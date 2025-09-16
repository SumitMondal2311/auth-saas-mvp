import { Router } from "express";
import { profileInfoController } from "../controllers/user/profile-info.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const userRouter: Router = Router();

userRouter.use(authMiddleware);

userRouter.get("/me", profileInfoController);
