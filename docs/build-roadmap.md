# Build Roadmap

Legend:

- ✅ Covered / implemented
- 🟡 Partially covered / needs polish
- ⬜ Not covered / pending
- 🔁 Changed from original plan

## Phase 1 — Foundation

- ✅ Create Next.js app
- ✅ Configure TypeScript, Tailwind, shadcn/ui
- ✅ Set up project structure
- ✅ Add theme tokens: **black / white / red**
- ✅ Build static homepage layout first

## Phase 2 — Public Website

Pages:

- ✅ Home
- ✅ About Boys of ADV
- ✅ Builds / Gallery
- ✅ Partners
- ✅ Events
- 🔁 Join Us → replaced by **Clerk sign-up + member approval flow**
- 🟡 Contact → partner inquiry exists; general contact may still be pending

Sections:

- ✅ Hero banner
- ✅ Mission / Vision
- ✅ Featured builds carousel
- ✅ Partners
- ✅ Meet & greet calendar / Events section
- ✅ Join CTA
- ✅ Partner CTA

## Phase 3 — Database + CMS

Tables:

- ✅ `users`
- ✅ `partners`
- ✅ `builds`
- ✅ `gallery_images`
- ✅ `events`
- 🔁 `join_requests` → replaced by `users.status = for_approval`
- ✅ `partner_inquiries`
- 🟡 `contact_messages` → optional / not confirmed
- ✅ `push_subscriptions`
- ✅ `event_attendance`

Stack:

- ✅ PostgreSQL
- ✅ Drizzle ORM
- 🔁 Production DB: Vercel Postgres instead of Neon

## Phase 4 — Admin Panel

Admin features:

- ✅ Login
- ✅ Role-based dashboard
- ✅ Manage builds
- ✅ Manage gallery images
- ✅ Manage partners
- ✅ Manage events
- ✅ View join requests → handled as **Membership Approvals**
- ✅ View partner inquiries
- 🔁 Send email notifications → replaced/augmented with **Web Push notifications**

Auth:

- 🔁 Better Auth recommendation replaced with **Clerk**
- ✅ Clerk authentication
- ✅ Role-based access control
- ✅ Approval gate for pending users

## Phase 5 — Media + Notifications

- ✅ UploadThing for build/gallery/partner/event images
- 🔁 Resend for contact/join/partner inquiry notifications → not primary
- ✅ Web Push notifications
- ✅ Push subscribe/unsubscribe/status APIs
- ✅ Admin/member notification senders
- ✅ Service worker / PWA notification support

## Phase 6 — Production

- 🔁 Neon PostgreSQL → using **Vercel Postgres**
- ✅ Vercel deployment
- 🟡 Environment validation
- ✅ Database migrations
- 🟡 Admin seed user / super admin bootstrap via `SUPER_ADMIN_EMAIL`
- ✅ SEO metadata
- 🟡 Open Graph image
- ✅ Sitemap
- ✅ Robots.txt

## Phase 7 — Member Portal

- ✅ Member dashboard / overview
- ✅ Profile management
- ✅ My Build management
- ✅ Build submission for review
- ✅ Build publish/reject workflow
- ✅ Build unpublish workflow
- ✅ Account settings
- ✅ Mobile sidebar behavior
- ✅ Push notification toggle

## Phase 8 — Events + Attendance

- ✅ Event CRUD
- ✅ Event poster upload
- ✅ Public event listing
- ✅ Event details page
- ✅ Event status labeling
- ✅ QR attendance token
- ✅ Rotating QR code
- ✅ Member check-in page
- ✅ Geofence validation
- ✅ Attendance records
- ✅ Attendance summary cron

## Phase 9 — Scheduled Jobs / Automation

- ✅ Event status automation
- ✅ Upcoming event reminders
- ✅ Pending approval reminders
- ✅ Build review reminders
- ✅ Event attendance summaries
- ✅ Inactive member detection
- ✅ Build popularity calculation
- ✅ Expired push subscription cleanup
- ✅ UploadThing orphan file cleanup with grace period

## Phase 10 — Remaining Polish

- 🟡 Final SEO pass
- 🟡 Final accessibility pass
- 🟡 Final mobile QA
- 🟡 Final image optimization
- 🟡 Production cron schedule cleanup
- 🟡 Error monitoring / logging
- 🟡 Admin analytics improvements
- 🟡 Comment and reply feature for builds
