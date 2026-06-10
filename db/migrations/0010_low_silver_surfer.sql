ALTER TABLE "events" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'draft'::text;--> statement-breakpoint
DROP TYPE "public"."event_status";--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."event_status";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "status" SET DATA TYPE "public"."event_status" USING "status"::"public"."event_status";