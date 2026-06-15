import type { ServiceActor } from "@/src/features/shared/service-actor";

export type BuildTransitionInput = {
  buildId: string;
  actor: ServiceActor;
};

export type RejectBuildInput = BuildTransitionInput & {
  reason: string;
};
