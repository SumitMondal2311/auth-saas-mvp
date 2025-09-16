import { Router } from "express";
import { applicationAuthRouter } from "./application-auth.routes.js";
import { applicationRouter } from "./application.routes.js";
import { authRouter } from "./auth.routes.js";
import { miscellaneousRouter } from "./miscellaneous.routes.js";
import { userRouter } from "./user.routes.js";

export const router: Router = Router();

router.use("/auth", authRouter);
router.use("/", miscellaneousRouter);
router.use("/user", userRouter);
router.use("/application-auth", applicationAuthRouter);
router.use("/application", applicationRouter);
