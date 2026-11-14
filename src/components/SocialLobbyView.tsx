import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { AvatarConfig, StudentProfile } from '../types';
import {
  DESTINATIONS,
  EMOTE_STICKERS,
  QUICK_CHAT_PRESETS
} from '../data/destinations';
import { getLevelProgress, getRankTier, levelFromXp } from '../data/levels';
import {
  claimCityTriviaBonus,
  fetchLobbyMessages,
  reportLobbyMessage,
  sendLobbyMessage,
  type HubState,
  type LobbyMessage
} from '../lib/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getVisitorId } from '../lib/presence';
import { soundManager } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import { City3DLandmark } from './City3DLandmark';
import { CoinIcon } from './GameIcons';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Award,
  Bot,
  Compass,
  Flag,
  Heart,
  HelpCircle,
  Loader2,
  MapPin,
  MessageCircle,
  Plane,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  Users,
  X,
  Zap
} from 'lucide-react';

interface PeerPresence {
  id: string;
  alias: string;
  level: number;
  rankTitle: string;
  avatarConfig: AvatarConfig;
  x: number;
  y: number;
  facing: 1 | -1;
  isGuest?: boolean;
  updatedAt: number;
}

interface FloatingBubble {
  text: string;
  kind: 'quick' | 'text' | 'emote';
  symbol?: string;
  expiresAt: number;
}

interface SocialLobbyViewProps {
  student: StudentProfile;
  hubState: HubState | null;
  cityOnlineCounts: Record<string, number>;
  onUpdateStudent: (updated: StudentProfile) => void;
  onHubStateChange: (updater: (prev: HubState | null) => HubState | null) => void;
  onOpenTravel: () => void;
  onOpenLevel: () => void;
  onNavigateToBlitz: () => void;
  onNavigateToShop: () => void;
  onRequireLogin: () => void;
}

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

export const SocialLobbyView: React.FC<SocialLobbyViewProps> = ({
  student,
  hubState,
  cityOnlineCounts,
  onUpdateStudent,
  onHubStateChange,
  onOpenTravel,
  onOpenLevel,
  onNavigateToBlitz,
  onNavigateToShop,
  onRequireLogin
}) => {
  const currentDestKey = hubState?.current_dest || 'hanoi_school';
  const currentCity = useMemo(
    () => DESTINATIONS.find((d) => d.destKey === currentDestKey) ?? DESTINATIONS[0],
    [currentDestKey]
  );

  const progress = getLevelProgress(hubState?.xp ?? student.exp);
  const myRank = progress.rank;
  const selfId = student.isGuest ? `guest:${getVisitorId()}` : student.id;
  const roomKey = `city:${currentDestKey}:1`;

  // Avatar position on 2.5D plaza (%)
  const [pos, setPos] = useState<{ x: number; y: number; facing: 1 | -1 }>({
    x: 42,
    y: 72,
    facing: 1
  });
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const [isWalking, setIsWalking] = useState(false);

  // Realtime state
  const [peers, setPeers] = useState<Record<string, PeerPresence>>({});
  const [bubbles, setBubbles] = useState<Record<string, FloatingBubble>>({});
  const [messages, setMessages] = useState<LobbyMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [chatTab, setChatTab] = useState<'quick' | 'free'>('quick');
  const [draftText, setDraftText] = useState('');
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [reportedIds, setReportedIds] = useState<Record<string, boolean>>({});

  // Interactive overlays
  const [selectedPeer, setSelectedPeer] = useState<PeerPresence | null>(null);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [triviaPicked, setTriviaPicked] = useState<number | null>(null);
  const [triviaStatus, setTriviaStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [triviaBusy, setTriviaBusy] = useState(false);
  const [triviaNotice, setTriviaNotice] = useState('');

  const stageRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastMoveBroadcastRef = useRef<number>(0);
  const walkTimerRef = useRef<number | null>(null);

  const showToast = useCallback((text: string) => {
    setToastMsg(text);
    window.setTimeout(() => {
      setToastMsg((prev) => (prev === text ? '' : prev));
    }, 3600);
  }, []);

  const setBubbleFor = useCallback((id: string, bubble: Omit<FloatingBubble, 'expiresAt'>) => {
    const expiresAt = Date.now() + (bubble.kind === 'emote' ? 3600 : 5600);
    setBubbles((prev) => ({ ...prev, [id]: { ...bubble, expiresAt } }));
  }, []);

  // Expire old floating speech / emote bubbles
  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();
      setBubbles((prev) => {
        let changed = false;
        const next: Record<string, FloatingBubble> = {};
        for (const [k, v] of Object.entries(prev)) {
          if (v.expiresAt > now) next[k] = v;
          else changed = true;
        }
        return changed ? next : prev;
      });
    }, 800);
    return () => window.clearInterval(timer);
  }, []);

  // Reset position gently when entering a new city
  useEffect(() => {
    setPos({ x: 38 + Math.round(Math.random() * 14), y: 72, facing: 1 });
    setSelectedPeer(null);
    setIsTriviaOpen(false);
    setTriviaPicked(null);
    setTriviaStatus('idle');
    setTriviaNotice('');
  }, [currentDestKey]);

  // Load recent server-filtered chat messages for current destination room
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    setLoadingMsgs(true);
    fetchLobbyMessages(roomKey)
      .then((rows) => {
        if (!cancelled) setMessages(rows);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMsgs(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomKey]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages.length]);

  // Subscribe to real Supabase Realtime Presence + Broadcast for the current city room
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channelName = `hsv-lobby:${currentDestKey}:1`;
    const channel = supabase.channel(channelName, {
      config: { presence: { key: selfId } }
    });
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PeerPresence>();
        const mapped: Record<string, PeerPresence> = {};
        for (const [key, list] of Object.entries(state)) {
          if (key === selfId || !Array.isArray(list) || list.length === 0) continue;
          const latest = list[list.length - 1];
          if (latest && latest.alias) {
            mapped[key] = latest;
          }
        }
        setPeers(mapped);
      })
      .on('broadcast', { event: 'move' }, ({ payload }) => {
        if (!payload || payload.id === selfId) return;
        setPeers((prev) => {
          const existing = prev[payload.id];
          if (!existing) return prev;
          return {
            ...prev,
            [payload.id]: {
              ...existing,
              x: clamp(Number(payload.x) || existing.x, 8, 88),
              y: clamp(Number(payload.y) || existing.y, 52, 90),
              facing: payload.facing === -1 ? -1 : 1,
              updatedAt: Date.now()
            }
          };
        });
      })
      .on('broadcast', { event: 'speech' }, ({ payload }) => {
        if (!payload || !payload.id) return;
        if (payload.id !== selfId) {
          soundManager.play('chat');
        }
        setBubbleFor(payload.id, {
          text: String(payload.text || ''),
          kind: payload.kind === 'emote' ? 'emote' : 'text',
          symbol: payload.symbol ? String(payload.symbol) : undefined
        });
      })
      .on('broadcast', { event: 'chat_msg' }, ({ payload }) => {
        const row = payload as LobbyMessage | undefined;
        if (!row || !row.id) return;
        setMessages((prev) => {
          if (prev.some((m) => m.id === row.id)) return prev;
          return [...prev.slice(-39), row];
        });
      })
      .on('broadcast', { event: 'wave' }, ({ payload }) => {
        if (!payload || payload.toId !== selfId) return;
        soundManager.play('coin');
        const symbol = payload.kind === 'heart' ? '❤️' : '👋';
        const verb = payload.kind === 'heart' ? 'vừa thả tim cho bạn' : 'vừa vẫy tay chào bạn';
        showToast(`${payload.fromAlias || 'Một người bạn'} ${verb}! ${symbol}`);
        setBubbleFor(selfId, {
          text: symbol,
          kind: 'emote',
          symbol
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: selfId,
            alias: student.name,
            level: progress.level,
            rankTitle: myRank.title,
            avatarConfig: student.avatarConfig,
            x: pos.x,
            y: pos.y,
            facing: pos.facing,
            isGuest: student.isGuest,
            updatedAt: Date.now()
          } satisfies PeerPresence);
        }
      });

    return () => {
      channelRef.current = null;
      void supabase.removeChannel(channel);
    };
    // Re-subscribe when room, identity, or avatar look changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDestKey, selfId, student.name, progress.level, student.avatarConfig, student.isGuest]);

  const moveSelfTo = useCallback(
    (nextX: number, nextY: number) => {
      const clampedX = clamp(Math.round(nextX * 10) / 10, 8, 86);
      const clampedY = clamp(Math.round(nextY * 10) / 10, 54, 88);

      setPos((prev) => {
        const facing: 1 | -1 = clampedX < prev.x - 0.5 ? -1 : clampedX > prev.x + 0.5 ? 1 : prev.facing;
        return { x: clampedX, y: clampedY, facing };
      });

      setIsWalking(true);
      if (walkTimerRef.current) window.clearTimeout(walkTimerRef.current);
      walkTimerRef.current = window.setTimeout(() => setIsWalking(false), 450);

      const now = Date.now();
      if (channelRef.current && now - lastMoveBroadcastRef.current >= 110) {
        lastMoveBroadcastRef.current = now;
        const facing: 1 | -1 = clampedX < pos.x - 0.5 ? -1 : 1;
        void channelRef.current.send({
          type: 'broadcast',
          event: 'move',
          payload: { id: selfId, x: clampedX, y: clampedY, facing }
        });
      }
    },
    [pos.x, selfId]
  );

  // Keyboard navigation (WASD / Arrows) when not typing
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      const step = 4.5;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveSelfTo(pos.x - step, pos.y);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveSelfTo(pos.x + step, pos.y);
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        moveSelfTo(pos.x, pos.y - step);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        moveSelfTo(pos.x, pos.y + step);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [moveSelfTo, pos.x, pos.y]);

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, [data-interactive="true"]')) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const targetX = clamp(xPct, 8, 86);
    const targetY = clamp(yPct, 54, 88);
    setClickRipple({ x: targetX, y: targetY, key: Date.now() });
    moveSelfTo(targetX, targetY);
  };

  const handleSendMessage = async (kind: 'quick' | 'text' | 'emote', body: string, symbol?: string) => {
    setChatError('');
    if (student.isGuest || !isSupabaseConfigured) {
      onRequireLogin();
      return;
    }
    const clean = body.trim();
    if (!clean) return;
    setSending(true);
    try {
      const saved = await sendLobbyMessage(roomKey, kind, clean);
      soundManager.play('chat');
      setMessages((prev) => [...prev.slice(-39), saved]);
      setBubbleFor(selfId, {
        text: saved.body,
        kind: kind === 'emote' ? 'emote' : 'text',
        symbol
      });
      if (kind === 'text') setDraftText('');

      if (channelRef.current) {
        await channelRef.current.send({
          type: 'broadcast',
          event: 'chat_msg',
          payload: saved
        });
        await channelRef.current.send({
          type: 'broadcast',
          event: 'speech',
          payload: {
            id: selfId,
            text: saved.body,
            kind,
            symbol
          }
        });
      }
    } catch (err) {
      soundManager.play('wrong');
      setChatError(err instanceof Error ? err.message : 'Không gửi được tin nhắn lúc này.');
    } finally {
      setSending(false);
    }
  };

  const handleReportMessage = async (msgId: string) => {
    if (student.isGuest || !isSupabaseConfigured) {
      onRequireLogin();
      return;
    }
    try {
      await reportLobbyMessage(msgId, 'Nội dung không phù hợp');
      setReportedIds((prev) => ({ ...prev, [msgId]: true }));
      showToast('Đã gửi báo cáo an toàn tới Quản trị viên.');
    } catch {
      showToast('Không thể báo cáo tin nhắn này.');
    }
  };

  const handleWaveOrHeart = async (peer: PeerPresence, kind: 'wave' | 'heart') => {
    if (student.isGuest || !isSupabaseConfigured) {
      onRequireLogin();
      return;
    }
    soundManager.play('equip');
    const symbol = kind === 'heart' ? '❤️' : '👋';
    setBubbleFor(selfId, { text: symbol, kind: 'emote', symbol });
    if (channelRef.current) {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'wave',
        payload: {
          fromId: selfId,
          fromAlias: student.name,
          toId: peer.id,
          kind
        }
      });
    }
    showToast(`Đã gửi ${symbol} tới ${peer.alias}!`);
  };

  const handleAnswerTrivia = async (optIdx: number) => {
    if (triviaBusy || triviaStatus !== 'idle') return;
    setTriviaPicked(optIdx);
    const isCorrect = optIdx === currentCity.trivia.correctIndex;
    if (!isCorrect) {
      soundManager.play('wrong');
      setTriviaStatus('wrong');
      setTriviaNotice(`Chưa đúng rồi! ${currentCity.trivia.fact}`);
      return;
    }

    soundManager.play('correct');
    setTriviaStatus('correct');
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.65 } });

    if (student.isGuest || !isSupabaseConfigured) {
      setTriviaNotice('Chính xác! Đăng nhập để nhận thưởng +3 Xu & +10 XP mỗi ngày từ Vui-Bot nhé.');
      return;
    }

    setTriviaBusy(true);
    try {
      const res = await claimCityTriviaBonus(currentCity.destKey);
      if (res.already_claimed_today) {
        setTriviaNotice('Chính xác! Hôm nay bạn đã nhận quà Đố Vui địa danh rồi, mai quay lại nhé!');
      } else {
        soundManager.play('coin');
        onUpdateStudent({
          ...student,
          coins: res.coins,
          exp: res.xp,
          level: levelFromXp(res.xp)
        });
        onHubStateChange((prev) =>
          prev
            ? {
                ...prev,
                coins: res.coins,
                xp: res.xp,
                level: res.level,
                trivia_claimed_today: true
              }
            : prev
        );
        setTriviaNotice(`Tuyệt vời! Bạn nhận +${res.coins_added ?? 3} Xu & +${res.xp_added ?? 10} XP!`);
      }
    } catch (err) {
      setTriviaNotice(err instanceof Error ? err.message : 'Đáp án chính xác!');
    } finally {
      setTriviaBusy(false);
    }
  };

  // Combine self + active peers sorted by Y coordinate for natural 2.5D depth overlapping
  const renderActors = useMemo(() => {
    const selfActor: PeerPresence & { isSelf: boolean } = {
      id: selfId,
      alias: student.name,
      level: progress.level,
      rankTitle: myRank.title,
      avatarConfig: student.avatarConfig,
      x: pos.x,
      y: pos.y,
      facing: pos.facing,
      isGuest: student.isGuest,
      updatedAt: Date.now(),
      isSelf: true
    };
    const list: (PeerPresence & { isSelf: boolean })[] = [
      selfActor,
      ...Object.values(peers).map((p) => ({ ...p, isSelf: false }))
    ];
    return list.sort((a, b) => a.y - b.y);
  }, [myRank.title, peers, pos.facing, pos.x, pos.y, progress.level, selfId, student.avatarConfig, student.isGuest, student.name]);

  const onlineInCity = Math.max(
    1 + Object.keys(peers).length,
    cityOnlineCounts[currentDestKey] ?? 0
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 pb-8 space-y-4">
      {/* Top Action & Status Bar */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {currentCity.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {onlineInCity} bạn đang ở đây
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentCity.region} · {currentCity.distanceKm === 0 ? 'Trung tâm Hà Nội Km 0' : `Cách Hà Nội ${currentCity.distanceKm.toLocaleString('vi-VN')} km`} · Chạm vào sân để di chuyển nhân vật!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundManager.play('click');
              onOpenLevel();
            }}
            className="px-3 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Cấp {progress.level} · {progress.percent}%</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.play('click');
              onNavigateToShop();
            }}
            className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Đổi Đồ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.play('click');
              onOpenTravel();
            }}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
          >
            <Plane className="w-4 h-4" />
            <span>Du Hành Xuyên Việt</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2.5D Interactive World Stage + Safe Chat Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 2.5D Schoolyard / Destination Plaza */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div
            ref={stageRef}
            onClick={handleStageClick}
            className="relative w-full h-[380px] sm:h-[460px] lg:h-[510px] rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg select-none cursor-crosshair bg-sky-200"
          >
            {/* 3D Isometric City Landmark Backdrop */}
            <City3DLandmark destKey={currentCity.destKey} mode="stage" className="pointer-events-none" />

            {/* Subtle perspective courtyard pavement tint in lower walkable zone */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-[52%] bottom-0 bg-gradient-to-b from-transparent via-black/5 to-black/20"
            />

            {/* Top-left Fun Fact Badge */}
            <div className="pointer-events-none absolute top-3 left-3 max-w-[75%] sm:max-w-md px-3 py-1.5 rounded-2xl bg-slate-950/70 backdrop-blur-xs text-white text-[11px] font-semibold shadow-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{currentCity.funFact}</span>
            </div>

            {/* Incoming Toast Notification */}
            {toastMsg && (
              <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 z-40 px-4 py-1.5 rounded-full bg-slate-950/90 text-amber-300 text-xs font-extrabold shadow-lg border border-amber-400/40 whitespace-nowrap">
                {toastMsg}
              </div>
            )}

            {/* Ground Click Ripple */}
            {clickRipple && (
              <div
                key={clickRipple.key}
                style={{ left: `${clickRipple.x}%`, top: `${clickRipple.y}%` }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-10 h-5 rounded-full border-2 border-amber-300 bg-amber-300/20 animate-ping"
              />
            )}

            {/* NPC Vui-Bot Kiosk (Stationary Interactive Guide) */}
            <button
              type="button"
              data-interactive="true"
              onClick={(e) => {
                e.stopPropagation();
                soundManager.play('click');
                setTriviaPicked(null);
                setTriviaStatus('idle');
                setTriviaNotice('');
                setIsTriviaOpen(true);
              }}
              style={{ left: '89%', top: '65%', zIndex: 650 }}
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer focus:outline-none"
              title="Trò chuyện với Hướng Dẫn Viên Vui-Bot để đố vui nhận Xu"
            >
              <span
                className={`mb-1 px-2 py-0.5 rounded-full text-[10px] font-black shadow-md whitespace-nowrap flex items-center gap-1 border ${
                  hubState?.trivia_claimed_today
                    ? 'bg-white/95 text-slate-700 border-slate-300'
                    : 'bg-amber-400 text-slate-950 border-white animate-bounce'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
                {hubState?.trivia_claimed_today ? 'Vui-Bot HDV' : 'Đố Vui +3 Xu!'}
              </span>
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 border-2 border-white shadow-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7" />
              </div>
              <div className="w-11 h-3 bg-slate-950/30 rounded-full blur-[2px] -mt-1" />
              <span className="mt-0.5 px-2 py-0.5 rounded-full bg-indigo-950/85 text-white text-[10px] font-bold whitespace-nowrap">
                🤖 Vui-Bot
              </span>
            </button>

            {/* Real Online Characters + Self (Sorted by Y depth) */}
            {renderActors.map((actor) => {
              const bubble = bubbles[actor.id];
              return (
                <div
                  key={actor.id}
                  data-interactive={actor.isSelf ? undefined : 'true'}
                  onClick={(e) => {
                    if (actor.isSelf) return;
                    e.stopPropagation();
                    soundManager.play('click');
                    setSelectedPeer(actor);
                  }}
                  style={{
                    left: `${actor.x}%`,
                    top: `${actor.y}%`,
                    zIndex: Math.round(actor.y * 10),
                    transition: 'left 0.48s linear, top 0.48s linear'
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-full flex flex-col items-center ${
                    actor.isSelf ? 'pointer-events-none' : 'cursor-pointer group'
                  }`}
                >
                  {/* Speech / Emote Bubble */}
                  {bubble && (
                    <div
                      className={`mb-1 max-w-[160px] text-center shadow-lg ${
                        bubble.kind === 'emote'
                          ? 'px-2.5 py-1 rounded-2xl bg-white/95 text-2xl animate-bounce border border-amber-300'
                          : 'px-2.5 py-1.5 rounded-2xl bg-white text-slate-900 text-[11px] font-bold leading-snug border border-slate-200 break-words'
                      }`}
                    >
                      {bubble.kind === 'emote' ? bubble.symbol || bubble.text : bubble.text}
                    </div>
                  )}

                  {/* Character Avatar */}
                  <div
                    className={`relative origin-bottom transition-transform ${
                      actor.isSelf && isWalking ? 'scale-[0.72] sm:scale-[0.82] -translate-y-1' : 'scale-[0.68] sm:scale-[0.78]'
                    } ${!actor.isSelf ? 'group-hover:scale-[0.75] sm:group-hover:scale-[0.85]' : ''}`}
                    style={{
                      transform: `scaleX(${actor.facing})`
                    }}
                  >
                    <AvatarRenderer
                      config={actor.avatarConfig}
                      size="sm"
                      animated={true}
                      isReacting={Boolean(bubble)}
                    />
                  </div>

                  {/* Ground shadow */}
                  <div className="w-12 h-3 bg-slate-950/30 rounded-full blur-[2px] -mt-4 pointer-events-none" />

                  {/* Name & Level Plate */}
                  <div
                    className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold whitespace-nowrap shadow-sm border ${
                      actor.isSelf
                        ? 'bg-emerald-600/95 text-white border-emerald-200'
                        : 'bg-slate-950/80 text-white border-white/25'
                    }`}
                  >
                    {actor.isSelf ? `${actor.alias} (Bạn)` : actor.alias} · Cấp {actor.level}
                  </div>
                </div>
              );
            })}

            {/* Touch / On-screen Compact D-Pad for Mobile & Quick Stepping */}
            <div
              data-interactive="true"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 left-3 z-30 grid grid-cols-3 gap-1 w-28 sm:w-32 opacity-85 hover:opacity-100"
              aria-label="Phím điều hướng nhân vật"
            >
              <div />
              <button
                type="button"
                onClick={() => moveSelfTo(pos.x, pos.y - 6)}
                className="h-9 rounded-xl bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-white/25 cursor-pointer active:scale-90"
                aria-label="Đi lên"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <div />
              <button
                type="button"
                onClick={() => moveSelfTo(pos.x - 6, pos.y)}
                className="h-9 rounded-xl bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-white/25 cursor-pointer active:scale-90"
                aria-label="Sang trái"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveSelfTo(pos.x, pos.y + 6)}
                className="h-9 rounded-xl bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-white/25 cursor-pointer active:scale-90"
                aria-label="Đi xuống"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveSelfTo(pos.x + 6, pos.y)}
                className="h-9 rounded-xl bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-white/25 cursor-pointer active:scale-90"
                aria-label="Sang phải"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom-right Quick Emote Strip on Stage */}
            <div
              data-interactive="true"
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 right-3 z-30 flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-slate-950/75 backdrop-blur-xs border border-white/20"
            >
              {EMOTE_STICKERS.slice(0, 4).map((em) => (
                <button
                  key={em.id}
                  type="button"
                  disabled={sending}
                  onClick={() => void handleSendMessage('emote', `${em.symbol} ${em.label}`, em.symbol)}
                  className="w-8 h-8 rounded-xl hover:bg-white/20 flex items-center justify-center text-lg cursor-pointer transition-transform active:scale-90"
                  title={em.label}
                >
                  {em.symbol}
                </button>
              ))}
            </div>

            {/* Selected Peer Mini Profile Overlay */}
            {selectedPeer && (
              <div
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-3 right-3 z-40 w-64 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-3.5 shadow-2xl space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-11 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      <AvatarRenderer config={selectedPeer.avatarConfig} size="sm" showVehicle={false} showTech={false} showPet={false} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {selectedPeer.alias}
                      </div>
                      <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        Cấp {selectedPeer.level} · {getRankTier(selectedPeer.level).title}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPeer(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    aria-label="Đóng thẻ bạn bè"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => void handleWaveOrHeart(selectedPeer, 'wave')}
                    className="py-2 px-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/50 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>👋 Vẫy tay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleWaveOrHeart(selectedPeer, 'heart')}
                    className="py-2 px-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/50 hover:bg-rose-200 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" /> Thả tim
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundManager.play('click');
                    onNavigateToBlitz();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" /> Vào Đấu Trường 60s
                </button>
              </div>
            )}

            {/* NPC Vui-Bot Daily City Trivia Overlay */}
            {isTriviaOpen && (
              <div
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3"
              >
                <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          Đố Vui Địa Danh: {currentCity.shortName}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Trả lời đúng nhận +3 Xu & +10 XP mỗi ngày
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTriviaOpen(false)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                    {currentCity.trivia.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentCity.trivia.options.map((opt, idx) => {
                      const isCorrectOpt = idx === currentCity.trivia.correctIndex;
                      const isPicked = triviaPicked === idx;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={triviaStatus !== 'idle' || triviaBusy}
                          onClick={() => void handleAnswerTrivia(idx)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-colors cursor-pointer ${
                            triviaStatus === 'idle'
                              ? 'border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                              : isCorrectOpt
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200'
                              : isPicked
                              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200'
                              : 'border-slate-200 dark:border-slate-800 opacity-50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {triviaNotice && (
                    <div
                      className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                        triviaStatus === 'correct'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      <CoinIcon className="w-4 h-4 shrink-0" />
                      <span>{triviaNotice}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* City Passport Quick Tip Bar */}
          <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                Mẹo: Chạm sân hoặc phím <b>WASD / Mũi tên</b> để đi dạo. Xe VIP/Thần Thoại giảm tới <b>30% giá vé Du Hành</b>!
              </span>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              Đã đi: {(hubState?.total_km ?? 0).toLocaleString('vi-VN')} km
            </span>
          </div>
        </div>

        {/* Dual-Mode Safe Chat Dock */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col justify-between gap-3 h-[460px] lg:h-[556px]">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Trò Chuyện Sảnh
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3 h-3" /> Lọc An Toàn
            </span>
          </div>

          {/* Message Feed */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            <div className="p-2.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-[11px] leading-relaxed">
              Chào mừng đến <b>{currentCity.shortName}</b>! Hãy trò chuyện lịch sự, không chia sẻ SĐT hay liên kết lạ nhé.
            </div>

            {loadingMsgs && (
              <div className="flex items-center gap-2 text-slate-400 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tải tin nhắn...
              </div>
            )}

            {messages.map((m) => {
              const isMine = m.student_id === student.id;
              return (
                <div
                  key={m.id}
                  className={`group p-2.5 rounded-2xl border ${
                    isMine
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/70'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-black text-slate-900 dark:text-white truncate">
                        {m.sender_alias}
                      </span>
                      <span className="px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-200">
                        Cấp {m.sender_level}
                      </span>
                    </div>
                    {!isMine && !reportedIds[m.id] && (
                      <button
                        type="button"
                        onClick={() => void handleReportMessage(m.id)}
                        className="opacity-60 hover:opacity-100 text-rose-500 p-0.5 cursor-pointer"
                        title="Báo cáo tin nhắn không phù hợp"
                        aria-label="Báo cáo tin nhắn"
                      >
                        <Flag className="w-3 h-3" />
                      </button>
                    )}
                    {reportedIds[m.id] && (
                      <span className="text-[10px] text-rose-500 font-bold">Đã báo cáo</span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 break-words leading-snug">
                    {m.body}
                  </p>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Mode Tabs & Controls */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setChatTab('quick');
                  setChatError('');
                }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                  chatTab === 'quick'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <Smile className="w-3.5 h-3.5" /> Chat Nhanh
              </button>
              <button
                type="button"
                onClick={() => {
                  setChatTab('free');
                  setChatError('');
                }}
                className={`py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                  chatTab === 'free'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" /> Gõ Tự Do
              </button>
            </div>

            {chatError && (
              <div className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[11px] font-semibold">
                {chatError}
              </div>
            )}

            {chatTab === 'quick' ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {EMOTE_STICKERS.map((em) => (
                    <button
                      key={em.id}
                      type="button"
                      disabled={sending}
                      onClick={() => void handleSendMessage('emote', `${em.symbol} ${em.label}`, em.symbol)}
                      className="px-2 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>{em.symbol}</span>
                      <span className="text-[10px] text-amber-900 dark:text-amber-200">{em.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CHAT_PRESETS.map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      disabled={sending}
                      onClick={() => void handleSendMessage('quick', q.text)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200 cursor-pointer active:scale-95"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : student.isGuest ? (
              <button
                type="button"
                onClick={onRequireLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black cursor-pointer"
              >
                Đăng nhập 10 giây để mở khóa Chat Tự Do
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSendMessage('text', draftText);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  maxLength={90}
                  placeholder="Nhắn thân thiện (chặn SĐT & link)..."
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={sending || !draftText.trim()}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                  aria-label="Gửi tin nhắn"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
