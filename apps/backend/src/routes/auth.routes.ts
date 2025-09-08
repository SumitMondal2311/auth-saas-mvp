import { Router } from "express";
import { signupController } from "../controllers/auth/signup.controller.js";
import { verifyEmailController } from "../controllers/auth/verify-email.controller.js";

export const authRouter: Router = Router();

authRouter.post("/signup", signupController);
authRouter.post("/verify-email", verifyEmailController.POST);
authRouter.get("/verify-email", verifyEmailController.GET);
