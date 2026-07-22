import router from "../auth/auth.routes";
import { SessionController } from "./session.controller";

const controller = new SessionController();

router.post("/", controller.create.bind(controller));

router.get(
    "/:sessionId",
    controller.get.bind(controller)
);

router.get(
    "/:sessionId/validate",
    controller.validate.bind(controller)
);

router.get(
    "/user/:userId",
    controller.getUserSessions.bind(controller)
);

router.delete(
    "/:sessionId",
    controller.revoke.bind(controller)
);

router.delete(
    "/user/:userId",
    controller.revokeAll.bind(controller)
);