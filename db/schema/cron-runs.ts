import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export type CronRunStatus = "running" | "success" | "failed";

export const cronRuns = pgTable(
  "cron_runs",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    cronName: text("cron_name").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    status: text("status").notNull().$type<CronRunStatus>().default("running"),
    errorMessage: text("error_message"),
    processedCount: integer("processed_count").notNull().default(0),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown> | unknown[] | null>()
      .default(null),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("cron_runs_name_started_at_idx").on(
      table.cronName,
      table.startedAt.desc(),
    ),
    index("cron_runs_status_started_at_idx").on(
      table.status,
      table.startedAt.desc(),
    ),
    index("cron_runs_started_at_idx").on(table.startedAt.desc()),
  ],
);
