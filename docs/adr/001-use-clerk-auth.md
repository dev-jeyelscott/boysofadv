# ADR 001: Use Clerk Auth

## Status

Accepted

## Context

Boys of ADV needs authentication for members, admins, and super admins. The platform also needs a clean signup flow, hosted sign-in screens, user lifecycle events, and reliable session handling in a Next.js App Router app.

## Decision

Use Clerk for authentication and session management. Store application-specific role and status in the internal `users` table.

Clerk owns hosted auth, sessions, and user lifecycle webhooks. Boys of ADV owns authorization decisions such as `super_admin`, `admin`, `member`, `for_approval`, `approved`, `rejected`, and `suspended`.

## Consequences

- Faster implementation of sign-in, sign-up, and session handling.
- Clerk webhooks can create and synchronize internal user records.
- App authorization remains explicit and queryable in PostgreSQL.
- Protected routes can use Clerk identity and internal user state together.
- The platform depends on Clerk availability and correct webhook configuration.

## Alternatives Considered

- Custom username/password auth: more control, but slower to build and higher security burden.
- NextAuth/Auth.js: flexible, but still requires more ownership of provider/session details.
- Clerk-only roles in metadata: simpler initially, but weaker for relational queries and service-level authorization.
