import { Router } from "express";

import * as controller from "./invitation.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", controller.create);

router.get("/", controller.listByResource);

router.get("/me", controller.myPending);

router.get(
    "/token/:token",
    controller.findByToken
);

router.post(
    "/token/:token/accept",
    controller.accept
);

router.post(
    "/token/:token/decline",
    controller.decline
);

router.post(
    "/:id/revoke",
    controller.revoke
);

router.post(
    "/:id/expire",
    controller.expire
);

export default router;