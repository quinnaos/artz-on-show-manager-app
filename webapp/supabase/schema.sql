-- Artz On Show Manager App — database schema.
-- Run this once in your Supabase project's SQL editor (Project > SQL Editor > New query).

-- ── Profiles ────────────────────────────────────────────────────────────
-- One row per signed-in manager/owner, created automatically on first login
-- (see the app's /auth/callback route) from an entry in invited_emails.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role text not null check (role in ('owner', 'manager')) default 'manager',
  created_at timestamptz not null default now()
);

-- Which hubs a manager can access. Owners implicitly have access to all hubs.
create table if not exists public.manager_hubs (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  hub_id text not null,
  primary key (profile_id, hub_id)
);

-- Allow-list of emails invited but not yet signed in. The admin screen writes
-- here; first login consumes the row and creates the matching profile.
create table if not exists public.invited_emails (
  email text primary key,
  role text not null check (role in ('owner', 'manager')) default 'manager',
  hub_ids text[] not null default '{}',
  invited_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── Checklist ticks ─────────────────────────────────────────────────────
-- scope is either a day list id ('mon'..'fri'), or 'admin@<dayId>' /
-- 'certs@<dayId>' for the two lists that reset every day.
create table if not exists public.ticks (
  hub_id text not null,
  scope text not null,
  item_index int not null,
  ticked_at timestamptz not null default now(),
  ticked_by uuid references public.profiles(id),
  primary key (hub_id, scope, item_index)
);

-- ── Points ──────────────────────────────────────────────────────────────
-- Append-only ledger so "undo" can remove exactly one award and totals are
-- always a straightforward sum. Points are never edited or subtracted below 0.
create table if not exists public.points_awards (
  id bigint generated always as identity primary key,
  hub_id text not null,
  day_id text not null,
  group_id text not null,
  delta int not null,
  awarded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ── Sign-offs ───────────────────────────────────────────────────────────
create table if not exists public.sign_offs (
  hub_id text not null,
  scope text not null,
  signed_by uuid references public.profiles(id),
  signed_at timestamptz not null default now(),
  primary key (hub_id, scope)
);

-- ── Helper functions ────────────────────────────────────────────────────
create or replace function public.is_owner()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.has_hub_access(h text)
returns boolean
language sql
security definer
stable
as $$
  select public.is_owner() or exists (
    select 1 from public.manager_hubs where profile_id = auth.uid() and hub_id = h
  );
$$;

-- ── Row Level Security ──────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.manager_hubs enable row level security;
alter table public.invited_emails enable row level security;
alter table public.ticks enable row level security;
alter table public.points_awards enable row level security;
alter table public.sign_offs enable row level security;

drop policy if exists "profiles: read own or owner" on public.profiles;
create policy "profiles: read own or owner" on public.profiles
  for select using (id = auth.uid() or public.is_owner());

drop policy if exists "profiles: owner can update" on public.profiles;
create policy "profiles: owner can update" on public.profiles
  for update using (public.is_owner());

drop policy if exists "profiles: owner can delete" on public.profiles;
create policy "profiles: owner can delete" on public.profiles
  for delete using (public.is_owner());

drop policy if exists "manager_hubs: read own or owner" on public.manager_hubs;
create policy "manager_hubs: read own or owner" on public.manager_hubs
  for select using (profile_id = auth.uid() or public.is_owner());

drop policy if exists "manager_hubs: owner manages" on public.manager_hubs;
create policy "manager_hubs: owner manages" on public.manager_hubs
  for all using (public.is_owner()) with check (public.is_owner());

drop policy if exists "invited_emails: owner only" on public.invited_emails;
create policy "invited_emails: owner only" on public.invited_emails
  for all using (public.is_owner()) with check (public.is_owner());

drop policy if exists "ticks: hub access" on public.ticks;
create policy "ticks: hub access" on public.ticks
  for all using (public.has_hub_access(hub_id)) with check (public.has_hub_access(hub_id));

drop policy if exists "points_awards: hub access" on public.points_awards;
create policy "points_awards: hub access" on public.points_awards
  for all using (public.has_hub_access(hub_id)) with check (public.has_hub_access(hub_id));

drop policy if exists "sign_offs: hub access" on public.sign_offs;
create policy "sign_offs: hub access" on public.sign_offs
  for all using (public.has_hub_access(hub_id)) with check (public.has_hub_access(hub_id));

-- ── Realtime ────────────────────────────────────────────────────────────
-- Lets multiple managers at the same hub see each other's ticks/points live.
-- Full replica identity so DELETE events (undo, untick) still carry hub_id
-- for the client's realtime filter to match against.
alter table public.ticks replica identity full;
alter table public.points_awards replica identity full;
alter table public.sign_offs replica identity full;

alter publication supabase_realtime add table public.ticks;
alter publication supabase_realtime add table public.points_awards;
alter publication supabase_realtime add table public.sign_offs;
