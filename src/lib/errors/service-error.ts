export class ServiceError extends Error {
  constructor(
    public code:
      | "UNAUTHORIZED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "VALIDATION_ERROR"
      | "INVALID_STATE"
      | "CONFLICT",
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
