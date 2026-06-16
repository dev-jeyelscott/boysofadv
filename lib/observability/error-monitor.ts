type CaptureErrorContext = {
  source: "cron" | "api" | "server";
  cronName?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

const SECRET_PATTERNS = [
  /postgres(?:ql)?:\/\/\S+/gi,
  /Bearer\s+[A-Za-z0-9._~+/=-]+/gi,
  /sk_(?:test|live|key)_[A-Za-z0-9_]+/gi,
  /[A-Za-z0-9_-]*secret[A-Za-z0-9_-]*=["']?[^"',\s]+/gi,
  /[A-Za-z]:\\[^\s)]+/g,
];

export function sanitizeErrorMessage(
  error: unknown,
  fallback = "Operation failed",
) {
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : fallback;

  const withoutSecrets = SECRET_PATTERNS.reduce(
    (message, pattern) => message.replace(pattern, "[redacted]"),
    rawMessage,
  );

  return withoutSecrets.slice(0, 500) || fallback;
}

export function captureError(error: unknown, context: CaptureErrorContext) {
  const message = sanitizeErrorMessage(error);

  console.error("[OBSERVABILITY_ERROR]", {
    message,
    source: context.source,
    cronName: context.cronName,
    userId: context.userId,
    entityType: context.entityType,
    entityId: context.entityId,
    metadata: context.metadata,
  });
}
