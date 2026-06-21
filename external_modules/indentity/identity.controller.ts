// identity.controller.ts

import { Request, Response } from "express";
import { IdentityService } from "./identity.service";

const service = new IdentityService();

export async function syncUser(
    req: Request,
    res: Response
) {
    try {
        const { userId } = req.body;

        const result =
            await service.syncUser(userId);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Failed to sync user",
        });
    }
}