import { Router } from "express";
import { loginController } from "../controllers/auth/login.controller.js";
import { logoutController } from "../controllers/auth/logout.controller.js";
import { signupController } from "../controllers/auth/signup.controller.js";
import { verifyEmailController } from "../controllers/auth/verify-email.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRouter: Router = Router();

authRouter.post("/signup", signupController);
authRouter.post("/verify-email", verifyEmailController.POST);
authRouter.get("/verify-email", verifyEmailController.GET);
authRouter.post("/login", loginController);
authRouter.post("/logout", authMiddleware, logoutController);
