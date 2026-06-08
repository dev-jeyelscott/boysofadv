import { redirect } from "next/navigation";
import { getCurrentDbUser } from "@/lib/current-user";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbUser = await getCurrentDbUser();

  if (dbUser && dbUser.status !== "approved") {
    redirect("/pending-approval");
  }

  return children;
}