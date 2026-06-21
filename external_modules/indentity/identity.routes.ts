// identity.routes.ts

import { Router } from "express";
import { syncUser } from "./identity.controller";

const router = Router();

router.post("/sync", syncUser);

export default router;