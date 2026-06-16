CREATE TABLE "cron_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"cron_name" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"completed_at" timestamp with time zone,
	"status" text DEFAULT 'running' NOT NULL,
	"error_message" text,
	"processed_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT 'null'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "cron_runs_name_started_at_idx" ON "cron_runs" USING btree ("cron_name","started_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "cron_runs_status_started_at_idx" ON "cron_runs" USING btree ("status","started_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "cron_runs_started_at_idx" ON "cron_runs" USING btree ("started_at" DESC NULLS LAST);