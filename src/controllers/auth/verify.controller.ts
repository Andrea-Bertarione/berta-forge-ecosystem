import type { Request, Response } from "express";
//import { verifyEmail } from "../../services/auth.service";
import { successResponse, errorResponse } from '../../interfaces/index.interface';

export default async (req: Request, res: Response) => {
    try {
        //const user = verifyEmail(req.body.token);

        const responseData: successResponse = {
            data: {}, //pass user
            message: "Email confirmed"
        }

        res.status(201).json(responseData);
    }
    catch(error: unknown) {
        const responseData: errorResponse = {
            message: error instanceof Error ? error.message : "An unknown error occurred"
        }
        res.status(500).json(responseData);
    }
};