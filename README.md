# Talent Registration

Next.js application for theater talent registration, deployed on Vercel. Registration data is stored centrally in Supabase PostgreSQL through server-side Next.js Route Handlers.

## Setup

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000` for the public registration page or `http://localhost:3000/admin` for the admin dashboard. The Next.js dev server serves both the UI and API Route Handlers locally.

## Architecture

```text
app/                 # App Router routes and route layouts
	admin/page.tsx     # Admin dashboard
	page.tsx           # Public registration page
components/          # Reusable UI components
services/            # API clients and data-access logic
lib/                 # Server-only Supabase and session helpers
styles/              # Global CSS and design tokens
supabase/migrations/ # PostgreSQL schema
```

Core components are intentionally small and typed: `Button`, `Input`, `Select`, and `GlassCard`.

## Environment

Copy the template before local development when backend configuration is needed:

```bash
cp .env.example .env.local
```

Configure `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` as server-only Vercel environment variables. They must never use the `NEXT_PUBLIC_` prefix. For local development, copy `.env.example` to `.env.local` and replace its placeholders; do not commit `.env.local`.

## Production checks

Run the complete local verification before opening a pull request:

```bash
npm run typecheck
npm run lint
npm run build
```

The production build generates the public and admin pages and deploys the dynamic API Route Handlers under `/api/` through Vercel. `output: "export"` is intentionally disabled because the API requires a Next.js server runtime.

## GitHub and Vercel deployment

1. Create an empty repository on GitHub.
2. From this project directory, commit and push the source:

```bash
git add .
git commit -m "Prepare talent registration for production"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repository>.git
git push -u origin main
```

3. Create a Supabase project and run `supabase/migrations/0001_create_registrations.sql` in the Supabase SQL Editor.
4. In Vercel project settings, add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` for Production, Preview, and Development as appropriate.
5. Use `npm run build` as the Vercel build command. No output directory override is needed.
6. Deploy. Future pushes to `main` will create production deployments automatically.

### Database schema

The Supabase `public.registrations` table contains `id` (UUID primary key), `name`, `national_id`, `college`, `phone`, `talent`, and `created_at` (required values). Indexes support newest-first dashboard loading and talent filtering. The schema is in `supabase/migrations/0001_create_registrations.sql`.

### API

- `POST /api/registrations` validates and inserts a public registration.
- `GET /api/registrations` returns all registrations for an authenticated admin session.
- `POST /api/admin/login` validates server-only credentials and sets an HttpOnly signed cookie.
- `GET /api/admin/session` checks the signed admin cookie.

The registration form calls `services/registrationService.ts`; the admin dashboard calls the same service for centralized data; the existing CSV/Excel-compatible export consumes that retrieved list, including the national ID. The print view uses the same protected admin table. No browser storage is used as the production source of truth.

## Implementation report

### Delivered phases

- **Foundation:** Next.js App Router, TypeScript, Tailwind CSS, modular routes and reusable UI components.
- **Visual system:** Dark Glossy Navy palette, glass panels, animated background lights, responsive layout, and reduced-motion support.
- **Registration:** Accessible controlled form with required fields, talent options, phone validation, focus states, and error feedback.
- **Success experience:** No-reload success transition with the `تم التسجيل` state.
- **Data layer:** Typed `registrationService` with `registerTalent` and `getAllRegistrations` backed by same-origin Next.js Route Handlers and Supabase PostgreSQL.
- **Admin:** Separate `/admin` dashboard with search, talent filtering, sorting, loading, empty, and responsive table states.
- **Export and printing:** Excel-compatible UTF-8 CSV export and a print stylesheet that leaves only the structured table.
- **Production preparation:** Vercel deployment configuration, environment template, same-origin API URL helper, Git ignore rules, and typecheck script.

### Storage

Supabase PostgreSQL is the only source of truth. The browser sends submissions to the same-origin Next.js API, and the server inserts them into `public.registrations` with its server-only service-role key. No browser storage or legacy database is read or written.

Admin authentication is server-side, using credentials stored in Vercel environment variables and an HttpOnly, Secure, SameSite cookie signed with `SESSION_SECRET`. It is intentionally simple and does not yet include rate limiting, password hashing/rotation, account management, or audit logs. Add those controls before exposing the admin endpoint to a high-risk environment.

### Deployment readiness checklist

- [x] `npm run typecheck` passes.
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] No database credentials or secrets are hardcoded.
- [x] `.env.example` documents future configuration.
- [x] `.next`, environment files, and build output are ignored by Git.
- [x] Mobile layout, touch-sized controls, labels, keyboard focus, and reduced motion are covered in the UI.
- [x] GitHub push and Vercel deployment steps are documented.
- [x] Supabase PostgreSQL storage and protected Next.js Route Handlers.