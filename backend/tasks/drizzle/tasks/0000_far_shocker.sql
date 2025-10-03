CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_name` text NOT NULL,
	`task_description` text NOT NULL,
	`task_status` text NOT NULL,
	`task_priority` text NOT NULL,
	`task_start_date` text NOT NULL,
	`task_due_date` text NOT NULL
);
