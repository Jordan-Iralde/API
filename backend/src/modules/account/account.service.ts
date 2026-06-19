// src/modules/account/account.service.ts

import { db } from "../../core/db";
import { users, userApps } from "../../core/db/schema";
import bcrypt from "bcrypt";
import { eq, and, sql } from "drizzle-orm";


export const updateProfile = async (userId: number, name: string) => {
  const [updated] = await db
    .update(users)
    .set({ name })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email
    });

  return updated;
};
export const getMe = async (userId: number) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  const { password, ...rest } = user;
  return rest;
};

export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error("Invalid password");

  const hashed = await bcrypt.hash(newPassword, 10);

  await db.update(users)
    .set({ password: hashed })
    .where(eq(users.id, userId));

  return { success: true };
};

export const revokeSessions = async (userId: number, appId: number) => {
  await db.delete(userApps).where(
    and(
      eq(userApps.userId, userId),
      eq(userApps.appId, appId)
    )
  );
  return { success: true };
};