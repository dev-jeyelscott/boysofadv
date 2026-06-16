import "@testing-library/jest-dom/vitest";

process.env.ATTENDANCE_TOKEN_SECRET ??= "test-attendance-secret";
process.env.AUTH_SECRET ??= "test-auth-secret";
process.env.VAPID_SUBJECT ??= "mailto:test@example.com";
process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??=
  "BIFlYRNsQgHZeNrTrAEs6kytKgoBM3Lwdjxb3JNldF6vYtVSP7qddcUUZWSUVPsVZiJ0f-lIDc5dA4h9wzQdKQ8";
process.env.VAPID_PRIVATE_KEY ??=
  "qdWHT9t4zyRqjfbbva0oOddD8BxC3wJXKo1blp8k6Rs";

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
