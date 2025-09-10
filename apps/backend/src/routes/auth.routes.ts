import { Router } from "express";
import { loginController } from "../controllers/auth/login.controller.js";
import { signupController } from "../controllers/auth/signup.controller.js";
import { verifyEmailController } from "../controllers/auth/verify-email.controller.js";

export const authRouter: Router = Router();

authRouter.post("/signup", signupController);
authRouter.post("/verify-email", verifyEmailController.POST);
authRouter.get("/verify-email", verifyEmailController.GET);
authRouter.post("/login", loginController);
