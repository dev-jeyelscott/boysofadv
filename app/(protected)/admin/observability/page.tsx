import type { SQL } from "drizzle-orm";

import { and, desc, eq, gte, lte } from "drizzle-orm";

import AdminPageShell from "@/components/admin/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db/db";
import { cronRuns } from "@/db/schema";
import { runHealthChecks } from "@/lib/observability/health";

type ObservabilityPageProps = {
  searchParams: Promise<{
    cronName?: string;
    status?: string;
    from?: string;
    to?: string;
  }>;
};

const CRON_STATUSES = ["running", "success", "failed"] as const;

export default async function ObservabilityPage({
  searchParams,
}: ObservabilityPageProps) {
  const params = await searchParams;
  const health = await runHealthChecks();
  const conditions = buildCronRunConditions(params);

  const [recentCronRuns, cronNames] = await Promise.all([
    db
      .select()
      .from(cronRuns)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(cronRuns.startedAt))
      .limit(100),
    db
      .selectDistinct({ cronName: cronRuns.cronName })
      .from(cronRuns)
      .orderBy(cronRuns.cronName),
  ]);

  return (
    <AdminPageShell
      title="Observability"
      description="Production health and scheduled job execution history."
    >
      <div className="space-y-5">
        <section className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/50">
                Health Status
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">
                {health.status}
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Last checked {formatDateTime(health.timestamp)}
              </p>
            </div>

            <Badge className={getStatusBadgeClass(health.status)}>
              {health.status}
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(health.checks).map(([name, check]) => (
              <div
                key={name}
                className="rounded-xl border border-white/10 bg-black/40 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50">
                    {name}
                  </p>
                  <Badge className={getStatusBadgeClass(check.status)}>
                    {check.status}
                  </Badge>
                </div>

                {"message" in check && check.message ? (
                  <p className="mt-3 text-sm text-white/60">{check.message}</p>
                ) : null}

                {"missing" in check && check.missing?.length ? (
                  <p className="mt-3 text-sm text-red-300">
                    Missing: {check.missing.join(", ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/50">
                Cron Runs
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white">
                Recent Executions
              </h2>
            </div>

            <form className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <label className="grid gap-1 text-xs font-bold uppercase tracking-wider text-white/50">
                Cron name
                <select
                  name="cronName"
                  defaultValue={params.cronName ?? ""}
                  className="h-9 rounded-lg border border-white/10 bg-black px-3 text-sm text-white"
                >
                  <option value="">All</option>
                  {cronNames.map((cron) => (
                    <option key={cron.cronName} value={cron.cronName}>
                      {cron.cronName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1 text-xs font-bold uppercase tracking-wider text-white/50">
                Status
                <select
                  name="status"
                  defaultValue={params.status ?? ""}
                  className="h-9 rounded-lg border border-white/10 bg-black px-3 text-sm text-white"
                >
                  <option value="">All</option>
                  {CRON_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1 text-xs font-bold uppercase tracking-wider text-white/50">
                From
                <Input
                  type="date"
                  name="from"
                  defaultValue={params.from ?? ""}
                  className="h-9 border-white/10 bg-black text-sm text-white"
                />
              </label>

              <label className="grid gap-1 text-xs font-bold uppercase tracking-wider text-white/50">
                To
                <Input
                  type="date"
                  name="to"
                  defaultValue={params.to ?? ""}
                  className="h-9 border-white/10 bg-black text-sm text-white"
                />
              </label>

              <Button
                type="submit"
                className="h-9 self-end bg-red-600 text-white hover:bg-red-700"
              >
                Apply
              </Button>
            </form>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/40">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/60">Cron name</TableHead>
                  <TableHead className="text-white/60">Status</TableHead>
                  <TableHead className="text-white/60">Started at</TableHead>
                  <TableHead className="text-white/60">Completed at</TableHead>
                  <TableHead className="text-white/60">Duration</TableHead>
                  <TableHead className="text-white/60">Processed</TableHead>
                  <TableHead className="text-white/60">Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCronRuns.length === 0 ? (
                  <TableRow className="border-white/10">
                    <TableCell
                      colSpan={7}
                      className="p-6 text-center text-white/50"
                    >
                      No cron runs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentCronRuns.map((run) => (
                    <TableRow
                      key={run.id}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell className="font-bold text-white">
                        {run.cronName}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(run.status)}>
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/70">
                        {formatDateTime(run.startedAt)}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {formatDateTime(run.completedAt)}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {formatDuration(run.startedAt, run.completedAt)}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {run.processedCount}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-red-200">
                        {run.errorMessage ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}

function buildCronRunConditions(
  params: Awaited<ObservabilityPageProps["searchParams"]>,
) {
  const conditions: SQL[] = [];

  if (params.cronName) {
    conditions.push(eq(cronRuns.cronName, params.cronName));
  }

  const status = parseCronStatus(params.status);

  if (status) {
    conditions.push(eq(cronRuns.status, status));
  }

  if (params.from) {
    conditions.push(gte(cronRuns.startedAt, new Date(params.from)));
  }

  if (params.to) {
    const to = new Date(params.to);
    to.setHours(23, 59, 59, 999);
    conditions.push(lte(cronRuns.startedAt, to));
  }

  return conditions;
}

function parseCronStatus(status: string | undefined) {
  if (!status) return null;

  return CRON_STATUSES.find((cronStatus) => cronStatus === status) ?? null;
}

function getStatusBadgeClass(status: string) {
  if (status === "ok" || status === "success") {
    return "border-green-500/30 bg-green-500/15 text-green-200 hover:bg-green-500/15";
  }

  if (status === "running" || status === "degraded") {
    return "border-yellow-500/30 bg-yellow-500/15 text-yellow-200 hover:bg-yellow-500/15";
  }

  return "border-red-500/30 bg-red-500/15 text-red-200 hover:bg-red-500/15";
}

function formatDateTime(value: Date | string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDuration(startedAt: Date, completedAt: Date | null) {
  if (!completedAt) return "-";

  const durationMs = completedAt.getTime() - startedAt.getTime();
  const seconds = Math.max(0, Math.round(durationMs / 1000));

  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${remainingSeconds}s`;
}
