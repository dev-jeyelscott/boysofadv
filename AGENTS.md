# Boys of ADV

## Project

Boys of ADV is a community platform for Honda ADV riders.

The platform consists of:

- Public Website
- Member Portal
- Admin Panel

Primary goals:

- Showcase member motorcycle builds
- Manage community events
- Manage memberships
- Support partners and sponsors
- Deliver a mobile-first experience

---

## Tech Stack

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Clerk Authentication
- PostgreSQL
- Drizzle ORM
- UploadThing
- Vercel
- PWA (next-pwa)

---

## Core Principles

- Mobile-first
- Server-first
- Type-safe
- Accessibility by default
- Reusable components
- Production-ready code
- Simple over clever
- Security by default

---

## Architecture Rules

### Frontend

- Use Server Components by default
- Use Client Components only when necessary
- Prefer Server Actions when appropriate
- Avoid unnecessary state management
- No `setState` inside `useEffect`

### Backend

- Validate all inputs
- Enforce authorization on every protected action
- Never trust client data
- Keep business logic out of UI components

### Database

- Use Drizzle ORM
- Use foreign keys and constraints
- Prefer explicit relations
- Design for maintainability
- Create safe migrations

---

## Authentication

Authentication is handled by Clerk.

Roles:

- super_admin
- admin
- member

Member statuses:

- for_approval
- approved
- rejected
- suspended

Only approved members may access protected member features.

---

## UI Guidelines

Theme:

- Dark
- Black / White / Red

Design:

- Mobile-first
- Clean layouts
- Consistent spacing
- Rounded cards
- Strong visual hierarchy
- Accessible contrast

---

## Key Features

### Builds

- Member build profiles
- Build gallery
- Build approval workflow
- Likes
- Comments and replies

### Events

- Public event listings
- QR attendance
- Geofence validation
- Event notifications

### Partners

- Partner directory
- Sponsorship inquiries

### Notifications

- Web Push Notifications
- Event updates
- Build approval updates
- Like notifications

---

## Development Expectations

Before implementation:

1. Understand requirements.
2. Identify risks and edge cases.
3. Propose the simplest maintainable solution.
4. Keep consistency with existing architecture.
5. Avoid introducing unnecessary dependencies.

When finished:

- Verify type safety.
- Verify authorization.
- Verify mobile responsiveness.
- Verify accessibility.
- Verify production readiness.
