import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventDisplayStatus } from "@/lib/constants/event";
import {
  getEventDisplayStatusClasses,
  getEventDisplayStatusLabel,
} from "@/lib/events/display-status";

type EventStatusBadgeProps = {
  status: EventDisplayStatus;
  variant?: "admin" | "public";
  className?: string;
};

export function EventStatusBadge({
  status,
  variant = "admin",
  className,
}: EventStatusBadgeProps) {
  return (
    <Badge
      className={cn(getEventDisplayStatusClasses(status, variant), className)}
    >
      {getEventDisplayStatusLabel(status)}
    </Badge>
  );
}
