-- ClaimLens™ — initial schema.
--
-- Run this once in the Supabase SQL Editor for the onarestore-claimlens
-- project. It is idempotent (uses if-not-exists / create-or-replace) so
-- re-running it is safe.
--
-- What this creates:
--   - 4 tables: profiles, claims, claim_files, claim_reports
--   - Row-Level Security policies so users only see their own data
--   - A trigger that auto-creates a profile row on auth signup
--   - A private storage bucket "claim-files" with per-user folder policies
--
-- Public schema only. Auth is provided by Supabase's `auth` schema (we
-- never touch auth.users directly except by FK reference).

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'homeowner'
    check (role in ('homeowner','contractor','estimator','public-adjuster','attorney','other')),
  created_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  claim_type text not null
    check (claim_type in ('water','fire','smoke','mold','storm','reconstruction','unknown')),
  property_state text,
  carrier_name text,
  status text not null default 'draft'
    check (status in ('draft','analyzing','complete','error')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists claims_user_id_idx on public.claims(user_id);
create index if not exists claims_created_at_idx on public.claims(created_at desc);

create table if not exists public.claim_files (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims(id) on delete cascade,
  file_name text not null,
  file_type text not null,
  document_category text not null
    check (document_category in (
      'carrier-estimate','contractor-estimate','policy',
      'denial-letter','photos','mitigation-invoice','other'
    )),
  storage_path text not null,
  size_bytes bigint not null,
  extracted_text text,
  uploaded_at timestamptz not null default now()
);

create index if not exists claim_files_claim_id_idx on public.claim_files(claim_id);

create table if not exists public.claim_reports (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims(id) on delete cascade,
  snapshot jsonb,
  key_findings jsonb not null default '[]'::jsonb,
  missing_scope jsonb not null default '[]'::jsonb,
  inconsistencies jsonb not null default '[]'::jsonb,
  questions jsonb not null default '[]'::jsonb,
  checklist jsonb not null default '[]'::jsonb,
  source text not null default 'ai',
  disclaimer_acknowledged boolean not null default false,
  generated_at timestamptz not null default now()
);

create index if not exists claim_reports_claim_id_idx on public.claim_reports(claim_id);

-- ---------------------------------------------------------------------------
-- Row-Level Security — every table on, policies restrict to owner.
-- ---------------------------------------------------------------------------

alter table public.profiles      enable row level security;
alter table public.claims        enable row level security;
alter table public.claim_files   enable row level security;
alter table public.claim_reports enable row level security;

-- profiles
drop policy if exists "profiles: own row" on public.profiles;
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- claims
drop policy if exists "claims: own rows" on public.claims;
create policy "claims: own rows" on public.claims
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- claim_files — joined through claims
drop policy if exists "files: via own claim" on public.claim_files;
create policy "files: via own claim" on public.claim_files
  for all
  using (exists (
    select 1 from public.claims c
    where c.id = claim_files.claim_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.claims c
    where c.id = claim_files.claim_id and c.user_id = auth.uid()
  ));

-- claim_reports — joined through claims
drop policy if exists "reports: via own claim" on public.claim_reports;
create policy "reports: via own claim" on public.claim_reports
  for all
  using (exists (
    select 1 from public.claims c
    where c.id = claim_reports.claim_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.claims c
    where c.id = claim_reports.claim_id and c.user_id = auth.uid()
  ));

-- ---------------------------------------------------------------------------
-- Trigger: auto-create a profile row when a new auth user signs up.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Storage bucket: claim-files (private).
-- Each user gets a folder named after their auth.uid(); object paths look
-- like {user_id}/{claim_id}/{file_id}-{filename}. RLS keys off the first
-- folder segment so a user can never read/write another user's files.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'claim-files',
  'claim-files',
  false,
  26214400, -- 25 MB per file, matches MAX_FILE_BYTES in lib/claimlens/config.ts
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies — own folder only.

drop policy if exists "claimlens: upload to own folder" on storage.objects;
create policy "claimlens: upload to own folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'claim-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "claimlens: read own folder" on storage.objects;
create policy "claimlens: read own folder" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'claim-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "claimlens: delete own folder" on storage.objects;
create policy "claimlens: delete own folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'claim-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
