import { Router } from "express";
import { loginController } from "../controllers/application-auth/login.controller.js";
import { signupController } from "../controllers/application-auth/signup.controller.js";
import { validBodyMiddleware } from "../middlewares/valid-body.middleware.js";

export const applicationAuthRouter: Router = Router();

applicationAuthRouter.use(["/signup", "/login"], validBodyMiddleware);

applicationAuthRouter.post("/signup", signupController);
applicationAuthRouter.post("/login", loginController);
