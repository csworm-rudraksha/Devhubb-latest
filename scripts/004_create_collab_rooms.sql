-- Collab rooms table
create table if not exists public.collab_rooms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  slug text,
  language text default 'java',
  content text default '// Start coding here...',
  participant_count int default 1,
  last_saved_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.collab_rooms enable row level security;

-- Owner can do everything
create policy "rooms_select_own" on public.collab_rooms
  for select using (auth.uid() = owner_id);

create policy "rooms_insert_own" on public.collab_rooms
  for insert with check (auth.uid() = owner_id);

create policy "rooms_update_own" on public.collab_rooms
  for update using (auth.uid() = owner_id);

create policy "rooms_delete_own" on public.collab_rooms
  for delete using (auth.uid() = owner_id);
