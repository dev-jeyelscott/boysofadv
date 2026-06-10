import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { events } from "@/db/schema";
import { getCurrentDbUser } from "@/lib/current-user";
import { MemberCheckInClient } from "./member-check-in-client";

type Props = {
  params: Promise<{
    eventId: string;
  }>;
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function MemberCheckInPage({
  params,
  searchParams,
}: Props) {
  const { eventId } = await params;
  const { token } = await searchParams;

  const user = await getCurrentDbUser();

  if (!user) {
    redirect(
      `/sign-in?redirect_url=/events/${eventId}/check-in?token=${token}`,
    );
  }

  const [event] = await db
    .select({
      id: events.id,
      title: events.title,
      location: events.location,
      startDate: events.startDate,
      endDate: events.endDate,
      status: events.status,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (event.status !== "published") {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-black uppercase">Check-in Failed</h1>
          <p className="mt-3 text-white/60">
            Attendance is not open for this event.
          </p>
        </div>
      </main>
    );
  }

  const now = new Date();

  if (event.startDate && now < event.startDate) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-black uppercase">Check-in Failed</h1>
          <p className="mt-3 text-white/60">Attendance has not started yet.</p>
        </div>
      </main>
    );
  }

  if (event.endDate && now > event.endDate) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-black uppercase">Check-in Failed</h1>
          <p className="mt-3 text-white/60">Attendance is already closed.</p>
        </div>
      </main>
    );
  }

  if (!event || !token) {
    redirect("/events");
  }

  return <MemberCheckInClient event={event} token={token} />;
}
