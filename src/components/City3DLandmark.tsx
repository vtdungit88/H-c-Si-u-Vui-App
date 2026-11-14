import React from 'react';

interface City3DLandmarkProps {
  destKey: string;
  mode?: 'stage' | 'card';
  className?: string;
}

/**
 * Crisp 3D isometric / perspective vector landmarks for the 10 Vietnamese destinations.
 * Used both as the panoramic backdrop of the live Social Lobby ("stage")
 * and as miniature 3D dioramas inside the Vietnam Travel Map ("card").
 */
export const City3DLandmark: React.FC<City3DLandmarkProps> = ({
  destKey,
  mode = 'stage',
  className = ''
}) => {
  const uid = `${mode}_${destKey}`;
  const isCard = mode === 'card';
  const viewBox = '0 0 1200 540';

  const renderScene = () => {
    switch (destKey) {
      case 'hanoi_ho_guom':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="56%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>
              <linearGradient id={`lake_${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="55%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="960" cy="88" r="42" fill="#fde047" opacity="0.92" />
            <ellipse cx="230" cy="82" rx="84" ry="22" fill="#ffffff" opacity="0.82" />
            <ellipse cx="700" cy="68" rx="96" ry="24" fill="#ffffff" opacity="0.72" />
            <path d="M0 245 L110 212 L220 238 L350 198 L480 235 L680 206 L860 235 L1040 194 L1200 225 L1200 280 L0 280 Z" fill="#93c5fd" opacity="0.55" />
            {/* Hoan Kiem Jade Water */}
            <rect x="0" y="255" width="1200" height="115" fill={`url(#lake_${uid})`} />
            <ellipse cx="600" cy="300" rx="460" ry="30" fill="#34d399" opacity="0.25" />
            {/* Turtle Tower Isometric Island */}
            <ellipse cx="600" cy="296" rx="96" ry="18" fill="#15803d" />
            <ellipse cx="600" cy="292" rx="82" ry="13" fill="#22c55e" />
            <polygon points="562,286 600,275 638,286 600,295" fill="#d97706" />
            <rect x="572" y="246" width="56" height="40" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <rect x="580" y="220" width="40" height="28" fill="#fef9c3" stroke="#b45309" strokeWidth="2" />
            <polygon points="574,220 600,196 626,220" fill="#b45309" />
            <rect x="592" y="256" width="16" height="24" rx="8" fill="#78350f" />
            {/* Iconic Red The Huc Bridge */}
            <path d="M770 296 Q890 242 1010 296" fill="none" stroke="#dc2626" strokeWidth="14" strokeLinecap="round" />
            <path d="M770 288 Q890 234 1010 288" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
            {/* Stone Walkway Plaza */}
            <polygon points="0,350 1200,350 1200,540 0,540" fill="#f1f5f9" />
            <polygon points="0,350 1200,350 1200,372 0,372" fill="#cbd5e1" />
            {/* Willow Trees */}
            <circle cx="150" cy="255" r="46" fill="#16a34a" />
            <circle cx="195" cy="268" r="36" fill="#22c55e" />
            <rect x="164" y="290" width="14" height="62" fill="#78350f" />
            <circle cx="1075" cy="265" r="48" fill="#15803d" />
            <rect x="1068" y="296" width="14" height="58" fill="#78350f" />
          </>
        );

      case 'halong_bay':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="55%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#e0f2fe" />
              </linearGradient>
              <linearGradient id={`sea_${uid}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="50%" stopColor="#0891b2" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="220" cy="86" r="44" fill="#fef08a" />
            <ellipse cx="550" cy="76" rx="110" ry="26" fill="#ffffff" opacity="0.82" />
            {/* Sea */}
            <rect x="0" y="240" width="1200" height="160" fill={`url(#sea_${uid})`} />
            {/* 3D Limestone Karsts */}
            <polygon points="150,275 215,155 275,275" fill="#1e293b" />
            <polygon points="215,155 275,275 315,275 235,165" fill="#334155" />
            <ellipse cx="215" cy="175" rx="34" ry="18" fill="#15803d" />
            <polygon points="480,285 565,120 645,285" fill="#1f2937" />
            <polygon points="565,120 645,285 690,285 590,136" fill="#334155" />
            <ellipse cx="568" cy="145" rx="46" ry="22" fill="#16a34a" />
            {/* Fighting Cock Islets (Hòn Trống Mái) */}
            <polygon points="790,282 818,200 855,212 840,282" fill="#475569" />
            <polygon points="865,282 882,196 922,220 905,282" fill="#334155" />
            {/* Red Wooden Sailboat */}
            <polygon points="340,295 455,295 435,315 358,315" fill="#78350f" />
            <polygon points="395,210 395,292 442,278" fill="#dc2626" />
            <polygon points="388,225 388,292 348,282" fill="#ef4444" />
            {/* Wooden Pier Deck */}
            <polygon points="0,350 1200,350 1200,540 0,540" fill="#fde68a" />
            <polygon points="0,350 1200,350 1200,372 0,372" fill="#d97706" />
            <line x1="0" y1="415" x2="1200" y2="415" stroke="#f59e0b" strokeWidth="2" opacity="0.45" />
            <line x1="0" y1="475" x2="1200" y2="475" stroke="#f59e0b" strokeWidth="2" opacity="0.45" />
          </>
        );

      case 'sapa_fansipan':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#312e81" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#c7d2fe" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="960" cy="96" r="46" fill="#fef08a" opacity="0.92" />
            {/* Misty Mountains */}
            <polygon points="0,330 220,120 450,330" fill="#4338ca" />
            <polygon points="300,330 600,82 900,330" fill="#3730a3" />
            <polygon points="600,82 900,330 980,330 645,105" fill="#4f46e5" />
            <polygon points="780,330 1020,138 1200,330" fill="#4338ca" />
            {/* Fansipan 3143m Monument */}
            <polygon points="575,95 600,56 625,95" fill="#e2e8f0" />
            <rect x="593" y="34" width="14" height="30" fill="#dc2626" />
            {/* Golden Terraced Fields */}
            <path d="M0 315 Q300 285 600 318 T1200 308 L1200 370 L0 370 Z" fill="#84cc16" />
            <path d="M0 335 Q300 312 600 342 T1200 332 L1200 390 L0 390 Z" fill="#eab308" />
            {/* Sea of Clouds */}
            <ellipse cx="260" cy="255" rx="180" ry="26" fill="#ffffff" opacity="0.65" />
            <ellipse cx="860" cy="240" rx="210" ry="28" fill="#ffffff" opacity="0.62" />
            {/* Stone Mountain Plaza */}
            <polygon points="0,360 1200,360 1200,540 0,540" fill="#e2e8f0" />
            <polygon points="0,360 1200,360 1200,382 0,382" fill="#94a3b8" />
          </>
        );

      case 'hue_imperial':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7e22ce" />
                <stop offset="55%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="240" cy="110" r="46" fill="#fef08a" opacity="0.92" />
            {/* Perfume River */}
            <rect x="0" y="275" width="1200" height="80" fill="#38bdf8" opacity="0.82" />
            {/* Ngo Mon Imperial Gate */}
            <rect x="330" y="210" width="540" height="75" fill="#78350f" />
            <rect x="390" y="160" width="420" height="52" fill="#dc2626" />
            <polygon points="365,162 600,104 835,162" fill="#d97706" />
            <polygon points="440,126 600,82 760,126" fill="#b45309" />
            <rect x="560" y="220" width="80" height="65" rx="14" fill="#451a03" />
            <rect x="440" y="232" width="52" height="53" rx="10" fill="#451a03" />
            <rect x="708" y="232" width="52" height="53" rx="10" fill="#451a03" />
            {/* Courtyard Plaza */}
            <polygon points="0,348 1200,348 1200,540 0,540" fill="#fef3c7" />
            <polygon points="0,348 1200,348 1200,370 0,370" fill="#d97706" />
          </>
        );

      case 'danang_dragon':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="60%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="980" cy="86" r="40" fill="#fde047" />
            {/* Han River */}
            <rect x="0" y="255" width="1200" height="100" fill="#0284c7" />
            {/* City Skyline */}
            <rect x="110" y="135" width="76" height="125" fill="#64748b" />
            <rect x="200" y="95" width="64" height="165" fill="#475569" />
            <rect x="920" y="120" width="82" height="140" fill="#475569" />
            <rect x="1020" y="150" width="70" height="110" fill="#64748b" />
            {/* Iconic Golden Dragon Bridge */}
            <rect x="120" y="280" width="960" height="18" fill="#cbd5e1" />
            <path
              d="M220 280 Q320 205 420 280 Q530 198 640 280 Q750 205 860 280"
              fill="none"
              stroke="#eab308"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <circle cx="888" cy="242" r="24" fill="#facc15" stroke="#ca8a04" strokeWidth="4" />
            <polygon points="908,236 965,214 958,258" fill="#fb923c" opacity="0.85" />
            {/* Riverfront Promenade */}
            <polygon points="0,348 1200,348 1200,540 0,540" fill="#e2e8f0" />
            <polygon points="0,348 1200,348 1200,372 0,372" fill="#94a3b8" />
          </>
        );

      case 'nhatrang_beach':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="65%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#ecfeff" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="960" cy="86" r="44" fill="#fde047" />
            {/* Turquoise Ocean */}
            <rect x="0" y="230" width="1200" height="125" fill="#06b6d4" />
            <path d="M0 325 Q300 305 600 328 T1200 318 L1200 360 L0 360 Z" fill="#ffffff" opacity="0.55" />
            {/* Tram Huong Tower */}
            <polygon points="565,265 635,265 616,135 584,135" fill="#fb7185" />
            <polygon points="575,138 625,138 600,98" fill="#f59e0b" />
            {/* Golden Beach Sand */}
            <polygon points="0,345 1200,345 1200,540 0,540" fill="#fde68a" />
            <polygon points="0,345 1200,345 1200,368 0,368" fill="#fcd34d" />
            {/* Coconut Palm Trees */}
            <rect x="132" y="195" width="16" height="160" fill="#92400e" />
            <ellipse cx="140" cy="192" rx="68" ry="18" fill="#16a34a" />
            <ellipse cx="140" cy="192" rx="18" ry="52" fill="#15803d" />
            <rect x="1040" y="205" width="16" height="150" fill="#92400e" />
            <ellipse cx="1048" cy="202" rx="64" ry="18" fill="#16a34a" />
          </>
        );

      case 'dalat_flowers':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="55%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#fce7f3" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="240" cy="96" r="42" fill="#fef08a" />
            {/* Pine Hills */}
            <path d="M0 280 Q240 190 540 265 T1200 250 L1200 320 L0 320 Z" fill="#15803d" />
            {/* Xuan Huong Lake */}
            <rect x="0" y="275" width="1200" height="75" fill="#38bdf8" />
            {/* Giant Yellow Wild Sunflower Dome (Quảng Trường Lâm Viên) */}
            <polygon points="480,285 600,150 720,285" fill="#facc15" stroke="#ca8a04" strokeWidth="5" />
            <polygon points="520,285 600,185 680,285" fill="#eab308" />
            <polygon points="750,285 820,192 890,285" fill="#22c55e" opacity="0.88" />
            {/* Pine Trees */}
            <polygon points="120,290 165,165 210,290" fill="#166534" />
            <polygon points="190,300 235,180 280,300" fill="#14532d" />
            <polygon points="990,295 1035,168 1080,295" fill="#166534" />
            {/* Flower Square Ground */}
            <polygon points="0,348 1200,348 1200,540 0,540" fill="#f3e8ff" />
            <polygon points="0,348 1200,348 1200,372 0,372" fill="#c084fc" />
          </>
        );

      case 'hcm_landmark':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="940" cy="100" r="46" fill="#fef08a" />
            {/* Saigon River */}
            <rect x="0" y="275" width="1200" height="75" fill="#0284c7" />
            {/* Landmark 81 Isometric Tower */}
            <rect x="572" y="45" width="56" height="240" fill="#38bdf8" />
            <rect x="546" y="105" width="26" height="180" fill="#0284c7" />
            <rect x="628" y="122" width="26" height="163" fill="#0369a1" />
            <line x1="600" y1="15" x2="600" y2="45" stroke="#ffffff" strokeWidth="5" />
            {/* Ben Thanh Market Clock Facade */}
            <rect x="190" y="218" width="220" height="72" fill="#fde047" stroke="#ca8a04" strokeWidth="3" />
            <polygon points="270,218 300,175 330,218" fill="#dc2626" />
            <circle cx="300" cy="235" r="14" fill="#ffffff" stroke="#78350f" strokeWidth="3" />
            {/* City Plaza */}
            <polygon points="0,348 1200,348 1200,540 0,540" fill="#e2e8f0" />
            <polygon points="0,348 1200,348 1200,372 0,372" fill="#94a3b8" />
          </>
        );

      case 'phuquoc_island':
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="48%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            {/* Sunset Over Ocean */}
            <circle cx="600" cy="215" r="76" fill="#fef08a" opacity="0.92" />
            <rect x="0" y="230" width="1200" height="120" fill="#0ea5e9" />
            <ellipse cx="600" cy="265" rx="180" ry="20" fill="#fb923c" opacity="0.55" />
            {/* Sea-crossing Cable Car */}
            <line x1="0" y1="135" x2="1200" y2="115" stroke="#1e293b" strokeWidth="3" />
            <rect x="440" y="132" width="38" height="28" rx="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <rect x="760" y="124" width="38" height="28" rx="6" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
            {/* White Sand Beach Plaza */}
            <polygon points="0,346 1200,346 1200,540 0,540" fill="#fef3c7" />
            <polygon points="0,346 1200,346 1200,370 0,370" fill="#fcd34d" />
            {/* Palm Silhouettes */}
            <rect x="140" y="190" width="16" height="165" fill="#78350f" />
            <ellipse cx="148" cy="188" rx="68" ry="18" fill="#15803d" />
            <rect x="1040" y="196" width="16" height="160" fill="#78350f" />
            <ellipse cx="1048" cy="194" rx="66" ry="18" fill="#15803d" />
          </>
        );

      case 'hanoi_school':
      default:
        return (
          <>
            <defs>
              <linearGradient id={`sky_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="55%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#e0f2fe" />
              </linearGradient>
              <linearGradient id={`grass_${uid}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
            </defs>
            <rect width="1200" height="540" fill={`url(#sky_${uid})`} />
            <circle cx="980" cy="84" r="42" fill="#fde047" />
            <ellipse cx="220" cy="82" rx="90" ry="24" fill="#ffffff" opacity="0.85" />
            <ellipse cx="640" cy="64" rx="108" ry="26" fill="#ffffff" opacity="0.75" />
            {/* Green Park Horizon */}
            <rect x="0" y="250" width="1200" height="90" fill={`url(#grass_${uid})`} />
            {/* 3D Isometric School Building */}
            <rect x="330" y="128" width="540" height="145" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
            <polygon points="300,128 600,66 900,128" fill="#dc2626" />
            <polygon points="520,128 600,82 680,128" fill="#b91c1c" />
            <circle cx="600" cy="108" r="14" fill="#ffffff" stroke="#78350f" strokeWidth="3" />
            {/* School Windows */}
            {[368, 434, 500, 650, 716, 782].map((wx) => (
              <rect key={wx} x={wx} y="158" width="40" height="44" rx="4" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
            ))}
            <rect x="564" y="200" width="72" height="73" rx="6" fill="#78350f" />
            {/* Flagpole */}
            <line x1="250" y1="90" x2="250" y2="275" stroke="#94a3b8" strokeWidth="6" />
            <rect x="253" y="92" width="54" height="34" fill="#dc2626" />
            <polygon points="280,99 283,108 292,108 285,113 287,121 280,116 273,121 275,113 268,108 277,108" fill="#facc15" />
            {/* Schoolyard Trees & Stone Benches */}
            <circle cx="135" cy="210" r="46" fill="#15803d" />
            <rect x="128" y="242" width="14" height="48" fill="#78350f" />
            <circle cx="1065" cy="212" r="48" fill="#16a34a" />
            <rect x="1058" y="246" width="14" height="46" fill="#78350f" />
            {/* Perspective Tiled Courtyard Floor */}
            <polygon points="0,330 1200,330 1200,540 0,540" fill="#f8fafc" />
            <polygon points="0,330 1200,330 1200,356 0,356" fill="#cbd5e1" />
            {!isCard && (
              <>
                <line x1="0" y1="400" x2="1200" y2="400" stroke="#e2e8f0" strokeWidth="2" />
                <line x1="0" y1="470" x2="1200" y2="470" stroke="#e2e8f0" strokeWidth="2" />
              </>
            )}
          </>
        );
    }
  };

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full block ${className}`}
      aria-hidden="true"
    >
      {renderScene()}
    </svg>
  );
};
