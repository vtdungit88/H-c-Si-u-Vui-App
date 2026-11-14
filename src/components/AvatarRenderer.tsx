import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarRendererProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showVehicle?: boolean;
  showTech?: boolean;
  showPet?: boolean;
  showAura?: boolean;
  animated?: boolean;
  isReacting?: boolean;
  onTap?: () => void;
  className?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  config,
  size = 'md',
  showVehicle = true,
  showTech = true,
  showPet = true,
  showAura = true,
  animated = true,
  isReacting = false,
  onTap,
  className = ''
}) => {
  const sizeMap = {
    sm: { width: 120, height: 130 },
    md: { width: 200, height: 230 },
    lg: { width: 280, height: 320 },
    xl: { width: 340, height: 390 }
  };

  const skin = config.skinColor || '#FDDFC6';
  const hair = config.hairColor || '#1E293B';
  const auraId = config.auraId || 'aura_none';

  const isFloatingVehicle =
    config.vehicleId === 'veh_hoverboard' ||
    config.vehicleId === 'veh_magic_carpet' ||
    config.vehicleId === 'veh_spaceship';

  return (
    <div
      onClick={onTap}
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
      onKeyDown={
        onTap
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTap();
              }
            }
          : undefined
      }
      aria-label={onTap ? 'Chạm để tương tác với nhân vật' : undefined}
      className={`relative inline-flex items-center justify-center select-none ${
        onTap ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-3xl' : ''
      } ${isReacting ? 'studio-tap-jump' : ''} ${className}`}
      style={{
        width: sizeMap[size].width,
        height: sizeMap[size].height
      }}
    >
      <svg
        viewBox="0 0 300 350"
        className="w-full h-full overflow-visible drop-shadow-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="carpetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          <linearGradient id="hoverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <linearGradient id="cyberSuit" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient id="rgbKey" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="75%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>

          <linearGradient id="flameAura" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 0. AURA LAYER (Behind character) */}
        {showAura && auraId !== 'aura_none' && (
          <g id="aura-layer">
            {auraId === 'aura_sparkle' && (
              <g className={animated ? 'studio-aura-spin' : ''}>
                <circle cx="150" cy="190" r="98" fill="none" stroke="#FACC15" strokeWidth="2" strokeDasharray="6 10" opacity="0.7" />
                <polygon points="150,78 154,88 164,88 156,94 159,104 150,98 141,104 144,94 136,88 146,88" fill="#FDE047" />
                <circle cx="62" cy="185" r="4" fill="#FEF08A" />
                <circle cx="238" cy="185" r="4" fill="#FEF08A" />
                <circle cx="95" cy="272" r="3.5" fill="#FACC15" />
                <circle cx="205" cy="272" r="3.5" fill="#FACC15" />
              </g>
            )}

            {auraId === 'aura_electric' && (
              <g className={animated ? 'studio-aura-pulse' : ''} filter="url(#glowEffect)">
                <ellipse cx="150" cy="195" rx="108" ry="62" fill="none" stroke="#38BDF8" strokeWidth="2.5" transform="rotate(-18 150 195)" opacity="0.75" />
                <ellipse cx="150" cy="195" rx="108" ry="62" fill="none" stroke="#0EA5E9" strokeWidth="2" transform="rotate(18 150 195)" opacity="0.65" />
                <circle cx="56" cy="158" r="5" fill="#7DD3FC" />
                <circle cx="244" cy="230" r="5" fill="#7DD3FC" />
              </g>
            )}

            {auraId === 'aura_flame' && (
              <g className={animated ? 'studio-aura-pulse' : ''} filter="url(#glowEffect)">
                <circle cx="150" cy="190" r="105" fill="none" stroke="url(#flameAura)" strokeWidth="4" opacity="0.75" />
                <circle cx="150" cy="190" r="92" fill="none" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="10 6" opacity="0.8" />
                <path d="M55 215 Q42 175 68 145 Q58 180 70 205 Z" fill="#F59E0B" opacity="0.8" />
                <path d="M245 215 Q258 175 232 145 Q242 180 230 205 Z" fill="#F59E0B" opacity="0.8" />
              </g>
            )}
          </g>
        )}

        {/* Ground Shadow */}
        <ellipse cx="150" cy="316" rx="72" ry="11" fill="#0F172A" opacity="0.16" />

        {/* FLOATING WRAPPER FOR CHARACTER + VEHICLE */}
        <g className={animated && isFloatingVehicle ? 'studio-float' : ''}>
          {/* 1. VEHICLE / BASE (Bottom Layer) */}
          {showVehicle && (
            <g id="vehicle-layer" className="transition-all duration-300">
              {config.vehicleId === 'veh_honeycomb' && (
                <g id="honeycomb_sandals">
                  <ellipse cx="120" cy="305" rx="16" ry="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                  <ellipse cx="120" cy="304" rx="12" ry="4" fill="#FEF08A" />
                  <ellipse cx="180" cy="305" rx="16" ry="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                  <ellipse cx="180" cy="304" rx="12" ry="4" fill="#FEF08A" />
                </g>
              )}

              {config.vehicleId === 'veh_skateboard' && (
                <g id="veh_skateboard">
                  <rect x="85" y="298" width="130" height="12" rx="6" fill="#F97316" stroke="#1E293B" strokeWidth="2.5" />
                  <rect x="105" y="300" width="90" height="4" rx="2" fill="#FDE047" opacity="0.8" />
                  <circle cx="110" cy="314" r="7" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
                  <circle cx="190" cy="314" r="7" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
                </g>
              )}

              {config.vehicleId === 'veh_bike_mini' && (
                <g id="bike_mini">
                  <circle cx="85" cy="295" r="24" fill="none" stroke="#64748B" strokeWidth="3" />
                  <circle cx="85" cy="295" r="4" fill="#334155" />
                  <circle cx="215" cy="295" r="24" fill="none" stroke="#64748B" strokeWidth="3" />
                  <circle cx="215" cy="295" r="4" fill="#334155" />
                  <path d="M85 295 L140 295 L180 260 L120 260 Z" fill="none" stroke="#0D9488" strokeWidth="5" strokeLinejoin="round" />
                  <path d="M140 295 L150 245" stroke="#0D9488" strokeWidth="5" />
                  <path d="M140 245 L165 245" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                  <path d="M180 260 L215 295" stroke="#0D9488" strokeWidth="4" />
                  <rect x="195" y="235" width="22" height="16" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                  <rect x="200" y="228" width="12" height="12" rx="1" fill="#3B82F6" />
                </g>
              )}

              {config.vehicleId === 'veh_scooter_pastel' && (
                <g id="scooter_pastel">
                  <circle cx="92" cy="298" r="17" fill="#334155" stroke="#94A3B8" strokeWidth="3" />
                  <circle cx="208" cy="298" r="17" fill="#334155" stroke="#94A3B8" strokeWidth="3" />
                  <path d="M80 288 Q110 260 132 288 L185 288 Q195 255 215 275 L220 296 L78 296 Z" fill="#6EE7B7" stroke="#059669" strokeWidth="2.5" />
                  <path d="M188 265 L196 236 L212 236" fill="none" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="215" cy="248" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                </g>
              )}

              {config.vehicleId === 'veh_mountain' && (
                <g id="bike_mountain">
                  <circle cx="75" cy="295" r="26" fill="none" stroke="#1E293B" strokeWidth="5" strokeDasharray="3 2" />
                  <circle cx="225" cy="295" r="26" fill="none" stroke="#1E293B" strokeWidth="5" strokeDasharray="3 2" />
                  <path d="M75 295 L135 295 L185 250 L125 250 Z" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinejoin="round" />
                  <path d="M185 250 L225 295" stroke="#EF4444" strokeWidth="5" />
                  <path d="M175 235 L215 235" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
                </g>
              )}

              {config.vehicleId === 'veh_ebike' && (
                <g id="bike_ebike">
                  <ellipse cx="150" cy="310" rx="90" ry="14" fill="#0284C7" opacity="0.2" />
                  <rect x="100" y="280" width="100" height="20" rx="8" fill="#F8FAFC" stroke="#0284C7" strokeWidth="3" />
                  <circle cx="95" cy="300" r="16" fill="#334155" stroke="#64748B" strokeWidth="4" />
                  <circle cx="205" cy="300" r="16" fill="#334155" stroke="#64748B" strokeWidth="4" />
                  <circle cx="220" cy="255" r="6" fill="#38BDF8" filter="url(#glowEffect)" />
                </g>
              )}

              {config.vehicleId === 'veh_hoverboard' && (
                <g id="hoverboard" filter="url(#glowEffect)">
                  <ellipse cx="150" cy="315" rx="75" ry="14" fill="url(#hoverGrad)" />
                  <ellipse cx="150" cy="315" rx="65" ry="8" fill="#0F172A" />
                  <ellipse cx="150" cy="328" rx="55" ry="6" fill="#38BDF8" opacity="0.6" />
                  <circle cx="105" cy="315" r="4" fill="#A5F3FC" />
                  <circle cx="195" cy="315" r="4" fill="#A5F3FC" />
                </g>
              )}

              {config.vehicleId === 'veh_spaceship' && (
                <g id="spaceship_pod" filter="url(#glowEffect)">
                  <ellipse cx="150" cy="308" rx="82" ry="18" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
                  <path d="M85 304 Q150 282 215 304 L205 320 Q150 328 95 320 Z" fill="#1E293B" stroke="#0EA5E9" strokeWidth="2" />
                  <ellipse cx="110" cy="322" rx="14" ry="5" fill="#F59E0B" />
                  <ellipse cx="190" cy="322" rx="14" ry="5" fill="#F59E0B" />
                  <circle cx="150" cy="306" r="6" fill="#38BDF8" />
                </g>
              )}

              {config.vehicleId === 'veh_magic_carpet' && (
                <g id="magic_carpet" filter="url(#glowEffect)">
                  <path d="M60 305 Q150 285 240 305 Q210 325 150 325 Q90 325 60 305 Z" fill="url(#carpetGrad)" />
                  <path d="M70 307 Q150 292 230 307" stroke="#FEF08A" strokeWidth="2" strokeDasharray="4 3" fill="none" />
                  <circle cx="60" cy="305" r="4" fill="#F59E0B" />
                  <circle cx="240" cy="305" r="4" fill="#F59E0B" />
                  <text x="150" y="316" fill="#FEF08A" fontSize="11" fontWeight="bold" textAnchor="middle">1, 1, 2, 3, 5, 8, 13...</text>
                </g>
              )}
            </g>
          )}

          {/* 2. BODY / LEGS */}
          <g id="legs-layer">
            <rect x="120" y="240" width="18" height="60" rx="6" fill="#1E3A8A" />
            <rect x="162" y="240" width="18" height="60" rx="6" fill="#1E3A8A" />
            {config.vehicleId !== 'veh_honeycomb' && (
              <>
                <ellipse cx="128" cy="300" rx="14" ry="7" fill="#0F172A" />
                <ellipse cx="172" cy="300" rx="14" ry="7" fill="#0F172A" />
              </>
            )}
          </g>

          {/* BREATHING TORSO + HEAD + ARMS GROUP */}
          <g className={animated ? 'studio-breathe' : ''}>
            {/* 3. OUTFIT / TORSO */}
            <g id="outfit-layer">
              {config.outfitId === 'outfit_uniform' && (
                <g id="outfit_uniform_group">
                  <path d="M105 160 L195 160 L185 245 L115 245 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                  <polygon points="135,160 150,180 142,160" fill="#F1F5F9" />
                  <polygon points="165,160 150,180 158,160" fill="#F1F5F9" />
                  <path d="M136 168 Q150 178 164 168 L155 210 L150 190 L145 210 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
                  <rect x="118" y="185" width="18" height="11" rx="2" fill="#2563EB" />
                  <text x="127" y="193" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">HSV</text>
                </g>
              )}

              {config.outfitId === 'outfit_scout' && (
                <g id="outfit_scout_group">
                  <path d="M105 160 L195 160 L185 245 L115 245 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
                  {/* Khaki vest */}
                  <path d="M105 160 L140 160 L140 245 L115 245 Z" fill="#B45309" />
                  <path d="M160 160 L195 160 L185 245 L160 245 Z" fill="#B45309" />
                  {/* Utility pockets */}
                  <rect x="116" y="205" width="18" height="16" rx="2" fill="#92400E" />
                  <rect x="166" y="205" width="18" height="16" rx="2" fill="#92400E" />
                  {/* Compass badge */}
                  <circle cx="175" cy="182" r="7" fill="#10B981" stroke="#FEF08A" strokeWidth="1.5" />
                </g>
              )}

              {config.outfitId === 'outfit_sport' && (
                <g id="outfit_sport_group">
                  <path d="M105 160 L195 160 L185 245 L115 245 Z" fill="#EA580C" />
                  <rect x="135" y="160" width="30" height="85" fill="#1E293B" />
                  <line x1="145" y1="160" x2="145" y2="245" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="155" y1="160" x2="155" y2="245" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="150" cy="204" r="11" fill="#FACC15" />
                  <text x="150" y="208" fill="#1E293B" fontSize="10" fontWeight="bold" textAnchor="middle">★</text>
                </g>
              )}

              {config.outfitId === 'outfit_hoodie' && (
                <g id="outfit_hoodie_group">
                  <path d="M100 160 L200 160 L185 248 L115 248 Z" fill="#4F46E5" />
                  <rect x="125" y="215" width="50" height="25" rx="6" fill="#4338CA" />
                  <circle cx="150" cy="188" r="16" fill="#FEF08A" />
                  <text x="150" y="193" fill="#4338CA" fontSize="13" fontWeight="bold" textAnchor="middle">π ∞</text>
                </g>
              )}

              {config.outfitId === 'outfit_lab' && (
                <g id="outfit_lab_group">
                  <path d="M102 158 L198 158 L190 250 L110 250 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                  <rect x="140" y="160" width="20" height="90" fill="#0EA5E9" opacity="0.25" />
                  <polygon points="135,158 150,185 165,158" fill="#38BDF8" />
                  {/* Lab pocket & pens */}
                  <rect x="162" y="185" width="18" height="22" rx="2" fill="#E2E8F0" />
                  <line x1="167" y1="178" x2="167" y2="188" stroke="#EF4444" strokeWidth="3" />
                  <line x1="174" y1="178" x2="174" y2="188" stroke="#0284C7" strokeWidth="3" />
                </g>
              )}

              {config.outfitId === 'outfit_detective' && (
                <g id="outfit_detective_group">
                  <path d="M105 160 L195 160 L185 245 L115 245 Z" fill="#334155" />
                  <polygon points="140,160 150,200 160,160" fill="#FFFFFF" />
                  <polygon points="142,166 150,172 142,178" fill="#DC2626" />
                  <polygon points="158,166 150,172 158,178" fill="#DC2626" />
                  <circle cx="150" cy="172" r="3" fill="#991B1B" />
                  <polygon points="120,160 140,205 125,205" fill="#1E293B" />
                  <polygon points="180,160 160,205 175,205" fill="#1E293B" />
                </g>
              )}

              {config.outfitId === 'outfit_varsity' && (
                <g id="outfit_varsity_group">
                  <path d="M104 158 L196 158 L186 246 L114 246 Z" fill="#1E3A8A" />
                  {/* White/cream sleeves shoulder accents */}
                  <path d="M104 158 L120 158 L116 200 L106 196 Z" fill="#FEF3C7" />
                  <path d="M196 158 L180 158 L184 200 L194 196 Z" fill="#FEF3C7" />
                  <line x1="150" y1="162" x2="150" y2="246" stroke="#FEF3C7" strokeWidth="2.5" />
                  <circle cx="132" cy="190" r="10" fill="#F59E0B" />
                  <text x="132" y="194" fill="#1E3A8A" fontSize="11" fontWeight="bold" textAnchor="middle">A+</text>
                </g>
              )}

              {config.outfitId === 'outfit_aodai_tech' && (
                <g id="outfit_aodai_group">
                  <path d="M102 158 L198 158 L190 256 L110 256 Z" fill="#B91C1C" stroke="#F59E0B" strokeWidth="2" />
                  <path d="M135 158 Q150 174 165 158" fill="none" stroke="#FDE047" strokeWidth="3.5" />
                  <circle cx="150" cy="196" r="15" fill="none" stroke="#FDE047" strokeWidth="2.5" />
                  <text x="150" y="201" fill="#FEF08A" fontSize="11" fontWeight="bold" textAnchor="middle">★</text>
                </g>
              )}

              {config.outfitId === 'outfit_scholar' && (
                <g id="outfit_scholar_group">
                  <path d="M98 158 L202 158 L190 252 L110 252 Z" fill="#581C87" />
                  <path d="M98 158 Q150 175 202 158" stroke="#F59E0B" strokeWidth="4" fill="none" />
                  <circle cx="150" cy="190" r="14" fill="#FBBF24" filter="url(#glowEffect)" />
                  <text x="150" y="195" fill="#581C87" fontSize="14" fontWeight="bold" textAnchor="middle">Σ</text>
                </g>
              )}

              {config.outfitId === 'outfit_cyber' && (
                <g id="outfit_cyber_group">
                  <path d="M100 158 L200 158 L185 248 L115 248 Z" fill="url(#cyberSuit)" stroke="#06B6D4" strokeWidth="2" />
                  <circle cx="150" cy="195" r="16" fill="#0891B2" filter="url(#glowEffect)" />
                  <circle cx="150" cy="195" r="8" fill="#A5F3FC" />
                  <line x1="120" y1="180" x2="135" y2="180" stroke="#06B6D4" strokeWidth="3" />
                  <line x1="165" y1="180" x2="180" y2="180" stroke="#06B6D4" strokeWidth="3" />
                </g>
              )}
            </g>

            {/* 4. ARMS */}
            <g id="arms-layer">
              <path d="M105 165 Q85 195 90 220" stroke={skin} strokeWidth="16" strokeLinecap="round" fill="none" />
              <path d="M195 165 Q215 195 210 220" stroke={skin} strokeWidth="16" strokeLinecap="round" fill="none" />
            </g>

            {/* 5. HEAD & FACE */}
            <g id="head-layer">
              <rect x="140" y="145" width="20" height="20" fill={skin} />
              <circle cx="112" cy="115" r="11" fill={skin} />
              <circle cx="188" cy="115" r="11" fill={skin} />
              <ellipse cx="150" cy="115" rx="38" ry="42" fill={skin} />
              <ellipse cx="128" cy="125" rx="7" ry="4" fill="#F43F5E" opacity="0.3" />
              <ellipse cx="172" cy="125" rx="7" ry="4" fill="#F43F5E" opacity="0.3" />
              <ellipse cx="150" cy="118" rx="2" ry="3" fill="#D97706" opacity="0.4" />
              <path d="M142 130 Q150 140 158 130" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" fill="#DC2626" />

              {/* EYES & EXPRESSION (with blink animation) */}
              <g className={animated ? 'studio-blink' : ''}>
                {config.eyeExpression === 'glasses_happy' && (
                  <g id="exp_glasses">
                    <circle cx="134" cy="110" r="14" fill="none" stroke="#1E293B" strokeWidth="3" />
                    <circle cx="166" cy="110" r="14" fill="none" stroke="#1E293B" strokeWidth="3" />
                    <line x1="148" y1="110" x2="152" y2="110" stroke="#1E293B" strokeWidth="3" />
                    <path d="M128 111 Q134 105 140 111" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                    <path d="M160 111 Q166 105 172 111" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </g>
                )}

                {config.eyeExpression === 'sparkle_joy' && (
                  <g id="exp_sparkle">
                    <ellipse cx="134" cy="110" rx="9" ry="11" fill="#1E293B" />
                    <ellipse cx="166" cy="110" rx="9" ry="11" fill="#1E293B" />
                    <circle cx="131" cy="107" r="4" fill="#FFFFFF" />
                    <circle cx="163" cy="107" r="4" fill="#FFFFFF" />
                    <circle cx="136" cy="114" r="2" fill="#FFFFFF" />
                    <circle cx="168" cy="114" r="2" fill="#FFFFFF" />
                  </g>
                )}

                {config.eyeExpression === 'cool_wink' && (
                  <g id="exp_wink">
                    <path d="M126 112 Q134 106 142 112" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                    <ellipse cx="166" cy="110" rx="8" ry="10" fill="#1E293B" />
                    <circle cx="164" cy="108" r="3" fill="#FFFFFF" />
                  </g>
                )}

                {config.eyeExpression === 'focused_scholar' && (
                  <g id="exp_scholar">
                    <line x1="125" y1="102" x2="142" y2="106" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                    <line x1="175" y1="102" x2="158" y2="106" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
                    <ellipse cx="134" cy="112" rx="7" ry="8" fill="#1E293B" />
                    <ellipse cx="166" cy="112" rx="7" ry="8" fill="#1E293B" />
                    <circle cx="133" cy="110" r="2.5" fill="#FFFFFF" />
                    <circle cx="165" cy="110" r="2.5" fill="#FFFFFF" />
                  </g>
                )}

                {config.eyeExpression === 'sunglasses_boss' && (
                  <g id="exp_sunglasses">
                    <polygon points="120,102 146,102 142,118 124,118" fill="#0F172A" />
                    <polygon points="154,102 180,102 176,118 158,118" fill="#0F172A" />
                    <line x1="146" y1="106" x2="154" y2="106" stroke="#0F172A" strokeWidth="3" />
                    <line x1="124" y1="108" x2="138" y2="108" stroke="#38BDF8" strokeWidth="1.5" />
                    <line x1="158" y1="108" x2="172" y2="108" stroke="#38BDF8" strokeWidth="1.5" />
                  </g>
                )}
              </g>
            </g>

            {/* 6. HAIR LAYER */}
            <g id="hair-layer">
              {config.hairStyle === 'short_neat' && (
                <path d="M112 110 C110 70 190 70 188 110 C180 95 120 95 112 110 Z" fill={hair} />
              )}

              {config.hairStyle === 'undercut' && (
                <g id="hair_undercut">
                  <path d="M112 115 C112 70 188 65 190 95 C185 80 150 75 125 90 Z" fill={hair} />
                  <path d="M125 78 Q155 60 185 75 Q160 85 135 88 Z" fill={hair} />
                </g>
              )}

              {config.hairStyle === 'messy_spiky' && (
                <path d="M112 105 L118 80 L132 85 L145 65 L158 80 L172 68 L182 85 L190 105 C180 92 120 92 112 105 Z" fill={hair} />
              )}

              {config.hairStyle === 'ponytail' && (
                <g id="hair_ponytail">
                  <path d="M112 115 C110 75 190 75 188 115 C180 95 120 95 112 115 Z" fill={hair} />
                  <ellipse cx="196" cy="95" rx="7" ry="5" fill="#EF4444" />
                  <path d="M198 96 Q225 110 220 145 Q212 140 205 115 Z" fill={hair} />
                </g>
              )}

              {config.hairStyle === 'twintails' && (
                <g id="hair_twintails">
                  <path d="M112 115 C110 75 190 75 188 115 C180 95 120 95 112 115 Z" fill={hair} />
                  <circle cx="106" cy="110" r="5" fill="#EC4899" />
                  <path d="M104 112 Q80 130 92 160 Q96 140 106 120 Z" fill={hair} />
                  <circle cx="194" cy="110" r="5" fill="#EC4899" />
                  <path d="M196 112 Q220 130 208 160 Q204 140 194 120 Z" fill={hair} />
                </g>
              )}

              {config.hairStyle === 'bob_bangs' && (
                <g id="hair_bob">
                  <path d="M110 115 C108 70 192 70 190 115 L192 135 C186 135 184 100 180 100 C160 105 140 105 120 100 C116 100 114 135 108 135 Z" fill={hair} />
                </g>
              )}

              {config.hairStyle === 'curly_wave' && (
                <g id="hair_curly">
                  <circle cx="120" cy="85" r="16" fill={hair} />
                  <circle cx="140" cy="75" r="18" fill={hair} />
                  <circle cx="160" cy="75" r="18" fill={hair} />
                  <circle cx="180" cy="85" r="16" fill={hair} />
                  <circle cx="112" cy="105" r="12" fill={hair} />
                  <circle cx="188" cy="105" r="12" fill={hair} />
                </g>
              )}

              {/* Lab safety goggles on forehead if lab coat equipped */}
              {config.outfitId === 'outfit_lab' && (
                <g id="lab_goggles">
                  <rect x="115" y="79" width="70" height="8" rx="4" fill="#0F172A" />
                  <rect x="122" y="73" width="24" height="16" rx="5" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2.5" />
                  <rect x="154" y="73" width="24" height="16" rx="5" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2.5" />
                </g>
              )}
            </g>

            {/* 7. HANDHELD ITEM (Right Hand) */}
            <g id="handheld-layer">
              {config.handheldId === 'hand_pencil' && (
                <g transform="translate(205, 195) rotate(-30)">
                  <rect x="0" y="0" width="8" height="45" fill="#F59E0B" rx="1" />
                  <polygon points="0,45 8,45 4,55" fill="#FED7AA" />
                  <polygon points="2,50 6,50 4,55" fill="#1E293B" />
                  <rect x="0" y="0" width="8" height="6" fill="#F43F5E" />
                </g>
              )}

              {config.handheldId === 'hand_ruler' && (
                <g transform="translate(200, 185) rotate(-20)">
                  <rect x="0" y="0" width="10" height="55" rx="3" fill="#06B6D4" opacity="0.85" stroke="#0891B2" strokeWidth="1" />
                  <line x1="2" y1="10" x2="8" y2="10" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="2" y1="20" x2="6" y2="20" stroke="#FFFFFF" strokeWidth="1" />
                  <line x1="2" y1="30" x2="8" y2="30" stroke="#FFFFFF" strokeWidth="1.5" />
                  <line x1="2" y1="40" x2="6" y2="40" stroke="#FFFFFF" strokeWidth="1" />
                  <line x1="2" y1="50" x2="8" y2="50" stroke="#FFFFFF" strokeWidth="1.5" />
                </g>
              )}

              {config.handheldId === 'hand_star_wand' && (
                <g transform="translate(202, 175) rotate(12)" filter="url(#glowEffect)">
                  <line x1="8" y1="50" x2="18" y2="12" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" />
                  <polygon points="18,-2 21,7 30,7 23,13 25,22 18,16 11,22 13,13 6,7 15,7" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
                </g>
              )}

              {config.handheldId === 'hand_compass' && (
                <g transform="translate(205, 185) rotate(-15)">
                  <line x1="12" y1="5" x2="2" y2="50" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
                  <line x1="12" y1="5" x2="22" y2="50" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="12" cy="5" r="5" fill="#0284C7" />
                  <circle cx="2" cy="50" r="2" fill="#0F172A" />
                  <circle cx="22" cy="50" r="2" fill="#EF4444" />
                </g>
              )}

              {config.handheldId === 'hand_magnifier' && (
                <g transform="translate(198, 182) rotate(15)">
                  <line x1="12" y1="22" x2="6" y2="46" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="15" cy="12" r="12" fill="#BAE6FD" stroke="#64748B" strokeWidth="3.5" />
                  <path d="M9 8 Q13 4 19 6" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" />
                </g>
              )}

              {config.handheldId === 'hand_casio' && (
                <g transform="translate(195, 185) rotate(-10)" filter="url(#glowEffect)">
                  <rect x="0" y="0" width="28" height="46" rx="4" fill="#0F172A" stroke="#2563EB" strokeWidth="2" />
                  <rect x="3" y="4" width="22" height="12" rx="2" fill="#E2E8F0" />
                  <text x="14" y="13" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">FX PRO</text>
                  <rect x="4" y="18" width="20" height="4" fill="#78350F" />
                  <circle cx="7" cy="28" r="2" fill="#3B82F6" />
                  <circle cx="14" cy="28" r="2" fill="#3B82F6" />
                  <circle cx="21" cy="28" r="2" fill="#3B82F6" />
                  <circle cx="7" cy="36" r="2" fill="#94A3B8" />
                  <circle cx="14" cy="36" r="2" fill="#94A3B8" />
                  <circle cx="21" cy="36" r="2" fill="#EF4444" />
                </g>
              )}

              {config.handheldId === 'hand_trophy_mini' && (
                <g transform="translate(198, 180) rotate(-6)" filter="url(#glowEffect)">
                  <path d="M4 2 L24 2 L20 18 Q14 23 8 18 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
                  <rect x="12" y="20" width="4" height="8" fill="#CA8A04" />
                  <rect x="7" y="28" width="14" height="5" rx="1.5" fill="#78350F" />
                </g>
              )}

              {config.handheldId === 'hand_laser' && (
                <g transform="translate(205, 185) rotate(-45)" filter="url(#glowEffect)">
                  <rect x="0" y="0" width="6" height="35" rx="3" fill="#334155" stroke="#10B981" strokeWidth="1.5" />
                  <line x1="3" y1="0" x2="3" y2="-60" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                </g>
              )}

              {config.handheldId === 'hand_tome' && (
                <g transform="translate(190, 180) rotate(-10)" filter="url(#glowEffect)">
                  <rect x="0" y="0" width="35" height="48" rx="4" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
                  <rect x="4" y="4" width="27" height="40" rx="2" fill="#B45309" />
                  <circle cx="17" cy="24" r="9" fill="#FEF08A" />
                  <text x="17" y="28" fill="#78350F" fontSize="12" fontWeight="bold" textAnchor="middle">√∞</text>
                </g>
              )}
            </g>

            {/* 8. PHONE ITEM (Left Hand) */}
            <g id="phone-layer">
              {config.phoneId === 'phone_brick' && (
                <g transform="translate(72, 195) rotate(15)">
                  <rect x="0" y="0" width="20" height="38" rx="5" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />
                  <rect x="3" y="4" width="14" height="12" rx="2" fill="#84CC16" />
                  <circle cx="10" cy="22" r="3" fill="#94A3B8" />
                  <rect x="4" y="27" width="12" height="7" rx="1" fill="#64748B" />
                </g>
              )}

              {config.phoneId === 'phone_walkie' && (
                <g transform="translate(70, 192) rotate(12)">
                  <rect x="14" y="-12" width="3" height="14" rx="1.5" fill="#1E293B" />
                  <rect x="0" y="0" width="20" height="40" rx="4" fill="#15803D" stroke="#064E3B" strokeWidth="1.5" />
                  <rect x="3" y="4" width="14" height="12" rx="2" fill="#FEF08A" />
                  <line x1="4" y1="22" x2="16" y2="22" stroke="#064E3B" strokeWidth="2" />
                  <line x1="4" y1="27" x2="16" y2="27" stroke="#064E3B" strokeWidth="2" />
                </g>
              )}

              {config.phoneId === 'phone_flip' && (
                <g transform="translate(74, 195) rotate(15)">
                  <rect x="0" y="0" width="18" height="25" rx="3" fill="#EC4899" />
                  <circle cx="9" cy="8" r="4" fill="#FCE7F3" />
                </g>
              )}

              {config.phoneId === 'phone_smart' && (
                <g transform="translate(68, 190) rotate(12)">
                  <rect x="0" y="0" width="24" height="44" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                  <rect x="2" y="2" width="20" height="40" rx="3" fill="#0284C7" />
                  <circle cx="12" cy="6" r="1.5" fill="#FFFFFF" />
                </g>
              )}

              {config.phoneId === 'phone_promax' && (
                <g transform="translate(65, 185) rotate(10)" filter="url(#glowEffect)">
                  <rect x="0" y="0" width="26" height="48" rx="5" fill="#D97706" stroke="#FEF08A" strokeWidth="1.5" />
                  <rect x="2" y="2" width="22" height="44" rx="4" fill="#1E293B" />
                  <circle cx="7" cy="8" r="2.5" fill="#D97706" stroke="#FEF08A" strokeWidth="0.8" />
                  <circle cx="13" cy="8" r="2.5" fill="#D97706" stroke="#FEF08A" strokeWidth="0.8" />
                  <circle cx="10" cy="14" r="2.5" fill="#D97706" stroke="#FEF08A" strokeWidth="0.8" />
                </g>
              )}

              {config.phoneId === 'phone_holo' && (
                <g transform="translate(62, 185)" filter="url(#glowEffect)">
                  <ellipse cx="14" cy="40" rx="14" ry="4" fill="#06B6D4" />
                  <polygon points="14,40 2,10 26,10" fill="#22D3EE" opacity="0.45" />
                  <text x="14" y="22" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">AI 3D</text>
                </g>
              )}
            </g>
          </g>

          {/* 9. TECH / LAPTOP (Beside Student) */}
          {showTech && (
            <g id="tech-layer">
              {config.techId === 'tech_notebook' && (
                <g transform="translate(30, 240)">
                  <rect x="0" y="0" width="38" height="48" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                  <rect x="6" y="8" width="26" height="16" rx="2" fill="#FFFFFF" />
                  <text x="19" y="16" fill="#1E293B" fontSize="6" fontWeight="bold" textAnchor="middle">VỞ GHI</text>
                  <text x="19" y="22" fill="#2563EB" fontSize="5" textAnchor="middle">SGK 1-9</text>
                  <line x1="4" y1="30" x2="34" y2="30" stroke="#93C5FD" strokeWidth="1" />
                  <line x1="4" y1="36" x2="34" y2="36" stroke="#93C5FD" strokeWidth="1" />
                </g>
              )}

              {config.techId === 'tech_abacus' && (
                <g transform="translate(24, 244)">
                  <rect x="0" y="0" width="44" height="36" rx="3" fill="#92400E" />
                  <rect x="4" y="4" width="36" height="28" fill="#FEF3C7" />
                  <line x1="4" y1="13" x2="40" y2="13" stroke="#78350F" strokeWidth="1.5" />
                  <line x1="4" y1="23" x2="40" y2="23" stroke="#78350F" strokeWidth="1.5" />
                  <circle cx="12" cy="13" r="3" fill="#EF4444" />
                  <circle cx="22" cy="13" r="3" fill="#F59E0B" />
                  <circle cx="30" cy="23" r="3" fill="#2563EB" />
                  <circle cx="16" cy="23" r="3" fill="#10B981" />
                </g>
              )}

              {config.techId === 'tech_tablet' && (
                <g transform="translate(25, 230)">
                  <rect x="0" y="0" width="46" height="58" rx="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
                  <rect x="3" y="3" width="40" height="52" rx="2" fill="#EFF6FF" />
                  <text x="23" y="18" fill="#1E40AF" fontSize="6" fontWeight="bold" textAnchor="middle">SGK SỐ</text>
                  <text x="23" y="28" fill="#3B82F6" fontSize="5" textAnchor="middle">LỚP 1-9</text>
                  <rect x="8" y="34" width="30" height="15" rx="2" fill="#DBEAFE" />
                </g>
              )}

              {config.techId === 'tech_ultrabook' && (
                <g transform="translate(20, 240)">
                  <polygon points="10,10 45,10 52,38 3,38" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
                  <rect x="12" y="12" width="31" height="22" fill="#0F172A" />
                  <rect x="0" y="38" width="55" height="6" rx="2" fill="#94A3B8" />
                </g>
              )}

              {config.techId === 'tech_gaming' && (
                <g transform="translate(15, 235)" filter="url(#glowEffect)">
                  <polygon points="12,8 52,8 60,38 4,38" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
                  <rect x="15" y="10" width="34" height="24" fill="#1E1B4B" />
                  <text x="32" y="24" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">&gt;GAME_</text>
                  <rect x="2" y="38" width="60" height="8" rx="2" fill="url(#rgbKey)" />
                </g>
              )}

              {config.techId === 'tech_quantum' && (
                <g transform="translate(25, 220)" filter="url(#glowEffect)" className={animated ? 'studio-float' : ''}>
                  <circle cx="25" cy="25" r="18" fill="#0284C7" opacity="0.3" />
                  <circle cx="25" cy="25" r="10" fill="#38BDF8" />
                  <ellipse cx="25" cy="25" rx="24" ry="8" fill="none" stroke="#F59E0B" strokeWidth="2" transform="rotate(30 25 25)" />
                  <ellipse cx="25" cy="25" rx="24" ry="8" fill="none" stroke="#10B981" strokeWidth="2" transform="rotate(-30 25 25)" />
                </g>
              )}
            </g>
          )}
        </g>

        {/* 10. COMPANION PET (Right Side with cheerful bob animation) */}
        {showPet && config.petId !== 'pet_none' && (
          <g id="pet-layer" className={animated ? 'studio-pet-bob' : ''}>
            {config.petId === 'pet_corgi' && (
              <g transform="translate(228, 246)">
                <ellipse cx="20" cy="30" rx="16" ry="11" fill="#F97316" />
                <ellipse cx="14" cy="32" rx="8" ry="6" fill="#FFFFFF" />
                <circle cx="17" cy="15" r="11" fill="#FDBA74" />
                <ellipse cx="17" cy="18" rx="7" ry="5" fill="#FFFFFF" />
                <polygon points="8,10 12,1 17,9" fill="#EA580C" />
                <polygon points="18,9 23,1 27,10" fill="#EA580C" />
                <circle cx="13" cy="14" r="1.8" fill="#1E293B" />
                <circle cx="21" cy="14" r="1.8" fill="#1E293B" />
                <circle cx="17" cy="17" r="2" fill="#1E293B" />
                <polygon points="13,24 21,24 17,28" fill="#EF4444" />
              </g>
            )}

            {config.petId === 'pet_cat' && (
              <g transform="translate(230, 245)">
                <ellipse cx="20" cy="30" rx="15" ry="12" fill="#F97316" />
                <circle cx="18" cy="16" r="11" fill="#FDBA74" />
                <polygon points="10,10 14,3 18,10" fill="#EA580C" />
                <polygon points="20,10 24,3 28,10" fill="#EA580C" />
                <circle cx="14" cy="15" r="2" fill="#1E293B" />
                <circle cx="22" cy="15" r="2" fill="#1E293B" />
                <path d="M16 19 Q18 22 20 19" stroke="#991B1B" strokeWidth="1.5" fill="none" />
                <path d="M33 32 Q42 20 38 10" stroke="#F97316" strokeWidth="4" strokeLinecap="round" fill="none" />
              </g>
            )}

            {config.petId === 'pet_bunny' && (
              <g transform="translate(230, 236)">
                <ellipse cx="14" cy="8" rx="4" ry="11" fill="#FFFFFF" stroke="#F472B6" strokeWidth="1.5" />
                <ellipse cx="24" cy="8" rx="4" ry="11" fill="#FFFFFF" stroke="#F472B6" strokeWidth="1.5" />
                <ellipse cx="19" cy="36" rx="13" ry="11" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                <circle cx="19" cy="21" r="11" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                <circle cx="15" cy="20" r="3.5" fill="none" stroke="#0284C7" strokeWidth="1.5" />
                <circle cx="23" cy="20" r="3.5" fill="none" stroke="#0284C7" strokeWidth="1.5" />
                <circle cx="15" cy="20" r="1.2" fill="#1E293B" />
                <circle cx="23" cy="20" r="1.2" fill="#1E293B" />
                <circle cx="19" cy="24" r="1.5" fill="#F43F5E" />
              </g>
            )}

            {config.petId === 'pet_owl' && (
              <g transform="translate(230, 235)">
                <ellipse cx="20" cy="30" rx="14" ry="16" fill="#78350F" />
                <ellipse cx="20" cy="32" rx="9" ry="11" fill="#FEF3C7" />
                <circle cx="20" cy="18" r="12" fill="#92400E" />
                <circle cx="15" cy="18" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="25" cy="18" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="15" cy="18" r="3" fill="#1E293B" />
                <circle cx="25" cy="18" r="3" fill="#1E293B" />
                <polygon points="18,22 22,22 20,26" fill="#EA580C" />
                <polygon points="20,4 32,8 20,12 8,8" fill="#1E3A8A" />
                <line x1="28" y1="9" x2="30" y2="16" stroke="#F59E0B" strokeWidth="1.5" />
              </g>
            )}

            {(config.petId === 'pet_robot' || config.petId === 'pet_vuibot') && (
              <g transform="translate(230, 235)" filter="url(#glowEffect)">
                <rect x="8" y="14" width="24" height="28" rx="6" fill="#E2E8F0" stroke="#0284C7" strokeWidth="2" />
                <line x1="20" y1="14" x2="20" y2="4" stroke="#64748B" strokeWidth="2" />
                <circle cx="20" cy="4" r="3" fill="#38BDF8" />
                <rect x="12" y="18" width="16" height="10" rx="2" fill="#0F172A" />
                <circle cx="16" cy="23" r="2" fill="#38BDF8" />
                <circle cx="24" cy="23" r="2" fill="#38BDF8" />
                <line x1="14" y1="34" x2="26" y2="34" stroke="#10B981" strokeWidth="2" />
              </g>
            )}

            {config.petId === 'pet_dragon' && (
              <g transform="translate(230, 225)" filter="url(#glowEffect)">
                <ellipse cx="20" cy="35" rx="14" ry="12" fill="#DC2626" />
                <circle cx="18" cy="20" r="12" fill="#EF4444" />
                <polygon points="12,12 14,4 18,12" fill="#F59E0B" />
                <polygon points="18,12 22,4 24,12" fill="#F59E0B" />
                <circle cx="14" cy="18" r="3" fill="#FEF08A" />
                <circle cx="14" cy="18" r="1.5" fill="#78350F" />
                <path d="M30 35 Q40 25 36 12" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
                <ellipse cx="8" cy="24" rx="4" ry="2" fill="#FBBF24" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
