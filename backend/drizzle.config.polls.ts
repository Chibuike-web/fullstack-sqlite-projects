import type { Config } from "drizzle-kit";

export default {
	schema: "./polls/lib/schema.ts",
	out: "./polls/drizzle/posts",
	dialect: "sqlite",
	dbCredentials: { url: "./polls/polls.db" },
} satisfies Config;
