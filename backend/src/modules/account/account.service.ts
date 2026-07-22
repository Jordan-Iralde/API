// src/modules/account/account.service.ts

import { users } from "../../core/db/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../core/db";
import { SessionService } from "../sessions/session.service";

const sessionService = new SessionService();

export const updateProfile = async (
  userId: number,
  name: string
) => {
  const [updated] = await db
    .update(users)
    .set({ name })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

  return updated;
};


export const getMe = async (
  userId: number
) => {

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return null;
  }

  const {
    password,
    ...rest
  } = user;

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

  if (!user) {
    throw new Error("User not found");
  }


  const valid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!valid) {
    throw new Error("Invalid password");
  }


  const hashed = await bcrypt.hash(
    newPassword,
    10
  );


  await db
    .update(users)
    .set({
      password: hashed,
    })
    .where(eq(users.id, userId));


  return {
    success: true,
  };
};


export const getSessions = async (
  userId: number
) => {

  return sessionService.getUserSessions(userId);

};


export const revokeSession = async (
  userId: number,
  sessionId: string
) => {

  const session =
    await sessionService.getSession(sessionId);


  if (!session) {
    throw new Error("Session not found");
  }


  if (session.userId !== userId) {
    throw new Error("Forbidden");
  }


  if (session.revokedAt) {
    throw new Error("Session already revoked");
  }


  await sessionService.revokeSession(sessionId);


  return {
    success: true,
  };
};


export const revokeAllSessions = async (
  userId: number
) => {

  await sessionService.revokeAllSessions(userId);


  return {
    success: true,
  };
};