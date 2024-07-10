ALTER TABLE "exercises" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_logs" ALTER COLUMN "logged_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "workout_logs" ALTER COLUMN "logged_at" SET DEFAULT now();