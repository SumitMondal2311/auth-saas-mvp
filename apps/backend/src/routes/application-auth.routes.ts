import { Router } from "express";
import { loginController } from "../controllers/application-auth/login.controller.js";
import { logoutController } from "../controllers/application-auth/logout.controller.js";
import { refreshController } from "../controllers/application-auth/refresh.controller.js";
import { signupController } from "../controllers/application-auth/signup.controller.js";
import { verifyEmailController } from "../controllers/application-auth/verify-email.controller.js";
import { applicationAuthMiddleware } from "../middlewares/application-auth.middleware.js";
import { validBodyMiddleware } from "../middlewares/valid-body.middleware.js";

export const applicationAuthRouter: Router = Router();

applicationAuthRouter.use(["/signup", "/login"], validBodyMiddleware);

applicationAuthRouter.post("/signup", signupController);
applicationAuthRouter
    .route("/verify-email")
    .get(verifyEmailController.GET)
    .post(verifyEmailController.POST);
applicationAuthRouter.post("/login", loginController);
applicationAuthRouter.post("/refresh", refreshController);
applicationAuthRouter.post("/logout", applicationAuthMiddleware, logoutController);
