import { Router } from "express";
import { applicationMiddleware } from "../middlewares/application.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { applicationAuthRouter } from "./application-auth.routes.js";
import { applicationRouter } from "./application.routes.js";
import { authRouter } from "./auth.routes.js";
import { userRouter } from "./user.routes.js";

export const router: Router = Router();

router.use("/auth", authRouter);

router.use(["/protected/user", "/protected/application"], authMiddleware);

router.use("/protected/user", userRouter);
router.use("/protected/application", applicationRouter);

router.use(["/application-auth"], applicationMiddleware);

router.use("/application-auth", applicationAuthRouter);
