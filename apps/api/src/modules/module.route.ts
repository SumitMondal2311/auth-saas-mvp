import { Router } from "express";
import { appAuthRouter } from "./app-auth/app-auth.route.js";
import { appRouter } from "./app/app.route.js";
import { authRouter } from "./auth/auth.route.js";

export const moduleRouter: Router = Router();
moduleRouter.use("/auth", authRouter);
moduleRouter.use("/app", appRouter);
moduleRouter.use("/app-auth", appAuthRouter);
