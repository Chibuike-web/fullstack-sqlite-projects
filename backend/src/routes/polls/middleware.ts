import { Request, Response } from "express";
import { verifySessionToken } from "../../../lib/session";

export async function middleware(req: Request & { userId?: string }, res: Response) {
	try {
		const token = req.cookies.token_polls;
		if (!token) return res.status(401).json({ message: "No token" });
		const payload = await verifySessionToken(token);
		req.userId = payload.userId as string;
	} catch (error) {
		console.error(error);
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}
