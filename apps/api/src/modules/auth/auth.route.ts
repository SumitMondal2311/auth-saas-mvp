import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { prepareInputMiddleware } from "../../middlewares/prepare-input.middleware.js";
import { handleAsync } from "../../utils/handle-async.js";
import {
    attemptFactorOneController,
    prepareFactorOneController,
} from "./controllers/factor-one.controller.js";
import { loginController } from "./controllers/login.controller.js";
import { logoutController } from "./controllers/logout.controller.js";
import { refreshController } from "./controllers/refresh.controller.js";
import { signupController } from "./controllers/signup.controller.js";
import {
    attemptVerificationController,
    prepareVerificationController,
} from "./controllers/verification.controller.js";
import { factorOneMiddleware } from "./middlewares/factor-one.middleware.js";
import { verificationMiddleware } from "./middlewares/verification.middleware.js";

export const authRouter: Router = Router();

// Signup Route Group //
authRouter.post("/signup", prepareInputMiddleware, handleAsync(signupController));
authRouter
    .use(handleAsync(verificationMiddleware))
    .get("/signup/prepare-verification", prepareVerificationController)
    .post(
        "/signup/attempt-verification",
        prepareInputMiddleware,
        handleAsync(attemptVerificationController)
    );

// Login Route Group //
authRouter.post("/login", prepareInputMiddleware, handleAsync(loginController));
authRouter
    .use(handleAsync(factorOneMiddleware))
    .get("/login/prepare-first-factor", prepareFactorOneController)
    .post(
        "/login/attempt-first-factor",
        prepareInputMiddleware,
        handleAsync(attemptFactorOneController)
    );

authRouter.post("/refresh", handleAsync(refreshController));
authRouter.post("/logout", handleAsync(authMiddleware), handleAsync(logoutController));
