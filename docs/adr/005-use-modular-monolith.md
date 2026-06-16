# ADR 005: Use Modular Monolith

## Status

Accepted

## Context

Boys of ADV includes public pages, member workflows, admin workflows, uploads, notifications, cron jobs, attendance, and audit logging. These domains are related and share a database, auth model, UI system, and deployment target.

## Decision

Use a modular monolith: one Next.js application and one primary database, with clear feature/service boundaries inside the codebase.

## Consequences

- Deployment stays simple through one Vercel app.
- Shared auth, permissions, database schema, UI, and cache rules remain easy to coordinate.
- Feature modules and services provide maintainable boundaries without microservice overhead.
- Refactoring is easier because related code lives in one repository and can be changed atomically.
- Module boundaries require discipline. Routes should not accumulate business logic, and services should not become catch-all utilities.

## Alternatives Considered

- Microservices: unnecessary operational overhead for the current product size.
- Separate admin/member apps: more deployment and shared-code complexity without enough benefit.
- Single unstructured app layer: fastest initially, but harder to maintain as workflows grow.
