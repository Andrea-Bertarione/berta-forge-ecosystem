import { Router as createRouter, Router } from "express";

import Joi from 'joi';
import { validateBody } from "../middlewares/validateBody.middleware";
import newController from "../controllers/projects/new.controller";
import { requireAuth } from "../middlewares/requireAuth.middleware";
import listController from "../controllers/projects/list.controller";
import inviteController from "../controllers/projects/invite.controller";

const createProjectSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string()
});

const createInviteSchema = Joi.object({
    type: Joi.string().valid('link','direct').required(),
    target: Joi.string(),
    expire: Joi.date(),
    project: Joi.string(),
    permisisons: Joi.object()
});

const projectsRouter: Router = createRouter();

projectsRouter.post("/new", validateBody(createProjectSchema), requireAuth, newController);
projectsRouter.get("/list", requireAuth, listController);
projectsRouter.post("/invite", validateBody(createInviteSchema), requireAuth, inviteController);

export default projectsRouter;