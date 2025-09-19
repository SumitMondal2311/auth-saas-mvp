import { Router } from "express";
import { loginController } from "../controllers/auth/login.controller.js";
import { logoutController } from "../controllers/auth/logout.controller.js";
import { refreshController } from "../controllers/auth/refresh.controller.js";
import { signupController } from "../controllers/auth/signup.controller.js";
import { verifyEmailController } from "../controllers/auth/verify-email.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validBodyMiddleware } from "../middlewares/valid-body.middleware.js";

export const authRouter: Router = Router();

authRouter.use(["/signup", "/login"], validBodyMiddleware);

authRouter.post("/signup", signupController);
authRouter
    .route("/verify-email")
    .post(validBodyMiddleware, verifyEmailController.POST)
    .get(verifyEmailController.GET);
authRouter.post("/login", loginController);
authRouter.post("/refresh", refreshController);
authRouter.post("/logout", authMiddleware, logoutController);
