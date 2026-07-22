import { Request, Response } from "express";
import { SessionService } from "./session.service";

const service = new SessionService();

export class SessionController {

    async create(req: Request, res: Response) {

        const {
            userId,
            device,
            ip,
            userAgent,
            expiresAt
        } = req.body;

        const session = await service.createSession({
            userId,
            device,
            ip,
            userAgent,
            expiresAt: new Date(expiresAt)
        });

        return res.status(201).json(session);
    }

    async validate(req: Request, res: Response) {

        const { sessionId } = req.params;

        if (typeof sessionId !== "string") {
            return res.status(400).json({
                message: "Invalid session id"
            });
        }

        const valid = await service.validateSession(sessionId);

        return res.json({ valid });

    }

    async get(req: Request, res: Response) {

        const { sessionId } = req.params;

        if (typeof sessionId !== "string") {
            return res.status(400).json({
                message: "Invalid session id"
            });
        }

        const session = await service.getSession(sessionId);

        if (!session) {
            return res.sendStatus(404);
        }

        return res.json(session);

    }

    async getUserSessions(req: Request, res: Response) {

        const { userId } = req.params;

        if (typeof userId !== "string") {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        const userIdAsNumber = parseInt(userId, 10);

        if (isNaN(userIdAsNumber)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        const sessions =
            await service.getUserSessions(userIdAsNumber);

        return res.json(sessions);

    }

    async revoke(req: Request, res: Response) {

        const { sessionId } = req.params;

        if (typeof sessionId !== "string") {
            return res.status(400).json({
                message: "Invalid session id"
            });
        }

        await service.revokeSession(sessionId);

        return res.sendStatus(204);

    }

    async revokeAll(req: Request, res: Response) {

        const { userId } = req.params;

        if (typeof userId !== "string") {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        const userIdAsNumber = Number(userId);

        if (Number.isNaN(userIdAsNumber)) {
            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        await service.revokeAllSessions(userIdAsNumber);

        return res.sendStatus(204);

    }

}