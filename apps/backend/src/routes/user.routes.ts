import { Router } from "express";
import { profileInfoController } from "../controllers/user/profile-info.controller.js";

export const userRouter: Router = Router();

userRouter.get("/me", profileInfoController);
