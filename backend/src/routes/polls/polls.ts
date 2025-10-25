import { Request, Response, Router } from "express";
import { polls, users } from "../../../polls/lib/schema";
import { db } from "../../../polls/lib";
import { authSchema } from "./authSchema";
import z from "zod";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession } from "../../../lib/session";
import { middleware } from "./middleware";

const router = Router();

router.post("/sign-up", async (req: Request, res: Response) => {
	try {
		const data = req.body;
		const parsed = authSchema.safeParse(data);

		if (!parsed.success) {
			console.error(z.treeifyError(parsed.error));
			return res.status(400).json({ status: "failed", error: "Invalid Input" });
		}

		const { firstName, lastName, email, password } = parsed.data;

		const existingUser = db.select().from(users).where(eq(users.email, email)).get();
		if (existingUser) return res.status(409).json({ error: "User already exist. Log in instead" });

		const hashedPassword = await bcrypt.hash(password, 10);
		db.insert(users)
			.values({
				firstName,
				lastName,
				email,
				password: hashedPassword,
			})
			.run();

		return res.status(201).json({ status: "success", message: "User registered successfully" });
	} catch (error) {
		console.error("Sign up failed", error);
		res.status(500).json({ status: "failed", error: "Internal server error" });
	}
});

router.post("/sign-in", async (req: Request, res: Response) => {
	try {
		const parsed = authSchema.safeParse(req.body);
		if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

		const { email, password } = parsed.data;
		const existingUser = db.select().from(users).where(eq(users.email, email)).get();

		if (!existingUser)
			return res.status(404).json({ error: "User doesn't exist. Sign up instead" });

		const isMatch = await bcrypt.compare(password, existingUser.password);
		if (!isMatch) return res.status(401).json({ error: "Wrong password" });

		const token = await createSession(existingUser.id);

		res.cookie("token_polls", token, { httpOnly: true, secure: true, sameSite: "none" });
		res.status(201).json({ status: "success", message: "Logged in successfully" });
	} catch (error) {
		console.error("Sign in failed", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/", (_, res: Response) => {
	try {
		const result = db.select().from(polls).all();
		res.status(200).json({ status: "success", result: result ?? [] });
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch polls" });
	}
});

router.get("/user", middleware, async (req: Request & { userId?: string }, res: Response) => {
	try {
		const user = db
			.select()
			.from(users)
			.where(eq(users.id, Number(req.userId)))
			.get();

		if (!user) {
			res.clearCookie("token_tasks");
			return res.status(404).json({ redirect: "/sign-up" });
		}
		return res.status(200).json({
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			id: user.id,
		});
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({ error: "Failed to fetch user" });
	}
});

router.post("/", middleware, async (req: Request & { userId?: string }, res: Response) => {
	try {
		const { question, options } = req.body;

		if (!question || !Array.isArray(options) || options.length === 0) {
			return res.status(400).json({ error: "Invalid input" });
		}
		const formattedOptions = JSON.stringify(
			options.map((opt: any, index: number) => ({
				id: index + 1,
				text: opt.text,
				votes: 0,
			}))
		);

		const pollsData = await db
			.insert(polls)
			.values({
				id: crypto.randomUUID(),
				userId: Number(req.userId),
				question,
				options: formattedOptions,
				createdAt: new Date().toISOString(),
			})
			.returning();

		const mainPoll = pollsData[0];
		return res.status(201).json({
			status: "success",
			message: "Poll created successfully",
			data: mainPoll,
			userId: req.userId,
		});
	} catch (error) {
		console.error("Create poll failed:", error);
		res.status(500).json({ error: "Failed to create poll" });
	}
});

export default router;
