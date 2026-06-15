import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { users } from "./users";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .$defaultFn(() => nanoid())
      .primaryKey(),
    actorId: text("actor_id")
      .notNull()
      .references(() => users.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown> | unknown[] | null>()
      .default(null),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_actor_created_at_idx").on(
      table.actorId,
      table.createdAt.desc(),
    ),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_action_created_at_idx").on(
      table.action,
      table.createdAt.desc(),
    ),
    index("audit_logs_created_at_idx").on(table.createdAt.desc()),
  ],
);
