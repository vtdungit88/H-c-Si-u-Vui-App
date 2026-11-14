-- hsv_phase2_studio_upgrade_rollback.sql
-- Safe rollback of Studio Phase 2 additions (preserves student_inventory & user purchases).
drop trigger if exists trg_profile_default_studio_items on public.profiles;
drop function if exists private.grant_default_studio_items();
alter table public.shop_items drop constraint if exists shop_items_rarity_chk;
alter table public.shop_items drop constraint if exists shop_items_item_type_chk;
alter table public.shop_items
  add constraint shop_items_item_type_chk
  check (item_type in ('outfit','handheld','phone','vehicle','tech','pet','backdrop','aura'));
