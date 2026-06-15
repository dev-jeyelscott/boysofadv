import { and, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { USER_ROLES, USER_STATUSES } from "@/lib/constants/user";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  createAuditLog,
} from "@/src/features/audit/audit-service";
import { NotificationService } from "@/src/features/notifications/notification-service";
import {
  assertApprovedAdmin,
  assertSuperAdmin,
} from "@/src/features/shared/service-actor";
import { eventBus } from "@/src/lib/events/event-bus";
import { registerDomainEventHandlers } from "@/src/lib/events/handlers";
import { ServiceError } from "@/src/lib/errors/service-error";
import type { MemberTransitionInput, RejectMemberInput } from "./member-types";
import { memberIdSchema, optionalReasonSchema } from "./member-validation";

function assertMemberFound<T>(member: T | undefined) {
  if (!member) {
    throw new ServiceError("NOT_FOUND", "Member not found.");
  }

  return member;
}

function assertNotSelf(input: MemberTransitionInput, message: string) {
  if (input.actor.id === input.memberId) {
    throw new ServiceError("INVALID_STATE", message);
  }
}

export const MemberService = {
  async approve(input: MemberTransitionInput) {
    assertApprovedAdmin(input.actor);
    memberIdSchema.parse(input.memberId);

    const now = new Date();
    const [member] = await db
      .update(users)
      .set({
        status: USER_STATUSES.APPROVED,
        approvedAt: now,
        approvedBy: input.actor.id,
        rejectionReason: null,
        updatedAt: now,
      })
      .where(
        and(
          eq(users.id, input.memberId),
          eq(users.status, USER_STATUSES.FOR_APPROVAL),
        ),
      )
      .returning();

    if (!member) {
      const existing = await db.query.users.findFirst({
        where: eq(users.id, input.memberId),
      });

      assertMemberFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only members for approval can be approved.",
      );
    }

    registerDomainEventHandlers();
    await eventBus.emit("member.approved", {
      actorId: input.actor.id,
      entityId: member.id,
      metadata: {
        previousStatus: USER_STATUSES.FOR_APPROVAL,
        newStatus: USER_STATUSES.APPROVED,
        approvedBy: input.actor.id,
        approvedAt: now,
      },
    });

    return {
      success: true,
      member,
    };
  },

  async reject(input: RejectMemberInput) {
    assertApprovedAdmin(input.actor);
    memberIdSchema.parse(input.memberId);
    const reason = optionalReasonSchema.parse(input.reason);

    const now = new Date();
    const [member] = await db
      .update(users)
      .set({
        status: USER_STATUSES.REJECTED,
        rejectedAt: now,
        rejectedBy: input.actor.id,
        rejectionReason: reason ?? null,
        updatedAt: now,
      })
      .where(
        and(
          eq(users.id, input.memberId),
          eq(users.status, USER_STATUSES.FOR_APPROVAL),
        ),
      )
      .returning();

    if (!member) {
      const existing = await db.query.users.findFirst({
        where: eq(users.id, input.memberId),
      });

      assertMemberFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only members for approval can be rejected.",
      );
    }

    await createAuditLog({
      actorId: input.actor.id,
      action: AUDIT_ACTIONS.MEMBER_REJECTED,
      entityType: AUDIT_ENTITY_TYPES.MEMBER,
      entityId: member.id,
      metadata: {
        previousStatus: USER_STATUSES.FOR_APPROVAL,
        newStatus: USER_STATUSES.REJECTED,
        rejectedBy: input.actor.id,
        rejectedAt: now,
        reason: reason ?? null,
      },
    });

    const notificationSummary = await NotificationService.notifyUser({
      userId: member.id,
      payload: {
        title: "Membership Declined",
        body: "Your membership application is rejected. Please coordinate with your designated admin.",
        url: "/my-profile",
      },
    });

    return {
      success: true,
      member,
      notificationSummary,
    };
  },

  async suspend(input: MemberTransitionInput) {
    assertApprovedAdmin(input.actor);
    assertNotSelf(input, "You cannot suspend your own account.");
    memberIdSchema.parse(input.memberId);

    const now = new Date();
    const [member] = await db
      .update(users)
      .set({
        status: USER_STATUSES.SUSPENDED,
        suspendedAt: now,
        suspendedBy: input.actor.id,
        updatedAt: now,
      })
      .where(
        and(
          eq(users.id, input.memberId),
          eq(users.status, USER_STATUSES.APPROVED),
        ),
      )
      .returning();

    if (!member) {
      const existing = await db.query.users.findFirst({
        where: eq(users.id, input.memberId),
      });

      assertMemberFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only approved members can be suspended.",
      );
    }

    await createAuditLog({
      actorId: input.actor.id,
      action: AUDIT_ACTIONS.MEMBER_SUSPENDED,
      entityType: AUDIT_ENTITY_TYPES.MEMBER,
      entityId: member.id,
      metadata: {
        previousStatus: USER_STATUSES.APPROVED,
        newStatus: USER_STATUSES.SUSPENDED,
        suspendedBy: input.actor.id,
        suspendedAt: now,
      },
    });

    return {
      success: true,
      member,
    };
  },

  async markActive(input: MemberTransitionInput) {
    assertApprovedAdmin(input.actor);
    memberIdSchema.parse(input.memberId);

    const [member] = await db
      .update(users)
      .set({
        status: USER_STATUSES.APPROVED,
        suspendedAt: null,
        suspendedBy: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(users.id, input.memberId),
          eq(users.status, USER_STATUSES.SUSPENDED),
        ),
      )
      .returning();

    if (!member) {
      const existing = await db.query.users.findFirst({
        where: eq(users.id, input.memberId),
      });

      assertMemberFound(existing);
      throw new ServiceError(
        "INVALID_STATE",
        "Only suspended members can be marked active.",
      );
    }

    const notificationSummary = await NotificationService.notifyUser({
      userId: member.id,
      payload: {
        title: "Account Active",
        body: "Your account is now active.",
        url: "/member/profile",
      },
    });

    return {
      success: true,
      member,
      notificationSummary,
    };
  },

  async archive(input: MemberTransitionInput) {
    assertApprovedAdmin(input.actor);
    assertNotSelf(input, "You cannot archive your own account.");
    memberIdSchema.parse(input.memberId);

    const existing = await db.query.users.findFirst({
      where: eq(users.id, input.memberId),
    });

    const existingMember = assertMemberFound(existing);

    if (existingMember.role === USER_ROLES.SUPER_ADMIN) {
      throw new ServiceError(
        "FORBIDDEN",
        "Super admin accounts cannot be archived.",
      );
    }

    const [member] = await db
      .update(users)
      .set({
        status: USER_STATUSES.ARCHIVED,
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.memberId))
      .returning();

    assertMemberFound(member);

    return {
      success: true,
      member,
    };
  },

  async promoteToAdmin(input: MemberTransitionInput) {
    assertSuperAdmin(input.actor);
    memberIdSchema.parse(input.memberId);

    const [member] = await db
      .update(users)
      .set({
        role: USER_ROLES.ADMIN,
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.memberId))
      .returning();

    assertMemberFound(member);

    const notificationSummary = await NotificationService.notifyUser({
      userId: member.id,
      payload: {
        title: "You've been Promoted",
        body: "Congratulations! You've been promoted as Boys of ADV Admin.",
        url: "/admin/dashboard",
      },
    });

    return {
      success: true,
      member,
      notificationSummary,
    };
  },

  async demoteToMember(input: MemberTransitionInput) {
    assertSuperAdmin(input.actor);
    assertNotSelf(input, "You cannot demote your own account.");
    memberIdSchema.parse(input.memberId);

    const existing = await db.query.users.findFirst({
      where: eq(users.id, input.memberId),
    });

    const existingMember = assertMemberFound(existing);

    if (existingMember.role === USER_ROLES.SUPER_ADMIN) {
      throw new ServiceError(
        "FORBIDDEN",
        "Super admin accounts cannot be demoted.",
      );
    }

    const [member] = await db
      .update(users)
      .set({
        role: USER_ROLES.MEMBER,
        updatedAt: new Date(),
      })
      .where(eq(users.id, input.memberId))
      .returning();

    assertMemberFound(member);

    return {
      success: true,
      member,
    };
  },
};
