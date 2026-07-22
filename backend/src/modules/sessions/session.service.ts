import { randomUUID } from "crypto";
import {
    CreateSessionDTO,
    Session
} from "./session.types";

import { SessionRepository } from "./session.repository";

export class SessionService {

    constructor(
        private repository = new SessionRepository()
    ) { }

    async createSession(
        dto: CreateSessionDTO
    ): Promise<{ sessionId: string }> {

        const session: Session = {

            sessionId: randomUUID(),

            userId: dto.userId,

            device: dto.device,

            ip: dto.ip,

            userAgent: dto.userAgent,

            createdAt: new Date(),

            expiresAt: dto.expiresAt,

            revokedAt: null

        };

        await this.repository.create(session);

        return {
            sessionId: session.sessionId
        };
    }

    async validateSession(
        sessionId: string
    ): Promise<boolean> {

        const session =
            await this.repository.findById(sessionId);

        if (!session) {
            return false;
        }

        if (session.revokedAt) {
            return false;
        }

        if (session.expiresAt < new Date()) {
            return false;
        }

        return true;
    }

    async revokeSession(
        sessionId: string
    ): Promise<void> {

        await this.repository.revoke(sessionId);

    }
    async getSession(
        sessionId: string
    ): Promise<Session | null> {

        return this.repository.findById(sessionId);

    }

    async getUserSessions(
        userId: number
    ): Promise<Session[]> {

        return this.repository.findByUserId(userId);

    }

    async revokeAllSessions(
        userId: number
    ): Promise<void> {

        await this.repository.revokeAll(userId);

    }

    async deleteExpiredSessions(): Promise<void> {

        await this.repository.deleteExpired();

    }
}