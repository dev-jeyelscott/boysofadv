import { sql } from "drizzle-orm";

import { db } from "@/db/db";

type CheckStatus = "ok" | "error";
type HealthStatus = "ok" | "degraded";

type HealthCheck = {
  status: CheckStatus;
  message?: string;
  missing?: string[];
};

const REQUIRED_ENVIRONMENT_VARIABLES = [
  "DATABASE_URL",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CRON_SECRET",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
  "VAPID_EMAIL",
] as const;

const PUSH_ENVIRONMENT_VARIABLES = [
  "NEXT_PUBLIC_VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
  "VAPID_EMAIL",
] as const;

function getMissingVariables(variables: readonly string[]) {
  return variables.filter((name) => !process.env[name]);
}

async function checkDatabase(): Promise<HealthCheck> {
  try {
    await db.execute(sql`select 1`);
    return { status: "ok" };
  } catch {
    return {
      status: "error",
      message: "Database connection failed",
    };
  }
}

function checkEnvironment(): HealthCheck {
  const missing = getMissingVariables(REQUIRED_ENVIRONMENT_VARIABLES);

  if (missing.length === 0) {
    return { status: "ok", missing: [] };
  }

  return {
    status: "error",
    missing,
  };
}

function checkPushConfig(): HealthCheck {
  const missing = getMissingVariables(PUSH_ENVIRONMENT_VARIABLES);

  if (missing.length === 0) {
    return { status: "ok" };
  }

  return {
    status: "error",
    message: "Push notification config incomplete",
    missing,
  };
}

export async function runHealthChecks() {
  const checks = {
    app: { status: "ok" } satisfies HealthCheck,
    database: await checkDatabase(),
    environment: checkEnvironment(),
    push: checkPushConfig(),
  };

  const status: HealthStatus = Object.values(checks).every(
    (check) => check.status === "ok",
  )
    ? "ok"
    : "degraded";

  return {
    status,
    timestamp: new Date().toISOString(),
    checks,
  };
}
