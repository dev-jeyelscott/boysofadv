import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config();

async function seedSuperAdmin() {
  const { db } = await import("../db");

  const clerkUserId = "user_3EtObqbaG9housVrla0eK0gPIfM";

  const existingUser = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  });

  if (existingUser) {
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
