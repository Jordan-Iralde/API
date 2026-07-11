import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../core/db";
import { ENV } from "../../core/config/env";
import { createEmailVerification } from "../email-verification/email-verification.service";
import { mailerService } from "../mailer/mailer.service";

import { users, apps, userApps, userSettings } from "../../core/db/schema";
import { and, eq } from "drizzle-orm";

import { getAppById, buildAppUrl, AppRoute } from "../../helpers/app-url.helper";
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  appId: number
) => {
  // 1. Buscar usuario existente
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const app = await getAppById(appId);

  let user = existing[0];

  // 2. Crear usuario si no existe
  if (!user) {
    const hashed = await bcrypt.hash(password, 10);

    const result = await db
      .insert(users)
      .values({
        email,
        password: hashed,
        name,
        emailVerified: false,
      })
      .returning();

    user = result[0];

    await db.insert(userSettings).values({
      userId: user.id,
    });
  }

  // 3. Relación usuario <-> app (idempotente)
  const existingRelation = await db
    .select()
    .from(userApps)
    .where(
      and(
        eq(userApps.userId, user.id),
        eq(userApps.appId, appId)
      )
    )
    .limit(1);

  if (existingRelation.length === 0) {
    await db.insert(userApps).values({
      userId: user.id,
      appId,
      role: "user",
    });
  }

  // 4. Enviar email de verificación si aún no verificó
  if (!user.emailVerified) {
    const verification = await createEmailVerification(user.id);

    const verifyUrl = buildAppUrl(
      app,
      AppRoute.VERIFY_EMAIL,
      {
        token: verification.token,
      }
    );
    await mailerService.create({
      appId,
      to: user.email,
      subject: "Verify your email",
      body: `
    Click the following link to verify your account:<br><br>
    <a href="${verifyUrl}">${verifyUrl}</a>
  `,
    });
  }

  return {
    id: user.id,
    email: user.email,
  };
};


export const loginUser = async (
  email: string,
  password: string,
  appId: number
) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = result[0];
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  // 🔴 EMAIL GATE
  if (!user.emailVerified) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  const access = await db
    .select()
    .from(userApps)
    .where(
      and(
        eq(userApps.userId, user.id),
        eq(userApps.appId, appId)
      )
    )
    .limit(1);

  if (access.length === 0) {
    await db.insert(userApps).values({
      userId: user.id,
      appId,
      role: "user",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      appId,
      email: user.email,
      name: user.name,
    },
    ENV.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};
