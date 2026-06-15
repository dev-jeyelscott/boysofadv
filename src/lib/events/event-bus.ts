export type BaseEventPayload = {
  actorId?: string;
  entityId: string;
  metadata?: Record<string, unknown>;
};

export type DomainEventPayloads = {
  "member.approved": BaseEventPayload & {
    actorId: string;
    metadata: {
      previousStatus: "for_approval";
      newStatus: "approved";
      approvedBy: string;
      approvedAt: Date;
    };
  };
  "build.submitted": BaseEventPayload & {
    actorId: string;
    metadata: {
      ownerId: string;
      slug: string;
      previousStatus: string;
      newStatus: "for_review";
      submittedBy: string;
      submittedAt: Date;
    };
  };
  "build.published": BaseEventPayload & {
    actorId: string;
    metadata: {
      previousStatus: "for_review";
      newStatus: "published";
      ownerId: string;
      slug: string;
      reviewedBy: string;
      reviewedAt: Date;
      publishedAt: Date;
    };
  };
  "build.rejected": BaseEventPayload & {
    actorId: string;
    metadata: {
      previousStatus: "for_review";
      newStatus: "rejected";
      ownerId: string;
      slug: string;
      reviewedBy: string;
      reviewedAt: Date;
      reason: string;
    };
  };
  "event.created": BaseEventPayload & {
    actorId: string;
    metadata: {
      title: string;
      slug: string;
      status: string;
      startsAt: string | null;
      endsAt: string | null;
      location: string | null;
      notificationQueued?: boolean;
    };
  };
  "event.updated": BaseEventPayload & {
    actorId: string;
    metadata: {
      title: string;
      before: Record<string, unknown>;
      after: Record<string, unknown>;
      notificationQueued: boolean;
    };
  };
  "event.cancelled": BaseEventPayload & {
    actorId: string;
    metadata: {
      title: string;
      previousStatus: string;
      status: "cancelled";
      reason: string;
      cancelledAt: string | null;
      notificationQueued: boolean;
    };
  };
  "attendance.checked_in": BaseEventPayload & {
    actorId: string;
    metadata: {
      eventId: string;
      memberId: string;
      checkedInAt: Date;
      gpsAccuracyMeters: string | null;
      distanceMeters: string | null;
    };
  };
};

export type DomainEventName = keyof DomainEventPayloads;
export type DomainEventHandler<TEventName extends DomainEventName> = (
  payload: DomainEventPayloads[TEventName],
) => Promise<void> | void;

class EventBus {
  private readonly handlers = new Map<
    DomainEventName,
    Set<DomainEventHandler<DomainEventName>>
  >();

  register<TEventName extends DomainEventName>(
    eventName: TEventName,
    handler: DomainEventHandler<TEventName>,
  ) {
    const handlers = this.handlers.get(eventName) ?? new Set();

    handlers.add(handler as DomainEventHandler<DomainEventName>);
    this.handlers.set(eventName, handlers);
  }

  async emit<TEventName extends DomainEventName>(
    eventName: TEventName,
    payload: DomainEventPayloads[TEventName],
  ) {
    const handlers = this.handlers.get(eventName);

    if (!handlers?.size) {
      return;
    }

    await Promise.all(
      Array.from(handlers).map(async (handler) => {
        try {
          await handler(payload);
        } catch (error) {
          console.error("[DOMAIN_EVENT_HANDLER_FAILED]", {
            eventName,
            entityId: payload.entityId,
            error,
          });
        }
      }),
    );
  }
}

export const eventBus = new EventBus();
