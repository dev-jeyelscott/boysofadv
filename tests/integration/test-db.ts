import { sql } from "drizzle-orm";

import { db } from "@/db/db";

export const hasTestDatabase = Boolean(process.env.TEST_DATABASE_URL);

export async function cleanupTestDatabase() {
  if (!hasTestDatabase) {
    return;
  }

  await db.execute(sql`
    truncate table
      event_attendance,
      push_subscriptions,
      audit_logs,
      gallery_images,
      build_comment_likes,
      build_comments,
      build_likes,
      builds,
      events,
      partners,
      users
    restart identity cascade
  `);
}
