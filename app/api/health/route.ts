import { NextResponse } from "next/server";

import { runHealthChecks } from "@/lib/observability/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await runHealthChecks();

  return NextResponse.json(health, {
    status: health.status === "ok" ? 200 : 503,
  });
}
