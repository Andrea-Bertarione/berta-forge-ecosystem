import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../services/auth.service';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  	try {
		const header = req.headers.authorization;
		if (!header?.startsWith("Bearer ")) {
			return res.status(401).json({ error: "Missing or invalid Authorization header" });
		}
		
		const token = header.split(" ")[1];
		if (!token) {
			return res.status(401).json({ error: "Missing or invalid Authorization header" });
		}

		const user = await validateToken(token);

		(req as any).user = user;

		next();
  	} catch (err: any) {
    	// All errors here map to 401 Unauthorized
    	res.status(401).json({ error: err.message });
  	}
}