import crypto from "crypto";
import { db } from "../../core/db";
import { emailVerifications, users } from "../../core/db/schema";
import { eq } from "drizzle-orm";

export const createEmailVerification = async (userId: number) => {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // opcional: invalidar anteriores
    await db
        .delete(emailVerifications)
        .where(eq(emailVerifications.userId, userId));

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await db.insert(emailVerifications).values({
        userId,
        tokenHash,
        expiresAt,
    });

    return { token };
};


export const verifyEmail = async (token: string) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const record = await db
        .select()
        .from(emailVerifications)
        .where(eq(emailVerifications.tokenHash, tokenHash))
        .limit(1);

    if (!record[0]) {
        throw new Error("INVALID_TOKEN");
    }

    const verification = record[0];

    if (verification.expiresAt < new Date()) {
        throw new Error("TOKEN_EXPIRED");
    }

    await db.transaction(async (tx) => {
        await tx
            .update(users)
            .set({
                emailVerified: true,
            })
            .where(eq(users.id, verification.userId));

        await tx
            .update(emailVerifications)
            .set({
                verifiedAt: new Date(),
            })
            .where(eq(emailVerifications.id, verification.id));
    });
    return { success: true };
};  