-- Fix visitor outfit saves without notes.
--
-- outfits.notes was NOT NULL default '', but the outfit-create edge function
-- inserts an explicit `notes: null` when the visitor leaves notes empty —
-- so every no-notes visitor save failed with a not-null violation. (Editors
-- survived via the retry-without-notes fallback in js/supabase-client.js.)
-- Null and '' both mean "no notes" to the app; allow null.
alter table public.outfits alter column notes drop not null;
