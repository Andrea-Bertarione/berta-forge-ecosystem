import type { Request, Response } from "express";

export default (req: Request, res: Response) => {
    res.json({
        "message": "well hello"
    });
} 