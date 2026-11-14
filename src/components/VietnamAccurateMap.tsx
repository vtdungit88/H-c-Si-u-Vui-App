import React, { useMemo, useState } from 'react';
import {
  DESTINATIONS,
  DestinationCity,
  MAP_BOUNDS,
  getDiscountedTicketPrice,
  projectVietnamLatLon
} from '../data/destinations';
import { soundManager } from '../utils/audio';
import { X } from 'lucide-react';

interface VietnamAccurateMapProps {
  selectedCity: DestinationCity;
  currentDestKey: string;
  studentLevel: number;
  vehicleId?: string;
  onSelectCity: (destKey: string) => void;
}

/**
 * 65-point geographically accurate mainland Vietnam coastline & border coordinates [lat, lon]
 * traced clockwise from Mong Cai -> Gulf of Tonkin -> Central Coast -> Ca Mau -> Western Border -> Lung Cu -> Mong Cai.
 */
const MAINLAND_LATLON: [number, number][] = [
  [21.53, 107.97], // Mong Cai
  [21.20, 107.48], // Van Don / Cam Pha
  [20.95, 107.06], // Ha Long
  [20.72, 106.79], // Hai Phong / Do Son
  [20.25, 106.56], // Cua Ba Lat (Thai Binh / Nam Dinh)
  [19.78, 105.92], // Sam Son (Thanh Hoa)
  [19.28, 105.75], // Nghi Son / Quynh Luu
  [18.80, 105.72], // Cua Lo / Vinh
  [18.30, 106.05], // Thien Cam
  [17.95, 106.46], // Deo Ngang / Vung Ang
  [17.47, 106.62], // Dong Hoi
  [16.95, 107.11], // Cua Tung
  [16.56, 107.63], // Thuan An (Hue)
  [16.18, 108.15], // Lang Co / Hai Van
  [16.12, 108.32], // Ban dao Son Tra (Da Nang)
  [15.88, 108.36], // Hoi An
  [15.42, 108.76], // Chu Lai / Dung Quat
  [14.88, 108.96], // Sa Huynh
  [14.20, 109.18], // Tam Quan
  [13.78, 109.25], // Quy Nhon
  [13.09, 109.32], // Tuy Hoa
  [12.65, 109.46], // Mui Doi (Cuc Dong dat lien)
  [12.24, 109.21], // Nha Trang
  [11.88, 109.21], // Cam Ranh
  [11.56, 109.02], // Phan Rang
  [11.18, 108.70], // Tuy Phong / Ca Na
  [10.92, 108.29], // Mui Ne
  [10.66, 107.78], // La Gi
  [10.34, 107.08], // Vung Tau
  [10.42, 106.92], // Can Gio
  [10.17, 106.72], // Ben Tre
  [9.65, 106.55],  // Tra Vinh
  [9.25, 105.95],  // Soc Trang
  [9.03, 105.42],  // Bac Lieu / Ganh Hao
  [8.60, 104.73],  // Mui Ca Mau (Cuc Nam dat lien)
  [9.02, 104.80],  // Song Doc
  [9.55, 104.86],  // An Bien
  [10.01, 105.08], // Rach Gia
  [10.38, 104.48], // Ha Tien
  [10.72, 105.11], // Chau Doc
  [10.95, 105.55], // Hong Ngu / Tan Chau
  [11.12, 105.85], // Moc Hoa
  [11.45, 105.92], // Tay Ninh
  [11.95, 106.58], // Loc Ninh (Binh Phuoc)
  [12.35, 107.35], // Dak Nong
  [12.88, 107.60], // Buon Don (Dak Lak)
  [13.80, 107.50], // Duc Co (Gia Lai)
  [14.68, 107.56], // Nga ba Dong Duong (Kon Tum)
  [15.42, 107.45], // Tay Giang
  [16.62, 106.60], // Lao Bao
  [17.68, 105.78], // Cha Lo
  [18.38, 105.16], // Cau Treo
  [18.92, 104.85], // Con Cuong
  [19.42, 104.12], // Muong Xen (Ky Son)
  [20.28, 104.60], // Na Meo (Thanh Hoa)
  [20.90, 103.65], // Song Ma (Son La)
  [21.38, 103.02], // Dien Bien Phu
  [22.40, 102.15], // A Pa Chai (Cuc Tay)
  [22.70, 102.62], // Muong Te (Lai Chau)
  [22.52, 103.95], // Lao Cai
  [22.78, 104.48], // Xin Man
  [23.36, 105.32], // Lung Cu (Cuc Bac)
  [23.14, 105.48], // Meo Vac
  [22.92, 106.25], // Bao Lac
  [22.85, 106.74], // Cao Bang / Ban Gioc
  [21.97, 106.71], // Huu Nghi (Lang Son)
  [21.65, 107.42]  // Binh Lieu
];

/** Coastal & offshore islands with real [lat, lon] + visual radius */
const COASTAL_ISLANDS: { name: string; lat: number; lon: number; rx: number; ry: number }[] = [
  { name: 'Đảo Cái Bầu / Cô Tô', lat: 21.02, lon: 107.62, rx: 4.5, ry: 3.2 },
  { name: 'Đảo Cát Bà', lat: 20.78, lon: 107.02, rx: 4.5, ry: 3.0 },
  { name: 'Đảo Bạch Long Vĩ', lat: 20.13, lon: 107.73, rx: 3.4, ry: 3.4 },
  { name: 'Đảo Cồn Cỏ', lat: 17.16, lon: 107.34, rx: 2.8, ry: 2.8 },
  { name: 'Đảo Lý Sơn', lat: 15.38, lon: 109.12, rx: 3.4, ry: 3.0 },
  { name: 'Đảo Phú Quý', lat: 10.52, lon: 108.94, rx: 3.6, ry: 3.2 },
  { name: 'Côn Đảo', lat: 8.68, lon: 106.60, rx: 4.6, ry: 3.2 },
  { name: 'Đảo Thổ Chu', lat: 9.28, lon: 103.47, rx: 3.0, ry: 2.8 }
];

/** Quần đảo Hoàng Sa (TP. Đà Nẵng) — raised 3D coral atolls & islands */
const HOANG_SA_ISLANDS: { name: string; lat: number; lon: number; r: number; major?: boolean }[] = [
  { name: 'Đảo Phú Lâm', lat: 16.83, lon: 112.34, r: 4.4, major: true },
  { name: 'Đảo Linh Côn', lat: 16.67, lon: 112.73, r: 3.6 },
  { name: 'Đảo Hoàng Sa', lat: 16.53, lon: 111.61, r: 4.8, major: true },
  { name: 'Đảo Hữu Nhật', lat: 16.51, lon: 111.54, r: 2.8 },
  { name: 'Đảo Quang Ảnh', lat: 16.45, lon: 111.71, r: 3.2 },
  { name: 'Đảo Duy Mộng', lat: 16.46, lon: 111.79, r: 2.8 },
  { name: 'Đảo Bạch Quy', lat: 16.05, lon: 112.27, r: 3.2 },
  { name: 'Đảo Tri Tôn', lat: 15.78, lon: 111.20, r: 3.6 }
];

/** Quần đảo Trường Sa (Tỉnh Khánh Hòa) — raised 3D coral atolls & islands + DK1 */
const TRUONG_SA_ISLANDS: { name: string; lat: number; lon: number; r: number; major?: boolean }[] = [
  { name: 'Song Tử Tây', lat: 11.43, lon: 114.33, r: 4.2, major: true },
  { name: 'Thị Tứ', lat: 11.05, lon: 114.28, r: 3.5 },
  { name: 'Loại Ta', lat: 10.67, lon: 114.42, r: 3.1 },
  { name: 'Sơn Ca', lat: 10.37, lon: 114.48, r: 3.3 },
  { name: 'Nam Yết', lat: 10.18, lon: 114.36, r: 3.8, major: true },
  { name: 'Sinh Tồn', lat: 9.88, lon: 114.33, r: 3.6 },
  { name: 'Phan Vinh', lat: 8.97, lon: 113.68, r: 3.4 },
  { name: 'Trường Sa Lớn', lat: 8.64, lon: 111.92, r: 5.0, major: true },
  { name: 'Đá Lát', lat: 8.67, lon: 111.67, r: 2.7 },
  { name: 'An Bang', lat: 7.89, lon: 112.92, r: 3.4 },
  { name: 'Thuyền Chài', lat: 8.15, lon: 113.38, r: 3.0 },
  { name: 'Nhà Giàn DK1', lat: 8.05, lon: 110.55, r: 3.3 }
];

/** Phu Quoc island polygon in [lat, lon] */
const PHU_QUOC_LATLON: [number, number][] = [
  [10.44, 103.90],
  [10.42, 104.04],
  [10.22, 104.05],
  [10.02, 104.01],
  [10.05, 103.95],
  [10.24, 103.85]
];

type ArchipelagoInfo = 'hoang_sa' | 'truong_sa' | null;

export const VietnamAccurateMap: React.FC<VietnamAccurateMapProps> = ({
  selectedCity,
  currentDestKey,
  studentLevel,
  vehicleId,
  onSelectCity
}) => {
  const [islandPopup, setIslandPopup] = useState<ArchipelagoInfo>(null);

  const mainlandPath = useMemo(() => {
    return (
      MAINLAND_LATLON.map(([la, lo], idx) => {
        const p = projectVietnamLatLon(la, lo);
        return `${idx === 0 ? 'M' : 'L'}${p.x},${p.y}`;
      }).join(' ') + ' Z'
    );
  }, []);

  const phuQuocPath = useMemo(() => {
    return (
      PHU_QUOC_LATLON.map(([la, lo], idx) => {
        const p = projectVietnamLatLon(la, lo);
        return `${idx === 0 ? 'M' : 'L'}${p.x},${p.y}`;
      }).join(' ') + ' Z'
    );
  }, []);

  const redRiverPath = useMemo(() => {
    const pts: [number, number][] = [
      [22.52, 103.95],
      [21.70, 104.90],
      [21.30, 105.40],
      [21.03, 105.85],
      [20.25, 106.56]
    ];
    return pts
      .map(([la, lo], i) => {
        const p = projectVietnamLatLon(la, lo);
        return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
      })
      .join(' ');
  }, []);

  const mekongPath = useMemo(() => {
    const pts: [number, number][] = [
      [10.85, 105.12],
      [10.35, 105.62],
      [9.95, 106.15],
      [9.65, 106.55]
    ];
    return pts
      .map(([la, lo], i) => {
        const p = projectVietnamLatLon(la, lo);
        return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
      })
      .join(' ');
  }, []);

  const hanoiPt = useMemo(() => projectVietnamLatLon(21.03, 105.85), []);
  const selectedPt = useMemo(
    () => projectVietnamLatLon(selectedCity.lat, selectedCity.lon),
    [selectedCity.lat, selectedCity.lon]
  );
  const hoangSaCenter = useMemo(() => projectVietnamLatLon(16.45, 112.0), []);
  const truongSaCenter = useMemo(() => projectVietnamLatLon(9.75, 113.35), []);

  // Anchor transform classes for city labels so neighboring pins never collide
  const anchorTransform = (anchor: DestinationCity['pinAnchor']) => {
    switch (anchor) {
      case 'top':
        return '-translate-x-1/2 -translate-y-[calc(100%+7px)]';
      case 'bottom':
        return '-translate-x-1/2 translate-y-[9px]';
      case 'left':
        return '-translate-x-[calc(100%+8px)] -translate-y-1/2';
      case 'right':
        return 'translate-x-[8px] -translate-y-1/2';
      case 'bottom-left':
      default:
        return '-translate-x-[calc(100%+6px)] translate-y-[6px]';
    }
  };

  return (
    <div className="relative w-full aspect-[500/560] max-h-[520px] mx-auto rounded-3xl overflow-hidden border border-sky-300 dark:border-slate-700 shadow-inner bg-sky-700">
      <svg
        viewBox={`0 0 ${MAP_BOUNDS.width} ${MAP_BOUNDS.height}`}
        className="w-full h-full block select-none"
        role="img"
        aria-label="Bản đồ Việt Nam chính xác gồm đất liền và hai quần đảo Hoàng Sa, Trường Sa"
      >
        <defs>
          {/* Deep East Sea Bathymetry Gradient */}
          <radialGradient id="vnOceanGrad" cx="35%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#075985" />
          </radialGradient>

          {/* Continental Shelf Halo around Mainland & Islands */}
          <radialGradient id="vnReefGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#22d3ee" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          {/* Mainland 3D Terrain Gradient */}
          <linearGradient id="vnLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="48%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          {/* Island 3D Raised Gold-Emerald Gradient */}
          <linearGradient id="vnIslandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* 3D Relief Drop Shadow Filter */}
          <filter id="vnRelief3D" x="-15%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="2.5" dy="4.5" stdDeviation="2.5" floodColor="#082f49" floodOpacity="0.55" />
          </filter>

          <filter id="vnIslandPop" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.6" floodColor="#042f2e" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Ocean Background */}
        <rect width={MAP_BOUNDS.width} height={MAP_BOUNDS.height} fill="url(#vnOceanGrad)" />

        {/* Subtle Geographic Lat/Lon Graticule Lines */}
        <g stroke="#bae6fd" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.28">
          {[10, 14, 18, 22].map((lat) => {
            const p = projectVietnamLatLon(lat, 105);
            return <line key={lat} x1="0" y1={p.y} x2={MAP_BOUNDS.width} y2={p.y} />;
          })}
          {[104, 108, 112, 116].map((lon) => {
            const p = projectVietnamLatLon(15, lon);
            return <line key={lon} x1={p.x} y1="0" x2={p.x} y2={MAP_BOUNDS.height} />;
          })}
        </g>

        {/* Distance Rings Centered at Hanoi Km 0 */}
        <g fill="none" stroke="#fef3c7" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.45">
          <circle cx={hanoiPt.x} cy={hanoiPt.y} r="70" />
          <circle cx={hanoiPt.x} cy={hanoiPt.y} r="165" />
          <circle cx={hanoiPt.x} cy={hanoiPt.y} r="275" />
          <circle cx={hanoiPt.x} cy={hanoiPt.y} r="385" />
        </g>

        {/* Mainland 3D Extruded Base Rim (gives physical thickness) */}
        <g transform="translate(3, 5)" opacity="0.88">
          <path d={mainlandPath} fill="#14532d" stroke="#052e16" strokeWidth="1.4" strokeLinejoin="round" />
          <path d={phuQuocPath} fill="#14532d" stroke="#052e16" strokeWidth="1.2" strokeLinejoin="round" />
        </g>

        {/* Mainland Top 3D Relief Layer */}
        <g filter="url(#vnRelief3D)">
          <path
            d={mainlandPath}
            fill="url(#vnLandGrad)"
            stroke="#dcfce7"
            strokeWidth="1.35"
            strokeLinejoin="round"
          />
          {/* Subtle Northern & Central Mountain Ridges for 3D depth */}
          <path
            d="M 55 45 Q 80 72 95 98 M 162 245 Q 190 295 210 360"
            fill="none"
            stroke="#15803d"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.24"
          />
          {/* Red River & Mekong Delta blue traces */}
          <path d={redRiverPath} fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity="0.65" strokeLinecap="round" />
          <path d={mekongPath} fill="none" stroke="#0ea5e9" strokeWidth="1.6" opacity="0.65" strokeLinecap="round" />

          {/* Phu Quoc Island */}
          <path
            d={phuQuocPath}
            fill="url(#vnIslandGrad)"
            stroke="#fef9c3"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>

        {/* Coastal & Offshore Islands (Raised 3D) */}
        <g filter="url(#vnIslandPop)">
          {COASTAL_ISLANDS.map((isl) => {
            const p = projectVietnamLatLon(isl.lat, isl.lon);
            return (
              <g key={isl.name}>
                <ellipse cx={p.x} cy={p.y} rx={isl.rx + 3} ry={isl.ry + 3} fill="url(#vnReefGlow)" />
                <ellipse cx={p.x + 1.2} cy={p.y + 1.8} rx={isl.rx} ry={isl.ry} fill="#064e3b" />
                <ellipse
                  cx={p.x}
                  cy={p.y}
                  rx={isl.rx}
                  ry={isl.ry}
                  fill="url(#vnIslandGrad)"
                  stroke="#fef9c3"
                  strokeWidth="0.9"
                />
              </g>
            );
          })}
        </g>

        {/* ==================== QUẦN ĐẢO HOÀNG SA (RAISED 3D ARCHIPELAGO) ==================== */}
        <g
          className="cursor-pointer"
          onClick={() => {
            soundManager.play('click');
            setIslandPopup((prev) => (prev === 'hoang_sa' ? null : 'hoang_sa'));
          }}
        >
          {/* Glowing Coral Atoll Shelf */}
          <ellipse cx={hoangSaCenter.x} cy={hoangSaCenter.y} rx="46" ry="34" fill="url(#vnReefGlow)" />
          <ellipse
            cx={hoangSaCenter.x}
            cy={hoangSaCenter.y}
            rx="40"
            ry="29"
            fill="#0ea5e9"
            fillOpacity="0.22"
            stroke="#fde047"
            strokeWidth="1.1"
            strokeDasharray="3 2.5"
          />
          {/* Individual Raised 3D Islands */}
          <g filter="url(#vnIslandPop)">
            {HOANG_SA_ISLANDS.map((isl) => {
              const p = projectVietnamLatLon(isl.lat, isl.lon);
              return (
                <g key={isl.name}>
                  <circle cx={p.x} cy={p.y} r={isl.r + 3.2} fill="#67e8f9" opacity="0.35" />
                  <circle cx={p.x + 1.3} cy={p.y + 2.0} r={isl.r} fill="#064e3b" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isl.r}
                    fill="url(#vnIslandGrad)"
                    stroke="#fef08a"
                    strokeWidth={isl.major ? '1.2' : '0.8'}
                  />
                  {isl.major && <circle cx={p.x} cy={p.y} r="1.4" fill="#ef4444" />}
                </g>
              );
            })}
          </g>
          {/* Raised Badge Label */}
          <g transform={`translate(${hoangSaCenter.x}, ${hoangSaCenter.y + 39})`} filter="url(#vnIslandPop)">
            <rect x="-66" y="-11" width="132" height="23" rx="8" fill="#0f172a" fillOpacity="0.88" stroke="#facc15" strokeWidth="1.2" />
            <text x="0" y="-0.5" textAnchor="middle" fill="#fde047" fontSize="8.5" fontWeight="900">
              ★ QUẦN ĐẢO HOÀNG SA
            </text>
            <text x="0" y="8.5" textAnchor="middle" fill="#e0f2fe" fontSize="6.8" fontWeight="700">
              TP. Đà Nẵng · Việt Nam
            </text>
          </g>
        </g>

        {/* ==================== QUẦN ĐẢO TRƯỜNG SA (RAISED 3D ARCHIPELAGO) ==================== */}
        <g
          className="cursor-pointer"
          onClick={() => {
            soundManager.play('click');
            setIslandPopup((prev) => (prev === 'truong_sa' ? null : 'truong_sa'));
          }}
        >
          {/* Glowing Coral Atoll Shelf */}
          <ellipse cx={truongSaCenter.x} cy={truongSaCenter.y} rx="82" ry="66" fill="url(#vnReefGlow)" />
          <ellipse
            cx={truongSaCenter.x}
            cy={truongSaCenter.y}
            rx="74"
            ry="58"
            fill="#0ea5e9"
            fillOpacity="0.2"
            stroke="#fde047"
            strokeWidth="1.15"
            strokeDasharray="3.5 2.5"
          />
          {/* Individual Raised 3D Islands */}
          <g filter="url(#vnIslandPop)">
            {TRUONG_SA_ISLANDS.map((isl) => {
              const p = projectVietnamLatLon(isl.lat, isl.lon);
              return (
                <g key={isl.name}>
                  <circle cx={p.x} cy={p.y} r={isl.r + 3.4} fill="#67e8f9" opacity="0.35" />
                  <circle cx={p.x + 1.4} cy={p.y + 2.2} r={isl.r} fill="#064e3b" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isl.r}
                    fill="url(#vnIslandGrad)"
                    stroke="#fef08a"
                    strokeWidth={isl.major ? '1.25' : '0.85'}
                  />
                  {isl.major && <circle cx={p.x} cy={p.y} r="1.5" fill="#ef4444" />}
                </g>
              );
            })}
          </g>
          {/* Raised Badge Label */}
          <g transform={`translate(${truongSaCenter.x}, ${truongSaCenter.y + 66})`} filter="url(#vnIslandPop)">
            <rect x="-68" y="-11" width="136" height="23" rx="8" fill="#0f172a" fillOpacity="0.88" stroke="#facc15" strokeWidth="1.2" />
            <text x="0" y="-0.5" textAnchor="middle" fill="#fde047" fontSize="8.5" fontWeight="900">
              ★ QUẦN ĐẢO TRƯỜNG SA
            </text>
            <text x="0" y="8.5" textAnchor="middle" fill="#e0f2fe" fontSize="6.8" fontWeight="700">
              Tỉnh Khánh Hòa · Việt Nam
            </text>
          </g>
        </g>

        {/* East Sea Cartographic Label */}
        <text
          x="338"
          y="336"
          textAnchor="middle"
          fill="#e0f2fe"
          opacity="0.72"
          fontSize="14"
          fontWeight="800"
          letterSpacing="3"
          fontStyle="italic"
        >
          BIỂN ĐÔNG
        </text>

        {/* Compass Rose Top-Right */}
        <g transform="translate(462, 38)" opacity="0.9">
          <circle cx="0" cy="0" r="17" fill="#0f172a" fillOpacity="0.45" stroke="#bae6fd" strokeWidth="1" />
          <polygon points="0,-13 4,0 0,-3 -4,0" fill="#facc15" />
          <polygon points="0,13 4,0 0,3 -4,0" fill="#e2e8f0" />
          <text x="0" y="-19" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="900">
            B
          </text>
        </g>

        {/* Flight Arc from True Hanoi (Km 0) to Selected Destination */}
        {selectedCity.destKey !== 'hanoi_school' && (
          <path
            d={`M ${hanoiPt.x} ${hanoiPt.y} Q ${(hanoiPt.x + selectedPt.x) / 2 + 34} ${(hanoiPt.y + selectedPt.y) / 2 - 14} ${selectedPt.x} ${selectedPt.y}`}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.6"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        )}

        {/* Exact Geographic Pin Dots for All 10 Destinations */}
        {DESTINATIONS.map((city) => {
          const p = projectVietnamLatLon(city.lat, city.lon);
          const isSelected = city.destKey === selectedCity.destKey;
          const isHere = city.destKey === currentDestKey;
          return (
            <g key={`dot_${city.destKey}`}>
              {(isSelected || isHere) && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  fill={isHere ? '#10b981' : '#f59e0b'}
                  opacity="0.38"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={city.destKey === 'hanoi_school' ? 5.2 : 4.2}
                fill={city.destKey === 'hanoi_school' ? '#dc2626' : isHere ? '#10b981' : isSelected ? '#f59e0b' : '#ffffff'}
                stroke="#0f172a"
                strokeWidth="1.4"
              />
              {city.destKey === 'hanoi_school' && (
                <circle cx={p.x} cy={p.y} r="1.9" fill="#facc15" />
              )}
            </g>
          );
        })}
      </svg>

      {/* Clickable HTML City Pills Anchored to Exact Projected Coordinates */}
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
              setIslandPopup(null);
              onSelectCity(city.destKey);
            }}
            style={{ left: `${city.mapX}%`, top: `${city.mapY}%` }}
            className={`absolute ${anchorTransform(city.pinAnchor)} cursor-pointer transition-transform ${
              isSelected ? 'z-30 scale-105' : 'z-20 hover:scale-105'
            }`}
          >
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-md border flex items-center gap-1 whitespace-nowrap ${
                isHere
                  ? 'bg-emerald-600 text-white border-white'
                  : isSelected
                  ? 'bg-amber-400 text-slate-950 border-white ring-2 ring-amber-300/60'
                  : lockedLvl
                  ? 'bg-slate-800/95 text-slate-200 border-slate-500'
                  : 'bg-white/95 text-slate-900 border-slate-300'
              }`}
            >
              <span>{city.shortName}</span>
              {city.ticketCoins > 0 && <span className="opacity-80 tabular-nums">· {price}xu</span>}
            </div>
          </button>
        );
      })}

      {/* Interactive Island Sovereignty Fact Tooltip */}
      {islandPopup && (
        <div className="absolute bottom-3 left-3 right-3 z-40 rounded-2xl bg-slate-950/92 text-white border border-amber-400/60 p-3 shadow-2xl flex items-start justify-between gap-2 text-xs">
          <div className="space-y-0.5">
            <div className="font-black text-amber-300">
              {islandPopup === 'hoang_sa'
                ? '★ Quần Đảo Hoàng Sa (TP. Đà Nẵng)'
                : '★ Quần Đảo Trường Sa (Tỉnh Khánh Hòa)'}
            </div>
            <p className="text-sky-100 leading-snug">
              {islandPopup === 'hoang_sa'
                ? 'Gồm hơn 30 đảo, đá, bãi cạn nổi bật giữa Biển Đông (Đảo Hoàng Sa, Đảo Phú Lâm, Đảo Tri Tôn, Đảo Linh Côn...), thuộc chủ quyền thiêng liêng của Việt Nam.'
                : 'Gồm hơn 100 đảo, đá, bãi ngầm phía Nam Biển Đông (Trường Sa Lớn, Song Tử Tây, Nam Yết, Sinh Tồn, An Bang, Nhà Giàn DK1...), nơi có cột mốc chủ quyền và ngọn hải đăng rực sáng.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIslandPopup(null)}
            className="p-1 rounded-lg hover:bg-white/15 shrink-0 cursor-pointer"
            aria-label="Đóng thông tin quần đảo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
