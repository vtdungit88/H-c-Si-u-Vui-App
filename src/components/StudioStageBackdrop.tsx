import React from 'react';

interface StudioStageBackdropProps {
  backdropId?: string;
}

export const StudioStageBackdrop: React.FC<StudioStageBackdropProps> = ({
  backdropId = 'bg_classroom'
}) => {
  if (backdropId === 'bg_forest') {
    return (
      <svg
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="forestSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="55%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#DCFCE7" />
          </linearGradient>
          <linearGradient id="forestGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="waterfallGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <rect width="600" height="420" fill="url(#forestSky)" />
        {/* Sunbeams */}
        <circle cx="510" cy="68" r="36" fill="#FEF08A" opacity="0.9" />
        <circle cx="510" cy="68" r="56" fill="#FEF08A" opacity="0.25" />
        {/* Distant hills */}
        <path d="M0 265 Q140 190 290 250 Q450 185 600 245 L600 420 L0 420 Z" fill="#86EFAC" />
        {/* Crystal waterfall */}
        <path d="M445 215 L495 215 L520 330 L425 330 Z" fill="url(#waterfallGrad)" opacity="0.85" />
        <ellipse cx="472" cy="330" rx="68" ry="14" fill="#A5F3FC" opacity="0.7" />
        {/* Lush stylized trees */}
        <g>
          <rect x="65" y="235" width="18" height="70" rx="5" fill="#78350F" />
          <circle cx="74" cy="215" r="46" fill="#16A34A" />
          <circle cx="55" cy="230" r="32" fill="#22C55E" />
          <circle cx="96" cy="228" r="30" fill="#15803D" />
        </g>
        <g>
          <rect x="528" y="220" width="16" height="75" rx="5" fill="#78350F" />
          <circle cx="536" cy="198" r="40" fill="#15803D" />
          <circle cx="515" cy="212" r="28" fill="#22C55E" />
        </g>
        {/* Foreground stage grass */}
        <path d="M0 320 Q300 295 600 320 L600 420 L0 420 Z" fill="url(#forestGround)" />
        <ellipse cx="300" cy="356" rx="145" ry="22" fill="#14532D" opacity="0.35" />
        {/* Floating glowing fireflies */}
        <circle cx="150" cy="160" r="3.5" fill="#FEF08A" className="studio-float" />
        <circle cx="410" cy="140" r="3" fill="#BAE6FD" className="studio-float" />
        <circle cx="210" cy="210" r="2.5" fill="#FEF08A" className="studio-float" />
      </svg>
    );
  }

  if (backdropId === 'bg_lab') {
    return (
      <svg
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="labWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="65%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="labFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>
        <rect width="600" height="420" fill="url(#labWall)" />
        {/* Architectural curved panels */}
        <path d="M40 320 L40 80 Q40 40 80 40 L520 40 Q560 40 560 80 L560 320" fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.3" />
        {/* Left holographic science board */}
        <rect x="44" y="88" width="135" height="92" rx="12" fill="#0EA5E9" opacity="0.16" stroke="#38BDF8" strokeWidth="1.5" />
        <circle cx="95" cy="134" r="24" fill="none" stroke="#7DD3FC" strokeWidth="1.5" />
        <ellipse cx="95" cy="134" rx="34" ry="11" fill="none" stroke="#BAE6FD" strokeWidth="1.2" transform="rotate(35 95 134)" />
        <ellipse cx="95" cy="134" rx="34" ry="11" fill="none" stroke="#BAE6FD" strokeWidth="1.2" transform="rotate(-35 95 134)" />
        <circle cx="95" cy="134" r="5" fill="#FDE047" />
        {/* Right holographic math/data board */}
        <rect x="420" y="88" width="135" height="92" rx="12" fill="#0EA5E9" opacity="0.16" stroke="#38BDF8" strokeWidth="1.5" />
        <polyline points="440,154 468,132 492,142 534,108" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="488" y="170" fill="#BAE6FD" fontSize="12" fontWeight="bold" textAnchor="middle">a² + b² = c²</text>
        {/* Lab Floor & Stage */}
        <rect x="0" y="310" width="600" height="110" fill="url(#labFloor)" />
        <line x1="0" y1="310" x2="600" y2="310" stroke="#38BDF8" strokeWidth="2.5" opacity="0.7" />
        <ellipse cx="300" cy="356" rx="155" ry="22" fill="#0EA5E9" opacity="0.25" stroke="#38BDF8" strokeWidth="2" />
      </svg>
    );
  }

  if (backdropId === 'bg_arena') {
    return (
      <svg
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="arenaSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="55%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="arenaFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <rect width="600" height="420" fill="url(#arenaSky)" />
        {/* Stadium arches */}
        <path d="M0 285 Q300 235 600 285 L600 325 L0 325 Z" fill="#451A03" opacity="0.65" />
        <rect x="55" y="120" width="22" height="165" fill="#78350F" />
        <rect x="523" y="120" width="22" height="165" fill="#78350F" />
        {/* Banners */}
        <polygon points="88,110 132,110 132,205 110,188 88,205" fill="#DC2626" />
        <polygon points="468,110 512,110 512,205 490,188 468,205" fill="#2563EB" />
        {/* Spotlights */}
        <polygon points="150,0 265,350 185,350" fill="#FEF08A" opacity="0.16" />
        <polygon points="450,0 415,350 335,350" fill="#FEF08A" opacity="0.16" />
        {/* Colosseum Stage Floor */}
        <path d="M0 315 Q300 295 600 315 L600 420 L0 420 Z" fill="url(#arenaFloor)" />
        <ellipse cx="300" cy="356" rx="158" ry="24" fill="#B45309" opacity="0.35" stroke="#FEF08A" strokeWidth="2.5" />
      </svg>
    );
  }

  if (backdropId === 'bg_galaxy') {
    return (
      <svg
        viewBox="0 0 600 420"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="galaxySky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#090D1F" />
            <stop offset="50%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
          <radialGradient id="nebulaGlow" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.38" />
            <stop offset="55%" stopColor="#8B5CF6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#090D1F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="420" fill="url(#galaxySky)" />
        <rect width="600" height="420" fill="url(#nebulaGlow)" />
        {/* Stars */}
        <circle cx="80" cy="62" r="2" fill="#FFFFFF" />
        <circle cx="145" cy="112" r="1.5" fill="#BAE6FD" />
        <circle cx="230" cy="48" r="2.2" fill="#FDE047" />
        <circle cx="385" cy="76" r="1.8" fill="#FFFFFF" />
        <circle cx="490" cy="54" r="2.5" fill="#FDE047" />
        <circle cx="535" cy="150" r="1.8" fill="#C4B5FD" />
        <circle cx="95" cy="195" r="2" fill="#7DD3FC" />
        {/* Planet with ring */}
        <circle cx="495" cy="118" r="30" fill="#6366F1" />
        <ellipse cx="495" cy="118" rx="54" ry="12" fill="none" stroke="#FDE047" strokeWidth="3" transform="rotate(-18 495 118)" />
        {/* Constellation lines */}
        <polyline points="60,115 110,88 155,120" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.45" />
        {/* Crystal Cosmic Platform */}
        <ellipse cx="300" cy="355" rx="170" ry="28" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="2.5" />
        <ellipse cx="300" cy="355" rx="120" ry="16" fill="#0EA5E9" opacity="0.25" />
      </svg>
    );
  }

  // Default: bg_classroom (Lớp Học Nắng Mai)
  return (
    <svg
      viewBox="0 0 600 420"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="classWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="classFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect width="600" height="420" fill="url(#classWall)" />
      {/* Sunlit window left */}
      <rect x="36" y="55" width="95" height="145" rx="10" fill="#BAE6FD" stroke="#93C5FD" strokeWidth="4" />
      <line x1="83.5" y1="55" x2="83.5" y2="200" stroke="#FFFFFF" strokeWidth="3" />
      <line x1="36" y1="127" x2="131" y2="127" stroke="#FFFFFF" strokeWidth="3" />
      <polygon points="131,65 250,310 131,310" fill="#FEF9C3" opacity="0.35" />
      {/* Green Chalkboard */}
      <rect x="170" y="58" width="260" height="145" rx="10" fill="#14532D" stroke="#92400E" strokeWidth="7" />
      <text x="300" y="102" fill="#FEF08A" fontSize="15" fontWeight="bold" textAnchor="middle" opacity="0.85">
        HỌC SIÊU VUI
      </text>
      <text x="230" y="140" fill="#BBF7D0" fontSize="12" opacity="0.75">
        1 + 1 = 2
      </text>
      <text x="365" y="142" fill="#BBF7D0" fontSize="12" opacity="0.75">
        a² + b² = c²
      </text>
      <circle cx="300" cy="166" r="14" fill="none" stroke="#86EFAC" strokeWidth="1.8" opacity="0.65" />
      {/* Clock right */}
      <circle cx="515" cy="98" r="28" fill="#FFFFFF" stroke="#64748B" strokeWidth="4" />
      <line x1="515" y1="98" x2="515" y2="80" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <line x1="515" y1="98" x2="528" y2="104" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      {/* Wooden floor */}
      <rect x="0" y="315" width="600" height="105" fill="url(#classFloor)" opacity="0.55" />
      <ellipse cx="300" cy="356" rx="145" ry="20" fill="#92400E" opacity="0.14" />
    </svg>
  );
};
