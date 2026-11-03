import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { StudentProfile, MathLesson, MathQuestion } from '../types';
import { MATH_LESSONS } from '../data/math6Lessons';
import { soundManager } from '../utils/audio';
import { updateActiveStudent } from '../utils/studentStorage';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Coins, 
  Star, 
  RotateCcw, 
  ChevronRight, 
  Trophy,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

interface MathGameArenaProps {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onNavigateToShop: () => void;
  onRequireLogin?: () => void;
}

export const MathGameArena: React.FC<MathGameArenaProps> = ({
  student,
  onUpdateStudent,
  onNavigateToShop,
  onRequireLogin
}) => {
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [activeLesson, setActiveLesson] = useState<MathLesson | null>(null);

  // Lesson state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLessonFinished, setIsLessonFinished] = useState(false);

  // Filter lessons by chapter
  const chapterLessons = MATH_LESSONS.filter((l) => l.chapter === selectedChapter);

  const startLesson = (lesson: MathLesson) => {
    if (student.isGuest) {
      soundManager.play('wrong');
      onRequireLogin?.();
      return;
    }
    soundManager.play('click');
    setActiveLesson(lesson);
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setIsLessonFinished(false);
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundManager.play('click');
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!activeLesson || !selectedOptionId || isAnswerSubmitted) return;

    const currentQ = activeLesson.questions[currentQuestionIndex];
    const chosenOption = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = !!chosenOption?.isCorrect;

    setIsAnswerSubmitted(true);

    if (isCorrect) {
      soundManager.play('correct');
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      soundManager.play('wrong');
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (!activeLesson) return;
    soundManager.play('click');

    if (currentQuestionIndex < activeLesson.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished lesson!
      finishLesson();
    }
  };

  const finishLesson = () => {
    if (!activeLesson) return;
    setIsLessonFinished(true);

    const totalQ = activeLesson.questions.length;
    const finalScore = score + (selectedOptionId && activeLesson.questions[currentQuestionIndex].options.find(o => o.id === selectedOptionId)?.isCorrect ? 1 : 0);
    const ratio = finalScore / totalQ;

    let earnedStars = 1;
    if (ratio >= 0.9) earnedStars = 3;
    else if (ratio >= 0.6) earnedStars = 2;

    const earnedCoins = activeLesson.rewardCoins + (earnedStars === 3 ? 30 : 10);

    soundManager.play('fanfare');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });

    const updated = updateActiveStudent((prev) => {
      const prevRecord = prev.completedLessons[activeLesson.id];
      const bestStars = Math.max(prevRecord?.stars || 0, earnedStars);
      const bestScore = Math.max(prevRecord?.bestScore || 0, finalScore);

      return {
        ...prev,
        coins: prev.coins + earnedCoins,
        stars: prev.stars + (bestStars > (prevRecord?.stars || 0) ? (bestStars - (prevRecord?.stars || 0)) : 1),
        completedLessons: {
          ...prev.completedLessons,
          [activeLesson.id]: {
            stars: bestStars,
            bestScore: bestScore,
            completedAt: new Date().toISOString()
          }
        }
      };
    });

    onUpdateStudent(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* If currently in an active lesson */}
      {activeLesson ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full">
                  {activeLesson.sgkPage}
                </span>
                <span className="text-xs text-slate-400">
                  Câu {currentQuestionIndex + 1}/{activeLesson.questions.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {activeLesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {streak >= 2 && (
                <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Combo x{streak}!</span>
                </div>
              )}
              <button
                onClick={() => {
                  soundManager.play('click');
                  setActiveLesson(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Thoát ải
              </button>
            </div>
          </div>

          {!isLessonFinished ? (
            /* ACTIVE QUESTION VIEW */
            <div className="space-y-6">
              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {activeLesson.questions[currentQuestionIndex].questionText}
                </h3>

                {/* Optional visual simulation container */}
                {activeLesson.questions[currentQuestionIndex].visualType === 'set' && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/50 flex items-center justify-center font-math text-blue-600 dark:text-blue-400 font-bold text-sm">
                    Tập hợp: &#123; 🐱 mèo ; 🐶 chó ; 🐔 gà ; 🦆 vịt &#125;
                  </div>
                )}
                {activeLesson.questions[currentQuestionIndex].visualType === 'power' && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center justify-center font-math text-amber-600 dark:text-amber-400 font-bold text-base">
                    2³ · 2⁴ = (2 · 2 · 2) · (2 · 2 · 2 · 2) = 2³⁺⁴
                  </div>
                )}
                {activeLesson.questions[currentQuestionIndex].visualType === 'geometry' && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs gap-3">
                    <span>🔺 Tam giác đều: 3 cạnh a = 6 cm</span>
                    <span>• Chu vi P = a + a + a = 3 · a</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeLesson.questions[currentQuestionIndex].options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optionClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400';

                  if (isSelected && !isAnswerSubmitted) {
                    optionClass = 'bg-blue-50 dark:bg-blue-900/40 border-blue-600 text-blue-700 dark:text-blue-300 font-bold shadow-sm';
                  } else if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      optionClass = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (isSelected && !opt.isCorrect) {
                      optionClass = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                    } else {
                      optionClass = 'opacity-50 border-slate-200 dark:border-slate-700';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between ${optionClass}`}
                    >
                      <span className="font-semibold">{opt.text}</span>
                      {isAnswerSubmitted && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !opt.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Feedback Card */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-200 dark:border-slate-700 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Bí Kíp & Lời Giải SGK:</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {activeLesson.questions[currentQuestionIndex].explanation}
                  </p>
                  <p className="text-xs italic text-blue-600 dark:text-blue-400 font-medium">
                    💡 Mẹo cười: {activeLesson.questions[currentQuestionIndex].funnyTip}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOptionId}
                    className={`py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all ${
                      selectedOptionId
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Kiểm Tra Đáp Án
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all"
                  >
                    <span>
                      {currentQuestionIndex < activeLesson.questions.length - 1
                        ? 'Câu Tiếp Theo'
                        : 'Xem Kết Quả & Nhận Thưởng'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* LESSON FINISHED MODAL / SUMMARY */
            <div className="py-8 text-center space-y-5 animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Hoàn Thành Xuất Sắc!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Bạn đã vượt qua bài học: <strong>{activeLesson.title}</strong>
                </p>
              </div>

              {/* Reward pill */}
              <div className="inline-flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-inner">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-amber-500" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Phần Thưởng</div>
                    <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                      +{activeLesson.rewardCoins + 30} Xu
                    </div>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Danh Hiệu</div>
                    <div className="text-lg font-black font-mono text-yellow-500">
                      +3 Sao Vàng
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => startLesson(activeLesson)}
                  className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Luyện Lại Ải Này
                </button>
                <button
                  onClick={() => {
                    soundManager.play('click');
                    onNavigateToShop();
                  }}
                  className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Vào Studio Mua Đồ Mới!
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* CHAPTER & LESSONS BROWSER */
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-blue-200">
                Sách Giáo Khoa NXB Giáo Dục Việt Nam
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-0.5">
                Chinh Phục Môn Toán 6 - Tập 1
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                Bám sát chương trình chuẩn. Vượt ải, tích lũy xu và sao để mở khóa xe đạp thể thao, iPhone 16 Pro Max và thú cưng thần kỳ!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shrink-0 text-center">
              <div className="text-[11px] text-blue-200">Tiến Độ Học Tập</div>
              <div className="text-lg font-black font-mono text-white">
                {Object.keys(student.completedLessons).length}/{MATH_LESSONS.length} Bài
              </div>
            </div>
          </div>

          {/* Chapter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
            {[1, 2, 3, 4, 5].map((chapNum) => {
              const chapTitles: Record<number, string> = {
                1: 'Chương 1: Số Tự Nhiên',
                2: 'Chương 2: Tính Chia Hết',
                3: 'Chương 3: Số Nguyên',
                4: 'Chương 4: Hình Phẳng',
                5: 'Chương 5: Đối Xứng'
              };
              return (
                <button
                  key={chapNum}
                  onClick={() => {
                    soundManager.play('click');
                    setSelectedChapter(chapNum);
                  }}
                  className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedChapter === chapNum
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {chapTitles[chapNum]}
                </button>
              );
            })}
          </div>

          {/* Lesson Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapterLessons.map((lesson) => {
              const record = student.completedLessons[lesson.id];
              const isDone = !!record;
              const earnedStars = record?.stars || 0;

              return (
                <div
                  key={lesson.id}
                  onClick={() => startLesson(lesson)}
                  className="group p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full">
                        {lesson.sgkPage}
                      </span>
                      {isDone ? (
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= earnedStars
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          Chưa vượt ải
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {lesson.subTitle}
                    </p>

                    {/* Quick concept tip */}
                    <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
                      💡 {lesson.conceptSummary[0]}
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> +{lesson.rewardCoins} xu
                      </span>
                      <span className="text-yellow-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" /> +3 sao
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>{isDone ? 'Luyện Lại' : 'Vào Học'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
