ALTER TABLE "workout_logs" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_logs" ALTER COLUMN "logged_at" SET DATA TYPE text;