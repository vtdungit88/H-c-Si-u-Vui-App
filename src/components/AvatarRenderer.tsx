import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarRendererProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showVehicle?: boolean;
  showTech?: boolean;
  showPet?: boolean;
  className?: string;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  config,
  size = 'md',
  showVehicle = true,
  showTech = true,
  showPet = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { width: 120, height: 130, scale: 0.55 },
    md: { width: 200, height: 230, scale: 0.9 },
    lg: { width: 280, height: 320, scale: 1.25 },
    xl: { width: 340, height: 390, scale: 1.5 }
  };

  const { scale } = sizeMap[size];
  const skin = config.skinColor || '#FDDFC6';
  const hair = config.hairColor || '#1E293B';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: sizeMap[size].width,
        height: sizeMap[size].height
      }}
    >
      <svg
        viewBox="0 0 300 350"
        className="w-full h-full overflow-visible drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient definitions for outfits & items */}
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

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. VEHICLE / BASE (Bottom Layer) */}
        {showVehicle && (
          <g id="vehicle-layer" className="transition-all duration-300">
            {config.vehicleId === 'veh_honeycomb' && (
              // Honeycomb yellow sandals
              <g id="honeycomb_sandals">
                <ellipse cx="120" cy="305" rx="16" ry="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                <ellipse cx="120" cy="304" rx="12" ry="4" fill="#FEF08A" />
                <ellipse cx="180" cy="305" rx="16" ry="7" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                <ellipse cx="180" cy="304" rx="12" ry="4" fill="#FEF08A" />
              </g>
            )}

            {config.vehicleId === 'veh_bike_mini' && (
              // Cute teal Martin 107 bike
              <g id="bike_mini">
                <circle cx="85" cy="295" r="24" fill="none" stroke="#64748B" strokeWidth="3" />
                <circle cx="85" cy="295" r="4" fill="#334155" />
                <circle cx="215" cy="295" r="24" fill="none" stroke="#64748B" strokeWidth="3" />
                <circle cx="215" cy="295" r="4" fill="#334155" />
                <path d="M85 295 L140 295 L180 260 L120 260 Z" fill="none" stroke="#0D9488" strokeWidth="5" strokeLinejoin="round" />
                <path d="M140 295 L150 245" stroke="#0D9488" strokeWidth="5" />
                <path d="M140 245 L165 245" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                <path d="M180 260 L215 295" stroke="#0D9488" strokeWidth="4" />
                {/* Bike basket with books */}
                <rect x="195" y="235" width="22" height="16" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
                <rect x="200" y="228" width="12" height="12" rx="1" fill="#3B82F6" />
              </g>
            )}

            {config.vehicleId === 'veh_mountain' && (
              // Mountain bike sporty
              <g id="bike_mountain">
                <circle cx="75" cy="295" r="26" fill="none" stroke="#1E293B" strokeWidth="5" strokeDasharray="3 2" />
                <circle cx="225" cy="295" r="26" fill="none" stroke="#1E293B" strokeWidth="5" strokeDasharray="3 2" />
                <path d="M75 295 L135 295 L185 250 L125 250 Z" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinejoin="round" />
                <path d="M185 250 L225 295" stroke="#EF4444" strokeWidth="5" />
                <path d="M175 235 L215 235" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
              </g>
            )}

            {config.vehicleId === 'veh_ebike' && (
              // Electric scooter/bike
              <g id="bike_ebike">
                <ellipse cx="150" cy="310" rx="90" ry="14" fill="#0284C7" opacity="0.2" />
                <rect x="100" y="280" width="100" height="20" rx="8" fill="#F8FAFC" stroke="#0284C7" strokeWidth="3" />
                <circle cx="95" cy="300" r="16" fill="#334155" stroke="#64748B" strokeWidth="4" />
                <circle cx="205" cy="300" r="16" fill="#334155" stroke="#64748B" strokeWidth="4" />
                <circle cx="220" cy="255" r="6" fill="#38BDF8" filter="url(#glowEffect)" />
              </g>
            )}

            {config.vehicleId === 'veh_hoverboard' && (
              // Neon floating hoverboard
              <g id="hoverboard" filter="url(#glowEffect)">
                <ellipse cx="150" cy="315" rx="75" ry="14" fill="url(#hoverGrad)" />
                <ellipse cx="150" cy="315" rx="65" ry="8" fill="#0F172A" />
                <ellipse cx="150" cy="328" rx="55" ry="6" fill="#38BDF8" opacity="0.6" />
                <circle cx="105" cy="315" r="4" fill="#A5F3FC" />
                <circle cx="195" cy="315" r="4" fill="#A5F3FC" />
              </g>
            )}

            {config.vehicleId === 'veh_magic_carpet' && (
              // Flying Fibonacci Magic Carpet
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
          {/* Default shoes if not honeycomb */}
          {config.vehicleId !== 'veh_honeycomb' && (
            <>
              <ellipse cx="128" cy="300" rx="14" ry="7" fill="#0F172A" />
              <ellipse cx="172" cy="300" rx="14" ry="7" fill="#0F172A" />
            </>
          )}
        </g>

        {/* 3. OUTFIT / TORSO */}
        <g id="outfit-layer">
          {config.outfitId === 'outfit_uniform' && (
            // Crisp white shirt with red scarf (Khăn quàng đỏ)
            <g id="outfit_uniform_group">
              <path d="M105 160 L195 160 L185 245 L115 245 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
              {/* Collar */}
              <polygon points="135,160 150,180 142,160" fill="#F1F5F9" />
              <polygon points="165,160 150,180 158,160" fill="#F1F5F9" />
              {/* Red Scarf (Khăn quàng đỏ) */}
              <path d="M136 168 Q150 178 164 168 L155 210 L150 190 L145 210 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
              {/* School badge */}
              <rect x="120" y="185" width="14" height="10" rx="2" fill="#2563EB" />
              <text x="127" y="193" fill="#FFFFFF" fontSize="5" fontWeight="bold" textAnchor="middle">HSV</text>
            </g>
          )}

          {config.outfitId === 'outfit_sport' && (
            // Sporty orange & navy stripes
            <g id="outfit_sport_group">
              <path d="M105 160 L195 160 L185 245 L115 245 Z" fill="#EA580C" />
              <rect x="135" y="160" width="30" height="85" fill="#1E293B" />
              <line x1="145" y1="160" x2="145" y2="245" stroke="#FFFFFF" strokeWidth="2" />
              <line x1="155" y1="160" x2="155" y2="245" stroke="#FFFFFF" strokeWidth="2" />
              <text x="150" y="210" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">06</text>
            </g>
          )}

          {config.outfitId === 'outfit_hoodie' && (
            // Cozy Math Hoodie
            <g id="outfit_hoodie_group">
              <path d="M100 160 L200 160 L185 248 L115 248 Z" fill="#4F46E5" />
              {/* Hoodie pocket */}
              <rect x="125" y="215" width="50" height="25" rx="6" fill="#4338CA" />
              {/* Math badge: Pi & Infinity */}
              <circle cx="150" cy="188" r="16" fill="#FEF08A" />
              <text x="150" y="193" fill="#4338CA" fontSize="13" fontWeight="bold" textAnchor="middle">π ∞</text>
            </g>
          )}

          {config.outfitId === 'outfit_detective' && (
            // Detective Suit with red bow
            <g id="outfit_detective_group">
              <path d="M105 160 L195 160 L185 245 L115 245 Z" fill="#334155" />
              <polygon points="140,160 150,200 160,160" fill="#FFFFFF" />
              {/* Bowtie */}
              <polygon points="142,166 150,172 142,178" fill="#DC2626" />
              <polygon points="158,166 150,172 158,178" fill="#DC2626" />
              <circle cx="150" cy="172" r="3" fill="#991B1B" />
              {/* Lapels */}
              <polygon points="120,160 140,205 125,205" fill="#1E293B" />
              <polygon points="180,160 160,205 175,205" fill="#1E293B" />
            </g>
          )}

          {config.outfitId === 'outfit_scholar' && (
            // Royal Wizard Cloak
            <g id="outfit_scholar_group">
              <path d="M98 158 L202 158 L190 252 L110 252 Z" fill="#581C87" />
              <path d="M98 158 Q150 175 202 158" stroke="#F59E0B" strokeWidth="4" fill="none" />
              <circle cx="150" cy="190" r="14" fill="#FBBF24" filter="url(#glowEffect)" />
              <text x="150" y="195" fill="#581C87" fontSize="14" fontWeight="bold" textAnchor="middle">Σ</text>
            </g>
          )}

          {config.outfitId === 'outfit_cyber' && (
            // Quantum astronaut mecha suit
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
          {/* Left Arm */}
          <path d="M105 165 Q85 195 90 220" stroke={skin} strokeWidth="16" strokeLinecap="round" fill="none" />
          {/* Right Arm */}
          <path d="M195 165 Q215 195 210 220" stroke={skin} strokeWidth="16" strokeLinecap="round" fill="none" />
        </g>

        {/* 5. HEAD & FACE */}
        <g id="head-layer">
          {/* Neck */}
          <rect x="140" y="145" width="20" height="20" fill={skin} />

          {/* Ears */}
          <circle cx="112" cy="115" r="11" fill={skin} />
          <circle cx="188" cy="115" r="11" fill={skin} />

          {/* Face base */}
          <ellipse cx="150" cy="115" rx="38" ry="42" fill={skin} />

          {/* Cheeks blush */}
          <ellipse cx="128" cy="125" rx="7" ry="4" fill="#F43F5E" opacity="0.3" />
          <ellipse cx="172" cy="125" rx="7" ry="4" fill="#F43F5E" opacity="0.3" />

          {/* Nose */}
          <ellipse cx="150" cy="118" rx="2" ry="3" fill="#D97706" opacity="0.4" />

          {/* Mouth */}
          <path d="M142 130 Q150 140 158 130" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" fill="#DC2626" />

          {/* EYES & EXPRESSION */}
          {config.eyeExpression === 'glasses_happy' && (
            // Round Student Glasses + Happy Smile
            <g id="exp_glasses">
              <circle cx="134" cy="110" r="14" fill="none" stroke="#1E293B" strokeWidth="3" />
              <circle cx="166" cy="110" r="14" fill="none" stroke="#1E293B" strokeWidth="3" />
              <line x1="148" y1="110" x2="152" y2="110" stroke="#1E293B" strokeWidth="3" />
              {/* Happy eyes inside glasses */}
              <path d="M128 111 Q134 105 140 111" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M160 111 Q166 105 172 111" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          )}

          {config.eyeExpression === 'sparkle_joy' && (
            // Big anime sparkle eyes
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
            // Confident wink
            <g id="exp_wink">
              <path d="M126 112 Q134 106 142 112" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <ellipse cx="166" cy="110" rx="8" ry="10" fill="#1E293B" />
              <circle cx="164" cy="108" r="3" fill="#FFFFFF" />
            </g>
          )}

          {config.eyeExpression === 'focused_scholar' && (
            // Determined eyebrows & sharp eyes
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
            // Cool dark sunglasses
            <g id="exp_sunglasses">
              <polygon points="120,102 146,102 142,118 124,118" fill="#0F172A" />
              <polygon points="154,102 180,102 176,118 158,118" fill="#0F172A" />
              <line x1="146" y1="106" x2="154" y2="106" stroke="#0F172A" strokeWidth="3" />
              <line x1="124" y1="108" x2="138" y2="108" stroke="#38BDF8" strokeWidth="1.5" />
              <line x1="158" y1="108" x2="172" y2="108" stroke="#38BDF8" strokeWidth="1.5" />
            </g>
          )}
        </g>

        {/* 6. HAIR LAYER */}
        <g id="hair-layer">
          {config.hairStyle === 'short_neat' && (
            // Neat student cut
            <path d="M112 110 C110 70 190 70 188 110 C180 95 120 95 112 110 Z" fill={hair} />
          )}

          {config.hairStyle === 'undercut' && (
            // Stylish undercut with swept top
            <g id="hair_undercut">
              <path d="M112 115 C112 70 188 65 190 95 C185 80 150 75 125 90 Z" fill={hair} />
              <path d="M125 78 Q155 60 185 75 Q160 85 135 88 Z" fill={hair} />
            </g>
          )}

          {config.hairStyle === 'messy_spiky' && (
            // Spiky anime hair
            <path d="M112 105 L118 80 L132 85 L145 65 L158 80 L172 68 L182 85 L190 105 C180 92 120 92 112 105 Z" fill={hair} />
          )}

          {config.hairStyle === 'ponytail' && (
            // Ponytail with red ribbon
            <g id="hair_ponytail">
              <path d="M112 115 C110 75 190 75 188 115 C180 95 120 95 112 115 Z" fill={hair} />
              <ellipse cx="196" cy="95" rx="7" ry="5" fill="#EF4444" />
              <path d="M198 96 Q225 110 220 145 Q212 140 205 115 Z" fill={hair} />
            </g>
          )}

          {config.hairStyle === 'twintails' && (
            // Twin pigtails with ribbons
            <g id="hair_twintails">
              <path d="M112 115 C110 75 190 75 188 115 C180 95 120 95 112 115 Z" fill={hair} />
              {/* Left bunch */}
              <circle cx="106" cy="110" r="5" fill="#EC4899" />
              <path d="M104 112 Q80 130 92 160 Q96 140 106 120 Z" fill={hair} />
              {/* Right bunch */}
              <circle cx="194" cy="110" r="5" fill="#EC4899" />
              <path d="M196 112 Q220 130 208 160 Q204 140 194 120 Z" fill={hair} />
            </g>
          )}

          {config.hairStyle === 'bob_bangs' && (
            // Cute bob with bangs
            <g id="hair_bob">
              <path d="M110 115 C108 70 192 70 190 115 L192 135 C186 135 184 100 180 100 C160 105 140 105 120 100 C116 100 114 135 108 135 Z" fill={hair} />
            </g>
          )}

          {config.hairStyle === 'curly_wave' && (
            // Curly fluffy hair
            <g id="hair_curly">
              <circle cx="120" cy="85" r="16" fill={hair} />
              <circle cx="140" cy="75" r="18" fill={hair} />
              <circle cx="160" cy="75" r="18" fill={hair} />
              <circle cx="180" cy="85" r="16" fill={hair} />
              <circle cx="112" cy="105" r="12" fill={hair} />
              <circle cx="188" cy="105" r="12" fill={hair} />
            </g>
          )}
        </g>

        {/* 7. HANDHELD ITEM (Right Hand) */}
        <g id="handheld-layer">
          {config.handheldId === 'hand_pencil' && (
            // Yellow 2B pencil
            <g transform="translate(205, 195) rotate(-30)">
              <rect x="0" y="0" width="8" height="45" fill="#F59E0B" rx="1" />
              <polygon points="0,45 8,45 4,55" fill="#FED7AA" />
              <polygon points="2,50 6,50 4,55" fill="#1E293B" />
              <rect x="0" y="0" width="8" height="6" fill="#F43F5E" />
            </g>
          )}

          {config.handheldId === 'hand_ruler' && (
            // Rainbow bendable ruler
            <g transform="translate(200, 185) rotate(-20)">
              <rect x="0" y="0" width="10" height="55" rx="3" fill="#06B6D4" opacity="0.85" stroke="#0891B2" strokeWidth="1" />
              <line x1="2" y1="10" x2="8" y2="10" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="2" y1="20" x2="6" y2="20" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="2" y1="30" x2="8" y2="30" stroke="#FFFFFF" strokeWidth="1.5" />
              <line x1="2" y1="40" x2="6" y2="40" stroke="#FFFFFF" strokeWidth="1" />
              <line x1="2" y1="50" x2="8" y2="50" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          )}

          {config.handheldId === 'hand_compass' && (
            // Compass drafting instrument
            <g transform="translate(205, 185) rotate(-15)">
              <line x1="12" y1="5" x2="2" y2="50" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
              <line x1="12" y1="5" x2="22" y2="50" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
              <circle cx="12" cy="5" r="5" fill="#0284C7" />
              <circle cx="2" cy="50" r="2" fill="#0F172A" />
              <circle cx="22" cy="50" r="2" fill="#EF4444" />
            </g>
          )}

          {config.handheldId === 'hand_casio' && (
            // Casio FX-580VN X with solar strip
            <g transform="translate(195, 185) rotate(-10)" filter="url(#glowEffect)">
              <rect x="0" y="0" width="28" height="46" rx="4" fill="#0F172A" stroke="#2563EB" strokeWidth="2" />
              <rect x="3" y="4" width="22" height="12" rx="2" fill="#E2E8F0" />
              <text x="14" y="13" fill="#0F172A" fontSize="7" fontWeight="bold" textAnchor="middle">580VN X</text>
              <rect x="4" y="18" width="20" height="4" fill="#78350F" />
              <circle cx="7" cy="28" r="2" fill="#3B82F6" />
              <circle cx="14" cy="28" r="2" fill="#3B82F6" />
              <circle cx="21" cy="28" r="2" fill="#3B82F6" />
              <circle cx="7" cy="36" r="2" fill="#94A3B8" />
              <circle cx="14" cy="36" r="2" fill="#94A3B8" />
              <circle cx="21" cy="36" r="2" fill="#EF4444" />
            </g>
          )}

          {config.handheldId === 'hand_laser' && (
            // Sci-fi laser wand
            <g transform="translate(205, 185) rotate(-45)" filter="url(#glowEffect)">
              <rect x="0" y="0" width="6" height="35" rx="3" fill="#334155" stroke="#10B981" strokeWidth="1.5" />
              <line x1="3" y1="0" x2="3" y2="-60" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}

          {config.handheldId === 'hand_tome' && (
            // Ancient golden math tome
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
            // Nokia 3310 blue
            <g transform="translate(72, 195) rotate(15)">
              <rect x="0" y="0" width="20" height="38" rx="5" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="1.5" />
              <rect x="3" y="4" width="14" height="12" rx="2" fill="#84CC16" />
              <circle cx="10" cy="22" r="3" fill="#94A3B8" />
              <rect x="4" y="27" width="12" height="7" rx="1" fill="#64748B" />
            </g>
          )}

          {config.phoneId === 'phone_flip' && (
            // Flip phone
            <g transform="translate(74, 195) rotate(15)">
              <rect x="0" y="0" width="18" height="25" rx="3" fill="#EC4899" />
              <circle cx="9" cy="8" r="4" fill="#FCE7F3" />
            </g>
          )}

          {config.phoneId === 'phone_smart' && (
            // Slim modern smartphone
            <g transform="translate(68, 190) rotate(12)">
              <rect x="0" y="0" width="24" height="44" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
              <rect x="2" y="2" width="20" height="40" rx="3" fill="#0284C7" />
              <circle cx="12" cy="6" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {config.phoneId === 'phone_promax' && (
            // iPhone 16 Pro Max Desert Titanium
            <g transform="translate(65, 185) rotate(10)" filter="url(#glowEffect)">
              <rect x="0" y="0" width="26" height="48" rx="5" fill="#D97706" stroke="#FEF08A" strokeWidth="1.5" />
              <rect x="2" y="2" width="22" height="44" rx="4" fill="#1E293B" />
              {/* Triple camera bump */}
              <circle cx="7" cy="8" r="2.5" fill="#D97706" stroke="#FEF08A" strokeWidth="0.8" />
              <circle cx="13" cy="8" r="2.5" fill="#D97706" stroke="#FEF08A" strokeWidth="0.8" />
              <circle cx="10" cy="14" r="2.5" fill="#D97706" stroke="#FEF08A" strokeWidth="0.8" />
            </g>
          )}

          {config.phoneId === 'phone_holo' && (
            // 3D Holographic projection
            <g transform="translate(62, 185)" filter="url(#glowEffect)">
              <ellipse cx="14" cy="40" rx="14" ry="4" fill="#06B6D4" />
              <polygon points="14,40 2,10 26,10" fill="#22D3EE" opacity="0.4" />
              <text x="14" y="22" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">AI 6</text>
            </g>
          )}
        </g>

        {/* 9. TECH / LAPTOP (Beside Student) */}
        {showTech && (
          <g id="tech-layer">
            {config.techId === 'tech_notebook' && (
              // Bãi Bằng Notebook
              <g transform="translate(30, 240)">
                <rect x="0" y="0" width="38" height="48" rx="3" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
                <rect x="6" y="8" width="26" height="16" rx="2" fill="#FFFFFF" />
                <text x="19" y="16" fill="#1E293B" fontSize="6" fontWeight="bold" textAnchor="middle">VỞ TOÁN</text>
                <text x="19" y="22" fill="#2563EB" fontSize="5" textAnchor="middle">HSV</text>
                <line x1="4" y1="30" x2="34" y2="30" stroke="#93C5FD" strokeWidth="1" />
                <line x1="4" y1="36" x2="34" y2="36" stroke="#93C5FD" strokeWidth="1" />
              </g>
            )}

            {config.techId === 'tech_tablet' && (
              // Tablet with SGK
              <g transform="translate(25, 230)">
                <rect x="0" y="0" width="46" height="58" rx="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
                <rect x="3" y="3" width="40" height="52" rx="2" fill="#EFF6FF" />
                <text x="23" y="18" fill="#1E40AF" fontSize="6" fontWeight="bold" textAnchor="middle">SGK TOÁN 6</text>
                <text x="23" y="28" fill="#3B82F6" fontSize="5" textAnchor="middle">TẬP 1</text>
                <rect x="8" y="34" width="30" height="15" rx="2" fill="#DBEAFE" />
              </g>
            )}

            {config.techId === 'tech_ultrabook' && (
              // Sleek laptop
              <g transform="translate(20, 240)">
                <polygon points="10,10 45,10 52,38 3,38" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
                <rect x="12" y="12" width="31" height="22" fill="#0F172A" />
                <rect x="0" y="38" width="55" height="6" rx="2" fill="#94A3B8" />
              </g>
            )}

            {config.techId === 'tech_gaming' && (
              // RGB Gaming Laptop
              <g transform="translate(15, 235)" filter="url(#glowEffect)">
                <polygon points="12,8 52,8 60,38 4,38" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
                <rect x="15" y="10" width="34" height="24" fill="#1E1B4B" />
                <text x="32" y="24" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">&gt;GAME_</text>
                {/* RGB keyboard */}
                <rect x="2" y="38" width="60" height="8" rx="2" fill="url(#rgbKey)" />
              </g>
            )}

            {config.techId === 'tech_quantum' && (
              // Floating Quantum AI core
              <g transform="translate(25, 220)" filter="url(#glowEffect)">
                <circle cx="25" cy="25" r="18" fill="#0284C7" opacity="0.3" />
                <circle cx="25" cy="25" r="10" fill="#38BDF8" />
                <ellipse cx="25" cy="25" rx="24" ry="8" fill="none" stroke="#F59E0B" strokeWidth="2" transform="rotate(30 25 25)" />
                <ellipse cx="25" cy="25" rx="24" ry="8" fill="none" stroke="#10B981" strokeWidth="2" transform="rotate(-30 25 25)" />
              </g>
            )}
          </g>
        )}

        {/* 10. COMPANION PET (Left / Right Side) */}
        {showPet && (
          <g id="pet-layer">
            {config.petId === 'pet_cat' && (
              // Cute calico cat
              <g transform="translate(230, 245)">
                <ellipse cx="20" cy="30" rx="15" ry="12" fill="#F97316" />
                <circle cx="18" cy="16" r="11" fill="#FDBA74" />
                {/* Ears */}
                <polygon points="10,10 14,3 18,10" fill="#EA580C" />
                <polygon points="20,10 24,3 28,10" fill="#EA580C" />
                {/* Face */}
                <circle cx="14" cy="15" r="2" fill="#1E293B" />
                <circle cx="22" cy="15" r="2" fill="#1E293B" />
                <path d="M16 19 Q18 22 20 19" stroke="#991B1B" strokeWidth="1.5" fill="none" />
                {/* Tail */}
                <path d="M33 32 Q42 20 38 10" stroke="#F97316" strokeWidth="4" strokeLinecap="round" fill="none" />
              </g>
            )}

            {config.petId === 'pet_owl' && (
              // Wise owl with grad cap
              <g transform="translate(230, 235)">
                <ellipse cx="20" cy="30" rx="14" ry="16" fill="#78350F" />
                <ellipse cx="20" cy="32" rx="9" ry="11" fill="#FEF3C7" />
                <circle cx="20" cy="18" r="12" fill="#92400E" />
                {/* Glasses */}
                <circle cx="15" cy="18" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="25" cy="18" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
                <circle cx="15" cy="18" r="3" fill="#1E293B" />
                <circle cx="25" cy="18" r="3" fill="#1E293B" />
                <polygon points="18,22 22,22 20,26" fill="#EA580C" />
                {/* Graduation cap */}
                <polygon points="20,4 32,8 20,12 8,8" fill="#1E3A8A" />
                <line x1="28" y1="9" x2="30" y2="16" stroke="#F59E0B" strokeWidth="1.5" />
              </g>
            )}

            {config.petId === 'pet_robot' && (
              // Mini AI Robot
              <g transform="translate(230, 235)" filter="url(#glowEffect)">
                <rect x="8" y="14" width="24" height="28" rx="6" fill="#E2E8F0" stroke="#0284C7" strokeWidth="2" />
                <line x1="20" y1="14" x2="20" y2="4" stroke="#64748B" strokeWidth="2" />
                <circle cx="20" cy="4" r="3" fill="#EF4444" />
                <rect x="12" y="18" width="16" height="10" rx="2" fill="#0F172A" />
                <circle cx="16" cy="23" r="2" fill="#38BDF8" />
                <circle cx="24" cy="23" r="2" fill="#38BDF8" />
                <line x1="14" y1="34" x2="26" y2="34" stroke="#10B981" strokeWidth="2" />
              </g>
            )}

            {config.petId === 'pet_dragon' && (
              // Mini Chibi Dragon
              <g transform="translate(230, 225)" filter="url(#glowEffect)">
                <ellipse cx="20" cy="35" rx="14" ry="12" fill="#DC2626" />
                <circle cx="18" cy="20" r="12" fill="#EF4444" />
                <polygon points="12,12 14,4 18,12" fill="#F59E0B" />
                <polygon points="18,12 22,4 24,12" fill="#F59E0B" />
                <circle cx="14" cy="18" r="3" fill="#FEF08A" />
                <circle cx="14" cy="18" r="1.5" fill="#78350F" />
                <path d="M30 35 Q40 25 36 12" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Fire puff */}
                <ellipse cx="8" cy="24" rx="4" ry="2" fill="#FBBF24" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
