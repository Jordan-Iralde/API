import { db } from "../../core/db";
import { userSessions } from "../../core/db/schema";
import { eq, lt } from "drizzle-orm";
import { Session } from "./session.types";

export class SessionRepository {

    async create(session: Session): Promise<void> {
        await db.insert(userSessions).values({
            sessionId: session.sessionId,
            userId: session.userId,
            device: session.device,
            ip: session.ip,
            userAgent: session.userAgent,
            createdAt: session.createdAt,
            expiresAt: session.expiresAt,
            revokedAt: session.revokedAt,
        });
    }

    async findById(sessionId: string): Promise<Session | null> {

        const session = await db.query.userSessions.findFirst({
            where: eq(userSessions.sessionId, sessionId),
        });

        if (!session) {
            return null;
        }

        return {
            sessionId: session.sessionId,
            userId: session.userId,
            device: session.device,
            ip: session.ip,
            userAgent: session.userAgent,
            createdAt: session.createdAt!,
            expiresAt: session.expiresAt,
            revokedAt: session.revokedAt,
        };
    }

    async revoke(sessionId: string): Promise<void> {

        await db
            .update(userSessions)
            .set({
                revokedAt: new Date(),
            })
            .where(eq(userSessions.sessionId, sessionId));

    }
    async findByUserId(
        userId: number
    ): Promise<Session[]> {

        const sessions =
            await db.query.userSessions.findMany({
                where: eq(userSessions.userId, userId),
            });

        return sessions.map(session => ({
            sessionId: session.sessionId,
            userId: session.userId,
            device: session.device,
            ip: session.ip,
            userAgent: session.userAgent,
            createdAt: session.createdAt!,
            expiresAt: session.expiresAt,
            revokedAt: session.revokedAt,
        }));

    }
    async revokeAll(
        userId: number
    ): Promise<void> {

        await db
            .update(userSessions)
            .set({
                revokedAt: new Date(),
            })
            .where(eq(userSessions.userId, userId));

    }
    async deleteExpired(): Promise<void> {

        await db
            .delete(userSessions)
            .where(
                lt(
                    userSessions.expiresAt,
                    new Date()
                )
            );

    }
}