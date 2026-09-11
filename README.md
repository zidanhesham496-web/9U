# Talent Registration

Cloudflare Pages application for theater talent registration. The UI remains a static Next.js export, while registration data is stored centrally in Cloudflare D1 through Pages Functions.

## Setup

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000` for the public registration page or `http://localhost:3000/admin` for the admin dashboard. The Next.js dev server serves the UI only; use Wrangler Pages dev to exercise the Functions and D1 locally.

## Architecture

```text
app/                 # App Router routes and route layouts
	admin/page.tsx     # Admin dashboard
	page.tsx           # Public registration page
components/          # Reusable UI components
services/            # API and data-access logic
utils/               # Shared pure helpers
data/                # Temporary local fixtures and storage adapters
styles/              # Global CSS and design tokens
```

Core components are intentionally small and typed: `Button`, `Input`, `Select`, and `GlassCard`.

## Environment

Copy the template before local development when backend configuration is needed:

```bash
cp .env.example .env.local
```

`NEXT_PUBLIC_API_BASE_URL` should remain empty when the API is deployed as same-origin Pages Functions. `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET` are server-only variables consumed by Functions and must never use the `NEXT_PUBLIC_` prefix. Configure them as encrypted Cloudflare Pages variables/secrets. For local Wrangler development, copy `.dev.vars.example` to `.dev.vars` and replace its placeholders; do not commit `.dev.vars`.

## Production checks

Run the complete local verification before opening a pull request:

```bash
npm run typecheck
npm run lint
npm run build
```

The production build generates the public registration route `/` and the admin route `/admin/` as static App Router pages. Next.js writes its export to `out/`, then the build script copies that export to `dist/` for Cloudflare Pages. `trailingSlash` makes each route a directory with an `index.html`, which lets Cloudflare Pages serve direct navigation and refreshes without a server runtime. The API is deployed by Pages Functions from `functions/`.

## GitHub and Cloudflare Pages deployment

1. Create an empty repository on GitHub.
2. From this project directory, commit and push the source:

```bash
git add .
git commit -m "Prepare talent registration for production"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repository>.git
git push -u origin main
```

3. Create a D1 database in Cloudflare named `talent-registration`. Apply `migrations/0001_create_registrations.sql` with Wrangler or the D1 dashboard, then set its ID in `wrangler.toml` if using Wrangler deployments.
4. In Cloudflare Pages, choose **Create a project**, connect the GitHub repository, and use these settings:
	- Build command: `npm run build`
	- Output directory: `dist`
5. In Pages project settings, bind the D1 database to the Functions binding name `DB`. Add encrypted variables/secrets named `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET`. Add `ALLOWED_ORIGIN` only if using a separate API origin; for same-origin Pages Functions it can be omitted.
6. Deploy. Future pushes to `main` will create production deployments automatically.

### Database schema

The `registrations` table contains `id` (TEXT primary key), `name`, `college`, `phone`, `talent`, and `created_at` (all required TEXT values). Indexes support newest-first dashboard loading and talent filtering. The schema is in `migrations/0001_create_registrations.sql`.

### API

- `POST /api/registrations` validates and inserts a public registration.
- `GET /api/registrations` returns all registrations for an authenticated admin session.
- `POST /api/admin/login` validates server-only credentials and sets an HttpOnly signed cookie.
- `GET /api/admin/session` checks the signed admin cookie.

The registration form calls `services/registrationService.ts`; the admin dashboard calls the same service for centralized data; the existing CSV/Excel-compatible export consumes that retrieved list. No browser storage is used as the production source of truth.

## Implementation report

### Delivered phases

- **Foundation:** Next.js App Router, TypeScript, Tailwind CSS, modular routes and reusable UI components.
- **Visual system:** Dark Glossy Navy palette, glass panels, animated background lights, responsive layout, and reduced-motion support.
- **Registration:** Accessible controlled form with required fields, talent options, phone validation, focus states, and error feedback.
- **Success experience:** No-reload success transition with the `تم التسجيل` state.
- **Data layer:** Typed `registrationService` with `registerTalent` and `getAllRegistrations` backed by Pages Functions and D1.
- **Admin:** Separate `/admin` dashboard with search, talent filtering, sorting, loading, empty, and responsive table states.
- **Export and printing:** Excel-compatible UTF-8 CSV export and a print stylesheet that leaves only the structured table.
- **Production preparation:** Static export configuration, environment template, API URL helper, Git ignore rules, Cloudflare Pages deployment instructions, and typecheck script.

### Storage and backend migration

The production source of truth is Cloudflare D1. Existing browser `localStorage` records are not automatically migrated because they were never sent to a server and cannot be trusted as authoritative data. They remain in old browsers but are no longer read by the application. Export remains client-generated CSV, using only centrally retrieved admin records.

Admin authentication is server-side, using credentials stored in Cloudflare secrets and an HttpOnly, Secure, SameSite cookie signed with `SESSION_SECRET`. It is intentionally simple and does not yet include rate limiting, password hashing/rotation, account management, or audit logs. Add those controls before exposing the admin endpoint to a high-risk environment.

### Deployment readiness checklist

- [x] `npm run typecheck` passes.
- [x] `npm run lint` passes.
- [x] `npm run build` passes.
- [x] No database credentials or secrets are hardcoded.
- [x] `.env.example` documents future configuration.
- [x] `.next`, environment files, and build output are ignored by Git.
- [x] Mobile layout, touch-sized controls, labels, keyboard focus, and reduced motion are covered in the UI.
- [x] GitHub push and Cloudflare Pages deployment steps are documented.
- [x] Central D1 storage and protected Pages Functions API.

## Local Cloudflare verification

After configuring Wrangler and a local `.dev.vars`, build the static site and run Pages locally:

```bash
npm run build
npx wrangler pages dev out --d1 DB=talent-registration --local
```

The exact production build command is `npm run build` and the Cloudflare Pages output directory is `dist`. The D1 binding and server variables are required for registration and admin data flow; without them, the static UI can build but API requests correctly return a configuration error.

This project uses Next.js, not Vite or VitePress. In Cloudflare Pages, set the root directory to `/`, the build command to `npm run build`, and the output directory to `dist`. Do not use `npx vitepress build`.