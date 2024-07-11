CREATE TABLE IF NOT EXISTS "exercises" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
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
	"name" text,
	"logged_at" date DEFAULT now(),
	"user_id" text NOT NULL,
	"workout_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exercises_sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"exercise_id" integer NOT NULL,
	"workout_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sets" (
	"id" serial PRIMARY KEY NOT NULL,
	"weight" integer NOT NULL,
	"repetitions" integer NOT NULL,
	"exercise_set_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"last_logged_at" date,
	"user_id" text NOT NULL,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "exercises_sets" ADD CONSTRAINT "exercises_sets_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exercises_sets" ADD CONSTRAINT "exercises_sets_workout_id_workouts_id_fk" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sets" ADD CONSTRAINT "sets_exercise_set_id_exercises_sets_id_fk" FOREIGN KEY ("exercise_set_id") REFERENCES "public"."exercises_sets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_index" ON "exercises" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_workout_logs_index" ON "workout_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_workout_index" ON "workouts" USING btree ("user_id");