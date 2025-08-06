import { successResponse, errorResponse } from "../../interfaces/index.interface";
import type { Request, Response } from "express";
import { logoutUser } from "../../services/auth.service";

export default async (req: Request, res: Response) => {
    try {
        await logoutUser();

        const responseData: successResponse = {
            message: "User succesfully logged out",
            data: {}
        }

        res.status(201).json(responseData);
    }
    catch(error: unknown) {
        const responseData: errorResponse = {
            message: error instanceof Error ? error.message : "An unknown error occurred"
        }
        res.status(500).json(responseData);
    }
} 