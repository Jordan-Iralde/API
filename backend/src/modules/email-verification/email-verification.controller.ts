import { Request, Response } from "express";
import { verifyEmail } from "./email-verification.service";

export const verifyEmailController = async (
    req: Request,
    res: Response
) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "TOKEN_REQUIRED",
            });
        }

        const result = await verifyEmail(token);

        return res.status(200).json(result);

    } catch (error: any) {
        console.error("VERIFY EMAIL ERROR:", error);

        return res.status(400).json({
            message: error.message,
        });
    }
};