import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ServiceError } from "./service-error";

const serviceErrorStatus = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  INVALID_STATE: 400,
  CONFLICT: 409,
} as const;

export function handleServiceError(error: unknown) {
  if (error instanceof ServiceError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: serviceErrorStatus[error.code] },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: error.issues[0]?.message ?? "Invalid input.",
        code: "VALIDATION_ERROR",
      },
      { status: 400 },
    );
  }

  console.error("[SERVICE_ERROR]", error);

  return NextResponse.json(
    { message: "Something went wrong.", code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}

export function getServiceActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ServiceError) {
    return error.message;
  }

  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallback;
  }

  console.error("[SERVICE_ACTION_ERROR]", error);

  return fallback;
}
