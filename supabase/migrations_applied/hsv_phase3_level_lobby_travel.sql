-- Phase 3 Migration (Applied live on Supabase owqbwykjabwevkbjroym)
-- Tables: public.level_milestones, public.student_level_claims, public.destinations,
--         public.student_travel_state, public.lobby_messages, public.lobby_mutes, public.lobby_reports
-- Functions & RPCs exported from live database:

CREATE OR REPLACE FUNCTION public.admin_lobby_reports()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if not private.is_platform_admin() then raise exception 'not allowed' using errcode = '42501'; end if;

  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', r.id,
      'message_id', r.message_id,
      'room_key', r.room_key,
      'reason', r.reason,
      'excerpt', r.excerpt,
      'status', r.status,
      'target_alias', coalesce(p.display_alias, 'Học sinh'),
      'target_student_id', r.target_student_id,
      'created_at', r.created_at
    ) order by r.created_at desc)
    from public.lobby_reports r
    left join public.profiles p on p.id = r.target_student_id
    where r.status = 'open'
  ), '[]'::jsonb);
end
$function$
;

CREATE OR REPLACE FUNCTION public.admin_moderate_lobby(p_report_id uuid, p_action text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_rep public.lobby_reports;
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if not private.is_platform_admin() then raise exception 'not allowed' using errcode = '42501'; end if;
  if p_action not in ('hide_msg','mute_1h','dismiss') then raise exception 'invalid action' using errcode = '22023'; end if;

  select * into v_rep from public.lobby_reports where id = p_report_id;
  if not found then raise exception 'report not found' using errcode = 'P0002'; end if;

  if p_action in ('hide_msg','mute_1h') then
    update public.lobby_messages set is_hidden = true where id = v_rep.message_id;
    update public.lobby_reports set status = 'resolved' where message_id = v_rep.message_id;
  end if;

  if p_action = 'mute_1h' and v_rep.target_student_id is not null then
    insert into public.lobby_mutes(student_id, muted_until, reason)
      values (v_rep.target_student_id, now() + interval '1 hour', v_rep.reason)
      on conflict (student_id) do update set muted_until = greatest(public.lobby_mutes.muted_until, now() + interval '1 hour'), reason = excluded.reason;
  elsif p_action = 'dismiss' then
    update public.lobby_reports set status = 'dismissed' where id = p_report_id;
  end if;

  insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
    values (auth.uid(), 'lobby.moderate', 'lobby_reports', p_report_id::text, jsonb_build_object('action', p_action));

  return jsonb_build_object('ok', true, 'action', p_action);
end
$function$
;

CREATE OR REPLACE FUNCTION public.claim_city_trivia_bonus(p_dest_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_travel public.student_travel_state;
  v_coins bigint := 0;
  v_xp bigint := 0;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  insert into public.student_travel_state(student_id) values (v_uid) on conflict do nothing;
  select * into v_travel from public.student_travel_state where student_id = v_uid for update;

  if v_travel.daily_trivia_date = current_date then
    select coalesce(coin_balance, 0), coalesce(xp_balance, 0) into v_coins, v_xp
    from public.student_wallets where student_id = v_uid;
    return jsonb_build_object('already_claimed_today', true, 'coins', v_coins, 'xp', v_xp, 'level', public.xp_to_level(v_xp));
  end if;

  update public.student_travel_state set daily_trivia_date = current_date, updated_at = now() where student_id = v_uid;

  perform private.post_ledger_entry(
    'coin', v_uid, 'earn'::public.ledger_kind, 3,
    'city_trivia', null,
    'city_trivia_coin:' || v_uid::text || ':' || to_char(current_date, 'YYYY-MM-DD'),
    'Đố vui địa danh (' || p_dest_key || ')'
  );
  perform private.post_ledger_entry(
    'xp', v_uid, 'earn'::public.ledger_kind, 10,
    'city_trivia', null,
    'city_trivia_xp:' || v_uid::text || ':' || to_char(current_date, 'YYYY-MM-DD'),
    'Đố vui địa danh (' || p_dest_key || ')'
  );

  select coalesce(coin_balance, 0), coalesce(xp_balance, 0) into v_coins, v_xp
  from public.student_wallets where student_id = v_uid;

  return jsonb_build_object(
    'already_claimed_today', false,
    'coins_added', 3,
    'xp_added', 10,
    'coins', v_coins,
    'xp', v_xp,
    'level', public.xp_to_level(v_xp)
  );
end
$function$
;

CREATE OR REPLACE FUNCTION public.claim_level_milestone(p_level integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_xp bigint := 0;
  v_lvl integer := 1;
  v_ms public.level_milestones;
  v_coins bigint := 0;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  select * into v_ms from public.level_milestones where level = p_level;
  if not found then raise exception 'milestone not found' using errcode = 'P0002'; end if;

  select coalesce(xp_balance, 0) into v_xp from public.student_wallets where student_id = v_uid;
  v_lvl := public.xp_to_level(v_xp);
  if v_lvl < p_level then raise exception 'level not reached' using errcode = 'P0001'; end if;

  if exists (select 1 from public.student_level_claims where student_id = v_uid and level = p_level) then
    select coin_balance into v_coins from public.student_wallets where student_id = v_uid;
    return jsonb_build_object('already_claimed', true, 'level', p_level, 'coins', coalesce(v_coins, 0));
  end if;

  insert into public.student_level_claims(student_id, level, reward_coins)
    values (v_uid, p_level, v_ms.reward_coins);

  perform private.post_ledger_entry(
    'coin', v_uid, 'earn'::public.ledger_kind, v_ms.reward_coins,
    'level_milestone', null,
    'level_milestone:' || v_uid::text || ':' || p_level::text,
    'Thưởng đạt Cấp ' || p_level::text || ' (' || v_ms.badge_title || ')'
  );

  select coin_balance into v_coins from public.student_wallets where student_id = v_uid;
  return jsonb_build_object(
    'already_claimed', false,
    'level', p_level,
    'reward_coins', v_ms.reward_coins,
    'coins', coalesce(v_coins, 0)
  );
end
$function$
;

CREATE OR REPLACE FUNCTION public.get_my_hub_state()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_xp bigint := 0;
  v_coins bigint := 0;
  v_lvl integer := 1;
  v_travel public.student_travel_state;
  v_claims integer[] := '{}';
begin
  if v_uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  select coalesce(xp_balance, 0), coalesce(coin_balance, 0)
    into v_xp, v_coins
  from public.student_wallets where student_id = v_uid;

  v_lvl := public.xp_to_level(v_xp);

  insert into public.student_travel_state(student_id)
    values (v_uid) on conflict (student_id) do nothing;

  select * into v_travel from public.student_travel_state where student_id = v_uid;

  select coalesce(array_agg(level order by level), '{}')
    into v_claims
  from public.student_level_claims where student_id = v_uid;

  return jsonb_build_object(
    'xp', coalesce(v_xp, 0),
    'coins', coalesce(v_coins, 0),
    'level', v_lvl,
    'next_level_xp', public.xp_for_level(least(v_lvl + 1, 50)),
    'current_level_xp', public.xp_for_level(v_lvl),
    'claimed_levels', to_jsonb(v_claims),
    'current_dest', v_travel.current_dest,
    'stamps', v_travel.stamps,
    'total_km', v_travel.total_km,
    'trivia_claimed_today', (v_travel.daily_trivia_date = current_date)
  );
end
$function$
;

CREATE OR REPLACE FUNCTION public.report_lobby_message(p_message_id uuid, p_reason text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_msg public.lobby_messages;
  v_cnt integer := 0;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;

  select * into v_msg from public.lobby_messages where id = p_message_id;
  if not found then raise exception 'message not found' using errcode = 'P0002'; end if;
  if v_msg.student_id = v_uid then raise exception 'cannot report self' using errcode = '22023'; end if;

  insert into public.lobby_reports(message_id, reporter_id, target_student_id, room_key, reason, excerpt)
    values (v_msg.id, v_uid, v_msg.student_id, v_msg.room_key, left(coalesce(nullif(trim(p_reason), ''), 'Nội dung không phù hợp'), 120), left(v_msg.body, 90))
    on conflict (message_id, reporter_id) do nothing;

  select count(*)::int into v_cnt from public.lobby_reports where message_id = v_msg.id and status = 'open';
  if v_cnt >= 3 then
    update public.lobby_messages set is_hidden = true where id = v_msg.id;
  end if;

  return jsonb_build_object('reported', true, 'auto_hidden', v_cnt >= 3);
end
$function$
;

CREATE OR REPLACE FUNCTION public.send_lobby_message(p_room_key text, p_kind text, p_body text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_alias text;
  v_xp bigint := 0;
  v_lvl integer := 1;
  v_muted timestamptz;
  v_last timestamptz;
  v_clean text;
  v_id uuid;
  v_created timestamptz;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if p_room_key !~ '^[a-z0-9_:-]{3,64}$' then raise exception 'invalid room' using errcode = '22023'; end if;
  if p_kind not in ('quick','text','emote') then raise exception 'invalid kind' using errcode = '22023'; end if;

  select muted_until into v_muted from public.lobby_mutes where student_id = v_uid;
  if v_muted is not null and v_muted > now() then
    raise exception 'Tài khoản đang tạm khóa trò chuyện đến %.', to_char(v_muted at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI DD/MM') using errcode = '42501';
  end if;

  select max(created_at) into v_last from public.lobby_messages where student_id = v_uid;
  if v_last is not null and now() - v_last < interval '2 seconds' then
    raise exception 'Bạn nhắn nhanh quá, đợi 2 giây rồi gửi tiếp nhé!' using errcode = 'P0001';
  end if;

  v_clean := private.validate_lobby_text(p_body);

  select display_alias into v_alias from public.profiles where id = v_uid;
  select coalesce(xp_balance, 0) into v_xp from public.student_wallets where student_id = v_uid;
  v_lvl := public.xp_to_level(v_xp);

  insert into public.lobby_messages(room_key, student_id, sender_alias, sender_level, kind, body)
    values (p_room_key, v_uid, coalesce(v_alias, 'Học sinh'), v_lvl, p_kind, v_clean)
    returning id, created_at into v_id, v_created;

  return jsonb_build_object(
    'id', v_id,
    'room_key', p_room_key,
    'student_id', v_uid,
    'sender_alias', coalesce(v_alias, 'Học sinh'),
    'sender_level', v_lvl,
    'kind', p_kind,
    'body', v_clean,
    'created_at', v_created
  );
end
$function$
;

CREATE OR REPLACE FUNCTION public.travel_to_destination(p_dest_key text, p_trip_nonce text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_dest public.destinations;
  v_xp bigint := 0;
  v_lvl integer := 1;
  v_coins bigint := 0;
  v_veh text := '';
  v_discount_pct integer := 0;
  v_final_cost integer := 0;
  v_travel public.student_travel_state;
  v_prev_count integer := 0;
  v_new_stamps jsonb;
  v_xp_bonus integer := 0;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if p_trip_nonce is null or length(trim(p_trip_nonce)) < 4 or length(p_trip_nonce) > 64 then
    raise exception 'invalid trip nonce' using errcode = '22023';
  end if;

  select * into v_dest from public.destinations where dest_key = p_dest_key and is_active;
  if not found then raise exception 'destination not found' using errcode = 'P0002'; end if;

  insert into public.student_travel_state(student_id)
    values (v_uid) on conflict (student_id) do nothing;

  select * into v_travel from public.student_travel_state where student_id = v_uid for update;
  select coalesce(xp_balance, 0), coalesce(coin_balance, 0)
    into v_xp, v_coins
  from public.student_wallets where student_id = v_uid for update;

  v_lvl := public.xp_to_level(v_xp);
  if v_lvl < v_dest.required_level then
    raise exception 'requires level %', v_dest.required_level using errcode = 'P0001';
  end if;

  -- Check vehicle equipped for travel discount
  select coalesce(config->>'vehicleId', '') into v_veh
  from public.student_avatars where student_id = v_uid;

  if v_veh in ('veh_hoverboard','veh_spaceship','veh_magic_carpet') then
    v_discount_pct := 30;
  elsif v_veh in ('veh_scooter_pastel','veh_mountain','veh_ebike') then
    v_discount_pct := 15;
  else
    v_discount_pct := 0;
  end if;

  if p_dest_key = 'hanoi_school' or v_dest.ticket_coins = 0 then
    v_final_cost := 0;
  else
    v_final_cost := greatest(1, round((v_dest.ticket_coins * (100 - v_discount_pct)) / 100.0)::integer);
  end if;

  if v_final_cost > 0 then
    if v_coins < v_final_cost then
      raise exception 'not enough coins' using errcode = 'P0001';
    end if;

    perform private.post_ledger_entry(
      'coin', v_uid, 'spend'::public.ledger_kind, -v_final_cost,
      'travel_ticket', v_dest.id,
      'trip:' || v_uid::text || ':' || p_trip_nonce,
      'Vé khứ hồi Hà Nội ↔ ' || v_dest.name
    );

    -- Award small exploration XP (+5 XP) when buying a round-trip ticket
    v_xp_bonus := 5;
    perform private.post_ledger_entry(
      'xp', v_uid, 'earn'::public.ledger_kind, v_xp_bonus,
      'travel_explore', v_dest.id,
      'trip_xp:' || v_uid::text || ':' || p_trip_nonce,
      'Khám phá ' || v_dest.name
    );
  end if;

  v_prev_count := coalesce((v_travel.stamps->>p_dest_key)::integer, 0);
  v_new_stamps := v_travel.stamps || jsonb_build_object(p_dest_key, v_prev_count + 1);

  update public.student_travel_state
    set current_dest = p_dest_key,
        stamps = v_new_stamps,
        total_km = total_km + (v_dest.distance_km * 2),
        updated_at = now()
  where student_id = v_uid;

  select coalesce(xp_balance, 0), coalesce(coin_balance, 0)
    into v_xp, v_coins
  from public.student_wallets where student_id = v_uid;

  return jsonb_build_object(
    'current_dest', p_dest_key,
    'final_cost', v_final_cost,
    'discount_pct', v_discount_pct,
    'xp_bonus', v_xp_bonus,
    'coins', v_coins,
    'xp', v_xp,
    'level', public.xp_to_level(v_xp),
    'stamps', v_new_stamps,
    'total_km', v_travel.total_km + (v_dest.distance_km * 2)
  );
end
$function$
;

CREATE OR REPLACE FUNCTION private.validate_lobby_text(p_body text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
declare
  v_clean text := trim(regexp_replace(coalesce(p_body, ''), '\s+', ' ', 'g'));
  v_digits text;
begin
  if char_length(v_clean) < 1 or char_length(v_clean) > 90 then
    raise exception 'Tin nhắn cần từ 1 đến 90 ký tự.' using errcode = '22023';
  end if;

  -- Block PII: phone numbers, emails, links, social handles
  v_digits := regexp_replace(v_clean, '[^0-9]', '', 'g');
  if char_length(v_digits) >= 8 then
    raise exception 'Không được chia sẻ số điện thoại hoặc dãy số dài trong Sảnh.' using errcode = '23514';
  end if;
  if v_clean ~* '(@|http://|https://|www\.|\.com\b|\.vn\b|\.net\b|zalo|facebook|fb\.com|tiktok|t\.me)' then
    raise exception 'Không được chia sẻ liên kết, email hoặc mạng xã hội để bảo vệ an toàn.' using errcode = '23514';
  end if;

  -- Basic Vietnamese profanity / bullying filter
  if v_clean ~* '\m(dm|đm|dcm|đcm|vcl|vl|cc|cl|cứt|đĩ|đéo|ngu|chó|súc vật|câm mồm|cút|chết đi|lồn|buồi|cặc|đụ|má mày|bố mày)\M' then
    raise exception 'Hãy dùng lời nói lịch sự, thân thiện với bạn bè nhé!' using errcode = '23514';
  end if;

  return v_clean;
end
$function$
;

CREATE OR REPLACE FUNCTION public.xp_for_level(p_level integer)
 RETURNS bigint
 LANGUAGE sql
 IMMUTABLE
AS $function$
  select case
    when p_level <= 1 then 0::bigint
    else (60::bigint * (least(p_level, 50) - 1)) + ((25::bigint * (least(p_level, 50) - 1) * (least(p_level, 50) - 2)) / 2)
  end
$function$
;

CREATE OR REPLACE FUNCTION public.xp_to_level(p_xp bigint)
 RETURNS integer
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
declare
  v_xp bigint := greatest(coalesce(p_xp, 0), 0);
  v_lvl integer := 1;
begin
  while v_lvl < 50 and v_xp >= public.xp_for_level(v_lvl + 1) loop
    v_lvl := v_lvl + 1;
  end loop;
  return v_lvl;
end
$function$
;
