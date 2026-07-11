import { db } from "../../core/db";
import { emailVerifications } from "../../core/db/schema";
import { eq, and, isNull } from "drizzle-orm";

export const createVerification = async (data: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
}) => {
    const [row] = await db
        .insert(emailVerifications)
        .values({
            userId: data.userId,
            tokenHash: data.tokenHash,
            expiresAt: data.expiresAt,
        })
        .returning();

    return row;
};

export const getByTokenHash = async (tokenHash: string) => {
    const [row] = await db
        .select()
        .from(emailVerifications)
        .where(eq(emailVerifications.tokenHash, tokenHash))
        .limit(1);

    return row;
};

export const markAsVerified = async (id: number) => {
    await db
        .update(emailVerifications)
        .set({
            verifiedAt: new Date(),
        })
        .where(eq(emailVerifications.id, id));
};

export const getByUserId = async (userId: number) => {
    const [row] = await db
        .select()
        .from(emailVerifications)
        .where(eq(emailVerifications.userId, userId))
        .limit(1);

    return row;
};

export const updateVerification = async (params: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
}) => {
    await db
        .update(emailVerifications)
        .set({
            tokenHash: params.tokenHash,
            expiresAt: params.expiresAt,
            verifiedAt: null,
        })
        .where(eq(emailVerifications.userId, params.userId));
};