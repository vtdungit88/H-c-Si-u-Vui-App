import React from 'react';
import { ItemCategory, ItemRarity } from '../types';

interface StudioItemThumbnailProps {
  renderType: string;
  category: ItemCategory;
  rarity: ItemRarity;
  size?: 'sm' | 'md' | 'lg';
}

const RARITY_BG: Record<ItemRarity, string> = {
  base: 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900',
  popular: 'from-sky-50 to-blue-100 dark:from-sky-950/60 dark:to-blue-900/50',
  vip: 'from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-orange-900/40',
  mythic: 'from-violet-100 via-fuchsia-50 to-cyan-100 dark:from-violet-950/70 dark:via-purple-900/50 dark:to-cyan-950/60'
};

export const StudioItemThumbnail: React.FC<StudioItemThumbnailProps> = ({
  renderType,
  category,
  rarity,
  size = 'md'
}) => {
  const dim = size === 'lg' ? 'w-24 h-24' : size === 'sm' ? 'w-11 h-11' : 'w-16 h-16';

  const renderArtwork = () => {
    // BACKDROPS
    if (category === 'backdrop') {
      const palette: Record<string, { sky: string; ground: string; accent: string }> = {
        bg_classroom: { sky: '#DBEAFE', ground: '#F59E0B', accent: '#15803D' },
        bg_forest: { sky: '#38BDF8', ground: '#16A34A', accent: '#A5F3FC' },
        bg_lab: { sky: '#1E3A8A', ground: '#0F172A', accent: '#38BDF8' },
        bg_arena: { sky: '#B45309', ground: '#F59E0B', accent: '#FEF08A' },
        bg_galaxy: { sky: '#1E1B4B', ground: '#312E81', accent: '#FDE047' }
      };
      const c = palette[renderType] || palette.bg_classroom;
      return (
        <g>
          <rect x="10" y="14" width="60" height="52" rx="10" fill={c.sky} stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M10 48 Q40 40 70 48 L70 56 Q70 66 60 66 L20 66 Q10 66 10 56 Z" fill={c.ground} />
          <circle cx="26" cy="29" r="6" fill={c.accent} />
          <rect x="40" y="25" width="22" height="14" rx="3" fill={c.accent} opacity="0.8" />
        </g>
      );
    }

    // AURAS
    if (category === 'aura') {
      const auraColor =
        renderType === 'aura_flame'
          ? '#F59E0B'
          : renderType === 'aura_electric'
          ? '#0EA5E9'
          : renderType === 'aura_sparkle'
          ? '#EAB308'
          : '#94A3B8';
      return (
        <g>
          <circle cx="40" cy="40" r="24" fill="none" stroke={auraColor} strokeWidth="3" strokeDasharray={renderType === 'aura_none' ? '4 4' : 'none'} opacity="0.85" />
          <circle cx="40" cy="40" r="16" fill="none" stroke={auraColor} strokeWidth="2" opacity="0.5" />
          {renderType !== 'aura_none' && (
            <>
              <polygon points="40,10 43,18 51,18 44,23 47,30 40,25 33,30 36,23 29,18 37,18" fill={auraColor} />
              <circle cx="18" cy="52" r="3" fill={auraColor} />
              <circle cx="62" cy="52" r="3" fill={auraColor} />
            </>
          )}
        </g>
      );
    }

    // OUTFITS
    if (category === 'outfit') {
      const outfitColors: Record<string, { main: string; trim: string; badge: string }> = {
        uniform: { main: '#FFFFFF', trim: '#DC2626', badge: '#2563EB' },
        scout: { main: '#D97706', trim: '#78350F', badge: '#10B981' },
        sport: { main: '#EA580C', trim: '#1E293B', badge: '#FFFFFF' },
        hoodie: { main: '#4F46E5', trim: '#312E81', badge: '#FEF08A' },
        lab: { main: '#F8FAFC', trim: '#0284C7', badge: '#06B6D4' },
        detective: { main: '#334155', trim: '#1E293B', badge: '#DC2626' },
        varsity: { main: '#1E3A8A', trim: '#FEF3C7', badge: '#F59E0B' },
        aodai_tech: { main: '#B91C1C', trim: '#F59E0B', badge: '#FEF08A' },
        scholar: { main: '#6B21A8', trim: '#F59E0B', badge: '#FDE047' },
        cyber: { main: '#0F172A', trim: '#06B6D4', badge: '#38BDF8' }
      };
      const c = outfitColors[renderType] || outfitColors.uniform;
      return (
        <g>
          {/* Sleeves */}
          <path d="M16 24 L27 18 L27 38 L13 38 Z" fill={c.trim} />
          <path d="M64 24 L53 18 L53 38 L67 38 Z" fill={c.trim} />
          {/* Torso */}
          <path d="M24 18 L56 18 L52 64 L28 64 Z" fill={c.main} stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Collar / Accent */}
          <polygon points="33,18 40,30 47,18" fill={c.trim} />
          <circle cx="40" cy="43" r="7" fill={c.badge} />
        </g>
      );
    }

    // HANDHELDS
    if (category === 'handheld') {
      if (renderType === 'pencil') {
        return (
          <g transform="rotate(-35 40 40)">
            <rect x="35" y="14" width="10" height="42" rx="2" fill="#F59E0B" />
            <rect x="35" y="14" width="10" height="7" rx="1" fill="#F43F5E" />
            <polygon points="35,56 45,56 40,67" fill="#FED7AA" />
            <polygon points="38,62 42,62 40,67" fill="#1E293B" />
          </g>
        );
      }
      if (renderType === 'ruler') {
        return (
          <g transform="rotate(-25 40 40)">
            <rect x="32" y="12" width="16" height="56" rx="4" fill="#06B6D4" stroke="#0E7490" strokeWidth="2" />
            <line x1="34" y1="22" x2="42" y2="22" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="34" y1="32" x2="40" y2="32" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="34" y1="42" x2="42" y2="42" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="34" y1="52" x2="40" y2="52" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        );
      }
      if (renderType === 'star_wand') {
        return (
          <g>
            <line x1="22" y1="62" x2="48" y2="32" stroke="#EC4899" strokeWidth="5" strokeLinecap="round" />
            <polygon points="50,12 54,23 66,23 56,30 60,41 50,34 40,41 44,30 34,23 46,23" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          </g>
        );
      }
      if (renderType === 'magnifier') {
        return (
          <g>
            <line x1="48" y1="48" x2="64" y2="64" stroke="#78350F" strokeWidth="7" strokeLinecap="round" />
            <circle cx="36" cy="36" r="18" fill="#BAE6FD" stroke="#64748B" strokeWidth="4" />
            <path d="M27 29 Q32 23 39 25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );
      }
      if (renderType === 'casio') {
        return (
          <g>
            <rect x="23" y="12" width="34" height="56" rx="5" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" />
            <rect x="28" y="17" width="24" height="13" rx="2" fill="#E2E8F0" />
            <circle cx="31" cy="40" r="3" fill="#38BDF8" />
            <circle cx="40" cy="40" r="3" fill="#38BDF8" />
            <circle cx="49" cy="40" r="3" fill="#38BDF8" />
            <circle cx="31" cy="50" r="3" fill="#94A3B8" />
            <circle cx="40" cy="50" r="3" fill="#94A3B8" />
            <circle cx="49" cy="50" r="3" fill="#EF4444" />
          </g>
        );
      }
      if (renderType === 'trophy_mini') {
        return (
          <g>
            <path d="M25 18 L55 18 L50 42 Q40 50 30 42 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            <path d="M25 22 Q15 22 18 33 Q21 38 28 36" fill="none" stroke="#EAB308" strokeWidth="3" />
            <path d="M55 22 Q65 22 62 33 Q59 38 52 36" fill="none" stroke="#EAB308" strokeWidth="3" />
            <rect x="36" y="45" width="8" height="12" fill="#CA8A04" />
            <rect x="28" y="57" width="24" height="7" rx="2" fill="#78350F" />
          </g>
        );
      }
      if (renderType === 'laser') {
        return (
          <g transform="rotate(-40 40 40)">
            <rect x="36" y="42" width="8" height="24" rx="3" fill="#334155" stroke="#10B981" strokeWidth="1.5" />
            <rect x="38" y="8" width="4" height="35" rx="2" fill="#34D399" />
          </g>
        );
      }
      if (renderType === 'tome') {
        return (
          <g>
            <rect x="20" y="14" width="40" height="52" rx="5" fill="#78350F" stroke="#F59E0B" strokeWidth="2.5" />
            <rect x="25" y="19" width="30" height="42" rx="2" fill="#B45309" />
            <circle cx="40" cy="40" r="10" fill="#FEF08A" />
            <text x="40" y="44" fill="#78350F" fontSize="11" fontWeight="bold" textAnchor="middle">Σ</text>
          </g>
        );
      }
      // compass
      return (
        <g>
          <circle cx="40" cy="20" r="6" fill="#0284C7" />
          <line x1="40" y1="24" x2="24" y2="62" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="40" y1="24" x2="56" y2="62" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="30" y1="45" x2="50" y2="45" stroke="#0284C7" strokeWidth="3" />
        </g>
      );
    }

    // PHONES
    if (category === 'phone') {
      const phonePalette: Record<string, { body: string; screen: string }> = {
        brick: { body: '#1E3A8A', screen: '#84CC16' },
        walkie: { body: '#15803D', screen: '#FACC15' },
        flip: { body: '#EC4899', screen: '#FCE7F3' },
        smart: { body: '#0F172A', screen: '#38BDF8' },
        promax: { body: '#D97706', screen: '#1E293B' },
        holo: { body: '#0284C7', screen: '#A5F3FC' }
      };
      const p = phonePalette[renderType] || phonePalette.smart;
      return (
        <g>
          {renderType === 'walkie' && <rect x="46" y="8" width="4" height="14" rx="2" fill="#334155" />}
          <rect x="25" y="14" width="30" height="52" rx="6" fill={p.body} stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="29" y="19" width="22" height="34" rx="3" fill={p.screen} />
          {renderType === 'holo' && (
            <polygon points="40,34 26,12 54,12" fill="#22D3EE" opacity="0.65" />
          )}
          <circle cx="40" cy="59" r="2.5" fill="#FFFFFF" opacity="0.8" />
        </g>
      );
    }

    // VEHICLES
    if (category === 'vehicle') {
      if (renderType === 'honeycomb') {
        return (
          <g>
            <ellipse cx="40" cy="42" rx="24" ry="11" fill="#FACC15" stroke="#CA8A04" strokeWidth="2.5" />
            <ellipse cx="40" cy="39" rx="16" ry="6" fill="#FEF08A" />
            <circle cx="32" cy="42" r="2" fill="#CA8A04" />
            <circle cx="40" cy="42" r="2" fill="#CA8A04" />
            <circle cx="48" cy="42" r="2" fill="#CA8A04" />
          </g>
        );
      }
      if (renderType === 'skateboard') {
        return (
          <g transform="rotate(-12 40 40)">
            <rect x="12" y="34" width="56" height="10" rx="5" fill="#F97316" stroke="#1E293B" strokeWidth="2" />
            <circle cx="24" cy="48" r="5" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="56" cy="48" r="5" fill="#38BDF8" stroke="#0F172A" strokeWidth="1.5" />
          </g>
        );
      }
      if (renderType === 'spaceship') {
        return (
          <g>
            <path d="M40 12 Q56 30 52 54 L28 54 Q24 30 40 12 Z" fill="#E2E8F0" stroke="#0284C7" strokeWidth="2" />
            <circle cx="40" cy="33" r="6" fill="#38BDF8" />
            <polygon points="28,44 18,58 28,54" fill="#EF4444" />
            <polygon points="52,44 62,58 52,54" fill="#EF4444" />
            <polygon points="34,54 46,54 40,68" fill="#F59E0B" />
          </g>
        );
      }
      if (renderType === 'carpet') {
        return (
          <g>
            <path d="M12 42 Q40 28 68 42 Q56 56 40 56 Q24 56 12 42 Z" fill="#7C3AED" stroke="#F59E0B" strokeWidth="2.5" />
            <path d="M20 42 Q40 34 60 42" stroke="#FEF08A" strokeWidth="2" strokeDasharray="3 2" fill="none" />
          </g>
        );
      }
      if (renderType === 'hoverboard') {
        return (
          <g>
            <ellipse cx="40" cy="44" rx="26" ry="8" fill="#06B6D4" stroke="#0F172A" strokeWidth="2" />
            <ellipse cx="40" cy="54" rx="18" ry="4" fill="#38BDF8" opacity="0.5" />
          </g>
        );
      }
      // Bikes & Scooters
      const frameColor =
        renderType === 'mountain'
          ? '#EF4444'
          : renderType === 'scooter_pastel'
          ? '#34D399'
          : renderType === 'ebike'
          ? '#0284C7'
          : '#0D9488';
      return (
        <g>
          <circle cx="22" cy="50" r="10" fill="none" stroke="#334155" strokeWidth="3.5" />
          <circle cx="58" cy="50" r="10" fill="none" stroke="#334155" strokeWidth="3.5" />
          <path d="M22 50 L38 50 L48 32 L30 32 Z" fill="none" stroke={frameColor} strokeWidth="4" strokeLinejoin="round" />
          <path d="M48 32 L58 50" stroke={frameColor} strokeWidth="3.5" />
          <line x1="44" y1="26" x2="54" y2="26" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    }

    // TECH
    if (category === 'tech') {
      if (renderType === 'notebook') {
        return (
          <g>
            <rect x="22" y="14" width="36" height="52" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <rect x="28" y="22" width="24" height="16" rx="2" fill="#FFFFFF" />
            <line x1="27" y1="46" x2="53" y2="46" stroke="#BFDBFE" strokeWidth="2" />
            <line x1="27" y1="54" x2="47" y2="54" stroke="#BFDBFE" strokeWidth="2" />
          </g>
        );
      }
      if (renderType === 'abacus') {
        return (
          <g>
            <rect x="14" y="18" width="52" height="44" rx="4" fill="#92400E" />
            <rect x="19" y="23" width="42" height="34" fill="#FEF3C7" />
            <line x1="19" y1="32" x2="61" y2="32" stroke="#78350F" strokeWidth="2" />
            <line x1="19" y1="45" x2="61" y2="45" stroke="#78350F" strokeWidth="2" />
            <circle cx="28" cy="32" r="4" fill="#EF4444" />
            <circle cx="38" cy="32" r="4" fill="#F59E0B" />
            <circle cx="48" cy="45" r="4" fill="#2563EB" />
            <circle cx="32" cy="45" r="4" fill="#10B981" />
          </g>
        );
      }
      if (renderType === 'quantum') {
        return (
          <g>
            <circle cx="40" cy="40" r="10" fill="#38BDF8" />
            <ellipse cx="40" cy="40" rx="26" ry="9" fill="none" stroke="#F59E0B" strokeWidth="2.5" transform="rotate(30 40 40)" />
            <ellipse cx="40" cy="40" rx="26" ry="9" fill="none" stroke="#10B981" strokeWidth="2.5" transform="rotate(-30 40 40)" />
          </g>
        );
      }
      // Tablet / Laptops
      return (
        <g>
          <rect x="16" y="20" width="48" height="32" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
          <rect x="20" y="24" width="40" height="24" rx="2" fill={renderType === 'gaming' ? '#312E81' : '#DBEAFE'} />
          <rect x="10" y="54" width="60" height="7" rx="3" fill={renderType === 'gaming' ? '#F59E0B' : '#94A3B8'} />
        </g>
      );
    }

    // PETS
    if (category === 'pet') {
      if (renderType === 'none') {
        return (
          <g>
            <circle cx="40" cy="40" r="20" fill="#E2E8F0" />
            <circle cx="33" cy="36" r="2.5" fill="#475569" />
            <circle cx="47" cy="36" r="2.5" fill="#475569" />
            <path d="M33 46 Q40 52 47 46" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );
      }
      if (renderType === 'corgi') {
        return (
          <g>
            <polygon points="20,30 26,14 34,26" fill="#F97316" />
            <polygon points="60,30 54,14 46,26" fill="#F97316" />
            <circle cx="40" cy="40" r="18" fill="#FDBA74" />
            <ellipse cx="40" cy="44" rx="11" ry="8" fill="#FFFFFF" />
            <circle cx="33" cy="36" r="2.5" fill="#1E293B" />
            <circle cx="47" cy="36" r="2.5" fill="#1E293B" />
            <circle cx="40" cy="42" r="3" fill="#1E293B" />
            <polygon points="34,57 46,57 40,62" fill="#EF4444" />
          </g>
        );
      }
      if (renderType === 'bunny') {
        return (
          <g>
            <ellipse cx="32" cy="20" rx="5" ry="14" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
            <ellipse cx="48" cy="20" rx="5" ry="14" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
            <circle cx="40" cy="44" r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="34" cy="42" r="4" fill="none" stroke="#0284C7" strokeWidth="2" />
            <circle cx="46" cy="42" r="4" fill="none" stroke="#0284C7" strokeWidth="2" />
            <circle cx="40" cy="48" r="2" fill="#F43F5E" />
          </g>
        );
      }
      if (renderType === 'robot') {
        return (
          <g>
            <line x1="40" y1="12" x2="40" y2="22" stroke="#64748B" strokeWidth="3" />
            <circle cx="40" cy="11" r="4" fill="#38BDF8" />
            <rect x="22" y="22" width="36" height="36" rx="10" fill="#E2E8F0" stroke="#0284C7" strokeWidth="2.5" />
            <rect x="27" y="30" width="26" height="14" rx="4" fill="#0F172A" />
            <circle cx="34" cy="37" r="3" fill="#38BDF8" />
            <circle cx="46" cy="37" r="3" fill="#38BDF8" />
          </g>
        );
      }
      if (renderType === 'dragon') {
        return (
          <g>
            <polygon points="26,24 30,12 36,24" fill="#FACC15" />
            <polygon points="54,24 50,12 44,24" fill="#FACC15" />
            <circle cx="40" cy="42" r="18" fill="#EF4444" />
            <circle cx="34" cy="38" r="3" fill="#FEF08A" />
            <circle cx="46" cy="38" r="3" fill="#FEF08A" />
            <ellipse cx="40" cy="50" rx="8" ry="4" fill="#F59E0B" />
          </g>
        );
      }
      if (renderType === 'owl') {
        return (
          <g>
            <ellipse cx="40" cy="44" rx="18" ry="18" fill="#92400E" />
            <circle cx="33" cy="38" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="47" cy="38" r="6" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="33" cy="38" r="2.5" fill="#1E293B" />
            <circle cx="47" cy="38" r="2.5" fill="#1E293B" />
            <polygon points="40,14 54,20 40,26 26,20" fill="#1E3A8A" />
          </g>
        );
      }
      // cat
      return (
        <g>
          <polygon points="22,30 27,16 35,27" fill="#EA580C" />
          <polygon points="58,30 53,16 45,27" fill="#EA580C" />
          <circle cx="40" cy="42" r="17" fill="#FDBA74" />
          <circle cx="34" cy="40" r="2.5" fill="#1E293B" />
          <circle cx="46" cy="40" r="2.5" fill="#1E293B" />
          <path d="M36 47 Q40 50 44 47" stroke="#991B1B" strokeWidth="2" fill="none" />
        </g>
      );
    }

    return <circle cx="40" cy="40" r="18" fill="#3B82F6" />;
  };

  return (
    <div
      className={`${dim} shrink-0 rounded-2xl bg-gradient-to-br ${RARITY_BG[rarity]} border border-black/5 dark:border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-200`}
    >
      <svg viewBox="0 0 80 80" className="w-full h-full drop-shadow-xs">
        {renderArtwork()}
      </svg>
    </div>
  );
};
