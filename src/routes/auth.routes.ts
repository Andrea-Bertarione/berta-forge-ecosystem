import { Router as createRouter } from "express";
import registerController from "../controllers/auth/register.controller";
import loginController from "../controllers/auth/login.controller";

import Joi from 'joi';
import { validateBody } from "../middlewares/validateBody.middleware";

import type { Router } from "express";

const createUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required
});

const authRouter: Router = createRouter();

authRouter.post("/register", registerController, validateBody(createUserSchema));
authRouter.post("/login", loginController);

export default authRouter;