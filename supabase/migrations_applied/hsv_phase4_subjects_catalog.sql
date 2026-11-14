-- Phase 4: Pre-seed complete GDPT 2018 / NXBGD subjects catalog (Tiểu học 1-5 & THCS 6-9)
-- Additive & idempotent: keeps existing 'toan' and 'khtn' active; pre-creates remaining subject rows (is_active = false) ready for future question bank imports.

insert into public.subjects (code, name, is_active) values
  ('toan', 'Toán', true),
  ('khtn', 'Khoa học tự nhiên', true),
  ('tiengviet', 'Tiếng Việt', false),
  ('tnxh', 'Tự nhiên và Xã hội', false),
  ('khoahoc', 'Khoa học', false),
  ('lsdl', 'Lịch sử và Địa lí', false),
  ('daoduc', 'Đạo đức', false),
  ('lssong', 'Giáo dục lối sống', false),
  ('tienganh', 'Tiếng Anh', false),
  ('tinhoc', 'Tin học', false),
  ('congnghe', 'Công nghệ', false),
  ('amnhac', 'Âm nhạc', false),
  ('mithuat', 'Mĩ thuật', false),
  ('gdtc', 'Giáo dục thể chất', false),
  ('hdtn', 'Hoạt động trải nghiệm', false),
  ('nguvan', 'Ngữ văn', false),
  ('gdcd', 'Giáo dục công dân', false),
  ('hdtn_hn', 'Hoạt động trải nghiệm, hướng nghiệp', false)
on conflict (code) do nothing;
