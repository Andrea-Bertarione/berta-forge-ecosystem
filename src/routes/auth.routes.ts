import { Router as createRouter } from "express";
import registerController from "../controllers/auth/register.controller";
import loginController from "../controllers/auth/login.controller";
import verifyController from "../controllers/auth/verify.controller";
import logoutController from "../controllers/auth/logout.controller";
import refreshController from "../controllers/auth/refresh.controller";

import Joi from 'joi';
import { validateBody } from "../middlewares/validateBody.middleware";

import type { Router } from "express";

const createUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters'
  }).required()
});

const validateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const verifyTokenSchema = Joi.object({
    access_token: Joi.string().required()
});

const authRouter: Router = createRouter();

authRouter.post("/register", validateBody(createUserSchema), registerController);
authRouter.post("/login", validateBody(validateUserSchema), loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/refresh", refreshController);
authRouter.post("/verify", validateBody(verifyTokenSchema), verifyController);

export default authRouter;