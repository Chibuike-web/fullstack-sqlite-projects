import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	taskName: text("task_name").notNull(),
	taskDescription: text("task_description").notNull(),
	taskStatus: text("task_status").notNull(),
	taskPriority: text("task_priority").notNull(),
	taskStartDate: text("task_start_date").notNull(),
	taskDueDate: text("task_due_date").notNull(),
});
