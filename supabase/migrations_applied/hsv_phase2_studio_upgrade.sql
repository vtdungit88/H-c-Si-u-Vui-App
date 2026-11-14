-- hsv_phase2_studio_upgrade.sql (ADDITIVE & IDEMPOTENT)
-- Target: Supabase project owqbwykjabwevkbjroym (after hsv_phase1_delta.sql).
-- Upgrades Studio Nhân Vật:
--   1. Widens item_type constraint to support backdrop & aura.
--   2. Adds metadata columns (rarity, tagline, render_type, set_id, sort_order) to public.shop_items.
--   3. Rebalances prices for all 56 items to match 120 Xu starter + 1-3 Xu/lesson + Arena rewards, fixes legacy Toán 6 text, and seeds 23 new vivid items.
--   4. Backfills free starter items (including bg_classroom & aura_none) into public.student_inventory.

-- ===== 1. WIDEN CONSTRAINTS & ADD METADATA COLUMNS =====
do $do$
declare
  r record;
begin
  -- Drop old item_type check constraints on public.shop_items if any
  for r in
    select c.conname
    from pg_constraint c
    where c.conrelid = 'public.shop_items'::regclass
      and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ilike '%item_type%'
  loop
    execute format('alter table public.shop_items drop constraint if exists %I', r.conname);
  end loop;

  alter table public.shop_items
    add constraint shop_items_item_type_chk
    check (item_type in ('outfit','handheld','phone','vehicle','tech','pet','backdrop','aura'));

  -- Widen any slot / item_type check constraint on public.student_equipment if present
  for r in
    select c.conname, pg_get_constraintdef(c.oid) as def
    from pg_constraint c
    where c.conrelid = 'public.student_equipment'::regclass
      and c.contype = 'c'
      and (pg_get_constraintdef(c.oid) ilike '%slot%' or pg_get_constraintdef(c.oid) ilike '%item_type%')
  loop
    execute format('alter table public.student_equipment drop constraint if exists %I', r.conname);
  end loop;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'student_equipment' and column_name = 'slot'
  ) then
    alter table public.student_equipment
      add constraint student_equipment_slot_chk
      check (slot in ('outfit','handheld','phone','vehicle','tech','pet','backdrop','aura'));
  elsif exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'student_equipment' and column_name = 'item_type'
  ) then
    alter table public.student_equipment
      add constraint student_equipment_item_type_chk
      check (item_type in ('outfit','handheld','phone','vehicle','tech','pet','backdrop','aura'));
  end if;
end $do$;

alter table public.shop_items
  add column if not exists rarity text not null default 'base',
  add column if not exists tagline text,
  add column if not exists render_type text,
  add column if not exists set_id text,
  add column if not exists sort_order integer not null default 100;

do $do$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.shop_items'::regclass and conname = 'shop_items_rarity_chk'
  ) then
    alter table public.shop_items
      add constraint shop_items_rarity_chk check (rarity in ('base','popular','vip','mythic'));
  end if;
end $do$;

grant select on public.shop_items to anon, authenticated;

-- ===== 2. UPSERT ALL 56 STUDIO ITEMS =====
insert into public.shop_items (
  item_key, name, description, item_type, price_coins, required_stars, is_active,
  rarity, tagline, render_type, set_id, sort_order
)
values
  ('outfit_uniform', 'Đồng Phục Khăn Quàng Đỏ', 'Áo sơ mi trắng tinh khôi thắt khăn quàng đỏ tươi. Chuẩn tác phong học sinh gương mẫu.', 'outfit', 0, 0, true, 'base', 'Học sinh chăm ngoan', 'uniform', null, 1),
  ('outfit_scout', 'Áo Gile Thám Hiểm Bản Đồ', 'Áo túi hộp kaki năng động gắn huy hiệu la bàn, sẵn sàng vượt ải trên Bản đồ thám hiểm.', 'outfit', 12, 0, true, 'popular', 'Sẵn sàng vượt ải', 'scout', 'set_explorer', 2),
  ('outfit_sport', 'Áo Thể Dục Năng Động 3 Sọc', 'Thoáng mát, co giãn cực tốt cho những giờ thể dục và đấu trường siêu tốc.', 'outfit', 18, 0, true, 'popular', 'Khỏe để học tốt', 'sport', null, 3),
  ('outfit_hoodie', 'Hoodie Biệt Đội Tri Thức', 'Áo hoodie in biểu tượng Số Pi và Vô Cùng, giữ ấm mỗi tối ôn bài chuẩn bị kiểm tra.', 'outfit', 24, 2, true, 'popular', 'Ấm áp mùa ôn thi', 'hoodie', null, 4),
  ('outfit_lab', 'Áo Blouse Nhà Khoa Học Nhí', 'Áo choàng trắng phòng thí nghiệm kèm kính bảo hộ gắn trán cho tín đồ Khoa học tự nhiên.', 'outfit', 42, 4, true, 'vip', 'Say mê khám phá', 'lab', 'set_scientist', 5),
  ('outfit_detective', 'Vest Thám Tử Lừng Danh', 'Bộ vest lịch lãm thắt nơ đỏ, chuyên gia phá giải các bài toán hóc búa nhất.', 'outfit', 52, 5, true, 'vip', 'Chân lý chỉ có một', 'detective', null, 6),
  ('outfit_varsity', 'Áo Khoác Bóng Chày Học Đường', 'Áo khoác Varsity xanh navy phối tay kem cực chất dành cho thủ lĩnh đội tuyển lớp.', 'outfit', 65, 6, true, 'vip', 'Phong cách thủ lĩnh', 'varsity', null, 7),
  ('outfit_aodai_tech', 'Cổ Phục Trạng Nguyên Hiện Đại', 'Lấy cảm hứng từ trang phục Trạng Nguyên Việt Nam hòa quyện hoa văn công nghệ ánh kim.', 'outfit', 82, 8, true, 'vip', 'Vinh danh Bảng Vàng', 'aodai_tech', null, 8),
  ('outfit_scholar', 'Áo Choàng Pháp Sư Tri Thức', 'Áo choàng nhung tím thêu chòm sao vàng kim, tỏa ánh sáng trí tuệ cổ điển.', 'outfit', 120, 12, true, 'mythic', 'Phép thuật tính nhẩm', 'scholar', null, 9),
  ('outfit_cyber', 'Bộ Giáp Phi Hành Gia Lượng Tử', 'Trang phục công nghệ vũ trụ tối tân, sẵn sàng chinh phục dải ngân hà tri thức.', 'outfit', 165, 18, true, 'mythic', 'Đỉnh cao tương lai', 'cyber', 'set_cosmic', 10),
  ('hand_pencil', 'Bút Chì 2B Cổ Điển', 'Cây bút chì quen thuộc vẽ hình, nháp phép tính không bao giờ thiếu trong cặp sách.', 'handheld', 0, 0, true, 'base', 'Vũ khí khởi đầu', 'pencil', null, 11),
  ('hand_ruler', 'Thước Kẻ Dẻo Cầu Vồng', 'Thước nhựa dẻo uốn cong không gãy, đo chuẩn từng milimet trên vở ô ly.', 'handheld', 10, 0, true, 'popular', 'Đo chuẩn từng ly', 'ruler', null, 12),
  ('hand_star_wand', 'Gậy Phép Ngôi Sao Tri Thức', 'Đầu gậy gắn ngôi sao vàng lấp lánh, vung lên là giải xong phép tính khó.', 'handheld', 15, 1, true, 'popular', 'Tỏa sáng mỗi câu đúng', 'star_wand', null, 13),
  ('hand_compass', 'Bộ Compa Hợp Kim Titan', 'Vẽ đường tròn, tam giác đều và hình lục giác sắc nét đến từng milimet.', 'handheld', 22, 2, true, 'popular', 'Tuyệt đỉnh hình học', 'compass', null, 14),
  ('hand_magnifier', 'Kính Lúp Thám Tử Bạc', 'Soi rõ từng chi tiết bẫy đề bài trong SGK và thí nghiệm khoa học tự nhiên.', 'handheld', 36, 3, true, 'vip', 'Bắt trọn mọi bẫy đề', 'magnifier', 'set_explorer', 15),
  ('hand_casio', 'Máy Tính Khoa Học FX Pro', 'Chiếc máy tính bỏ túi huyền thoại của mọi học sinh phổ thông, bấm nhanh như chớp.', 'handheld', 48, 5, true, 'vip', 'Bảo bối phòng thi', 'casio', 'set_scientist', 16),
  ('hand_trophy_mini', 'Cúp Pha Lê Đấu Trường', 'Chiếc cúp pha lê lấp lánh biểu tượng của nhà vô địch Đấu Trường 60 giây.', 'handheld', 72, 7, true, 'vip', 'Chiến thắng vang dội', 'trophy_mini', null, 17),
  ('hand_laser', 'Kiếm Ánh Sáng Số Học', 'Phát ra chùm tia sáng ngọc lục bảo chỉ thẳng vào đáp án chính xác.', 'handheld', 115, 12, true, 'mythic', 'Chỉ đâu trúng đó', 'laser', 'set_cosmic', 18),
  ('hand_tome', 'Đại Bí Kíp Tri Thức Dát Vàng', 'Cuốn cổ thư dát vàng tổng hợp trọn vẹn công thức Toán và Khoa học từ Lớp 1 đến Lớp 9.', 'handheld', 150, 16, true, 'mythic', 'Bí kíp trấn phái', 'tome', null, 19),
  ('phone_brick', 'Điện Thoại Cục Gạch Huyền Thoại', 'Pin bền cả tháng, rơi xuống sân trường không một vết xước.', 'phone', 0, 0, true, 'base', 'Nồi đồng cối đá', 'brick', null, 20),
  ('phone_walkie', 'Bộ Đàm Thám Hiểm Rừng Xanh', 'Bắt sóng cực khỏe để gọi đồng đội cùng vượt ải trên Bản đồ.', 'phone', 12, 0, true, 'popular', 'Kết nối đồng đội', 'walkie', null, 21),
  ('phone_flip', 'Điện Thoại Nắp Gập Retro', 'Gập kêu tanh tách sành điệu với sắc hồng pastel trẻ trung.', 'phone', 20, 1, true, 'popular', 'Phong cách cổ điển', 'flip', null, 22),
  ('phone_smart', 'Smartphone Màn Hình Tràn Viền', 'Lướt học siêu mượt, màn hình sắc nét bảo vệ mắt cho học sinh.', 'phone', 45, 4, true, 'vip', 'Thông minh đa năng', 'smart', null, 23),
  ('phone_promax', 'Flagship Titan Sa Mạc', 'Khung viền titan vàng cát sang trọng với cụm 3 camera siêu nét.', 'phone', 75, 8, true, 'vip', 'Đẳng cấp học đường', 'promax', null, 24),
  ('phone_holo', 'Máy Chiếu Hologram 3D AI', 'Chiếu mô hình hình học không gian lơ lửng 3D ngay trên lòng bàn tay.', 'phone', 140, 15, true, 'mythic', 'Công nghệ viễn tưởng', 'holo', null, 25),
  ('veh_honeycomb', 'Dép Tổ Ong Huyền Thoại', 'Đôi dép quốc dân êm ái, đồng hành cùng biết bao thế hệ học trò Việt Nam.', 'vehicle', 0, 0, true, 'base', 'Bước chân dũng cảm', 'honeycomb', null, 26),
  ('veh_skateboard', 'Ván Trượt Đường Phố Năng Động', 'Ván gỗ phong 7 lớp họa tiết đường phố cực ngầu để lướt qua sân trường.', 'vehicle', 14, 1, true, 'popular', 'Lướt nhanh như gió', 'skateboard', null, 27),
  ('veh_bike_mini', 'Xe Đạp Mini Cổ Điển Có Giỏ', 'Xe đạp màu xanh ngọc có giỏ đựng sách vở và chuông reng reng vui tai.', 'vehicle', 24, 2, true, 'popular', 'Kỷ niệm tuổi thơ', 'bike_mini', null, 28),
  ('veh_scooter_pastel', 'Xe Tay Ga Mini Pastel', 'Nhỏ gọn, xinh xắn màu xanh bạc hà cùng đèn pha tròn cổ điển.', 'vehicle', 42, 4, true, 'vip', 'Dạo phố siêu xinh', 'scooter_pastel', null, 29),
  ('veh_mountain', 'Xe Đạp Địa Hình Thể Thao', 'Bánh gai hầm hố, bộ đề 21 tốc độ chinh phục mọi cung đường đồi núi.', 'vehicle', 55, 5, true, 'vip', 'Vua leo dốc', 'mountain', 'set_explorer', 30),
  ('veh_ebike', 'Xe Điện Thông Minh Xanh', 'Chạy điện êm ru, thân thiện môi trường, không lo trễ giờ vào lớp.', 'vehicle', 78, 7, true, 'vip', 'Êm ái thần tốc', 'ebike', null, 31),
  ('veh_hoverboard', 'Ván Trượt Phản Trọng Lực', 'Lơ lửng cách mặt đất 20cm với ánh sáng xanh dương công nghệ cao.', 'vehicle', 120, 12, true, 'mythic', 'Bay trên mặt đất', 'hoverboard', null, 32),
  ('veh_spaceship', 'Phi Thuyền Mini VNPT Cloud', 'Tàu vũ trụ cá nhân động cơ phản lực ánh sáng đưa bạn du hành qua các thiên hà.', 'vehicle', 170, 18, true, 'mythic', 'Chinh phục ngân hà', 'spaceship', 'set_cosmic', 33),
  ('veh_magic_carpet', 'Thảm Bay Thần Thoại Fibonacci', 'Thảm bay dệt hoa văn dãy số vàng, lơ lửng đưa bạn tới đỉnh cao Bảng Vàng.', 'vehicle', 195, 22, true, 'mythic', 'Thần thoại vô đối', 'carpet', null, 34),
  ('tech_notebook', 'Vở Ô Ly Tinh Khôi 96 Trang', 'Giấy trắng chống lóa, kẻ ô ly sắc nét để rèn chữ và ghi chép công thức.', 'tech', 0, 0, true, 'base', 'Nét chữ nết người', 'notebook', null, 35),
  ('tech_abacus', 'Bàn Tính Gẩy Soroban Gỗ', 'Bàn tính hạt gỗ giúp tăng tốc khả năng tính nhẩm siêu tốc cho Tiểu học.', 'tech', 15, 1, true, 'popular', 'Tính nhẩm siêu phàm', 'abacus', null, 36),
  ('tech_tablet', 'Máy Tính Bảng SGK Điện Tử', 'Màn hình bảo vệ mắt, mở nhanh toàn bộ sách giáo khoa Lớp 1 đến Lớp 9.', 'tech', 35, 3, true, 'vip', 'Học tập mọi nơi', 'tablet', null, 37),
  ('tech_ultrabook', 'Laptop Nhôm Mỏng Nhẹ Pro', 'Mỏng nhẹ chỉ 1kg, pin dùng cả ngày để lập trình và làm bài thuyết trình nhóm.', 'tech', 62, 6, true, 'vip', 'Làm việc nhóm đỉnh cao', 'ultrabook', null, 38),
  ('tech_gaming', 'Laptop Đồ Họa RGB Tản Nhiệt', 'Bàn phím đổi màu rực rỡ, mô phỏng hình học 3D và thí nghiệm mượt mà.', 'tech', 110, 11, true, 'mythic', 'Chiến mượt mọi tác vụ', 'gaming', null, 39),
  ('tech_quantum', 'Lõi Máy Tính Lượng Tử AI', 'Khối năng lượng xoay quanh hạt nhân lượng tử, xử lý hàng triệu phép tính trong chớp mắt.', 'tech', 160, 17, true, 'mythic', 'Trí tuệ vũ trụ', 'quantum', null, 40),
  ('pet_none', 'Tự Lực Cánh Sinh', 'Rèn luyện tinh thần độc lập và tự giác khi chinh phục các bài học.', 'pet', 0, 0, true, 'base', 'Tự tin tự giác', 'none', null, 41),
  ('pet_corgi', 'Cún Corgi Đeo Nơ Đỏ', 'Chú cún chân ngắn tinh nghịch luôn vẫy đuôi cổ vũ mỗi khi bạn ghi điểm.', 'pet', 18, 1, true, 'popular', 'Người bạn trung thành', 'corgi', null, 42),
  ('pet_cat', 'Mèo Mướp Ham Học', 'Chú mèo mướp thông minh meo meo ăn mừng khi bạn đạt chuỗi Combo.', 'pet', 24, 2, true, 'popular', 'Bạn thân chăm chỉ', 'cat', null, 43),
  ('pet_bunny', 'Thỏ Ngọc Đeo Kính Tri Thức', 'Tai dài đáng yêu, nhảy tưng tưng mỗi lần bạn hoàn thành xuất sắc 15 câu.', 'pet', 42, 4, true, 'vip', 'Nhanh nhẹn tinh anh', 'bunny', null, 44),
  ('pet_owl', 'Cú Vọ Tiến Sĩ Mũ Vuông', 'Đội mũ tốt nghiệp tí hon, biểu tượng thông thái nhắc bạn đọc kỹ đề bài.', 'pet', 68, 7, true, 'vip', 'Biểu tượng thông thái', 'owl', null, 45),
  ('pet_vuibot', 'Robot VNPT Vui-Bot Mini', 'Phiên bản đồng hành thu nhỏ của linh vật VNPT Vui-Bot, mắt LED biết cười cực dễ thương.', 'pet', 85, 8, true, 'vip', 'Trợ thủ công nghệ', 'robot', 'set_scientist', 46),
  ('pet_dragon', 'Rồng Con Tí Nị Lửa Vàng', 'Bé rồng huyền thoại bay lơ lửng vỗ cánh, mang lại may mắn trên mọi đấu trường.', 'pet', 155, 16, true, 'mythic', 'Thần thú may mắn', 'dragon', null, 47),
  ('bg_classroom', 'Lớp Học Nắng Mai', 'Khung cảnh lớp học sáng sủa ngập tràn ánh nắng ban mai và bảng xanh thân quen.', 'backdrop', 0, 0, true, 'base', 'Khởi đầu quen thuộc', 'bg_classroom', null, 48),
  ('bg_forest', 'Đảo Thám Hiểm Rừng Xanh', 'Thảm cỏ xanh mướt cùng thác pha lê lấp lánh trên quần đảo Thám Hiểm.', 'backdrop', 20, 2, true, 'popular', 'Thiên nhiên tươi mát', 'bg_forest', 'set_explorer', 49),
  ('bg_lab', 'Phòng Lab Công Nghệ VNPT', 'Phòng thí nghiệm công nghệ cao với màn hình hình học và ánh sáng xanh dịu.', 'backdrop', 46, 5, true, 'vip', 'Khoa học hiện đại', 'bg_lab', 'set_scientist', 50),
  ('bg_arena', 'Đấu Trường Ánh Dương', 'Khán đài rực rỡ cờ hoa chào đón những nhà vô địch leo Top Bảng Vàng.', 'backdrop', 74, 8, true, 'vip', 'Sân khấu vinh quang', 'bg_arena', null, 51),
  ('bg_galaxy', 'Vũ Trụ Tri Thức Lượng Tử', 'Bầu trời cực quang sâu thẳm với các chòm sao và khối đa diện trôi lơ lửng.', 'backdrop', 135, 14, true, 'mythic', 'Bao la vô tận', 'bg_galaxy', 'set_cosmic', 52),
  ('aura_none', 'Mặc Định Tự Nhiên', 'Hiển thị nhân vật mộc mạc, gọn gàng không kèm hiệu ứng vòng sáng.', 'aura', 0, 0, true, 'base', 'Đơn giản tinh tế', 'aura_none', null, 53),
  ('aura_sparkle', 'Bụi Sao Lấp Lánh', 'Những ngôi sao vàng nhỏ xoay nhẹ xung quanh nhân vật đầy sinh động.', 'aura', 22, 2, true, 'popular', 'Lấp lánh tỏa sáng', 'aura_sparkle', null, 54),
  ('aura_electric', 'Vòng Năng Lượng Xanh VNPT', 'Vòng quỹ đạo điện tích xanh dương xoay đều chuẩn công nghệ số.', 'aura', 54, 5, true, 'vip', 'Tốc độ ánh sáng', 'aura_electric', 'set_scientist', 55),
  ('aura_flame', 'Hào Quang Phượng Hoàng Vàng', 'Vầng hào quang rực lửa vàng kim uy nghiêm của bậc Trạng Nguyên Đấu Trường.', 'aura', 125, 13, true, 'mythic', 'Khí chất vô địch', 'aura_flame', 'set_cosmic', 56)
on conflict (item_key) do update set
  name = excluded.name,
  description = excluded.description,
  item_type = excluded.item_type,
  price_coins = excluded.price_coins,
  required_stars = excluded.required_stars,
  is_active = excluded.is_active,
  rarity = excluded.rarity,
  tagline = excluded.tagline,
  render_type = excluded.render_type,
  set_id = excluded.set_id,
  sort_order = excluded.sort_order;

-- ===== 3. BACKFILL & AUTO-GRANT FREE STARTER STUDIO ITEMS =====
insert into public.student_inventory (student_id, item_id)
select p.id, s.id
from public.profiles p
cross join public.shop_items s
where s.item_key in (
  'outfit_uniform','hand_pencil','phone_brick','veh_honeycomb',
  'tech_notebook','pet_none','bg_classroom','aura_none'
)
on conflict do nothing;

create or replace function private.grant_default_studio_items()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
begin
  insert into public.student_inventory (student_id, item_id)
  select new.id, s.id
  from public.shop_items s
  where s.item_key in (
    'outfit_uniform','hand_pencil','phone_brick','veh_honeycomb',
    'tech_notebook','pet_none','bg_classroom','aura_none'
  )
  on conflict do nothing;
  return new;
end $fn$;

revoke all on function private.grant_default_studio_items() from public, anon, authenticated;

drop trigger if exists trg_profile_default_studio_items on public.profiles;
create trigger trg_profile_default_studio_items
  after insert on public.profiles
  for each row execute function private.grant_default_studio_items();
