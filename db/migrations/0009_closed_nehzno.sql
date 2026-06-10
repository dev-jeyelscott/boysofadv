ALTER TYPE "public"."user_status" ADD VALUE 'archived';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "poster_image_key" text;