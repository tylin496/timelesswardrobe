-- Add notes_updated_at to wardrobe_items.
--
-- Tracks when the notes field was last edited, independently of the row's
-- general updated_at (which moves on any field change — price, image, etc.).
-- Stamped at the app layer on notes save; null means notes have never been
-- edited since this migration.

alter table public.wardrobe_items
  add column if not exists notes_updated_at timestamptz null;

-- Index for "recently edited notes" queries.
create index if not exists wardrobe_items_notes_updated_at_idx
  on public.wardrobe_items (notes_updated_at desc nulls last);
