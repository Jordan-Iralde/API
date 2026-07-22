export interface CreateSessionDTO {
    userId: number;
    device: string | null;
    ip: string | null;
    userAgent: string | null;
    expiresAt: Date;
}

export interface Session {
    sessionId: string;
    userId: number;
    device: string | null;
    ip: string | null;
    userAgent: string | null;
    createdAt: Date;
    expiresAt: Date;
    revokedAt: Date | null;
}