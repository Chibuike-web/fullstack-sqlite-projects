import type { Config } from "drizzle-kit";

export default {
	schema: "./posts/lib/schema.ts",
	out: "./posts/drizzle/posts",
	dialect: "sqlite",
	dbCredentials: { url: "./posts/posts.db" },
} satisfies Config;
