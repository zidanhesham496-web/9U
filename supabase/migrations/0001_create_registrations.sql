create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  national_id text not null,
  college text not null,
  phone text not null,
  talent text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists registrations_created_at_idx on public.registrations (created_at desc);
create index if not exists registrations_talent_idx on public.registrations (talent);

alter table public.registrations enable row level security;