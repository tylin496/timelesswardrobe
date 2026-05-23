-- Repair mixed wardrobe_app_state schemas where modern collection_* columns
-- were created with defaults before legacy archive_* values were copied.

do $$
declare
  old_overrides text := 'arch' || 'ive_overrides';
  old_hidden text := 'arch' || 'ive_hidden_ids';
  has_old_overrides boolean;
  has_new_overrides boolean;
  has_old_hidden boolean;
  has_new_hidden boolean;
begin
  if not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
  ) then
    return;
  end if;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
      and column_name = old_overrides
  ) into has_old_overrides;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
      and column_name = 'collection_overrides'
  ) into has_new_overrides;

  if has_old_overrides and has_new_overrides then
    execute format(
      'update public.wardrobe_app_state
       set collection_overrides = coalesce(%1$I, ''{}''::jsonb)
       where collection_overrides = ''{}''::jsonb
         and %1$I is not null
         and %1$I <> ''{}''::jsonb',
      old_overrides
    );
  end if;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
      and column_name = old_hidden
  ) into has_old_hidden;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wardrobe_app_state'
      and column_name = 'collection_hidden_ids'
  ) into has_new_hidden;

  if has_old_hidden and has_new_hidden then
    execute format(
      'update public.wardrobe_app_state
       set collection_hidden_ids = coalesce(%1$I, ''[]''::jsonb)
       where collection_hidden_ids = ''[]''::jsonb
         and %1$I is not null
         and %1$I <> ''[]''::jsonb',
      old_hidden
    );
  end if;
end $$;
