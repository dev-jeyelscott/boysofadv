DROP INDEX "push_subscriptions_endpoint_idx";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (
        setweight(to_tsvector('simple', coalesce("first_name", '')), 'A') ||
        setweight(to_tsvector('simple', coalesce("last_name", '')), 'A') ||
        setweight(to_tsvector('simple', coalesce("nickname", '')), 'A') ||
        setweight(to_tsvector('simple', coalesce("codename", '')), 'A') ||
        setweight(to_tsvector('simple', coalesce("email", '')), 'B') ||
        setweight(to_tsvector('simple', coalesce("unit", '')), 'C') ||
        setweight(to_tsvector('simple', coalesce("chapter", '')), 'C')
      ) STORED;--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("motorcycle_model", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("engine_setup", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("cvt_setup", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("suspension_setup", '')), 'C') ||
        setweight(to_tsvector('english', coalesce("braking_setup", '')), 'C') ||
        setweight(to_tsvector('english', coalesce("wheel_setup", '')), 'C') ||
        setweight(to_tsvector('english', coalesce("accessories", '')), 'D')
      ) STORED;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
        setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
        setweight(to_tsvector('english', coalesce("location", '')), 'C')
      ) STORED;--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_status_created_at_idx" ON "users" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "users_role_status_idx" ON "users" USING btree ("role","status");--> statement-breakpoint
CREATE INDEX "users_search_vector_idx" ON "users" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "builds_status_idx" ON "builds" USING btree ("status");--> statement-breakpoint
CREATE INDEX "builds_user_id_idx" ON "builds" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "builds_created_at_idx" ON "builds" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "builds_updated_at_idx" ON "builds" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "builds_status_created_at_idx" ON "builds" USING btree ("status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "builds_user_id_status_idx" ON "builds" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "builds_search_vector_idx" ON "builds" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "events_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "events_start_date_idx" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "events_end_date_idx" ON "events" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "events_status_start_date_idx" ON "events" USING btree ("status","start_date");--> statement-breakpoint
CREATE INDEX "events_status_end_date_idx" ON "events" USING btree ("status","end_date");--> statement-breakpoint
CREATE INDEX "events_search_vector_idx" ON "events" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "push_subscriptions_user_id_idx" ON "push_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "push_subscriptions_created_at_idx" ON "push_subscriptions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "push_subscriptions_endpoint_unique_idx" ON "push_subscriptions" USING btree ("endpoint");