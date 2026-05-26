-- Shared app metadata for global presentation settings.
-- Used for values that are not individual wardrobe rows or editorial stories.

alter table public.wardrobe_app_state
  add column if not exists metadata jsonb not null default '{}'::jsonb;
