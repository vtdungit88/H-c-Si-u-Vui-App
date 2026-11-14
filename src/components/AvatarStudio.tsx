import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StudentProfile, AvatarConfig, ShopItem, ItemCategory, ItemRarity } from '../types';
import {
  SHOP_ITEMS,
  STUDIO_SETS,
  HAIR_STYLES,
  HAIR_COLORS,
  SKIN_TONES,
  EYE_EXPRESSIONS
} from '../data/items';
import { AvatarRenderer } from './AvatarRenderer';
import { StudioStageBackdrop } from './StudioStageBackdrop';
import { StudioItemThumbnail } from './StudioItemThumbnail';
import { CoinIcon, StarIcon } from './GameIcons';
import { soundManager } from '../utils/audio';
import { updateActiveStudent } from '../utils/studentStorage';
import { buyItem, saveAvatar, fetchShopCatalog } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  Sparkles,
  Check,
  Lock,
  Palette,
  Shirt,
  PenTool,
  Smartphone,
  Bike,
  Laptop,
  Heart,
  ChevronRight,
  Image,
  Sun,
  Layers,
  Eye,
  X,
  Trophy,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface AvatarStudioProps {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onNavigateToStudy: () => void;
  onRequireLogin?: () => void;
}

type StudioTab = 'appearance' | 'sets' | ItemCategory;

const CATEGORY_TABS: { id: StudioTab; label: string; icon: React.ReactNode }[] = [
  { id: 'appearance', label: 'Diện Mạo', icon: <Palette className="w-4 h-4" /> },
  { id: 'outfit', label: 'Trang Phục', icon: <Shirt className="w-4 h-4" /> },
  { id: 'handheld', label: 'Cầm Tay', icon: <PenTool className="w-4 h-4" /> },
  { id: 'vehicle', label: 'Xe Cộ', icon: <Bike className="w-4 h-4" /> },
  { id: 'pet', label: 'Thú Cưng', icon: <Heart className="w-4 h-4" /> },
  { id: 'phone', label: 'Điện Thoại', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'tech', label: 'Công Nghệ', icon: <Laptop className="w-4 h-4" /> },
  { id: 'backdrop', label: 'Phông Nền', icon: <Image className="w-4 h-4" /> },
  { id: 'aura', label: 'Hào Quang', icon: <Sun className="w-4 h-4" /> },
  { id: 'sets', label: 'Bộ Sưu Tập', icon: <Layers className="w-4 h-4" /> }
];

const RARITY_LABEL: Record<ItemRarity, { text: string; colorClass: string; stripClass: string }> = {
  base: {
    text: 'Khởi Đầu',
    colorClass: 'text-slate-500 dark:text-slate-400',
    stripClass: 'bg-slate-300 dark:bg-slate-700'
  },
  popular: {
    text: 'Phổ Biến',
    colorClass: 'text-blue-600 dark:text-blue-400',
    stripClass: 'bg-blue-500'
  },
  vip: {
    text: 'Xịn Sò VIP',
    colorClass: 'text-amber-600 dark:text-amber-400',
    stripClass: 'bg-amber-500'
  },
  mythic: {
    text: 'Thần Thoại',
    colorClass: 'text-violet-600 dark:text-violet-400',
    stripClass: 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500'
  }
};

const TAP_QUOTES = [
  'Sẵn sàng chinh phục mọi bài học SGK!',
  'Hôm nay mình thử phối bộ đồ mới nhé!',
  'Làm thêm bài Đấu Trường để mở khóa thêm phụ kiện nha!',
  'Phong độ là nhất thời, kiến thức là mãi mãi!'
];

export const AvatarStudio: React.FC<AvatarStudioProps> = ({
  student,
  onUpdateStudent,
  onNavigateToStudy,
  onRequireLogin
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('outfit');
  const [selectedSubCategory, setSelectedSubCategory] = useState<'hair' | 'eyes' | 'skin' | 'gender'>('hair');
  const [rarityFilter, setRarityFilter] = useState<'all' | 'owned' | ItemRarity>('all');

  // Hydrated catalog synced with live Supabase shop_items pricing
  const [catalogItems, setCatalogItems] = useState<ShopItem[]>(SHOP_ITEMS);
  const [serverKeys, setServerKeys] = useState<Set<string> | null>(null);

  // Try-on preview state (lets users preview locked items live on the stage)
  const [previewItem, setPreviewItem] = useState<ShopItem | null>(null);

  // Interactive tap reaction state
  const [isReacting, setIsReacting] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  // Unboxing reveal modal after unlocking a new item
  const [unlockedRevealItem, setUnlockedRevealItem] = useState<ShopItem | null>(null);

  // Server sync feedback & lock
  const [notice, setNotice] = useState('');
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 3500);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    fetchShopCatalog()
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        const map = new Map(rows.map((r) => [r.item_key, r] as const));
        setServerKeys(new Set(map.keys()));
        setCatalogItems(
          SHOP_ITEMS.map((item) => {
            const srv = map.get(item.id);
            if (!srv) return item;
            return {
              ...item,
              name: srv.name || item.name,
              description: srv.description || item.description,
              costCoins: Number(srv.price_coins ?? item.costCoins),
              costStars: Number(srv.required_stars ?? item.costStars)
            };
          })
        );
      })
      .catch(() => {
        // Fallback gracefully to bundled catalog if offline
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fireConfetti = () => {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.58 }
    });
  };

  const triggerCharacterReaction = () => {
    soundManager.play('coin');
    setIsReacting(false);
    requestAnimationFrame(() => setIsReacting(true));
    const randomLine = TAP_QUOTES[Math.floor(Math.random() * TAP_QUOTES.length)];
    setSpeechBubble(randomLine);
    window.setTimeout(() => setIsReacting(false), 480);
  };

  const requireLogin = () => {
    soundManager.play('wrong');
    onRequireLogin?.();
  };

  /** Apply a new look locally (instant), then persist on Supabase; roll back on server refusal. */
  const commitLook = async (next: AvatarConfig, extra?: Partial<StudentProfile>) => {
    const previous = student;
    const optimistic = updateActiveStudent((prev) => ({
      ...prev,
      ...extra,
      avatarConfig: next,
      equippedItems: {
        outfit: next.outfitId,
        handheld: next.handheldId,
        phone: next.phoneId,
        vehicle: next.vehicleId,
        tech: next.techId,
        pet: next.petId,
        backdrop: next.backdropId || 'bg_classroom',
        aura: next.auraId || 'aura_none'
      }
    }));
    onUpdateStudent(optimistic);

    if (!isSupabaseConfigured || student.isGuest) return;
    try {
      await saveAvatar(next);
    } catch (e) {
      const reverted = updateActiveStudent(() => previous);
      onUpdateStudent(reverted);
      flash('Chưa lưu được lên máy chủ, hãy thử lại nhé.');
      console.error(e);
    }
  };

  // Update appearance (skin, hair, eye expression, gender)
  const handleUpdateAppearance = (partial: Partial<AvatarConfig>) => {
    if (student.isGuest) return requireLogin();
    soundManager.play('click');
    void commitLook({ ...student.avatarConfig, ...partial });
  };

  // Equip already owned item
  const handleEquipItem = (item: ShopItem) => {
    if (student.isGuest) return requireLogin();
    soundManager.play('equip');
    setPreviewItem(null);
    setIsReacting(false);
    requestAnimationFrame(() => setIsReacting(true));
    window.setTimeout(() => setIsReacting(false), 480);

    void commitLook({
      ...student.avatarConfig,
      [`${item.category}Id`]: item.id
    } as AvatarConfig);
  };

  // Buy (server deducts coins via RPC buy_item) and equip
  const handleBuyItem = async (item: ShopItem) => {
    if (student.isGuest) return requireLogin();
    if (busyItemId) return;
    if (student.coins < item.costCoins || student.stars < item.costStars) {
      soundManager.play('wrong');
      flash('Bạn chưa đủ xu hoặc sao để mở khóa món này.');
      return;
    }

    if (isSupabaseConfigured && serverKeys && !serverKeys.has(item.id)) {
      soundManager.play('wrong');
      flash('Vật phẩm mới đang chờ đồng bộ máy chủ, hãy thử lại sau ít phút nhé.');
      return;
    }

    setBusyItemId(item.id);
    try {
      let nextCoins = student.coins - item.costCoins;
      if (isSupabaseConfigured) {
        const res = await buyItem(item.id);
        nextCoins = Number(res.coins);
      }

      soundManager.play('unlock');
      fireConfetti();
      setPreviewItem(null);
      setUnlockedRevealItem(item);

      await commitLook(
        {
          ...student.avatarConfig,
          [`${item.category}Id`]: item.id
        } as AvatarConfig,
        {
          coins: nextCoins,
          unlockedItems: Array.from(new Set([...student.unlockedItems, item.id]))
        }
      );
    } catch (e) {
      soundManager.play('wrong');
      flash(e instanceof Error ? e.message : 'Không mua được món này.');
    } finally {
      setBusyItemId(null);
    }
  };

  // Effective AvatarConfig combining equipped items + active try-on preview
  const effectiveConfig: AvatarConfig = useMemo(() => {
    if (!previewItem) return student.avatarConfig;
    return {
      ...student.avatarConfig,
      [`${previewItem.category}Id`]: previewItem.id
    };
  }, [student.avatarConfig, previewItem]);

  // Filtered items for the current category tab
  const currentCategoryItems = useMemo(() => {
    if (activeTab === 'appearance' || activeTab === 'sets') return [];
    return catalogItems.filter((item) => {
      if (item.category !== activeTab) return false;
      if (rarityFilter === 'owned') return student.unlockedItems.includes(item.id);
      if (rarityFilter !== 'all') return item.rarity === rarityFilter;
      return true;
    });
  }, [activeTab, rarityFilter, catalogItems, student.unlockedItems]);

  const ownedTotalCount = useMemo(
    () => catalogItems.filter((i) => student.unlockedItems.includes(i.id)).length,
    [catalogItems, student.unlockedItems]
  );

  const completedSets = useMemo(
    () =>
      STUDIO_SETS.filter((set) =>
        set.itemIds.every((id) => student.unlockedItems.includes(id))
      ),
    [student.unlockedItems]
  );

  const activeStageBackdropName =
    catalogItems.find((i) => i.id === (effectiveConfig.backdropId || 'bg_classroom'))?.name ||
    'Lớp Học Nắng Mai';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {notice && (
        <div
          role="alert"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-rose-600 text-white text-sm font-bold shadow-xl"
        >
          {notice}
        </div>
      )}

      {/* Top Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-slate-900 dark:bg-slate-900 rounded-3xl text-white border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-300 font-semibold">
            <span>Studio Nhân Vật</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              Đã sưu tầm {ownedTotalCount}/{catalogItems.length} vật phẩm
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
            Phòng Hóa Trang & Trang Bị Tri Thức
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Tự do phối đồ, chọn phông nền, hào quang và thú cưng đồng hành. Bấm vào món chưa mở để mặc thử ngay trên sân khấu!
          </p>
        </div>

        {/* Currency Counter */}
        <div className="flex items-center gap-4 bg-slate-800/90 px-5 py-3 rounded-2xl border border-slate-700 self-stretch md:self-auto justify-between md:justify-start shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <CoinIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Ví Tiền Xu</div>
              <div className="text-lg font-black font-mono tabular-nums text-amber-300">
                {student.coins}
              </div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-700" />

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center">
              <StarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Sao Danh Dự</div>
              <div className="text-lg font-black font-mono tabular-nums text-yellow-300">
                {student.stars}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Dressing Room */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Interactive Game Stage */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Stage Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {student.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>{student.isGuest ? 'Khách ghé thăm' : `Cấp ${student.level}`}</span>
                  {completedSets.length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {completedSets[0].titleReward}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                {activeStageBackdropName}
              </span>
            </div>

            {/* Illustrated Game Stage */}
            <div className="relative mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 min-h-[340px] flex flex-col items-center justify-center">
              <StudioStageBackdrop backdropId={effectiveConfig.backdropId} />

              {/* Speech bubble on character tap */}
              {speechBubble && (
                <div className="relative z-20 mx-4 mt-3 px-3.5 py-2 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 max-w-xs text-center">
                  {speechBubble}
                </div>
              )}

              <div className="relative z-10 py-3">
                <AvatarRenderer
                  config={effectiveConfig}
                  size="lg"
                  animated={true}
                  showAura={true}
                  isReacting={isReacting}
                  onTap={triggerCharacterReaction}
                />
              </div>

              <div className="relative z-10 pb-2 text-[11px] font-medium text-slate-700/85 dark:text-slate-200/95 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xs px-3 py-1 rounded-full mb-2">
                Chạm vào nhân vật để tương tác
              </div>
            </div>

            {/* Active Try-On Bar */}
            {previewItem && (
              <div className="mt-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-blue-900 dark:text-blue-200 truncate">
                    Đang mặc thử: {previewItem.name}
                  </div>
                  <div className="text-[11px] text-blue-700 dark:text-blue-300 tabular-nums">
                    Giá mở khóa: {previewItem.costCoins} xu
                    {previewItem.costStars > 0 ? ` · cần ${previewItem.costStars} sao` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {student.coins >= previewItem.costCoins &&
                    student.stars >= previewItem.costStars && (
                      <button
                        disabled={Boolean(busyItemId)}
                        onClick={() => void handleBuyItem(previewItem)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl whitespace-nowrap cursor-pointer transition-colors disabled:opacity-60"
                      >
                        Mở Khóa
                      </button>
                    )}
                  <button
                    onClick={() => {
                      soundManager.play('click');
                      setPreviewItem(null);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg cursor-pointer"
                    title="Hủy mặc thử"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Equipped Slots */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
              {[
                { label: 'Trang Phục', id: effectiveConfig.outfitId },
                { label: 'Xe Cộ', id: effectiveConfig.vehicleId },
                { label: 'Thú Cưng', id: effectiveConfig.petId },
                { label: 'Hào Quang', id: effectiveConfig.auraId || 'aura_none' }
              ].map((slot) => {
                const found = catalogItems.find((i) => i.id === slot.id);
                return (
                  <div
                    key={slot.label}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80"
                  >
                    <div className="text-[10px] text-slate-400 font-medium">{slot.label}</div>
                    <div className="text-xs font-bold truncate text-slate-800 dark:text-slate-200 mt-0.5">
                      {found?.name || 'Mặc định'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Earn Coins CTA */}
            <div className="mt-4 p-3.5 bg-amber-50 dark:bg-amber-950/35 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-amber-950 dark:text-amber-200">
                  Cần thêm Xu và Sao Danh Dự?
                </div>
                <div className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                  Làm bài tập SGK (tới 3 xu/bài) hoặc thi đấu tại Đấu Trường để mở khóa trang bị mới.
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.play('click');
                  onNavigateToStudy();
                }}
                className="shrink-0 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 whitespace-nowrap cursor-pointer transition-colors"
              >
                <span>Học Ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Category Navigation + Shop Grid */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Tabs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundManager.play('click');
                    setActiveTab(tab.id);
                    setRarityFilter('all');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                {[
                  { id: 'hair' as const, label: 'Kiểu & Màu Tóc' },
                  { id: 'eyes' as const, label: 'Mắt & Kính' },
                  { id: 'skin' as const, label: 'Làn Da' },
                  { id: 'gender' as const, label: 'Hình Mẫu' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategory(sub.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      selectedSubCategory === sub.id
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {selectedSubCategory === 'hair' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                      Chọn Kiểu Tóc Học Sinh
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {HAIR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => handleUpdateAppearance({ hairStyle: style.id })}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            student.avatarConfig.hairStyle === style.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="text-xs">{style.name}</div>
                          {student.avatarConfig.hairStyle === style.id && (
                            <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 mt-1">
                              <Check className="w-3 h-3" /> Đang chọn
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                      Chọn Màu Tóc Cá Tính
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {HAIR_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleUpdateAppearance({ hairColor: c.id })}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                            student.avatarConfig.hairColor === c.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 font-bold'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded-full border border-black/20"
                            style={{ backgroundColor: c.id }}
                          />
                          <span className="text-xs text-slate-700 dark:text-slate-300">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedSubCategory === 'eyes' && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                    Biểu Cảm Khuôn Mặt & Kính Cận Học Đường
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EYE_EXPRESSIONS.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => handleUpdateAppearance({ eyeExpression: exp.id })}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          student.avatarConfig.eyeExpression === exp.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-xs">{exp.name}</div>
                        {student.avatarConfig.eyeExpression === exp.id && (
                          <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 mt-1">
                            <Check className="w-3 h-3" /> Đang dùng
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubCategory === 'skin' && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                    Tông Màu Da Nhân Vật
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => handleUpdateAppearance({ skinColor: tone.id })}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          student.avatarConfig.skinColor === tone.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 font-bold'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-black/20"
                          style={{ backgroundColor: tone.id }}
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300">{tone.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubCategory === 'gender' && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                    Hình Mẫu Nhân Vật
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'boy' as const, label: 'Học Sinh Nam', icon: '👦' },
                      { id: 'girl' as const, label: 'Học Sinh Nữ', icon: '👧' },
                      { id: 'scholar' as const, label: 'Nhà Thông Thái', icon: '🎓' }
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleUpdateAppearance({ gender: g.id })}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                          student.avatarConfig.gender === g.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 font-bold'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="text-3xl mb-1">{g.icon}</div>
                        <div className="text-xs text-slate-800 dark:text-slate-200">{g.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: STUDIO SETS COLLECTION */}
          {activeTab === 'sets' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
                Sưu tầm đủ các món cùng chủ đề để mở khóa danh hiệu vinh danh đặc biệt trên hồ sơ nhân vật.
              </div>

              {STUDIO_SETS.map((set) => {
                const setItems = set.itemIds
                  .map((id) => catalogItems.find((i) => i.id === id))
                  .filter((i): i is ShopItem => Boolean(i));
                const ownedInSet = setItems.filter((i) => student.unlockedItems.includes(i.id)).length;
                const isSetComplete = ownedInSet === setItems.length;

                return (
                  <div
                    key={set.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>Danh hiệu: {set.titleReward}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">
                            {ownedInSet}/{setItems.length} món
                          </span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                          {set.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {set.description}
                        </p>
                      </div>

                      {isSetComplete ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                          <Check className="w-4 h-4" /> Đã hoàn thành bộ
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const firstMissing = setItems.find(
                              (i) => !student.unlockedItems.includes(i.id)
                            );
                            if (firstMissing) {
                              soundManager.play('click');
                              setPreviewItem(firstMissing);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Mặc thử món thiếu
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {setItems.map((item) => {
                        const owned = student.unlockedItems.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              soundManager.play('click');
                              if (owned) {
                                handleEquipItem(item);
                              } else {
                                setPreviewItem(item);
                              }
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${
                              owned
                                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-85 hover:opacity-100'
                            }`}
                          >
                            <StudioItemThumbnail
                              renderType={item.renderType}
                              category={item.category}
                              rarity={item.rarity}
                              size="sm"
                            />
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-semibold tabular-nums">
                              {owned ? (
                                <span className="text-emerald-600 dark:text-emerald-400">Đã có</span>
                              ) : (
                                <span className="text-amber-600 dark:text-amber-400">
                                  {item.costCoins} xu
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: SHOP CATEGORY ITEMS */}
          {activeTab !== 'appearance' && activeTab !== 'sets' && (
            <div className="space-y-3">
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {(
                    [
                      { id: 'all', label: 'Tất cả' },
                      { id: 'owned', label: 'Đã có' },
                      { id: 'popular', label: 'Phổ biến' },
                      { id: 'vip', label: 'VIP' },
                      { id: 'mythic', label: 'Thần thoại' }
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        soundManager.play('click');
                        setRarityFilter(f.id);
                      }}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                        rarityFilter === f.id
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {currentCategoryItems.length} vật phẩm
                </span>
              </div>

              {currentCategoryItems.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
                  Chưa có vật phẩm nào ở bộ lọc này. Hãy chọn "Tất cả" để xem toàn bộ danh mục.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {currentCategoryItems.map((item) => {
                    const isUnlocked = student.unlockedItems.includes(item.id);
                    const equippedKey = `${item.category}Id` as keyof AvatarConfig;
                    const isEquipped = student.avatarConfig[equippedKey] === item.id;
                    const isPreviewing = previewItem?.id === item.id;
                    const canAfford =
                      student.coins >= item.costCoins && student.stars >= item.costStars;
                    const rarityMeta = RARITY_LABEL[item.rarity];
                    const isBuyingThis = busyItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`group relative overflow-hidden p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isEquipped
                            ? 'bg-blue-50/70 dark:bg-blue-950/35 border-blue-400 dark:border-blue-600 shadow-sm'
                            : isPreviewing
                            ? 'bg-amber-50/50 dark:bg-amber-950/25 border-amber-400 dark:border-amber-600'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Top rarity accent hairline */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${rarityMeta.stripClass}`} />

                        <div className="flex items-start gap-3.5 pt-1">
                          <StudioItemThumbnail
                            renderType={item.renderType}
                            category={item.category}
                            rarity={item.rarity}
                            size="md"
                          />

                          <div className="min-w-0 flex-1">
                            {/* Unboxed clean metadata line */}
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
                              <span className={rarityMeta.colorClass}>{rarityMeta.text}</span>
                              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                                ·
                              </span>
                              <span className="text-slate-500 dark:text-slate-400 truncate">
                                {item.tagline}
                              </span>
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug mt-0.5">
                              {item.name}
                            </h4>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Bottom row: Pricing & Actions */}
                        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <div className="tabular-nums">
                            {isUnlocked ? (
                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Đã sở hữu
                              </span>
                            ) : (
                              <div className="flex items-center gap-2.5 text-xs font-bold">
                                {item.costCoins > 0 ? (
                                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                    <CoinIcon className="w-3.5 h-3.5" /> {item.costCoins} xu
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 font-bold">Miễn phí</span>
                                )}
                                {item.costStars > 0 && (
                                  <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                                    <StarIcon className="w-3.5 h-3.5" /> cần {item.costStars} sao
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!isEquipped && !isUnlocked && (
                              <button
                                onClick={() => {
                                  soundManager.play('click');
                                  setPreviewItem(isPreviewing ? null : item);
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 whitespace-nowrap cursor-pointer border transition-colors ${
                                  isPreviewing
                                    ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-400 text-amber-800 dark:text-amber-200'
                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isPreviewing ? 'Đang thử' : 'Mặc thử'}</span>
                              </button>
                            )}

                            {isEquipped ? (
                              <button
                                disabled
                                className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 whitespace-nowrap cursor-default"
                              >
                                <Check className="w-3.5 h-3.5" /> Đang Dùng
                              </button>
                            ) : isUnlocked ? (
                              <button
                                onClick={() => handleEquipItem(item)}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl whitespace-nowrap cursor-pointer transition-colors"
                              >
                                Mặc Ngay
                              </button>
                            ) : canAfford ? (
                              <button
                                disabled={Boolean(busyItemId)}
                                onClick={() => void handleBuyItem(item)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 whitespace-nowrap cursor-pointer transition-colors disabled:opacity-60"
                              >
                                {isBuyingThis ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5" />
                                )}
                                <span>Mở Khóa</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  soundManager.play('click');
                                  onNavigateToStudy();
                                }}
                                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-600 font-semibold text-xs rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700 whitespace-nowrap cursor-pointer"
                                title="Chưa đủ xu hoặc sao - bấm để làm bài tập SGK kiếm thêm!"
                              >
                                <Lock className="w-3 h-3" />
                                <span>Kiếm Xu</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* UNBOXING REVEAL MODAL */}
      {unlockedRevealItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setUnlockedRevealItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-2xl text-center relative studio-chest-reveal"
          >
            <button
              onClick={() => setUnlockedRevealItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              Mở Khóa Thành Công · {RARITY_LABEL[unlockedRevealItem.rarity].text}
            </div>

            <div className="my-5 flex justify-center">
              <StudioItemThumbnail
                renderType={unlockedRevealItem.renderType}
                category={unlockedRevealItem.category}
                rarity={unlockedRevealItem.rarity}
                size="lg"
              />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {unlockedRevealItem.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5">
              {unlockedRevealItem.description}
            </p>

            <button
              onClick={() => setUnlockedRevealItem(null)}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md transition-colors cursor-pointer"
            >
              Tuyệt Vời · Đang Trang Bị
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
