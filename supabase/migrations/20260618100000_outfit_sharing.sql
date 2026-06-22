-- Outfit sharing: anonymous ownership via hashed token, slug URLs, locked-down mutations.

-- 1. New columns on outfits
alter table public.outfits
  add column if not exists owner_token_hash text not null default '',
  add column if not exists slug            text unique,
  add column if not exists is_public       boolean not null default true;

-- 2. Column-level security: hide owner_token_hash from client roles.
--    anon / authenticated may only read the columns listed here.
revoke select on public.outfits from anon, authenticated;
grant select (id, name, notes, slug, is_public, created_at)
  on public.outfits to anon, authenticated;

-- 3. Rebuild RLS on outfits to split read/write permissions.
drop policy if exists outfits_all_anon       on public.outfits;
drop policy if exists outfits_all_service    on public.outfits;
drop policy if exists "outfits_select_public" on public.outfits;
drop policy if exists "outfits_insert_anon"  on public.outfits;
drop policy if exists "outfits_all_editor"   on public.outfits;

-- Anon / authenticated may read (column-level grant above limits which columns).
create policy "outfits_select_public"
  on public.outfits for select
  to anon, authenticated
  using (true);

-- Anon may INSERT (visitor creates a new outfit via direct client or edge function).
create policy "outfits_insert_anon"
  on public.outfits for insert
  to anon
  with check (true);

-- Authenticated wardrobe editors may do anything (admin operations go direct).
create policy "outfits_all_editor"
  on public.outfits for all
  to authenticated
  using (public.tw_is_wardrobe_editor())
  with check (public.tw_is_wardrobe_editor());

-- Service role is exempt from RLS by default; no policy needed.

-- 4. Rebuild RLS on outfit_items.
drop policy if exists outfit_items_all_anon          on public.outfit_items;
drop policy if exists outfit_items_all_service       on public.outfit_items;
drop policy if exists "outfit_items_select_public"   on public.outfit_items;
drop policy if exists "outfit_items_insert_anon"     on public.outfit_items;
drop policy if exists "outfit_items_all_editor"      on public.outfit_items;

create policy "outfit_items_select_public"
  on public.outfit_items for select
  to anon, authenticated
  using (true);

create policy "outfit_items_insert_anon"
  on public.outfit_items for insert
  to anon
  with check (true);

create policy "outfit_items_all_editor"
  on public.outfit_items for all
  to authenticated
  using (public.tw_is_wardrobe_editor())
  with check (public.tw_is_wardrobe_editor());
