import { Router } from "express";
import { loginController } from "../controllers/application-auth/login.controller.js";
import { signupController } from "../controllers/application-auth/signup.controller.js";
import { applicationMiddleware } from "../middlewares/application.middleware.js";

export const applicationAuthRouter: Router = Router();

applicationAuthRouter.use(applicationMiddleware);

applicationAuthRouter.post("/signup", signupController);
applicationAuthRouter.post("/login", loginController);
