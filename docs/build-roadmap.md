# Build Roadmap

## Phase 1 — Foundation

* Create Next.js app
* Configure TypeScript, Tailwind, shadcn/ui
* Set up project structure
* Add theme tokens: **black / white / red**
* Build static homepage layout first

## Phase 2 — Public Website

Pages:

* Home
* About Boys of ADV
* Builds / Gallery
* Partners
* Events
* Join Us
* Contact

Sections:

* Hero banner
* Mission / Vision
* Featured builds carousel
* Partners
* Meet & greet calendar
* Join CTA
* Partner CTA

## Phase 3 — Database + CMS

Tables:

* `users`
* `partners`
* `builds`
* `gallery_images`
* `events`
* `join_requests`
* `partner_inquiries`
* `contact_messages`

Use **PostgreSQL + Drizzle**, which officially supports PostgreSQL drivers.

## Phase 4 — Admin Panel

Admin features:

* Login
* Role-based dashboard
* Manage builds
* Manage gallery images
* Manage partners
* Manage events
* View join requests
* View partner inquiries
* Send email notifications

For auth, I recommend **Better Auth** over Auth.js for this project because it has built-in email/password support, Next.js integration, roles/members features, and database-backed sessions.

## Phase 5 — Media + Email

* UploadThing for build/gallery/partner images
* Resend for contact/join/partner inquiry notifications

UploadThing is a good fit because it provides a managed file dashboard and Next.js/App Router examples.

## Phase 6 — Production

* Neon PostgreSQL
* Vercel deployment
* Environment validation
* Database migrations
* Admin seed user
* SEO metadata
* Open Graph image
* Sitemap
* Robots.txt
