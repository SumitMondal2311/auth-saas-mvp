import { Router } from "express";
import { signupController } from "../controllers/application-auth/signup.controller.js";
import { applicationMiddleware } from "../middlewares/application.middleware.js";

export const applicationAuthRouter: Router = Router();

applicationAuthRouter.use(applicationMiddleware);

applicationAuthRouter.post("/signup", signupController);
