import dotenv from "dotenv";
import { sql } from "drizzle-orm";

dotenv.config();

async function reset() {
  const { db } = await import("../db");

  await db.execute(sql`
    TRUNCATE TABLE
      audit_logs,
      build_comment_likes,
      build_comments,
      build_likes,
      builds,
      contact_messages,
      cron_runs,
      event_attendance,
      event_reminders,
      events,
      gallery_images,
      join_requests,
      partner_inquiries,
      partners,
      push_subscriptions,
      users
    RESTART IDENTITY CASCADE;
  `);

  console.log("Database reset complete.");
}

reset()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => process.exit());
