import { Router } from "express";
import { signupController } from "../controllers/auth/signup.controller.js";

export const authRouter: Router = Router();

authRouter.post("/signup", signupController);
