import { NextFunction, Request, Response } from "express";
import { verifySessionToken } from "../../../lib/session";

export async function middleware(
	req: Request & { userId?: string },
	res: Response,
	next: NextFunction
) {
	try {
		const userId = req.headers.authorization;

		if (!userId) {
			return res.status(401).json({ message: "No user ID provided in authorization header" });
		}

		const tokenKey = `token_polls_${userId}`;
		const token = req.cookies[tokenKey];

		if (!token) {
			return res.status(401).json({ message: "No matching token for this user" });
		}

		const payload = await verifySessionToken(token);
		req.userId = payload.userId as string;
		next();
	} catch (err) {
		console.error(err);
		return res.status(401).json({ message: "Invalid or expired token" });
	}
}
