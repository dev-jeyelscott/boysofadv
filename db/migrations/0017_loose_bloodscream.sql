CREATE TABLE "event_reminders" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"reminder_type" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "statusUpdatedBy" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "completedAt" timestamp;--> statement-breakpoint
ALTER TABLE "event_reminders" ADD CONSTRAINT "event_reminders_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "event_reminders_event_id_type_unique" ON "event_reminders" USING btree ("event_id","reminder_type");