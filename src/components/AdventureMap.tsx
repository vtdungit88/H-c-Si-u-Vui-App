import React from 'react';
import { StudentProfile, MathLesson } from '../types';
import { fetchCurriculum, type Curriculum } from '../lib/api';
import { toMathLessons } from '../lib/curriculum';
import { soundManager } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import { 
  MapPin, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Mountain, 
  Castle, 
  Snowflake,
  Flag,
  Ship
} from 'lucide-react';
import { StarIcon } from './GameIcons';

interface AdventureMapProps {
  student: StudentProfile;
  onSelectLesson: (lesson: MathLesson) => void;
  onRequireLogin?: () => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  student,
  onSelectLesson,
  onRequireLogin
}) => {
  const [selectedMapTerm, setSelectedMapTerm] = React.useState<1 | 2>(1);

  const [curriculum, setCurriculum] = React.useState<Curriculum | null>(null);
  React.useEffect(() => {
    let alive = true;
    fetchCurriculum('math', 6).then((c) => alive && setCurriculum(c)).catch(() => undefined);
    return () => { alive = false; };
  }, []);
  const activeLessons = React.useMemo(
    () => toMathLessons(curriculum).filter((l) => (selectedMapTerm === 1 ? l.chapter <= 5 : l.chapter >= 6)),
    [curriculum, selectedMapTerm]
  );

  // Check completion for current term
  const completedInTermCount = activeLessons.filter((l) => !!student.completedLessons[l.id]).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Ship className="w-3.5 h-3.5" />
            <span>Bản Đồ Thám Hiểm • Vượt Ải Kiến Thức SGK</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            {selectedMapTerm === 1
              ? 'Hải Trình 10 Đảo Số Học & Hình Học (Tập 1)'
              : 'Hải Trình 9 Đảo Phân Số & Xác Suất (Tập 2)'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            {selectedMapTerm === 1
              ? 'Khám phá quần đảo số tự nhiên, tính chia hết, thung lũng số nguyên âm và lâu đài hình học phẳng bám sát SGK.'
              : 'Chinh phục bí mật phân số, kho báu số thập phân, tháp góc hình học và đảo xác suất thực nghiệm bám sát SGK.'}
          </p>
        </div>

        {/* Right side stats + Term Selector */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-black/25 rounded-2xl border border-white/20 text-xs font-bold">
            <button
              onClick={() => {
                soundManager.play('click');
                setSelectedMapTerm(1);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedMapTerm === 1
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Tập 1 (10 Ải)
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setSelectedMapTerm(2);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedMapTerm === 2
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Tập 2 (9 Ải)
            </button>
          </div>

          <div className="bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shrink-0 text-center flex items-center gap-4">
            <div>
              <div className="text-[10px] text-emerald-200 uppercase font-semibold">Tiến Độ</div>
              <div className="text-xl font-black font-mono text-white">
                {completedInTermCount}/{activeLessons.length} Ải
              </div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <div className="text-[10px] text-emerald-200 uppercase font-semibold">Sao Tích Lũy</div>
              <div className="text-xl font-black font-mono text-yellow-300 flex items-center justify-center gap-1">
                <StarIcon className="w-4 h-4 fill-yellow-300" />
                <span>{student.stars}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE VECTOR ADVENTURE MAP (Vibrant, Never Black!) */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-300 dark:border-emerald-800 shadow-xl bg-gradient-to-b from-sky-400 via-teal-500 to-emerald-600 p-4 sm:p-8 select-none">
        {/* Sky, Clouds, Sea Waves */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300/40 via-cyan-400/20 to-teal-800/40 pointer-events-none" />

        {/* Floating clouds in background */}
        <div className="absolute top-4 left-10 text-white/30 text-5xl select-none pointer-events-none">☁️</div>
        <div className="absolute top-12 right-20 text-white/25 text-6xl select-none pointer-events-none">☁️</div>
        <div className="absolute top-24 left-1/3 text-white/20 text-4xl select-none pointer-events-none">☁️</div>

        {/* Map Title Plaque */}
        <div className="relative z-10 inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg border-2 border-yellow-200 mb-6">
          <Compass className="w-4 h-4" />
          <span>BẢN ĐỒ KHO BÁU SỐ HỌC (TẬP {selectedMapTerm}) - BẤM VÀO ẢI ĐỂ VƯỢT THỬ THÁCH</span>
        </div>

        {/* Island Stages Map Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {activeLessons.map((lesson, idx) => {
            const isCompleted = !!student.completedLessons[lesson.id];
            const stars = student.completedLessons[lesson.id]?.stars || 0;
            const isCurrent = idx === completedInTermCount;

            const term1Themes = [
              { name: 'Đảo Số Tự Nhiên', icon: '🏝️', color: 'bg-emerald-50 text-emerald-950 border-emerald-400' },
              { name: 'Tháp Lũy Thừa', icon: '🗼', color: 'bg-amber-50 text-amber-950 border-amber-400' },
              { name: 'Mê Cung Ngoặc', icon: '🌀', color: 'bg-indigo-50 text-indigo-950 border-indigo-400' },
              { name: 'Núi Lửa Chia Hết', icon: '🌋', color: 'bg-orange-50 text-orange-950 border-orange-400' },
              { name: 'Rừng Số Nguyên Tố', icon: '🌲', color: 'bg-green-50 text-green-950 border-green-400' },
              { name: 'Băng Sa Pa (Số Âm)', icon: '🧊', color: 'bg-cyan-50 text-cyan-950 border-cyan-400' },
              { name: 'Quy Tắc Âm Dương', icon: '⚡', color: 'bg-purple-50 text-purple-950 border-purple-400' },
              { name: 'Thành Tam Giác Đều', icon: '🔺', color: 'bg-rose-50 text-rose-950 border-rose-400' },
              { name: 'Sân Trường Hình Thoi', icon: '🪁', color: 'bg-blue-50 text-blue-950 border-blue-400' },
              { name: 'Đền Thờ Đối Xứng', icon: '⭐', color: 'bg-yellow-50 text-yellow-950 border-yellow-400' }
            ];

            const term2Themes = [
              { name: 'Đảo Phân Số', icon: '🍕', color: 'bg-orange-50 text-orange-950 border-orange-400' },
              { name: 'Thung Lũng Tối Giản', icon: '✂️', color: 'bg-cyan-50 text-cyan-950 border-cyan-400' },
              { name: 'Cây Cầu Nhân Nghịch Đảo', icon: '🌉', color: 'bg-purple-50 text-purple-950 border-purple-400' },
              { name: 'Kho Báu Hai Bài Toán', icon: '💎', color: 'bg-yellow-50 text-yellow-950 border-yellow-400' },
              { name: 'Hải Đăng Thập Phân', icon: '💡', color: 'bg-sky-50 text-sky-950 border-sky-400' },
              { name: 'Đấu Trường Phần Trăm', icon: '🎯', color: 'bg-red-50 text-red-950 border-red-400' },
              { name: 'Đường Thẳng Vô Cực', icon: '📏', color: 'bg-emerald-50 text-emerald-950 border-emerald-400' },
              { name: 'Tháp Thước Đo Góc', icon: '📐', color: 'bg-amber-50 text-amber-950 border-amber-400' },
              { name: 'Vương Quốc Biểu Đồ', icon: '📊', color: 'bg-indigo-50 text-indigo-950 border-indigo-400' },
              { name: 'Vòng Quay Xác Suất', icon: '🎲', color: 'bg-rose-50 text-rose-950 border-rose-400' }
            ];

            const themes = selectedMapTerm === 1 ? term1Themes : term2Themes;
            const theme = themes[idx] || themes[0];

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (student.isGuest) {
                    soundManager.play('wrong');
                    onRequireLogin?.();
                    return;
                  }
                  soundManager.play('click');
                  onSelectLesson(lesson);
                }}
                className={`relative p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:scale-105 active:scale-95 group ${
                  isCurrent
                    ? 'ring-4 ring-amber-300 ring-offset-2 scale-102 bg-white text-slate-900 border-amber-500'
                    : isCompleted
                    ? 'bg-white/95 text-slate-900 border-emerald-400'
                    : 'bg-white/90 text-slate-900 border-slate-300 hover:border-blue-400'
                }`}
              >
                {/* Current Player Pin Marker */}
                {isCurrent && (
                  <div className="absolute -top-6 -right-2 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-1 animate-bounce">
                    <Flag className="w-3 h-3 fill-slate-950" />
                    <span>Vị Trí Của Bạn!</span>
                  </div>
                )}

                <div>
                  {/* Top node header */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xl">{theme.icon}</span>
                  </div>

                  <div className="text-[11px] font-extrabold uppercase text-slate-500">
                    {theme.name}
                  </div>
                  <h4 className="font-black text-xs text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                    {lesson.title}
                  </h4>
                </div>

                {/* Bottom status & stars */}
                <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-between">
                  {isCompleted ? (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <StarIcon
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      +{lesson.rewardCoins} xu
                    </span>
                  )}

                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trail path description */}
        <div className="relative z-10 mt-6 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/20 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Mỗi ải hoàn thành với 3 sao sẽ cộng dồn điểm leo <strong>Bảng Vàng Danh Dự</strong>!
            </span>
          </div>
          <span className="font-mono text-amber-300 font-bold whitespace-nowrap">
            Cấp {student.level} • {student.name}
          </span>
        </div>
      </div>
    </div>
  );
};
