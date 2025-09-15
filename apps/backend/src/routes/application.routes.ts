import { Router } from "express";
import { createApplicationController } from "../controllers/application/create.controller.js";
import { getAllApplicationController } from "../controllers/application/get-all.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const applicationRouter: Router = Router();

applicationRouter.use(authMiddleware);

applicationRouter.post("/create", createApplicationController);
applicationRouter.get("/get-all", getAllApplicationController);
