import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { cronRuns } from "@/db/schema";
import {
  captureError,
  sanitizeErrorMessage,
} from "@/lib/observability/error-monitor";

type SafeMetadata = Record<string, unknown> | unknown[] | null;

type CronRunResult = {
  processedCount?: number;
  metadata?: SafeMetadata;
};

type MonitorCronRunOptions<T extends CronRunResult> = {
  cronName: string;
  metadata?: SafeMetadata;
  handler: () => Promise<T>;
};

export async function createCronRun({
  cronName,
  metadata = null,
}: {
  cronName: string;
  metadata?: SafeMetadata;
}) {
  const now = new Date();
  const [cronRun] = await db
    .insert(cronRuns)
    .values({
      cronName,
      startedAt: now,
      status: "running",
      processedCount: 0,
      metadata,
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: cronRuns.id });

  return cronRun;
}

export async function completeCronRun({
  cronRunId,
  processedCount = 0,
  metadata = null,
}: {
  cronRunId: string;
  processedCount?: number;
  metadata?: SafeMetadata;
}) {
  const now = new Date();

  await db
    .update(cronRuns)
    .set({
      completedAt: now,
      status: "success",
      processedCount,
      metadata,
      updatedAt: now,
    })
    .where(eq(cronRuns.id, cronRunId));
}

export async function failCronRun({
  cronRunId,
  errorMessage,
  processedCount = 0,
  metadata = null,
}: {
  cronRunId: string;
  errorMessage: string;
  processedCount?: number;
  metadata?: SafeMetadata;
}) {
  const now = new Date();

  await db
    .update(cronRuns)
    .set({
      completedAt: now,
      status: "failed",
      errorMessage: sanitizeErrorMessage(errorMessage, "Cron job failed"),
      processedCount,
      metadata,
      updatedAt: now,
    })
    .where(eq(cronRuns.id, cronRunId));
}

export async function monitorCronRun<T extends CronRunResult>({
  cronName,
  metadata = null,
  handler,
}: MonitorCronRunOptions<T>) {
  const cronRun = await createCronRun({ cronName, metadata });

  try {
    const result = await handler();

    await completeCronRun({
      cronRunId: cronRun.id,
      processedCount: result.processedCount ?? 0,
      metadata: result.metadata ?? null,
    });

    return result;
  } catch (error) {
    const message = sanitizeErrorMessage(error, "Cron job failed");

    captureError(error, {
      source: "cron",
      cronName,
      metadata: { cronRunId: cronRun.id },
    });

    await failCronRun({
      cronRunId: cronRun.id,
      errorMessage: message,
      metadata: { cronName },
    });

    throw error;
  }
}
