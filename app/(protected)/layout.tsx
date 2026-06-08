import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dbUser = await getCurrentUser();

  if (dbUser && dbUser.status !== "approved") {
    redirect("/pending-approval");
  }

  return children;
}