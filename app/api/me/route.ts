import { getCurrentUser } from "@/lib/get-current-user";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }
  return NextResponse.json({
    user,
  });
}
