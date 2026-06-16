# ADR 003: Use UploadThing

## Status

Accepted

## Context

Boys of ADV needs image uploads for build covers, build galleries, event posters, and partner logos. Uploads need to work in a Next.js app without building custom file storage infrastructure.

## Decision

Use UploadThing for image upload handling and store public URLs plus provider file keys in PostgreSQL.

## Consequences

- Upload implementation is faster and simpler than maintaining custom object storage routes.
- Uploads can be integrated directly with App Router route handlers and React components.
- Build covers, gallery images, event posters, and partner logos use the same storage pattern.
- Database records must keep file keys so cleanup jobs can identify unused files.
- Orphan cleanup is required when records are deleted, replaced, or abandoned.

## Alternatives Considered

- Direct S3/R2 integration: more flexible, but more setup and security work.
- Database blob storage: not appropriate for image-heavy public content.
- Manual external image URLs only: simpler, but poor UX and no ownership over uploaded assets.
