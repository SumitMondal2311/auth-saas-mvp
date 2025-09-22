import { Router } from "express";
import { emailVerificationStatusController } from "../controllers/auth/email-verification-status.controller.js";
import { loginController } from "../controllers/auth/login.controller.js";
import { logoutController } from "../controllers/auth/logout.controller.js";
import { refreshController } from "../controllers/auth/refresh.controller.js";
import { signupController } from "../controllers/auth/signup.controller.js";
import { verifyEmailController } from "../controllers/auth/verify-email.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validBodyMiddleware } from "../middlewares/valid-body.middleware.js";

export const authRouter: Router = Router();

authRouter.post("/signup", validBodyMiddleware, signupController);
authRouter.get("/email-verfication-flow-status", emailVerificationStatusController);
authRouter.post("/verify-eamil", validBodyMiddleware, verifyEmailController);
authRouter.post("/login", validBodyMiddleware, loginController);
authRouter.post("/refresh", refreshController);
authRouter.post("/protected/logout", authMiddleware, logoutController);
