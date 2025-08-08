import { successResponse, errorResponse } from "../../interfaces/index.interface";
import type { Request, Response } from "express";
import { generateInvite } from "../../services/projects.service";
import { InviteCreationData } from "../../interfaces/projects.interface";

export default async (req: Request, res: Response) => {
    try {
        const data: InviteCreationData = {
            ...req.body
        }
        const inviteData = await generateInvite((req as any).user, data);

        const responseData: successResponse = {
            message: "Succesfully invited user",
            data: inviteData
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