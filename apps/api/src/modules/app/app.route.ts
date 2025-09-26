import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { handleAsync } from "../../utils/handle-async.js";
import { createController } from "./controllers/create.controller.js";
import { getAllController } from "./controllers/get-all.controller.js";
import { getController } from "./controllers/get.controller.js";

export const appRouter: Router = Router();

appRouter.use(handleAsync(authMiddleware));

appRouter.post("/", handleAsync(createController));
appRouter.get("/:appId", handleAsync(getController));
appRouter.get("/all", handleAsync(getAllController));
