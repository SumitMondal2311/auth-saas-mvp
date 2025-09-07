import { Router } from "express";
import { miscellaneousRouter } from "./miscellaneous.routes.js";
import { authRouter } from "./auth.routes.js";

export const router: Router = Router();

router.use("/auth", authRouter);
router.use("/", miscellaneousRouter);
