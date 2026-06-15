import type { ServiceActor } from "@/src/features/shared/service-actor";

export type MemberTransitionInput = {
  memberId: string;
  actor: ServiceActor;
};

export type RejectMemberInput = MemberTransitionInput & {
  reason?: string;
};
