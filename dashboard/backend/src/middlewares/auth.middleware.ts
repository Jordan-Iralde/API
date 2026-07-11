import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }

    try {
        verifyToken(token);
        next();
    } catch {
        res.status(401).json({
            message: "Invalid token",
        });
    }
}