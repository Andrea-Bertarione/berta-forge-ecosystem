import { Router as createRouter } from "express";
import registerController from "../controllers/auth/register.controller";

import type { Router } from "express";

const authRouter: Router = createRouter();

authRouter.post("/register", registerController);

export default authRouter;