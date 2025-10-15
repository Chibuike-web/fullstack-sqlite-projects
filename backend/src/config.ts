if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in .env");
}

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
