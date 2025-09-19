import { Router } from "express";
import { loginController } from "../controllers/application-auth/login.controller.js";
import { signupController } from "../controllers/application-auth/signup.controller.js";
import { verifyEmailController } from "../controllers/application-auth/verify-email.controller.js";
import { validBodyMiddleware } from "../middlewares/valid-body.middleware.js";

export const applicationAuthRouter: Router = Router();

applicationAuthRouter.use(["/signup", "/login"], validBodyMiddleware);

applicationAuthRouter.post("/signup", signupController);
applicationAuthRouter
    .route("/verify-email")
    .get(verifyEmailController.GET)
    .post(verifyEmailController.POST);
applicationAuthRouter.post("/login", loginController);
