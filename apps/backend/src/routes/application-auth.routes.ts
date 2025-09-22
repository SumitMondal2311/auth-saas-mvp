import { Router } from "express";
import { loginController } from "../controllers/application-auth/login.controller.js";
import { logoutController } from "../controllers/application-auth/logout.controller.js";
import { refreshController } from "../controllers/application-auth/refresh.controller.js";
import { signupController } from "../controllers/application-auth/signup.controller.js";
import { emailVerificationStatusController } from "../controllers/auth/email-verification-status.controller.js";
import { verifyEmailController } from "../controllers/auth/verify-email.controller.js";
import { applicationAuthMiddleware } from "../middlewares/application-auth.middleware.js";
import { validBodyMiddleware } from "../middlewares/valid-body.middleware.js";

export const applicationAuthRouter: Router = Router();

applicationAuthRouter.post("/signup", validBodyMiddleware, signupController);
applicationAuthRouter.get("/a", emailVerificationStatusController);
applicationAuthRouter.post("/ve", verifyEmailController);
applicationAuthRouter.post("/login", validBodyMiddleware, loginController);
applicationAuthRouter.post("/refresh", refreshController);
applicationAuthRouter.post("/logout", applicationAuthMiddleware, logoutController);
