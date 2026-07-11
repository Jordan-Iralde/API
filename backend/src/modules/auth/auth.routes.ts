import { RequestHandler, Router } from "express";
import { login, register } from "./auth.controller";
import { resolveApp } from "../../core/middlewares/resolve-app";
import { verifyEmailController } from "../email-verification/email-verification.controller";

const router = Router();

router.post("/register", resolveApp as RequestHandler, register);
router.post("/login", resolveApp as RequestHandler, login);
router.post(
    "/verify-email",
    resolveApp as RequestHandler,
    verifyEmailController as RequestHandler
);

export default router;

