# ADR 002: Use Drizzle + PostgreSQL

## Status

Accepted

## Context

Boys of ADV stores relational community data: users, builds, events, attendance, partners, push subscriptions, audit logs, and cron runs. The application needs type-safe database access, explicit schema changes, joins, constraints, and search support.

## Decision

Use PostgreSQL as the primary database and Drizzle ORM for schema definitions, queries, and migrations.

## Consequences

- TypeScript code can share schema-derived types with queries.
- Relational data is modeled with foreign keys and explicit relations.
- PostgreSQL supports strong indexing, constraints, JSON metadata, and full-text search.
- Drizzle migrations make schema changes reviewable.
- The team must maintain schema discipline and inspect generated migrations before applying them.

## Alternatives Considered

- Prisma with PostgreSQL: productive, but Drizzle gives more direct SQL-oriented control.
- Supabase client without Drizzle: useful platform features, but less aligned with repo-local schema and migration ownership.
- Document database: poorer fit for the relational workflows and reporting needs.
