-- Notebooks table
create table if not exists public.notebooks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.notebooks enable row level security;

create policy "notebooks_select_own" on public.notebooks
  for select using (auth.uid() = owner_id);

create policy "notebooks_insert_own" on public.notebooks
  for insert with check (auth.uid() = owner_id);

create policy "notebooks_update_own" on public.notebooks
  for update using (auth.uid() = owner_id);

create policy "notebooks_delete_own" on public.notebooks
  for delete using (auth.uid() = owner_id);

-- Notebook pages table
create table if not exists public.notebook_pages (
  id uuid primary key default gen_random_uuid(),
  notebook_id uuid not null references public.notebooks(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text,
  content_md text default '',
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.notebook_pages enable row level security;

create policy "pages_select_own" on public.notebook_pages
  for select using (auth.uid() = owner_id);

create policy "pages_select_public" on public.notebook_pages
  for select using (is_public = true);

create policy "pages_insert_own" on public.notebook_pages
  for insert with check (auth.uid() = owner_id);

create policy "pages_update_own" on public.notebook_pages
  for update using (auth.uid() = owner_id);

create policy "pages_delete_own" on public.notebook_pages
  for delete using (auth.uid() = owner_id);
