import { Router as createRouter, Router } from "express";

import Joi from 'joi';
import { validateBody } from "../middlewares/validateBody.middleware";
import newController from "../controllers/projects/new.controller";
import { requireAuth } from "../middlewares/requireAuth.middleware";
import listController from "../controllers/projects/list.controller";

const createProjectSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string()
});

const projectsRouter: Router = createRouter();

projectsRouter.post("/new", validateBody(createProjectSchema), requireAuth, newController);
projectsRouter.get("/list", requireAuth, listController);

export default projectsRouter;