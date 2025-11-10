import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// --- Users table ---
export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
});

// --- Polls table ---
export const polls = sqliteTable("polls", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	question: text("questions").notNull(),
	options: text("options", { mode: "json" }).notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// --- Votes table ---
export const votes = sqliteTable("votes", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	pollId: text("poll_id")
		.notNull()
		.references(() => polls.id, { onDelete: "cascade" }),
	optionId: integer("option_id").notNull(),
	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
