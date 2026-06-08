import { NextResponse } from "next/server";
import { getCurrentDbUser } from "@/lib/current-user";

export async function GET() {
  const user = await getCurrentDbUser();

  return NextResponse.json({
    user,
  });
}