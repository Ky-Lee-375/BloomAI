-- Bouquet Creator: bouquets table + row level security
-- Run via `supabase db push` or the Supabase SQL editor.

create table if not exists public.bouquets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_url text not null,
  prompt text not null,
  flowers text[] not null default '{}',
  mood text not null,
  color_palette text not null,
  created_at timestamptz not null default now()
);

comment on table public.bouquets is 'Saved AI-generated flower bouquets, one row per bouquet, owned by the creating user.';

create index if not exists bouquets_user_id_created_at_idx
  on public.bouquets (user_id, created_at desc);

alter table public.bouquets enable row level security;

-- Users may read only their own bouquets.
create policy "Users can view their own bouquets"
  on public.bouquets
  for select
  using (auth.uid() = user_id);

-- Users may insert bouquets only under their own user_id.
create policy "Users can insert their own bouquets"
  on public.bouquets
  for insert
  with check (auth.uid() = user_id);

-- Users may delete only their own bouquets.
create policy "Users can delete their own bouquets"
  on public.bouquets
  for delete
  using (auth.uid() = user_id);

-- No update policy is defined: bouquets are immutable once saved.
-- With RLS enabled and no matching policy, updates are denied by default.
