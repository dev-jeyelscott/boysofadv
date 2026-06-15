ALTER TABLE "builds" DROP CONSTRAINT "builds_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "event_attendance" DROP CONSTRAINT "event_attendance_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "builds" ADD CONSTRAINT "builds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_attendance" ADD CONSTRAINT "event_attendance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_clerk_user_id_idx" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "partners_status_idx" ON "partners" USING btree ("status");--> statement-breakpoint
CREATE INDEX "partners_category_idx" ON "partners" USING btree ("category");--> statement-breakpoint
CREATE INDEX "builds_is_featured_idx" ON "builds" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "event_attendance_event_id_idx" ON "event_attendance" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_attendance_user_id_idx" ON "event_attendance" USING btree ("user_id");