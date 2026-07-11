import { Response } from "express";

export function setAuthCookie(res: Response, token: string) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
    });
}

export function clearAuthCookie(res: Response) {
    res.clearCookie("token");
}