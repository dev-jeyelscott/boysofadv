import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/current-user";

const ignoredPaths = ["/pending-approval", "/sign-in", "/sign-up"];

export async function ApprovalGate({ pathname }: { pathname: string }) {
  const dbUser = await getCurrentDbUser();

  if (!dbUser) return null;

  const isIgnored =
    pathname === "/" ||
    ignoredPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

  if (!isIgnored && dbUser.status !== "approved") {
    redirect("/pending-approval");
  }

  return null;
}
