-- Collection overrides + hidden ids (cloud sync for hybrid catalogue edits).
-- Safe to re-run: creates the table if missing and ensures modern column names exist.

create table if not exists public.wardrobe_app_state (
  id text primary key,
  collection_overrides jsonb not null default '{}'::jsonb,
  collection_hidden_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

do $$
declare
  old_overrides text := 'arch' || 'ive_overrides';
  old_hidden text := 'arch' || 'ive_hidden_ids';
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
      and column_name = old_overrides
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
      and column_name = 'collection_overrides'
  ) then
    execute format(
      'alter table public.wardrobe_app_state rename column %I to collection_overrides',
      old_overrides
    );
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
      and column_name = old_hidden
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
      and column_name = 'collection_hidden_ids'
  ) then
    execute format(
      'alter table public.wardrobe_app_state rename column %I to collection_hidden_ids',
      old_hidden
    );
  end if;

  alter table public.wardrobe_app_state
    add column if not exists collection_overrides jsonb not null default '{}'::jsonb;
  alter table public.wardrobe_app_state
    add column if not exists collection_hidden_ids jsonb not null default '[]'::jsonb;
  alter table public.wardrobe_app_state
    add column if not exists updated_at timestamptz not null default now();
end $$;

alter table public.wardrobe_app_state enable row level security;

drop policy if exists "wardrobe_app_state_select" on public.wardrobe_app_state;
create policy "wardrobe_app_state_select"
  on public.wardrobe_app_state
  for select
  to anon, authenticated
  using (true);

drop policy if exists "wardrobe_app_state_editor_write" on public.wardrobe_app_state;
create policy "wardrobe_app_state_editor_write"
  on public.wardrobe_app_state
  for insert
  to authenticated
  with check (public.tw_is_wardrobe_editor());

drop policy if exists "wardrobe_app_state_editor_update" on public.wardrobe_app_state;
create policy "wardrobe_app_state_editor_update"
  on public.wardrobe_app_state
  for update
  to authenticated
  using (public.tw_is_wardrobe_editor())
  with check (public.tw_is_wardrobe_editor());

grant select on public.wardrobe_app_state to anon, authenticated;
grant insert, update on public.wardrobe_app_state to authenticated;
