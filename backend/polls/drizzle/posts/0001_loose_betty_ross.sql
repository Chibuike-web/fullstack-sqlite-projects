PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_polls` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`questions` text NOT NULL,
	`options` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_polls`("id", "user_id", "questions", "options", "created_at") SELECT "id", "user_id", "questions", "options", "created_at" FROM `polls`;--> statement-breakpoint
DROP TABLE `polls`;--> statement-breakpoint
ALTER TABLE `__new_polls` RENAME TO `polls`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`first_name` text,
	`last_name` text
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "password", "first_name", "last_name") SELECT "id", "email", "password", "first_name", "last_name" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;