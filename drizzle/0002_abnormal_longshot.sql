CREATE TABLE IF NOT EXISTS "exercise_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"exercise_id" integer NOT NULL,
	"workout_log_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "set_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"weight" integer NOT NULL,
	"repetitions" integer NOT NULL,
	"exercise_logs_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workout_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logged_at" date,
	"user_id" text NOT NULL,
	"workout_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sets" RENAME COLUMN "reps" TO "repetitions";--> statement-breakpoint
DROP INDEX IF EXISTS "user_index";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_logs" ADD CONSTRAINT "exercise_logs_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercise_logs" ADD CONSTRAINT "exercise_logs_workout_log_id_workout_logs_id_fk" FOREIGN KEY ("workout_log_id") REFERENCES "public"."workout_logs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "set_logs" ADD CONSTRAINT "set_logs_exercise_logs_id_exercise_logs_id_fk" FOREIGN KEY ("exercise_logs_id") REFERENCES "public"."exercise_logs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workout_logs" ADD CONSTRAINT "workout_logs_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_workout_logs_index" ON "workout_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_workout_index" ON "workouts" USING btree ("user_id");