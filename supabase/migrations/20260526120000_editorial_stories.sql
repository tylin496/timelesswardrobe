-- Editorial stories: public read, editor-only writes.
-- Safe to re-run after the editor auth migration has created tw_is_wardrobe_editor().

create table if not exists public.editorial_stories (
  slug text primary key,
  label text not null default '',
  title text not null,
  subtitle text not null default '',
  hero_image text,
  piece_ids jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.editorial_stories
  add column if not exists label text not null default '',
  add column if not exists subtitle text not null default '',
  add column if not exists hero_image text,
  add column if not exists piece_ids jsonb not null default '[]'::jsonb,
  add column if not exists sort_order integer not null default 0,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.editorial_stories enable row level security;

drop policy if exists "editorial_stories_select" on public.editorial_stories;
create policy "editorial_stories_select"
  on public.editorial_stories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "editorial_stories_editor_insert" on public.editorial_stories;
create policy "editorial_stories_editor_insert"
  on public.editorial_stories
  for insert
  to authenticated
  with check (public.tw_is_wardrobe_editor());

drop policy if exists "editorial_stories_editor_update" on public.editorial_stories;
create policy "editorial_stories_editor_update"
  on public.editorial_stories
  for update
  to authenticated
  using (public.tw_is_wardrobe_editor())
  with check (public.tw_is_wardrobe_editor());

drop policy if exists "editorial_stories_editor_delete" on public.editorial_stories;
create policy "editorial_stories_editor_delete"
  on public.editorial_stories
  for delete
  to authenticated
  using (public.tw_is_wardrobe_editor());

grant select on public.editorial_stories to anon, authenticated;
grant insert, update, delete on public.editorial_stories to authenticated;

insert into storage.buckets (id, name, public)
values ('editorial-images', 'editorial-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "editorial_images_select" on storage.objects;
create policy "editorial_images_select"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'editorial-images');

drop policy if exists "editorial_images_editor_insert" on storage.objects;
create policy "editorial_images_editor_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'editorial-images' and public.tw_is_wardrobe_editor());

drop policy if exists "editorial_images_editor_update" on storage.objects;
create policy "editorial_images_editor_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'editorial-images' and public.tw_is_wardrobe_editor())
  with check (bucket_id = 'editorial-images' and public.tw_is_wardrobe_editor());

drop policy if exists "editorial_images_editor_delete" on storage.objects;
create policy "editorial_images_editor_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'editorial-images' and public.tw_is_wardrobe_editor());

insert into public.editorial_stories
  (slug, label, title, subtitle, hero_image, piece_ids, sort_order)
values
  (
    'english-rain',
    'A/W',
    'English Rain',
    'Waxed cotton, gabardine, corduroy, and polished leather for wet weather.',
    null,
    '["sage-beaufort-waxed-jacket","balmacaan-coat","pembroke","corduroy-trousers","tank-solo","chukka"]'::jsonb,
    0
  ),
  (
    'gold-after-dark',
    'Evening',
    'Gold After Dark',
    'Evening objects in yellow gold, amber, ruby, and black leather.',
    null,
    '["tank-solo","ligne-2","ruby-gypsy-ring","curb-bracelet","signet-ring","grand-soir"]'::jsonb,
    1
  ),
  (
    'mediterranean-leisure',
    'S/S',
    'Mediterranean Leisure',
    'Linen, open collars, pale cotton, and summer objects.',
    null,
    '["linen-safari-jacket","basket-weave-linen-jacket","linen-camp-collar-shirt","linen-loop-collar-shirt","panama-hat","ferret"]'::jsonb,
    2
  ),
  (
    'ivy-weekend',
    'S/S',
    'Ivy Weekend',
    'Washed rugby, cricket knit, oxford cloth, tassel loafers, and casual tailoring.',
    null,
    '["washed-rugby-shirt","cricket-cable-knit-jumper-vest","ocbd-shirt","tassel-loafer","golden-fleece-navy-blazer","boat-and-tote"]'::jsonb,
    3
  ),
  (
    'travel-objects',
    'Objects',
    'Travel Objects',
    'Personal objects for movement, writing, weather, and memory.',
    null,
    '["cordovan-l-zip-wallet-regular-price","ligne-2","grand-soir","panama-hat","tank-solo","kingsman-0847-sunglasses"]'::jsonb,
    4
  )
on conflict (slug) do nothing;
