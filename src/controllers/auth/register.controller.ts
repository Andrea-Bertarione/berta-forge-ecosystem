import { registerSuccessResponse } from "../../interfaces/auth.interface";
import { registerUser } from "../../services/auth.service";

import type { Request, Response } from "express";


export default async (req: Request, res: Response) => {
    try {
        await registerUser(req.body);

        const responseData: registerSuccessResponse = {
            message: "User succesfully registered, email confirmation sent",
            data: { }
        }

        res.json(responseData);
    }
    catch (err) {

    }
} 