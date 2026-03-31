import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import { authMiddleware } from "../modules/auth/auth.middleware";
import { resolveApp } from "../core/middlewares/resolve-app";
import { sendMailController } from "../modules/mailer/sendMail.controller";
import contactRoutes from "../modules/contact/contact.routes";

const router = Router();

router.post("/send", resolveApp, sendMailController);
router.use("/contact", contactRoutes);

router.use("/auth", authRoutes);

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/private", authMiddleware, (req, res) => {
  res.json({ message: "ok" });
});

router.post(
  "/send",
  resolveApp,
  sendMailController
);

export default router;