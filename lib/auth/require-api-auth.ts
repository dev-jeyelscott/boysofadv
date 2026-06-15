import { getCurrentDbUser } from "@/lib/current-user";

export async function requireApiAuth() {
  const user = await getCurrentDbUser();

  if (!user) {
    return {
      ok: false,
      status: 401,
      message: "Unauthorized.",
    } as const;
  }

  return {
    ok: true,
    user,
  } as const;
}
