-- Add created_at / updated_at to wardrobe_items.
--
-- created_at: when the row was first inserted.
-- updated_at: auto-stamped by trigger on every UPDATE (server-authoritative).
--
-- Existing rows get created_at ≈ purchase_date where parseable, otherwise now().
-- updated_at on existing rows defaults to now() (no prior history available).

-- 1. Add columns (idempotent).
alter table public.wardrobe_items
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- 2. Back-fill created_at from purchase_date for existing rows that still carry
--    the migration-default timestamp (i.e. any row touched before this migration).
--    Accepts "YYYY-MM-DD" and "YYYY-MM" formats; anything else stays as now().
update public.wardrobe_items
set created_at = case
  when purchase_date ~ '^\d{4}-\d{2}-\d{2}' then (purchase_date::date)::timestamptz
  when purchase_date ~ '^\d{4}-\d{2}$'       then ((purchase_date || '-01')::date)::timestamptz
  else now()
end;

-- 3. Trigger function: stamp updated_at on every row update.
create or replace function public.tw_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- 4. Attach trigger to wardrobe_items.
drop trigger if exists wardrobe_items_set_updated_at on public.wardrobe_items;
create trigger wardrobe_items_set_updated_at
  before update on public.wardrobe_items
  for each row execute function public.tw_set_updated_at();

-- 5. Index updated_at for fast "recently edited" queries.
create index if not exists wardrobe_items_updated_at_idx
  on public.wardrobe_items (updated_at desc);

create index if not exists wardrobe_items_created_at_idx
  on public.wardrobe_items (created_at desc);
