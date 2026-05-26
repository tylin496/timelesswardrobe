-- Story-card thumbnails are separate from editorial story cover images.

alter table public.editorial_stories
  add column if not exists thumbnail_image text;
