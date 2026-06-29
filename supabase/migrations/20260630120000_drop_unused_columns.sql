-- Drop columns that are never queried and carry no business logic.

-- wardrobe_editors: created_at never selected anywhere in JS or edge functions
alter table public.wardrobe_editors
  drop column if exists created_at;

-- wardrobe_app_state: collection_overrides always written as {} (layer retired Jun 2026)
-- wardrobe_app_state: metadata always an empty {} roundtrip, no consumer
alter table public.wardrobe_app_state
  drop column if exists collection_overrides,
  drop column if exists metadata;
