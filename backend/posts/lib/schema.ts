import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	content: text("content").notNull(),
	likes: integer("likes").notNull().default(0),
	dislikes: integer("dislikes").notNull().default(0),
});
