# Services

Place API clients and data-access functions here. Keep network and persistence logic outside route components.

`registrationService.ts` is the frontend boundary for the centralized registration API. Its exported methods call `/api/registrations`, so the form and admin dashboard do not access Supabase or browser storage directly.

`POST /api/registrations` validates and stores public submissions in Supabase. `GET /api/registrations` requires the server-issued admin session cookie and returns records for the dashboard and CSV export. The API implementation lives in `app/api/registrations/route.ts`.

`apiConfig.ts` exposes `getApiUrl(path)` for same-origin Next.js Route Handlers. Keep private database credentials server-side and never expose them through `NEXT_PUBLIC_*` variables.