import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

async function seedSuperAdmin() {
  const clerkUserId = "user_3EogImecKpWji1WgblRI8Qe4twj";

  const existing = await db.query.users.findFirst({
    where: eq(users.id, clerkUserId),
  });

  if (existing) {
    console.log("Super Admin already exists");
    process.exit(0);
  }

  await db.insert(users).values({
  id: nanoid(),

  clerkUserId: clerkUserId,

  email: "jleward.escote17@gmail.com",
  firstName: "Leward",
  lastName: "Escote",
  nickname: "Leward",
  codename: "Super Admin",

  role: "super_admin",
  status: "approved",
  isFeatured: false,
});

  console.log("Super Admin created");
}

seedSuperAdmin()
  .catch(console.error)
  .finally(() => process.exit());