import { successResponse, errorResponse } from "../../interfaces/index.interface";
import type { Request, Response } from "express";
import { listProjects } from "../../services/projects.service";

export default async (req: Request, res: Response) => {
    try {
        const projectsResult = await listProjects((req as any).user);

        const responseData: successResponse = {
            message: "Succesfully listed projects",
            data: projectsResult
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