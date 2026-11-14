import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';
import {
  DESTINATIONS,
  DestinationCity,
  getDiscountedTicketPrice,
  getVehicleDiscountPct
} from '../data/destinations';
import { SHOP_ITEMS } from '../data/items';
import { levelFromXp } from '../data/levels';
import { travelToDestination, type HubState } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { soundManager } from '../utils/audio';
import { City3DLandmark } from './City3DLandmark';
import { StudioItemThumbnail } from './StudioItemThumbnail';
import { CoinIcon } from './GameIcons';
import { Compass, Lock, MapPin, Navigation, Sparkles, X, Loader2, ArrowRight } from 'lucide-react';

interface VietnamTravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  hubState: HubState | null;
  currentDestKey: string;
  cityOnlineCounts: Record<string, number>;
  onTravelSuccess: (nextDestKey: string, nextCoins: number, nextXp: number, stamps: Record<string, number>, totalKm: number) => void;
  onRequireLogin: () => void;
}

export const VietnamTravelModal: React.FC<VietnamTravelModalProps> = ({
  isOpen,
  onClose,
  student,
  hubState,
  currentDestKey,
  cityOnlineCounts,
  onTravelSuccess,
  onRequireLogin
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(currentDestKey || 'hanoi_ho_guom');
  const [busy, setBusy] = useState(false);
  const [transitCity, setTransitCity] = useState<DestinationCity | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedCity = DESTINATIONS.find((d) => d.destKey === selectedKey) ?? DESTINATIONS[1];
  const studentLevel = levelFromXp(hubState?.xp ?? student.exp);
  const vehicleId = student.avatarConfig.vehicleId;
  const vehicleItem = SHOP_ITEMS.find((i) => i.id === vehicleId);
  const discountPct = getVehicleDiscountPct(vehicleId);
  const finalPrice = getDiscountedTicketPrice(selectedCity.ticketCoins, vehicleId);
  const stamps = hubState?.stamps ?? { hanoi_school: 1 };
  const isCurrentCity = selectedCity.destKey === currentDestKey;
  const meetsLevel = studentLevel >= selectedCity.requiredLevel;
  const canAfford = student.coins >= finalPrice;

  const handleDepart = async () => {
    setErrorMsg('');
    if (student.isGuest || !isSupabaseConfigured) {
      onRequireLogin();
      return;
    }
    if (isCurrentCity) return;
    if (!meetsLevel) {
      setErrorMsg(`Cần đạt Cấp ${selectedCity.requiredLevel} để mở đường đến ${selectedCity.shortName}!`);
      return;
    }
    if (!canAfford) {
      setErrorMsg(`Bạn cần ${finalPrice} Xu cho vé khứ hồi này (hiện có ${student.coins} Xu). Hãy làm bài tập để kiếm thêm Xu nhé!`);
      return;
    }

    setBusy(true);
    try {
      soundManager.play('travel');
      setTransitCity(selectedCity);
      const [res] = await Promise.all([
        travelToDestination(selectedCity.destKey),
        new Promise((resolve) => setTimeout(resolve, 1150))
      ]);
      confetti({ particleCount: 60, spread: 75, origin: { y: 0.6 } });
      onTravelSuccess(res.current_dest, res.coins, res.xp, res.stamps, res.total_km);
      setTransitCity(null);
      onClose();
    } catch (e) {
      setTransitCity(null);
      soundManager.play('wrong');
      setErrorMsg(e instanceof Error ? e.message : 'Không thể mua vé lúc này.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative space-y-5">
        {/* Round-trip Departure Animation Overlay */}
        {transitCity && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-gradient-to-br from-sky-600 via-indigo-700 to-violet-700 text-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-white/20 animate-in zoom-in-95">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white/15 flex items-center justify-center animate-bounce">
                {vehicleItem ? (
                  <StudioItemThumbnail item={vehicleItem} size={64} />
                ) : (
                  <Navigation className="w-10 h-10 text-amber-300" />
                )}
              </div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                Đang khởi hành từ Hà Nội Km 0
              </div>
              <h3 className="text-2xl font-black">Đang bay tới {transitCity.shortName}...</h3>
              <p className="text-xs text-sky-100">
                Quãng đường khứ hồi {(transitCity.distanceKm * 2).toLocaleString('vi-VN')} km · +5 XP Khám Phá!
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Bản Đồ Du Hành Xuyên Việt (Trung Tâm Hà Nội Km 0)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đi càng xa càng cần nhiều Xu & Cấp cao hơn · Xe VIP/Thần Thoại giảm 15%–30% vé khứ hồi!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-black text-amber-700 dark:text-amber-300 tabular-nums">
              <CoinIcon className="w-4 h-4" />
              {student.coins.toLocaleString('vi-VN')} Xu
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs font-black text-indigo-700 dark:text-indigo-300 tabular-nums">
              Cấp {studentLevel}
            </span>
            <button
              onClick={onClose}
              aria-label="Đóng bản đồ du hành"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two-column Map + 3D Landmark Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Stylized Distance-Ring Vietnam Corridor Map */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-sky-200 dark:border-slate-700 bg-gradient-to-b from-sky-100 via-cyan-50 to-emerald-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 min-h-[380px] sm:min-h-[430px] p-3">
            <div className="relative w-full h-full min-h-[360px]">
              {/* Stylized Vietnam Silhouette & Distance Rings from Hanoi (44.5%, 18%) */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                {/* Sea grid */}
                <circle cx="44.5" cy="18" r="18" fill="none" stroke="#38bdf8" strokeDasharray="1.5 1.5" strokeWidth="0.35" opacity="0.55" />
                <circle cx="44.5" cy="18" r="36" fill="none" stroke="#38bdf8" strokeDasharray="1.5 1.5" strokeWidth="0.35" opacity="0.45" />
                <circle cx="44.5" cy="18" r="56" fill="none" stroke="#38bdf8" strokeDasharray="1.5 1.5" strokeWidth="0.35" opacity="0.35" />
                <circle cx="44.5" cy="18" r="76" fill="none" stroke="#38bdf8" strokeDasharray="1.5 1.5" strokeWidth="0.35" opacity="0.28" />

                {/* Stylized S-shaped Vietnam Landmass */}
                <path
                  d="M28,6 L50,6 L63,16 L54,28 L50,38 L58,48 L67,62 L63,75 L49,85 L37,90 L33,83 L43,75 L49,64 L45,48 L39,34 L31,20 Z"
                  fill="#86efac"
                  fillOpacity="0.6"
                  stroke="#16a34a"
                  strokeWidth="0.7"
                />
                {/* Hoang Sa & Truong Sa archipelagos */}
                <circle cx="80" cy="46" r="1.4" fill="#16a34a" opacity="0.75" />
                <circle cx="83" cy="48" r="1.1" fill="#16a34a" opacity="0.75" />
                <circle cx="82" cy="72" r="1.4" fill="#16a34a" opacity="0.75" />
                <circle cx="86" cy="75" r="1.1" fill="#16a34a" opacity="0.75" />

                {/* Flight arc from Hanoi (44.5, 18) to selected city */}
                {selectedCity.destKey !== 'hanoi_school' && (
                  <path
                    d={`M 44.5 18 Q ${(44.5 + selectedCity.mapX) / 2 + 8} ${(18 + selectedCity.mapY) / 2 - 4} ${selectedCity.mapX} ${selectedCity.mapY}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.1"
                    strokeDasharray="2 1.4"
                  />
                )}
              </svg>

              {/* Clickable City Pins */}
              {DESTINATIONS.map((city) => {
                const isSelected = city.destKey === selectedCity.destKey;
                const isHere = city.destKey === currentDestKey;
                const lockedLvl = studentLevel < city.requiredLevel;
                const price = getDiscountedTicketPrice(city.ticketCoins, vehicleId);
                return (
                  <button
                    key={city.destKey}
                    type="button"
                    onClick={() => {
                      soundManager.play('click');
                      setSelectedKey(city.destKey);
                      setErrorMsg('');
                    }}
                    style={{ left: `${city.mapX}%`, top: `${city.mapY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform ${
                      isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                    }`}
                  >
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-md border flex items-center gap-1 whitespace-nowrap ${
                        isHere
                          ? 'bg-emerald-600 text-white border-white'
                          : isSelected
                          ? 'bg-amber-500 text-slate-950 border-white'
                          : lockedLvl
                          ? 'bg-slate-700 text-slate-200 border-slate-500'
                          : 'bg-white text-slate-900 border-slate-300'
                      }`}
                    >
                      <span>{city.shortName}</span>
                      {city.ticketCoins > 0 && (
                        <span className="opacity-80 tabular-nums">· {price}xu</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: 3D City Landmark Diorama & Round-trip Ticket */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/40">
              {/* 3D Isometric Preview */}
              <div className="relative h-52 sm:h-60 overflow-hidden border-b border-slate-200 dark:border-slate-700">
                <City3DLandmark destKey={selectedCity.destKey} mode="card" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/75 text-white text-[11px] font-bold backdrop-blur-xs">
                  {selectedCity.region} · Cách Hà Nội {selectedCity.distanceKm.toLocaleString('vi-VN')} km
                </div>
                {(cityOnlineCounts[selectedCity.destKey] ?? 0) > 0 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-emerald-600/90 text-white text-[11px] font-bold">
                    {cityOnlineCounts[selectedCity.destKey]} bạn đang ở đây
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedCity.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{selectedCity.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400 font-semibold">Vé khứ hồi</div>
                    <div className="text-sm font-black text-amber-600 dark:text-amber-400 tabular-nums mt-0.5">
                      {finalPrice === 0 ? 'Miễn phí' : `${finalPrice} Xu`}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400 font-semibold">Yêu cầu</div>
                    <div
                      className={`text-sm font-black tabular-nums mt-0.5 ${
                        meetsLevel ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                      }`}
                    >
                      Cấp {selectedCity.requiredLevel}+
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-400 font-semibold">Đã ghé thăm</div>
                    <div className="text-sm font-black text-blue-600 dark:text-blue-400 tabular-nums mt-0.5">
                      {stamps[selectedCity.destKey] ?? 0} lần
                    </div>
                  </div>
                </div>

                {discountPct > 0 && selectedCity.ticketCoins > 0 && (
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-200 dark:border-emerald-800 px-3 py-2 rounded-xl flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                      Đang trang bị <b>{vehicleItem?.name}</b>: Giảm {discountPct}% giá vé (từ {selectedCity.ticketCoins} Xu còn {finalPrice} Xu)!
                    </span>
                  </div>
                )}

                {errorMsg && (
                  <div className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-3 py-2 rounded-xl">
                    {errorMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  Vị trí hiện tại: <b>{DESTINATIONS.find((d) => d.destKey === currentDestKey)?.shortName ?? 'Hà Nội'}</b>
                </span>
              </div>

              {isCurrentCity ? (
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
                >
                  Đang ở Sảnh này
                </button>
              ) : !meetsLevel ? (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-sm flex items-center gap-1.5 cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" /> Cần Cấp {selectedCity.requiredLevel}
                </button>
              ) : (
                <button
                  disabled={busy || !canAfford}
                  onClick={() => void handleDepart()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>
                    {finalPrice === 0 ? 'Về Sân Trường Hà Nội (0 Xu)' : `Mua Vé Khứ Hồi (${finalPrice} Xu)`}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
