import type { Config } from "drizzle-kit";

export default {
	schema: "./tasks/lib/schema.ts",
	out: "./tasks/drizzle/tasks",
	dialect: "sqlite",
	dbCredentials: { url: "./tasks/tasks.db" },
} satisfies Config;
