ALTER TABLE "users" ADD COLUMN "approved_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "approved_by_user_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "rejected_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "rejected_by_user_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "suspended_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "suspended_by_user_id" text;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "submitted_at" timestamp;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "reviewed_at" timestamp;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "reviewed_by" text;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "published_at" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cancelled_at" timestamp;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cancelled_by_user_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cancellation_reason" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_approved_by_user_id_users_id_fk" FOREIGN KEY ("approved_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_rejected_by_user_id_users_id_fk" FOREIGN KEY ("rejected_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_suspended_by_user_id_users_id_fk" FOREIGN KEY ("suspended_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "builds" ADD CONSTRAINT "builds_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_cancelled_by_user_id_users_id_fk" FOREIGN KEY ("cancelled_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_approved_by_idx" ON "users" USING btree ("approved_by_user_id");--> statement-breakpoint
CREATE INDEX "users_rejected_by_idx" ON "users" USING btree ("rejected_by_user_id");--> statement-breakpoint
CREATE INDEX "users_suspended_by_idx" ON "users" USING btree ("suspended_by_user_id");--> statement-breakpoint
CREATE INDEX "builds_review_queue_idx" ON "builds" USING btree ("status","submitted_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "builds_public_listing_idx" ON "builds" USING btree ("status","popularity_score" DESC NULLS LAST,"published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "builds_reviewed_by_idx" ON "builds" USING btree ("reviewed_by");--> statement-breakpoint
CREATE INDEX "gallery_images_build_order_idx" ON "gallery_images" USING btree ("build_id","display_order");--> statement-breakpoint
CREATE INDEX "events_cancelled_by_idx" ON "events" USING btree ("cancelled_by_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "event_attendance_event_user_unique_idx" ON "event_attendance" USING btree ("event_id","user_id");--> statement-breakpoint
CREATE INDEX "event_attendance_event_checked_in_idx" ON "event_attendance" USING btree ("event_id","checked_in_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "event_attendance_user_checked_in_idx" ON "event_attendance" USING btree ("user_id","checked_in_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "build_likes_build_id_idx" ON "build_likes" USING btree ("build_id");