CREATE TABLE `doctors` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`license_number` text NOT NULL,
	`specialization` text,
	`authorized_on_blockchain` integer DEFAULT false NOT NULL,
	`blockchain_tx_hash` text,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `doctors_user_id_unique` ON `doctors` (`user_id`);--> statement-breakpoint
CREATE TABLE `patients` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`date_of_birth` integer NOT NULL,
	`gender` text,
	`blood_group` text,
	`phone` text,
	`email` text,
	`address` text,
	`city` text,
	`state` text,
	`pincode` text,
	`emergency_name` text,
	`emergency_relation` text,
	`emergency_phone` text,
	`allergies` text,
	`chronic_conditions` text,
	`current_medications` text,
	`previous_surgeries` text,
	`height` text,
	`weight` text,
	`waist_circumference` text,
	`last_checked_date` text,
	`registered_on_blockchain` integer DEFAULT false NOT NULL,
	`blockchain_tx_hash` text,
	`last_synced_at` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `patients_user_id_unique` ON `patients` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`wallet_address` text,
	`role` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_wallet_address_unique` ON `users` (`wallet_address`);