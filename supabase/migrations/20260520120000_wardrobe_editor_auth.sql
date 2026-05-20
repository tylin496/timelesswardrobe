-- Google Sign-In editors: add your Gmail to `wardrobe_editors`, enable Google in Auth,
-- and set the same emails in js/tw-supabase-config.js → EDITOR_ALLOWED_EMAILS.

create table if not exists public.wardrobe_editors (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.wardrobe_editors enable row level security;

drop policy if exists "wardrobe_editors_select_self" on public.wardrobe_editors;
create policy "wardrobe_editors_select_self"
  on public.wardrobe_editors
  for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

create or replace function public.tw_is_wardrobe_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.wardrobe_editors e
    where lower(e.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.tw_is_wardrobe_editor() from public;
grant execute on function public.tw_is_wardrobe_editor() to authenticated, anon;

drop policy if exists "wardrobe_editor_insert" on public.wardrobe_items;
drop policy if exists "wardrobe_editor_update" on public.wardrobe_items;
drop policy if exists "wardrobe_editor_delete" on public.wardrobe_items;

create policy "wardrobe_editor_insert"
  on public.wardrobe_items
  for insert
  to authenticated
  with check (public.tw_is_wardrobe_editor());

create policy "wardrobe_editor_update"
  on public.wardrobe_items
  for update
  to authenticated
  using (public.tw_is_wardrobe_editor())
  with check (public.tw_is_wardrobe_editor());

create policy "wardrobe_editor_delete"
  on public.wardrobe_items
  for delete
  to authenticated
  using (public.tw_is_wardrobe_editor());

drop policy if exists "wardrobe_images_editor_insert" on storage.objects;
drop policy if exists "wardrobe_images_editor_update" on storage.objects;
drop policy if exists "wardrobe_images_editor_delete" on storage.objects;

create policy "wardrobe_images_editor_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'wardrobe-images' and public.tw_is_wardrobe_editor());

create policy "wardrobe_images_editor_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'wardrobe-images' and public.tw_is_wardrobe_editor())
  with check (bucket_id = 'wardrobe-images' and public.tw_is_wardrobe_editor());

create policy "wardrobe_images_editor_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'wardrobe-images' and public.tw_is_wardrobe_editor());
