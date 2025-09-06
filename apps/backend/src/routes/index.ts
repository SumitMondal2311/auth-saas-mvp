import { Router } from "express";
import { miscellaneousRouter } from "./miscellaneous.routes.js";

export const router: Router = Router();

router.use("/", miscellaneousRouter);
