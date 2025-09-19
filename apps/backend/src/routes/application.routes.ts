import { Router } from "express";
import { createApplicationController } from "../controllers/application/create.controller.js";
import { getAllApplicationController } from "../controllers/application/get-all.controller.js";
import { validBodyMiddleware } from "../middlewares/valid-body.middleware.js";

export const applicationRouter: Router = Router();

applicationRouter.use(["/create"], validBodyMiddleware);

applicationRouter.post("/create", createApplicationController);
applicationRouter.get("/get-all", getAllApplicationController);
