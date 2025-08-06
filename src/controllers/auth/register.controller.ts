import { successResponse, errorResponse } from "../../interfaces/index.interface";
import { registerUser } from "../../services/auth.service";

import type { Request, Response } from "express";

export default async (req: Request, res: Response) => {
    try {
        const registerResult = await registerUser(req.body);

        const responseData: successResponse = {
            message: "User succesfully registered, email confirmation sent",
            data: registerResult
        }

        res.status(201).json(responseData);
    }
    catch (error: unknown) {
        const responseData: errorResponse = {
            message: error instanceof Error ? error.message : "An unknown error occurred"
        }
        res.status(500).json(responseData);
    }
} 