import { Router } from "express";
import { applicationMiddleware } from "../middlewares/application.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { applicationAuthRouter } from "./application-auth.routes.js";
import { applicationRouter } from "./application.routes.js";
import { authRouter } from "./auth.routes.js";
import { miscellaneousRouter } from "./miscellaneous.routes.js";
import { userRouter } from "./user.routes.js";

export const router: Router = Router();

router.use("/", miscellaneousRouter);
router.use("/auth", authRouter);

router.use(["/user", "/application"], authMiddleware);

router.use("/user", userRouter);
router.use("/application", applicationRouter);

router.use(["/application-auth"], applicationMiddleware);

router.use("/application-auth", applicationAuthRouter);
