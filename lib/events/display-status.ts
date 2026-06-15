import type { EventDisplayStatus, EventRow } from "@/lib/constants/event";

type EventSchedule = Pick<EventRow, "startsAt" | "endsAt" | "status">;

type DisplayStatusMode = "admin" | "schedule";

const eventDisplayStatusLabels: Record<EventDisplayStatus, string> = {
  draft: "Draft",
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const adminStatusClasses: Record<EventDisplayStatus, string> = {
  draft: "bg-yellow-600/20 text-yellow-300 border-yellow-500/20",
  upcoming: "bg-red-600/20 text-red-300 border-red-500/20",
  ongoing: "bg-emerald-600/20 text-emerald-300 border-emerald-500/20",
  completed: "bg-white/10 text-white/70 border-white/10",
  cancelled: "bg-zinc-700/40 text-zinc-300 border-white/10",
};

const publicStatusClasses: Record<EventDisplayStatus, string> = {
  draft: "border-red-500/30 bg-red-500/10 text-red-400",
  upcoming: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  ongoing: "border-green-500/30 bg-green-500/10 text-green-400",
  completed: "border-white/20 bg-white/10 text-white",
  cancelled: "border-red-500/30 bg-red-500/10 text-red-400",
};

export function getEventDisplayStatus(
  event: EventSchedule,
  mode: DisplayStatusMode = "admin",
): EventDisplayStatus {
  const now = new Date();
  const startsAt = event.startsAt ? new Date(event.startsAt) : null;
  const endsAt = event.endsAt ? new Date(event.endsAt) : startsAt;

  if (mode === "admin") {
    if (event.status === "draft") return "draft";
    if (event.status === "cancelled") return "cancelled";
    if (event.status === "completed") return "completed";
  }

  if (!startsAt) return "draft";
  if (startsAt > now) return "upcoming";
  if (endsAt && endsAt < now) return "completed";

  return "ongoing";
}

export function getEventDisplayStatusLabel(status: EventDisplayStatus) {
  return eventDisplayStatusLabels[status];
}

export function getEventDisplayStatusClasses(
  status: EventDisplayStatus,
  variant: "admin" | "public" = "admin",
) {
  return variant === "public"
    ? publicStatusClasses[status]
    : adminStatusClasses[status];
}
