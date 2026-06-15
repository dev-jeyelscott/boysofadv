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
CREATE INDEX "event_attendance_user_id_idx" ON "event_attendance" USING btree ("user_id");--> statement-breakpoint
DROP INDEX IF EXISTS "builds_search_vector_idx";--> statement-breakpoint
ALTER TABLE "builds" DROP COLUMN "search_vector";--> statement-breakpoint
ALTER TABLE "builds" ADD COLUMN "search_vector" "tsvector";--> statement-breakpoint
CREATE OR REPLACE FUNCTION update_build_search_vector()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  owner_record record;
BEGIN
  SELECT
    "first_name",
    "last_name",
    "nickname",
    "codename"
  INTO owner_record
  FROM "users"
  WHERE "id" = NEW."user_id";

  NEW."search_vector" :=
    setweight(to_tsvector('english', coalesce(NEW."title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."motorcycle_model", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(owner_record.first_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(owner_record.last_name, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(owner_record.nickname, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(owner_record.codename, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW."engine_setup", '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW."cvt_setup", '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW."suspension_setup", '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW."braking_setup", '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW."wheel_setup", '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW."description", '')), 'D') ||
    setweight(to_tsvector('english', coalesce(NEW."accessories", '')), 'D');

  RETURN NEW;
END;
$$;--> statement-breakpoint
CREATE TRIGGER "builds_search_vector_update"
BEFORE INSERT OR UPDATE OF
  "user_id",
  "title",
  "motorcycle_model",
  "description",
  "engine_setup",
  "cvt_setup",
  "suspension_setup",
  "braking_setup",
  "wheel_setup",
  "accessories"
ON "builds"
FOR EACH ROW
EXECUTE FUNCTION update_build_search_vector();--> statement-breakpoint
CREATE OR REPLACE FUNCTION refresh_build_search_vector_for_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "builds"
  SET "updated_at" = "updated_at"
  WHERE "user_id" = NEW."id";

  RETURN NEW;
END;
$$;--> statement-breakpoint
CREATE TRIGGER "users_refresh_build_search_vector"
AFTER UPDATE OF
  "first_name",
  "last_name",
  "nickname",
  "codename"
ON "users"
FOR EACH ROW
EXECUTE FUNCTION refresh_build_search_vector_for_user();--> statement-breakpoint
UPDATE "builds" SET "title" = "title";--> statement-breakpoint
CREATE INDEX "builds_search_vector_idx" ON "builds" USING gin ("search_vector");
