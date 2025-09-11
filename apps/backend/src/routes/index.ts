import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { miscellaneousRouter } from "./miscellaneous.routes.js";
import { userRouter } from "./user.routes.js";

export const router: Router = Router();

router.use("/auth", authRouter);
router.use("/", miscellaneousRouter);
router.use("/user", userRouter);
