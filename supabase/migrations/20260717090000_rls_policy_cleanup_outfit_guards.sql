-- RLS policy cleanup + outfit abuse guards.
--
-- Background (Jul 17 2026 audit): the live database had accumulated permissive
-- policies that were never in tracked migrations (dashboard leftovers from
-- before 20260520/20260618 locked things down). Worst offender: anon could
-- INSERT/UPDATE/DELETE wardrobe_items and wardrobe_app_state. This migration
-- makes the tracked migrations the whole truth again.
--
-- Intended end state per table:
--   wardrobe_items      public SELECT; writes via editor policies only
--   wardrobe_app_state  public SELECT; writes via editor policies only
--   outfits             public SELECT (column-grant limited); editor ALL;
--                       visitor mutations ONLY via edge functions
--                       (outfit-create / outfit-mutate, service role)
--   outfit_items        same as outfits
--
-- Plus abuse guards on the visitor-outfit path (edge functions use the
-- service role, so RLS cannot rate-limit them — triggers can):
--   * max 30 new outfits per rolling 10 minutes (db_created_at is server-set;
--     client-supplied created_at cannot dodge the window)
--   * max 40 items per outfit
--   * name/notes length caps
--
-- Bulk restore note: a mass re-import will trip the rate guard. Disable it
-- for the session first:
--   alter table public.outfits disable trigger tw_outfits_rate_guard;
--   ... restore ...
--   alter table public.outfits enable trigger tw_outfits_rate_guard;

-- 1. wardrobe_items — drop stray anon-write policies, codify public SELECT.
alter table public.wardrobe_items enable row level security;

drop policy if exists "tw_wi_select"              on public.wardrobe_items;
drop policy if exists "tw_wi_insert"              on public.wardrobe_items;
drop policy if exists "tw_wi_update"              on public.wardrobe_items;
drop policy if exists "tw_wi_delete"              on public.wardrobe_items;
drop policy if exists "wardrobe_items_all_anon"   on public.wardrobe_items;

drop policy if exists "wardrobe_items_select_public" on public.wardrobe_items;
create policy "wardrobe_items_select_public"
  on public.wardrobe_items for select
  to anon, authenticated
  using (true);
-- (wardrobe_editor_insert / _update / _delete from 20260520 remain the only write paths.)

-- 2. wardrobe_app_state — drop stray anon-write policies.
drop policy if exists "Allow public read wardrobe app state"   on public.wardrobe_app_state;
drop policy if exists "Allow public write wardrobe app state"  on public.wardrobe_app_state;
drop policy if exists "Allow public update wardrobe app state" on public.wardrobe_app_state;
drop policy if exists "tw_was_select" on public.wardrobe_app_state;
drop policy if exists "tw_was_insert" on public.wardrobe_app_state;
drop policy if exists "tw_was_update" on public.wardrobe_app_state;
drop policy if exists "tw_was_delete" on public.wardrobe_app_state;
-- (wardrobe_app_state_select / _editor_write / _editor_update from 20260523 remain.)

-- 3. outfits — visitor writes go through edge functions now, so no anon
--    write policy is needed at all (20260618's outfits_insert_anon included).
drop policy if exists "outfits_insert_anon" on public.outfits;
drop policy if exists "outfits_select"      on public.outfits;
drop policy if exists "outfits_insert"      on public.outfits;
drop policy if exists "outfits_update"      on public.outfits;
drop policy if exists "outfits_delete"      on public.outfits;
drop policy if exists "tw_outfits_select"   on public.outfits;
drop policy if exists "tw_outfits_insert"   on public.outfits;
drop policy if exists "tw_outfits_update"   on public.outfits;
drop policy if exists "tw_outfits_delete"   on public.outfits;
-- (outfits_select_public / outfits_all_editor from 20260618 remain.)

-- 4. outfit_items — same story.
drop policy if exists "outfit_items_insert_anon" on public.outfit_items;
drop policy if exists "outfit_items_select"      on public.outfit_items;
drop policy if exists "outfit_items_insert"      on public.outfit_items;
drop policy if exists "outfit_items_update"      on public.outfit_items;
drop policy if exists "outfit_items_delete"      on public.outfit_items;
drop policy if exists "tw_outfit_items_select"   on public.outfit_items;
drop policy if exists "tw_outfit_items_insert"   on public.outfit_items;
drop policy if exists "tw_outfit_items_update"   on public.outfit_items;
drop policy if exists "tw_outfit_items_delete"   on public.outfit_items;
-- (outfit_items_select_public / outfit_items_all_editor from 20260618 remain.)

-- 5. Belt-and-braces: anon should hold no write grants anywhere. All anon
--    writes go through the service-role edge functions.
revoke insert, update, delete on public.wardrobe_items     from anon;
revoke insert, update, delete on public.wardrobe_app_state from anon;
revoke insert, update, delete on public.outfits            from anon;
revoke insert, update, delete on public.outfit_items       from anon;

-- 6. Server-set creation timestamp. outfit-create accepts a client-supplied
--    created_at (the user-facing outfit date), so the rate window must count
--    on a column the client cannot influence. Not in the anon column grant
--    (20260618), so it stays invisible to clients.
alter table public.outfits
  add column if not exists db_created_at timestamptz not null default now();

-- 7. Rate guard: max 30 new outfits per rolling 10 minutes, all roles.
--    Statement-level AFTER trigger so bulk inserts are counted in full.
create or replace function public.tw_outfits_rate_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent integer;
begin
  select count(*) into recent
  from public.outfits
  where db_created_at > now() - interval '10 minutes';
  if recent > 30 then
    raise exception 'Too many new outfits right now — please try again in a few minutes.'
      using errcode = 'P0001';
  end if;
  return null;
end;
$$;

drop trigger if exists tw_outfits_rate_guard on public.outfits;
create trigger tw_outfits_rate_guard
  after insert on public.outfits
  for each statement
  execute function public.tw_outfits_rate_guard();

-- 8. Cap items per outfit (edge functions insert up to `slots.length` rows
--    with no server-side cap; current max in data is 6).
create or replace function public.tw_outfit_items_cap_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  over_cap integer;
begin
  select count(*) into over_cap
  from (
    select oi.outfit_id
    from public.outfit_items oi
    where oi.outfit_id in (select distinct outfit_id from new_rows)
    group by oi.outfit_id
    having count(*) > 40
  ) t;
  if over_cap > 0 then
    raise exception 'An outfit can hold at most 40 items.'
      using errcode = 'P0001';
  end if;
  return null;
end;
$$;

drop trigger if exists tw_outfit_items_cap_guard on public.outfit_items;
create trigger tw_outfit_items_cap_guard
  after insert on public.outfit_items
  referencing new table as new_rows
  for each statement
  execute function public.tw_outfit_items_cap_guard();

-- 9. Size sanity on visitor-writable text (current maxima: name 13, notes 32).
alter table public.outfits drop constraint if exists outfits_name_len_max;
alter table public.outfits add constraint outfits_name_len_max
  check (char_length(name) <= 200);
alter table public.outfits drop constraint if exists outfits_notes_len_max;
alter table public.outfits add constraint outfits_notes_len_max
  check (notes is null or char_length(notes) <= 4000);
