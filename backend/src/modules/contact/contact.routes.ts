// /modules/contact/contact.routes.ts

import { Router, RequestHandler } from "express";
import { contactController } from "./contact.controller";
import { resolveApp } from "../../core/middlewares/resolve-app";

const router = Router();

router.post("/", resolveApp as RequestHandler, contactController as RequestHandler);

export default router;