ALTER TABLE "events" ADD COLUMN "latitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "longitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "geo_radius_meters" integer DEFAULT 80 NOT NULL;