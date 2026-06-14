ALTER TABLE "users" ADD COLUMN "last_active_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "inactive_detected_at" timestamp;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "popularity_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "popularity_calculated_at" timestamp;