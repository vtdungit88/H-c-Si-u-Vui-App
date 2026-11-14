import React, { useEffect, useState } from 'react';
import { Compass, Play } from 'lucide-react';
import type { StudentProfile } from '../../types';
import { fetchMapProgress } from '../../lib/api';
import { soundManager } from '../../utils/audio';
import { IslandArt, BIOMES } from '../map/IslandArt';
import { MapScenery } from '../map/MapScenery';
import { StarIcon } from '../GameIcons';

interface Props { student: StudentProfile; onOpen: () => void }

const MASCOT_FACE = `${import.meta.env.BASE_URL}assets/icons/mascot-face.webp`;
// A tiny zig-zag of five islands, one per biome, to tempt kids into the full map.
const SPOTS = [
  { x: 14, y: 62, kind: 'normal' as const }, { x: 34, y: 34, kind: 'normal' as const }, { x: 54, y: 64, kind: 'mini_boss' as const },
  { x: 74, y: 34, kind: 'normal' as const }, { x: 90, y: 60, kind: 'boss' as const }
];

/** Home section 3: live preview of the adventure map that opens the real map. */
export const MapPreview: React.FC<Props> = ({ student, onOpen }) => {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    if (student.isGuest) { setStars(null); return; }
    fetchMapProgress(student.id).then((p) => alive && setStars(Object.values(p).reduce((a, n) => a + n.stars, 0))).catch(() => undefined);
    return () => { alive = false; };
  }, [student.id, student.isGuest]);

  return (
    <section aria-labelledby="map-title" className="relative overflow-hidden rounded-3xl border-4 border-white dark:border-slate-700 shadow-xl">
      <div className="relative h-60 sm:h-72">
        <MapScenery nodeCount={16} width={600} height={300} top={60} step={14} />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden>
          <path d="M14 66 C24 66 24 40 34 38 C44 36 44 68 54 68 C64 68 64 38 74 38 C82 38 84 62 90 64" fill="none" stroke="#fef3c7" strokeWidth="3.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d="M14 66 C24 66 24 40 34 38 C44 36 44 68 54 68 C64 68 64 38 74 38 C82 38 84 62 90 64" fill="none" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeDasharray="1 5" vectorEffect="non-scaling-stroke" />
        </svg>
        {SPOTS.map((s, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            <IslandArt biome={BIOMES[i % BIOMES.length]} kind={s.kind} locked={false} cleared={false} className={s.kind === 'boss' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-16 h-16 sm:w-20 sm:h-20'} />
          </div>
        ))}
        <img src={MASCOT_FACE} alt="" className="absolute w-12 h-12 rounded-full border-4 border-white shadow-lg bg-sky-200 object-cover hsv-anim-hop" style={{ left: '8%', top: '18%' }} />
      </div>
      <div className="relative bg-white dark:bg-slate-900 px-5 py-4 flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
        <div className="text-center sm:text-left">
          <h2 id="map-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2"><Compass className="w-6 h-6 text-emerald-600" /> Bản Đồ Thám Hiểm</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Vượt từng hòn đảo kiến thức, gom sao, đánh bại Trùm Cuối!
            {stars !== null && <span className="ml-1 inline-flex items-center gap-1 font-black text-amber-600"><StarIcon className="w-4 h-4" /> Bạn đã gom {stars} sao</span>}
          </p>
        </div>
        <button onClick={() => { soundManager.play('fanfare'); onOpen(); }}
          className="shrink-0 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform inline-flex items-center gap-2 cursor-pointer">
          <Play className="w-5 h-5" /> Khám phá ngay
        </button>
      </div>
    </section>
  );
};
