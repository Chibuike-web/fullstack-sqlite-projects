import { z } from "zod";

export const authSchema = z.object({
	firstName: z
		.string()
		.optional()
		.refine((val) => !val || /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(val), {
			message: "First name must contain only letters",
		}),
	lastName: z
		.string()
		.optional()
		.refine((val) => !val || /^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(val), {
			message: "Last name must contain only letters",
		}),
	email: z
		.string()
		.min(1, "Email is required")
		.min(6, "Enter a valid email address")
		.refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Invalid email address"),
	password: z
		.string()
		.min(1, "Password is required")
		.min(6, "Password must contain at least 6 character"),
});

export type FormData = z.infer<typeof authSchema>;
