-- Add showcase_order and showcase_at to wardrobe_items.
--
-- showcase_order: sparse integer (10, 20, 30…) controlling PLP front-row position.
--                 NULL = not in showcase.
-- showcase_at:    when this piece was first added to the showcase (owner-set timestamp).
--                 NULL = not in showcase / pre-feature.

-- 1. Add columns (idempotent).
alter table public.wardrobe_items
  add column if not exists showcase_order int,
  add column if not exists showcase_at timestamptz;

-- 2. Backfill showcase_order from metadata.showcase_rank for existing showcase pieces.
--    Dense rank i → sparse order i*10 so the column matches the JS write convention.
update public.wardrobe_items
set showcase_order = ((metadata->>'showcase_rank')::int) * 10
where metadata->>'showcase_rank' is not null
  and (metadata->>'showcase_rank') ~ '^\d+$';

-- 3. Index for fast default-sort queries.
create index if not exists wardrobe_items_showcase_order_idx
  on public.wardrobe_items (showcase_order asc nulls last);
