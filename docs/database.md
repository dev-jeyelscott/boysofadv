# Database

## Overview

Boys of ADV uses PostgreSQL through Drizzle ORM. Schema files live in `db/schema/`, relations live in `db/schema/relations.ts`, and migrations live in `db/migrations/`.

The schema uses explicit foreign keys, Drizzle enums for core statuses, and indexes for public listings, admin queues, full-text search, and cron observability.

## Main Tables

| Table                | Purpose                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `users`              | Internal user profile synced from Clerk and enriched with community fields, role, and status. |
| `builds`             | Member motorcycle build profiles and review state.                                            |
| `gallery_images`     | Build gallery images attached to build records.                                               |
| `events`             | Community events, locations, publication state, and attendance summary metadata.              |
| `event_attendance`   | One check-in record per user per event.                                                       |
| `partners`           | Partner directory entries and sponsorship metadata.                                           |
| `push_subscriptions` | Browser Web Push subscription keys per user endpoint.                                         |
| `audit_logs`         | Append-only admin/domain action history.                                                      |
| `cron_runs`          | Execution records for scheduled jobs.                                                         |

## `users`

Purpose: stores internal user records mapped to Clerk users.

Important columns:

- `id`: internal primary key.
- `clerk_user_id`: unique Clerk user id.
- `email`: unique email address.
- `role`: `super_admin`, `admin`, or `member`.
- `status`: `for_approval`, `approved`, `rejected`, `suspended`, or `archived`.
- `approved_at`, `approved_by_user_id`, `rejected_at`, `rejected_by_user_id`, `suspended_at`, `suspended_by_user_id`: moderation lifecycle fields.
- `last_active_at`, `inactive_detected_at`: activity tracking for inactive member detection.
- `search_vector`: generated `tsvector` for member search.

Relationships:

- One user owns one build through `builds.user_id`.
- Users can author build comments and likes.
- Users can have many push subscriptions.
- Users can have many audit logs as actors.

Indexes and constraints:

- Unique indexes on `clerk_user_id` and `email`.
- Indexes on status, role, created date, status plus created date, role plus status, reviewer references, and GIN search vector.

Delete behavior:

- Moderation references use `onDelete: set null`.
- Build ownership restricts deletion through `builds.user_id`.
- Push subscriptions cascade when a user is deleted.

## `builds`

Purpose: stores member build profiles and review workflow state.

Important columns:

- `user_id`: required owner reference to `users.id`.
- `title`, `slug`, `motorcycle_model`, `year_model`: listing identity.
- `description`, `concept`, and setup fields for build details.
- `cover_image_url`, `cover_image_key`: UploadThing cover image data.
- `status`: `draft`, `for_review`, `published`, `unpublished`, `rejected`, or `archived`.
- `is_featured`: highlighted public listing flag.
- `submitted_at`, `published_at`, `reviewed_at`, `reviewed_by`, `rejection_reason`: review lifecycle fields.
- `popularity_score`, `popularity_calculated_at`: scheduled popularity metrics.
- `search_vector`: maintained build search vector.

Relationships:

- Each build belongs to a user.
- Build gallery images cascade from builds.
- Build comments and likes attach to builds through their own schema files.

Indexes and constraints:

- Unique `slug`.
- Indexes on status, owner, featured flag, created/updated dates, review queue, public listing, reviewer, and GIN search vector.

Delete behavior:

- `user_id` uses `onDelete: restrict`.
- `gallery_images.build_id` uses `onDelete: cascade`.

## `gallery_images`

Purpose: stores gallery images for builds.

Important columns:

- `user_id`: optional uploader/owner reference.
- `build_id`: required build reference.
- `type`: `build`, `event`, or `general`.
- `image_url`, `alt_text`, `caption`, `display_order`.

Relationships:

- Belongs to a build.
- Optionally belongs to a user.

Indexes and constraints:

- `gallery_images_build_order_idx` supports ordered gallery display.

Delete behavior:

- User and build references cascade.

## `events`

Purpose: stores community event listings, publication state, geofence details, and summary flags.

Important columns:

- `title`, `slug`, `description`, `location`.
- `start_date`, `end_date`.
- `latitude`, `longitude`, `geo_radius_meters`.
- `poster_image_url`, `poster_image_key`.
- `status`: `draft`, `published`, `completed`, or `cancelled`.
- `published_at`, `cancelled_at`, `cancelled_by_user_id`, `cancellation_reason`, `completedAt`.
- `attendance_summary_sent_at`: prevents duplicate summary notifications.
- `search_vector`: generated `tsvector` for event search.

Relationships:

- Events have many attendance rows.
- Cancelled-by points to `users.id` with `onDelete: set null`.

Indexes and constraints:

- Unique `slug`.
- Indexes on status, start/end dates, status plus dates, cancelled-by, and GIN search vector.

Delete behavior:

- Attendance rows cascade when an event is deleted.

## `event_attendance`

Purpose: records member check-ins for events.

Important columns:

- `event_id`, `user_id`: checked-in event and member.
- `status`: currently defaults to `checked_in`.
- `check_in_latitude`, `check_in_longitude`, `gps_accuracy_meters`, `distance_meters`.
- `checked_in_at`.

Relationships:

- Belongs to `events`.
- Belongs to `users`.

Indexes and constraints:

- Unique `(event_id, user_id)` prevents duplicate check-ins.
- Indexes on event, user, event plus checked-in time, and user plus checked-in time.

Delete behavior:

- Event deletion cascades attendance.
- User deletion is restricted.

## `partners`

Purpose: stores public partner directory entries.

Important columns:

- `name`, `slug`.
- `logo_url`, `logo_key`.
- `website_url`, `facebook_url`.
- `description`, `category`.
- `status`: `draft`, `active`, or `inactive`.
- `is_official`, `display_order`.

Indexes and constraints:

- Unique `slug`.
- Indexes on status and category.

## `push_subscriptions`

Purpose: stores browser Web Push subscription endpoints for approved users.

Important columns:

- `user_id`: subscription owner.
- `endpoint`: unique browser push endpoint.
- `p256dh`, `auth`: subscription keys.
- `updated_at`: refreshed on subscribe and used by cleanup jobs.

Indexes and constraints:

- Unique endpoint.
- Indexes on user and created date.

Delete behavior:

- User deletion cascades subscriptions.
- Expired endpoints are removed when push delivery returns 404 or 410, and by scheduled cleanup.

## `audit_logs`

Purpose: append-only record of domain actions.

Important columns:

- `actor_id`: user who initiated the action.
- `action`: normalized audit action string.
- `entity_type`, `entity_id`: affected entity.
- `metadata`: JSON details about the action.
- `created_at`.

Indexes and constraints:

- Indexes on actor plus created date, entity, action plus created date, and created date.

Delete behavior:

- Actor references `users.id`; audit entries should be treated as append-only history.

## `cron_runs`

Purpose: records scheduled job execution for admin observability.

Important columns:

- `cron_name`.
- `started_at`, `completed_at`.
- `status`: `running`, `success`, or `failed`.
- `error_message`, `processed_count`, `metadata`.

Indexes and constraints:

- Indexes on cron name plus start time, status plus start time, and start time.

## Search Strategy

The project uses PostgreSQL full-text search where higher-scale search is needed:

- `users.search_vector` is generated from names, nickname, codename, email, unit, and chapter using `simple` configuration.
- `events.search_vector` is generated from title, description, and location using `english` configuration.
- `builds.search_vector` is maintained because build search needs fields from both builds and owners. It is indexed with GIN and refreshed by migration-level database behavior.

Simple admin filters still use direct equality or `ilike` where appropriate.
