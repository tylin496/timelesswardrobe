-- Tear down the Editorial feature (page removed from the site).
-- Drops the editorial_stories table and the editorial-images storage bucket
-- along with their RLS policies. Idempotent / safe to re-run.

-- Table + its policies (dropped via cascade with the table).
drop table if exists public.editorial_stories cascade;

-- Storage object policies for the editorial-images bucket.
drop policy if exists "editorial_images_select" on storage.objects;
drop policy if exists "editorial_images_editor_insert" on storage.objects;
drop policy if exists "editorial_images_editor_update" on storage.objects;
drop policy if exists "editorial_images_editor_delete" on storage.objects;

-- The editorial-images bucket and its objects are removed out-of-band via the
-- Storage API (storage.objects rows are protected from direct SQL deletion).
