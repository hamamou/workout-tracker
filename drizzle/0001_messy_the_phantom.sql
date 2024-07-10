DROP INDEX IF EXISTS "user_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_index" ON "workouts" USING btree ("user_id");