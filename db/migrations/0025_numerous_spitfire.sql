UPDATE "partner_inquiries" SET "phone_number" = '' WHERE "phone_number" IS NULL;--> statement-breakpoint
UPDATE "partner_inquiries" SET "message" = '' WHERE "message" IS NULL;--> statement-breakpoint
ALTER TABLE "partner_inquiries" ALTER COLUMN "phone_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "partner_inquiries" ALTER COLUMN "message" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "partners" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "partner_inquiries" ADD COLUMN "contacted_at" timestamp;--> statement-breakpoint
ALTER TABLE "partner_inquiries" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "partner_inquiries" ADD COLUMN "rejected_at" timestamp;
