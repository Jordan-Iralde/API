import { Request, Response } from "express";

import { authService } from "./auth.service";
import { loginSchema } from "./auth.schema";
import { setAuthCookie, clearAuthCookie } from "../../utils/cookies";

class AuthController {
    login(req: Request, res: Response) {
        const body = loginSchema.parse(req.body);

        const token = authService.login(
            body.username,
            body.password
        );

        setAuthCookie(res, token);

        return res.status(200).json({
            success: true,
        });
    }

    logout(req: Request, res: Response) {
        clearAuthCookie(res);

        return res.status(200).json({
            success: true,
        });
    }

    me(req: Request, res: Response) {
        return res.status(200).json(authService.me());
    }
}

export const authController = new AuthController();