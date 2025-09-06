import { Router } from "express";
import { healthController } from "../controllers/miscellaneous/health.controller.js";

export const miscellaneousRouter: Router = Router();

miscellaneousRouter.get("/health", healthController);
