import { Router as createRouter } from "express";
import registerController from "../controllers/auth/register.controller";
import loginController from "../controllers/auth/login.controller";
import verifyController from "../controllers/auth/verify.controller";

import Joi from 'joi';
import { validateBody } from "../middlewares/validateBody.middleware";

import type { Router } from "express";
import logoutController from "../controllers/auth/logout.controller";

const createUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required
});

const validateUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required
});

const verifyTokenSchema = Joi.object({
    access_token: Joi.string().required()
});

const authRouter: Router = createRouter();

authRouter.post("/register", registerController, validateBody(createUserSchema));
authRouter.post("/login", loginController, validateBody(validateUserSchema));
authRouter.post("/logout", logoutController);
authRouter.post("/verify", verifyController, validateBody(verifyTokenSchema));

export default authRouter;