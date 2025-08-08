import { successResponse, errorResponse } from "../../interfaces/index.interface";
import type { Request, Response } from "express";
import { refreshToken } from "../../services/auth.service";

export default async (req: Request, res: Response) => {
    try {
        const refreshData = await refreshToken();

        const responseData: successResponse = {
            message: "Succesfully refreshed JWT",
            data: refreshData
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