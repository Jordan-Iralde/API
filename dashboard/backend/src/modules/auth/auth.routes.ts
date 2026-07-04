import { Router } from "express";

import { authController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const authRoutes = Router();

authRoutes.post("/login", authController.login);

authRoutes.post(
    "/logout",
    authMiddleware,
    authController.logout
);

authRoutes.get(
    "/me",
    authMiddleware,
    authController.me
);