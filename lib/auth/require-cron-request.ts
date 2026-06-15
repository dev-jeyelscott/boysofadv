export function requireCronRequest(request: Request) {
  const authHeader = request.headers.get("authorization");

  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}
