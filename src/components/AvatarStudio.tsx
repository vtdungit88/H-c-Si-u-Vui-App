import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { StudentProfile, AvatarConfig, ShopItem, ItemCategory } from '../types';
import { SHOP_ITEMS, HAIR_STYLES, HAIR_COLORS, SKIN_TONES, EYE_EXPRESSIONS } from '../data/items';
import { AvatarRenderer } from './AvatarRenderer';
import { soundManager } from '../utils/audio';
import { updateActiveStudent } from '../utils/studentStorage';
import { 
  Sparkles, 
  Coins, 
  Star, 
  Check, 
  Lock, 
  ShoppingBag, 
  Palette, 
  Shirt, 
  PenTool, 
  Smartphone, 
  Bike, 
  Laptop, 
  Heart,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface AvatarStudioProps {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onNavigateToStudy: () => void;
  onRequireLogin?: () => void;
}

export const AvatarStudio: React.FC<AvatarStudioProps> = ({
  student,
  onUpdateStudent,
  onNavigateToStudy,
  onRequireLogin
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | ItemCategory>('appearance');
  const [selectedSubCategory, setSelectedSubCategory] = useState<'gender' | 'skin' | 'hair' | 'eyes'>('hair');

  // Trigger confetti burst on unlocking luxury items
  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Update appearance (skin, hair, eye expression, gender)
  const handleUpdateAppearance = (partial: Partial<AvatarConfig>) => {
    if (student.isGuest) {
      soundManager.play('wrong');
      onRequireLogin?.();
      return;
    }
    soundManager.play('click');
    const updated = updateActiveStudent((prev) => ({
      ...prev,
      avatarConfig: {
        ...prev.avatarConfig,
        ...partial
      }
    }));
    onUpdateStudent(updated);
  };

  // Equip already owned item
  const handleEquipItem = (item: ShopItem) => {
    if (student.isGuest) {
      soundManager.play('wrong');
      onRequireLogin?.();
      return;
    }
    soundManager.play('equip');
    const updated = updateActiveStudent((prev) => ({
      ...prev,
      avatarConfig: {
        ...prev.avatarConfig,
        [`${item.category}Id`]: item.id
      },
      equippedItems: {
        ...prev.equippedItems,
        [item.category]: item.id
      }
    }));
    onUpdateStudent(updated);
  };

  // Buy and equip new item
  const handleBuyItem = (item: ShopItem) => {
    if (student.isGuest) {
      soundManager.play('wrong');
      onRequireLogin?.();
      return;
    }
    if (student.coins < item.costCoins || student.stars < item.costStars) {
      soundManager.play('wrong');
      return;
    }

    soundManager.play('unlock');
    fireConfetti();

    const updated = updateActiveStudent((prev) => ({
      ...prev,
      coins: prev.coins - item.costCoins,
      stars: prev.stars - item.costStars,
      unlockedItems: [...prev.unlockedItems, item.id],
      avatarConfig: {
        ...prev.avatarConfig,
        [`${item.category}Id`]: item.id
      },
      equippedItems: {
        ...prev.equippedItems,
        [item.category]: item.id
      }
    }));
    onUpdateStudent(updated);
  };

  // Filter items by category
  const currentCategoryItems = SHOP_ITEMS.filter((i) => i.category === activeTab);

  const getRarityBadge = (rarity: ShopItem['rarity']) => {
    switch (rarity) {
      case 'base':
        return <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Khởi Đầu</span>;
      case 'popular':
        return <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">Phổ Biến</span>;
      case 'vip':
        return <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">Xịn Sò (VIP)</span>;
      case 'mythic':
        return <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">Thần Thoại</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl text-white shadow-xl mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
              Studio Của Tôi
            </span>
            <span className="text-xs text-blue-200">
              • Tự Do Tùy Biến Nhân Vật & Phụ Kiện
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">
            Studio Của Tôi
          </h1>
          <p className="text-sm text-blue-100 mt-1 max-w-2xl">
            Tự do chọn kiểu tóc, kính cận, điện thoại xịn, xe đạp lướt gió, máy tính xách tay và thú cưng trợ thủ giải toán.
          </p>
        </div>

        {/* Currency Pill */}
        <div className="flex items-center gap-3 bg-black/25 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 self-stretch md:self-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 shadow">
              <Coins className="w-5 h-5 fill-slate-900" />
            </div>
            <div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Ví Tiền Xu</div>
              <div className="text-lg font-black font-mono text-amber-300">{student.coins}</div>
            </div>
          </div>

          <div className="h-8 w-px bg-white/20 mx-1" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 shadow">
              <Star className="w-5 h-5 fill-slate-900" />
            </div>
            <div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Sao Danh Dự</div>
              <div className="text-lg font-black font-mono text-yellow-300">{student.stars}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Avatar Live Preview (Sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Nhân Vật Của Bạn
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full">
                {student.name} • {student.grade}
              </span>
            </div>

            {/* Avatar Display Box */}
            <div className="relative py-6 flex items-center justify-center min-h-[300px] overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50/50 via-indigo-50/20 to-slate-50/80 dark:from-slate-800/50 dark:via-slate-850 dark:to-slate-900 my-3 border border-slate-100 dark:border-slate-800">
              <AvatarRenderer config={student.avatarConfig} size="lg" />
            </div>

            {/* Quick Equipped Items Summary */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-left">
                Đang Trang Bị Trên Người
              </div>
              <div className="grid grid-cols-3 gap-2 text-left">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="text-[10px] text-slate-400">Trang Phục</div>
                  <div className="font-bold truncate text-slate-800 dark:text-slate-200">
                    {SHOP_ITEMS.find((i) => i.id === student.avatarConfig.outfitId)?.name.split(' ')[0] || 'Áo trắng'}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="text-[10px] text-slate-400">Xe Cộ</div>
                  <div className="font-bold truncate text-slate-800 dark:text-slate-200">
                    {SHOP_ITEMS.find((i) => i.id === student.avatarConfig.vehicleId)?.name.split(' ')[0] || 'Dép tổ ong'}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="text-[10px] text-slate-400">Điện Thoại</div>
                  <div className="font-bold truncate text-slate-800 dark:text-slate-200">
                    {SHOP_ITEMS.find((i) => i.id === student.avatarConfig.phoneId)?.name.split(' ')[0] || 'Cục gạch'}
                  </div>
                </div>
              </div>
            </div>

            {/* Call to action to earn coins */}
            <div className="mt-4 p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-center justify-between text-left">
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Muốn sắm iPhone 16 hay Xe cào cào?
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-300">
                  Giải bài tập SGK Toán 6 nhận tới 150 xu và 3 sao mỗi bài!
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.play('click');
                  onNavigateToStudy();
                }}
                className="shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 transition-colors"
              >
                <span>Học Ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Wardrobe Tabs & Shop Catalog */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Tabs Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                soundManager.play('click');
                setActiveTab('appearance');
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'appearance'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Diện Mạo</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('click');
                setActiveTab('outfit');
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'outfit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Trang Phục</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('click');
                setActiveTab('handheld');
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'handheld'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Đồ Cầm Tay</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('click');
                setActiveTab('phone');
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'phone'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Điện Thoại</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('click');
                setActiveTab('vehicle');
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'vehicle'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Xe Cộ</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('click');
                setActiveTab('tech');
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'tech'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Laptop & Công Nghệ</span>
            </button>

            <button
              onClick={() => {
                soundManager.play('click');
                setActiveTab('pet');
              }}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'pet'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Thú Cưng</span>
            </button>
          </div>

          {/* TAB 1: APPEARANCE CUSTOMIZER */}
          {activeTab === 'appearance' ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Sub tabs for appearance */}
              <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <button
                  onClick={() => setSelectedSubCategory('hair')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedSubCategory === 'hair'
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Kiểu Tóc & Màu Tóc
                </button>
                <button
                  onClick={() => setSelectedSubCategory('eyes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedSubCategory === 'eyes'
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Mắt & Kính Cận
                </button>
                <button
                  onClick={() => setSelectedSubCategory('skin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedSubCategory === 'skin'
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Màu Làn Da
                </button>
                <button
                  onClick={() => setSelectedSubCategory('gender')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedSubCategory === 'gender'
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Giới Tính Nhân Vật
                </button>
              </div>

              {/* Sub-view: HAIR */}
              {selectedSubCategory === 'hair' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      1. Chọn Kiểu Tóc Học Sinh
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {HAIR_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => handleUpdateAppearance({ hairStyle: style.id })}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            student.avatarConfig.hairStyle === style.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
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
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      2. Chọn Màu Tóc Cá Tính
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {HAIR_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleUpdateAppearance({ hairColor: c.id })}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                            student.avatarConfig.hairColor === c.id
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 font-bold'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full border border-black/20 shadow-sm"
                            style={{ backgroundColor: c.id }}
                          />
                          <span className="text-xs text-slate-700 dark:text-slate-300">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-view: EYES */}
              {selectedSubCategory === 'eyes' && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Biểu Cảm Khuôn Mặt & Kính Cận Học Đường
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EYE_EXPRESSIONS.map((exp) => (
                      <button
                        key={exp.id}
                        onClick={() => handleUpdateAppearance({ eyeExpression: exp.id })}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          student.avatarConfig.eyeExpression === exp.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
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

              {/* Sub-view: SKIN */}
              {selectedSubCategory === 'skin' && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Tông Màu Da Học Sinh
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => handleUpdateAppearance({ skinColor: tone.id })}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                          student.avatarConfig.skinColor === tone.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 font-bold'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-full border border-black/20 shadow-sm"
                          style={{ backgroundColor: tone.id }}
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300">{tone.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-view: GENDER */}
              {selectedSubCategory === 'gender' && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Hình Mẫu Nhân Vật
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleUpdateAppearance({ gender: 'boy' })}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        student.avatarConfig.gender === 'boy'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 font-bold'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="text-3xl mb-1">👦</div>
                      <div className="text-xs text-slate-800 dark:text-slate-200">Học Sinh Nam</div>
                    </button>
                    <button
                      onClick={() => handleUpdateAppearance({ gender: 'girl' })}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        student.avatarConfig.gender === 'girl'
                          ? 'border-pink-600 bg-pink-50 dark:bg-pink-900/30 font-bold'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="text-3xl mb-1">👧</div>
                      <div className="text-xs text-slate-800 dark:text-slate-200">Học Sinh Nữ</div>
                    </button>
                    <button
                      onClick={() => handleUpdateAppearance({ gender: 'scholar' })}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        student.avatarConfig.gender === 'scholar'
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 font-bold'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="text-3xl mb-1">🧙‍♂️</div>
                      <div className="text-xs text-slate-800 dark:text-slate-200">Nhà Toán Học</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2..7: SHOP INVENTORY CARDS */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>
                  Danh mục: <strong>{currentCategoryItems.length} món đồ</strong> (Từ cơ bản đến thần thoại)
                </span>
                <span>Giá từ 0 xu → Hàng nghìn xu</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentCategoryItems.map((item) => {
                  const isUnlocked = student.unlockedItems.includes(item.id);
                  const isEquipped = student.avatarConfig[`${item.category}Id`] === item.id;
                  const canAfford = student.coins >= item.costCoins && student.stars >= item.costStars;

                  return (
                    <div
                      key={item.id}
                      className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isEquipped
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-sm'
                          : isUnlocked
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-95'
                      }`}
                    >
                      <div>
                        {/* Top row: Rarity badge & tag */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          {getRarityBadge(item.rarity)}
                          <span className="text-[11px] font-medium text-slate-400 italic">
                            {item.tagline}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                          {item.name}
                        </h4>

                        {/* Description */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom row: Pricing & Action Button */}
                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        {/* Price tag */}
                        <div>
                          {isUnlocked ? (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Đã sở hữu
                            </span>
                          ) : (
                            <div className="flex items-center gap-2 text-xs font-bold">
                              {item.costCoins > 0 ? (
                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                  <Coins className="w-3.5 h-3.5" /> {item.costCoins} xu
                                </span>
                              ) : (
                                <span className="text-emerald-600 font-bold">Miễn phí</span>
                              )}
                              {item.costStars > 0 && (
                                <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                                  <Star className="w-3.5 h-3.5 fill-yellow-400" /> {item.costStars} sao
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Button states */}
                        {isEquipped ? (
                          <button
                            disabled
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-default"
                          >
                            <Check className="w-3.5 h-3.5" /> Đang Dùng
                          </button>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => handleEquipItem(item)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                          >
                            Mặc Ngay
                          </button>
                        ) : canAfford ? (
                          <button
                            onClick={() => handleBuyItem(item)}
                            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1 transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Mở Khóa
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              soundManager.play('click');
                              onNavigateToStudy();
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-amber-600 font-semibold text-xs rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                            title="Chưa đủ xu hoặc sao - bấm để làm bài tập SGK kiếm thêm!"
                          >
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Kiếm Xu</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
