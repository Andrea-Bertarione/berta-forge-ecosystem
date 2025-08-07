import { successResponse, errorResponse } from "../../interfaces/index.interface";
import type { Request, Response } from "express";
import { createProject } from "../../services/projects.service";
import { ProjectCreationData } from "../../interfaces/projects.interface";

export default async (req: Request, res: Response) => {
    try {
        const projectBody: ProjectCreationData = {
            ...req.body,
            owner: (req as any).user.id,
        }

        await createProject(projectBody);

        const responseData: successResponse = {
            message: "Succesfully created new project",
            data: {}
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