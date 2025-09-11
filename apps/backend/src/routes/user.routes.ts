import { Router } from "express";
import { meController } from "../controllers/user/me.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const userRouter: Router = Router();

userRouter.use(authMiddleware);

userRouter.get("/me", meController);
