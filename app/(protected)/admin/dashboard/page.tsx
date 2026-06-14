import type { ReactNode } from "react";
import type { SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

import Link from "next/link";
import { and, desc, eq, gte, ne, sql } from "drizzle-orm";
import {
  ArrowRight,
  Bike,
  CalendarDays,
  Clock,
  Handshake,
  Users,
} from "lucide-react";

import AdminPageShell from "@/components/admin/admin-page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import { builds, events, partners, users } from "@/db/schema";
import { BUILD_STATUSES } from "@/lib/constants/build";
import { USER_STATUSES } from "@/lib/constants/user";

export default async function DashboardPage() {
  const today = new Date();

  const [
    totalMembers,
    pendingMembers,
    approvedMembers,
    suspendedMembers,
    totalBuilds,
    pendingBuilds,
    publishedBuilds,
    featuredBuildsCount,
    totalPartners,
    featuredPartners,
    upcomingEvents,
    recentMembers,
    recentBuilds,
    recentPartners,
    recentEvents,
  ] = await Promise.all([
    getCount(users),
    getCount(users, eq(users.status, USER_STATUSES.FOR_APPROVAL)),
    getCount(users, eq(users.status, USER_STATUSES.APPROVED)),
    getCount(users, eq(users.status, USER_STATUSES.SUSPENDED)),

    getCount(builds),
    getCount(builds, eq(builds.status, BUILD_STATUSES.FOR_REVIEW)),
    getCount(builds, ne(builds.status, BUILD_STATUSES.DRAFT)),
    getCount(builds, eq(builds.isFeatured, true)),

    getCount(partners),
    getCount(partners, eq(partners.isOfficial, true)),

    getCount(
      events,
      and(eq(events.status, "published"), gte(events.startDate, today)),
    ),

    db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        nickname: users.nickname,
        codename: users.codename,
        email: users.email,
        unit: users.unit,
        status: users.status,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5),

    db
      .select({
        id: builds.id,
        title: builds.title,
        motorcycleModel: builds.motorcycleModel,
        status: builds.status,
        isFeatured: builds.isFeatured,
        createdAt: builds.createdAt,
        ownerFirstName: users.firstName,
        ownerLastName: users.lastName,
        ownerNickname: users.nickname,
        ownerEmail: users.email,
      })
      .from(builds)
      .leftJoin(users, eq(builds.userId, users.id))
      .orderBy(desc(builds.createdAt))
      .limit(5),

    db
      .select({
        id: partners.id,
        name: partners.name,
        isOfficial: partners.isOfficial,
        createdAt: partners.createdAt,
      })
      .from(partners)
      .orderBy(desc(partners.createdAt))
      .limit(5),

    db
      .select({
        id: events.id,
        title: events.title,
        location: events.location,
        startDate: events.startDate,
        createdAt: events.createdAt,
      })
      .from(events)
      .where(and(eq(events.status, "published"), gte(events.startDate, today)))
      .orderBy(events.startDate)
      .limit(5),
  ]);

  return (
    <AdminPageShell
      title="Dashboard"
      description="Live overview of members, builds, partners, and events."
    >
      <div className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Members"
            value={totalMembers}
            helper={`${pendingMembers} pending approval`}
            href="/admin/memberships"
            icon={<Users className="size-5" />}
          />

          <StatCard
            label="Total Builds"
            value={totalBuilds}
            helper={`${pendingBuilds} pending review`}
            href="/admin/builds"
            icon={<Bike className="size-5" />}
          />

          <StatCard
            label="Partners"
            value={totalPartners}
            helper={`${featuredPartners} official partners`}
            href="/admin/partners"
            icon={<Handshake className="size-5" />}
          />

          <StatCard
            label="Upcoming Events"
            value={upcomingEvents}
            helper="Scheduled from today onward"
            href="/admin/events"
            icon={<CalendarDays className="size-5" />}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MiniStat label="Active Members" value={approvedMembers} />
          <MiniStat label="Suspended Members" value={suspendedMembers} />
          <MiniStat label="Published Builds" value={publishedBuilds} />
          <MiniStat label="Featured Builds" value={featuredBuildsCount} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <AdminPanel
            title="Recent Members"
            href="/admin/members"
            emptyText="No members yet."
          >
            {recentMembers.map((member) => (
              <ListItem
                key={member.id}
                title={getMemberName(member)}
                meta={[member.unit, formatStatus(member.status)]
                  .filter(Boolean)
                  .join(" • ")}
                badge={formatStatus(member.status)}
                href="/admin/members"
              />
            ))}
          </AdminPanel>

          <AdminPanel
            title="Recent Builds"
            href="/admin/builds"
            emptyText="No builds yet."
          >
            {recentBuilds.map((build) => (
              <ListItem
                key={build.id}
                title={build.title || "Untitled Build"}
                meta={[
                  build.motorcycleModel,
                  getOwnerName(build),
                  build.isFeatured ? "Featured" : null,
                ]
                  .filter(Boolean)
                  .join(" • ")}
                badge={formatStatus(build.status)}
                href="/admin/builds"
              />
            ))}
          </AdminPanel>

          <AdminPanel
            title="Recent Partners"
            href="/admin/partners"
            emptyText="No partners yet."
          >
            {recentPartners.map((partner) => (
              <ListItem
                key={partner.id}
                title={partner.name}
                meta={
                  partner.isOfficial ? "Official Partner" : "Standard Partner"
                }
                badge={partner.isOfficial ? "Official" : "Partner"}
                href="/admin/partners"
              />
            ))}
          </AdminPanel>

          <AdminPanel
            title="Upcoming Events"
            href="/admin/events"
            emptyText="No upcoming events."
          >
            {recentEvents.map((event) => (
              <ListItem
                key={event.id}
                title={event.title}
                meta={[formatDate(event.startDate), event.location]
                  .filter(Boolean)
                  .join(" • ")}
                badge="Upcoming"
                href="/admin/events"
              />
            ))}
          </AdminPanel>
        </div>
      </div>
    </AdminPageShell>
  );
}

async function getCount(table: PgTable, where?: SQL) {
  const query = db
    .select({
      value: sql<number>`count(*)::int`,
    })
    .from(table)
    .$dynamic();

  const [result] = where ? await query.where(where) : await query;

  return result?.value ?? 0;
}

function StatCard({
  label,
  value,
  helper,
  href,
  icon,
}: {
  label: string;
  value: number;
  helper: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-white/4 p-4 transition hover:border-red-500/40 hover:bg-white/7 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/50 sm:text-xs">
          {label}
        </p>

        <div className="shrink-0 rounded-xl border border-white/10 bg-black/40 p-2 text-red-500">
          {icon}
        </div>
      </div>

      <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
        {value}
      </h2>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="line-clamp-2 text-xs text-white/50 sm:text-sm">
          {helper}
        </p>

        <ArrowRight className="size-4 shrink-0 text-white/70 transition group-hover:translate-x-1 group-hover:text-red-500" />
      </div>
    </Link>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/70 sm:text-xs">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white sm:text-3xl">{value}</p>
    </div>
  );
}

function AdminPanel({
  title,
  href,
  children,
  emptyText,
}: {
  title: string;
  href: string;
  children: ReactNode;
  emptyText: string;
}) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const isEmpty = Array.isArray(items) && items.length === 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black uppercase text-white sm:text-xl">
          {title}
        </h2>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-9 shrink-0 border-white/10 bg-white/3 px-3 text-xs text-white hover:bg-white/10 hover:text-white sm:text-sm"
        >
          <Link href={href}>View all</Link>
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:mt-5">
        {isEmpty ? <EmptyState text={emptyText} /> : children}
      </div>
    </section>
  );
}

function ListItem({
  title,
  meta,
  badge,
  href,
}: {
  title: string;
  meta: string;
  badge: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-white/10 bg-black/40 p-4 transition hover:border-red-500/40 hover:bg-black/60"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="line-clamp-1 font-black text-white group-hover:text-red-400">
            {title}
          </p>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/50 sm:text-sm">
            {meta || "—"}
          </p>
        </div>

        <Badge className="w-fit shrink-0 border-white/10 bg-white/10 text-xs text-white hover:bg-white/10">
          {badge}
        </Badge>
      </div>
    </Link>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-black/30 p-6 text-center">
      <Clock className="mx-auto size-5 text-white/30" />
      <p className="mt-3 text-sm text-white/50">{text}</p>
    </div>
  );
}

function getMemberName(member: {
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  codename: string | null;
  email: string;
}) {
  return (
    member.nickname ||
    member.codename ||
    [member.firstName, member.lastName].filter(Boolean).join(" ") ||
    member.email
  );
}

function getOwnerName(build: {
  ownerFirstName: string | null;
  ownerLastName: string | null;
  ownerNickname: string | null;
  ownerEmail: string | null;
}) {
  return (
    build.ownerNickname ||
    [build.ownerFirstName, build.ownerLastName].filter(Boolean).join(" ") ||
    build.ownerEmail ||
    "Unknown owner"
  );
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: Date | string | null) {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
