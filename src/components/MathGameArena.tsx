import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { emitMascot } from '../lib/mascotBus';
import { StudentProfile, MathLesson, MathQuestion, GradeLevel } from '../types';
import { 
  LESSON_TIERS_CONFIG, 
  LessonDifficultyTier 
} from '../data/lessonTiers';
import { soundManager } from '../utils/audio';
import { supabase } from '../lib/supabase';
import { toMathLessons } from '../lib/curriculum';
import {
  fetchCurriculum, startQuiz, answerQuestion, submitQuiz, loadStudentProfile,
  type Curriculum, type QuizQuestion
} from '../lib/api';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  Trophy,
  ArrowRight,
  GraduationCap,
  Clock,
  Flame,
  Award,
  Layers,
  X,
  Play
} from 'lucide-react';
import { CoinIcon, StarIcon } from './GameIcons';

interface MathGameArenaProps {
  student: StudentProfile;
  subjectId?: string;
  currentGrade: GradeLevel;
  currentTerm: 1 | 2;
  onUpdateStudent: (updated: StudentProfile) => void;
  onNavigateToShop: () => void;
  onRequireLogin?: () => void;
  /** Lesson code to start immediately (used by the adventure map). */
  autoStartLessonCode?: string | null;
  onAutoStartConsumed?: () => void;
}

export const MathGameArena: React.FC<MathGameArenaProps> = ({
  student,
  subjectId = 'math',
  currentGrade,
  currentTerm,
  onUpdateStudent,
  onNavigateToShop,
  onRequireLogin,
  autoStartLessonCode,
  onAutoStartConsumed
}) => {
  // Curriculum comes from Supabase (published content only). No answers are bundled in the client.
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [curriculumError, setCurriculumError] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    let alive = true;
    setCurriculum(null);
    setCurriculumError('');
    if (subjectId !== 'math' && subjectId !== 'science') return () => { alive = false; };
    fetchCurriculum(subjectId, Number(currentGrade)).then((c) => alive && setCurriculum(c)).catch((e) => alive && setCurriculumError(String(e.message || e)));
    return () => { alive = false; };
  }, [subjectId, currentGrade]);

  const dbLessonIdByCode = React.useMemo(
    () => new Map((curriculum?.lessons ?? []).map((l) => [l.code, l.id] as const)),
    [curriculum]
  );

  // Every chapter is one mixed-difficulty set and is available in both terms.
  const currentLessons: MathLesson[] = React.useMemo(() => toMathLessons(curriculum), [curriculum]);

  // Extract unique chapters
  const availableChapters = React.useMemo(() => {
    const map = new Map<number, string>();
    currentLessons.forEach((l) => {
      if (!map.has(l.chapter)) {
        map.set(l.chapter, l.chapterTitle);
      }
    });
    return Array.from(map.entries()).map(([num, title]) => ({ num, title }));
  }, [currentLessons]);

  const [selectedChapter, setSelectedChapter] = useState<number>(() => {
    return availableChapters[0]?.num || 1;
  });

  // Keep selectedChapter synced when grade/term changes
  useEffect(() => {
    if (availableChapters.length > 0) {
      const exists = availableChapters.some((c) => c.num === selectedChapter);
      if (!exists) {
        setSelectedChapter(availableChapters[0].num);
      }
    }
  }, [availableChapters, selectedChapter]);


  // Active quiz state
  const [activeLesson, setActiveLesson] = useState<MathLesson | null>(null);
  const [selectedTier, setSelectedTier] = useState<LessonDifficultyTier>('mixed');
  const [activeQuestions, setActiveQuestions] = useState<MathQuestion[]>([]);
  const [isReplayLesson, setIsReplayLesson] = useState(false);
  const [lastAnswerResult, setLastAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const [earnedCoinsState, setEarnedCoinsState] = useState(0);
  const [earnedStarsState, setEarnedStarsState] = useState(0);

  // Question navigation and scoring
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLessonFinished, setIsLessonFinished] = useState(false);

  // 60-second countdown timer for each question
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter lessons by chapter
  const chapterLessons = currentLessons.filter((l) => l.chapter === selectedChapter);

  // Open exercise tier selector
  const handleOpenLessonTiers = (lesson: MathLesson) => {
    if (student.isGuest) {
      soundManager.play('wrong');
      onRequireLogin?.();
      return;
    }
    soundManager.play('click');
    void startTierExercise(lesson, 'mixed');
  };

  useEffect(() => {
    if (!autoStartLessonCode || !curriculum) return;
    const lesson = currentLessons.find((l) => l.id === autoStartLessonCode);
    onAutoStartConsumed?.();
    if (lesson) handleOpenLessonTiers(lesson);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartLessonCode, curriculum]);

  const mapQuestion = (q: QuizQuestion): MathQuestion => ({
    id: q.quiz_question_id,
    questionText: q.prompt.text,
    contextHint: q.prompt.hint,
    visualType: (q.prompt.visualType as MathQuestion['visualType']) ?? 'none',
    visualData: q.prompt.visualData,
    // isCorrect stays false until the server reveals the answer after the student commits.
    options: q.options.map((o) => ({ id: o.key, text: o.content.text, isCorrect: false })),
    explanation: '',
    funnyTip: ''
  });

  // Start a specific tier exercise: the server picks and returns the questions (without answers).
  const startTierExercise = async (lesson: MathLesson, tier: LessonDifficultyTier) => {
    soundManager.play('click');
    const dbId = dbLessonIdByCode.get(lesson.id);
    if (!dbId) { setQuizError('Không tìm thấy bài học trên máy chủ.'); return; }
    const tierKey = `${lesson.id}_${tier}`;
    const wasCompleted = !!student.completedLessons[tierKey];
    setIsStarting(true);
    setQuizError('');
    try {
      const quiz = await startQuiz(dbId, tier, 15);
      setSessionId(quiz.session_id);
      setIsReplayLesson(wasCompleted);
      setActiveLesson(lesson);
      setSelectedTier(tier);
      setActiveQuestions(quiz.questions.map(mapQuestion));
      setCurrentQuestionIndex(0);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setIsTimeOut(false);
      setLastAnswerResult(null);
      setScore(0);
      setStreak(0);
      setIsLessonFinished(false);
      setTimeLeft(60);
      questionStartRef.current = Date.now();
    } catch (e) {
      soundManager.play('wrong');
      setQuizError(e instanceof Error && /not authenticated/.test(e.message)
        ? 'Hãy đăng nhập để làm bài.' : 'Chưa bắt đầu được bài. Hãy thử lại sau.');
    } finally {
      setIsStarting(false);
    }
  };

  // Reveal the server's verdict for the current question (marks the correct option, adds explanation).
  const applyReveal = (index: number, r: { correct_key: string; explanation: { text?: string; tip?: string } }) => {
    setActiveQuestions((prev) => prev.map((q, i) => i !== index ? q : {
      ...q,
      options: q.options.map((o) => ({ ...o, isCorrect: o.id === r.correct_key })),
      explanation: r.explanation?.text ?? '',
      funnyTip: r.explanation?.tip ?? ''
    }));
  };

  // Countdown timer logic: 60s per question
  useEffect(() => {
    if (!activeLesson || isAnswerSubmitted || isLessonFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(60);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, activeLesson, isAnswerSubmitted, isLessonFinished]);

  // Handle when 60s expires: lock the question as unanswered on the server and reveal the answer.
  const handleTimeOut = () => {
    soundManager.play('wrong');
    setIsTimeOut(true);
    setIsAnswerSubmitted(true);
    setLastAnswerResult('wrong');
    setStreak(0);
    const q = activeQuestions[currentQuestionIndex];
    const idx = currentQuestionIndex;
    if (q) answerQuestion(q.id, null, 60000).then((r) => applyReveal(idx, r)).catch((e) => console.error(e));
  };

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    soundManager.play('click');
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = async () => {
    if (!activeLesson || !selectedOptionId || isAnswerSubmitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = activeQuestions[currentQuestionIndex];
    const idx = currentQuestionIndex;
    setIsAnswerSubmitted(true);
    setIsTimeOut(false);
    setQuizError('');
    try {
      const r = await answerQuestion(currentQ.id, selectedOptionId, Date.now() - questionStartRef.current);
      applyReveal(idx, r);
      if (r.is_correct) {
        soundManager.play('correct');
        setLastAnswerResult('correct');
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
        emitMascot(streak + 1 >= 5 && (streak + 1) % 5 === 0 ? { type: 'streak', count: streak + 1 } : { type: 'correct' });
      } else {
        soundManager.play('wrong');
        setLastAnswerResult('wrong');
        setStreak(0);
        emitMascot({ type: 'wrong' });
      }
    } catch (e) {
      console.error(e);
      setIsAnswerSubmitted(false);
      setQuizError('Mất kết nối máy chủ. Hãy thử gửi lại câu trả lời.');
    }
  };

  const handleNextQuestion = () => {
    if (!activeLesson) return;
    soundManager.play('click');

    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
      setIsTimeOut(false);
      setLastAnswerResult(null);
      setTimeLeft(60);
    } else {
      finishLesson();
    }
  };

  const finishLesson = async () => {
    if (!activeLesson || !sessionId) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsLessonFinished(true);
    try {
      // The server grades from the recorded attempts, awards XP/coins idempotently and saves progress.
      const result = await submitQuiz(sessionId);
      const ratio = result.total_count ? result.correct_count / result.total_count : 0;
      const tierConfig = LESSON_TIERS_CONFIG[selectedTier];
      setScore(result.correct_count);
      setEarnedCoinsState(result.coins_awarded);
      setEarnedStarsState(ratio >= 0.8 && result.coins_awarded > 0 ? tierConfig.rewardStars : 0);
      soundManager.play('fanfare');
      if (result.coins_awarded > 0) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      const { data } = await supabase.auth.getUser();
      if (data.user) onUpdateStudent(await loadStudentProfile(data.user));
    } catch (e) {
      console.error(e);
      setQuizError('Chưa lưu được kết quả lên máy chủ. Hãy kiểm tra mạng và thử lại.');
    }
  };

  const activeTierConfig = LESSON_TIERS_CONFIG[selectedTier];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {quizError && (
        <div role="alert" className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm font-semibold">{quizError}</div>
      )}
      {!activeLesson && curriculumError && (
        <div role="alert" className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm">
          Không tải được danh sách bài học: {curriculumError}
        </div>
      )}
      {!activeLesson && !curriculum && !curriculumError && (subjectId === 'math' || subjectId === 'science') && currentGrade === '6' && (
        <div className="mb-4 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm">Đang tải bài học…</div>
      )}
      {!activeLesson && curriculum && currentLessons.length === 0 && (
        <div className="mb-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm">Chưa có chương nào cho lớp này.</div>
      )}
      {isStarting && (
        <div className="mb-4 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-sm">Đang chuẩn bị câu hỏi…</div>
      )}
      {/* If currently in an active lesson */}
      {activeLesson ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full">
                  {activeTierConfig.title}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  Câu {currentQuestionIndex + 1}/{activeQuestions.length || 15}
                </span>
                {isReplayLesson && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-bold px-2 py-0.5 rounded">
                    Chế Độ Luyện Lại (0 xu)
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {activeLesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* 60s Countdown Timer */}
              {!isLessonFinished && (
                <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl border font-mono text-xs font-black transition-all ${
                  timeLeft <= 10 
                    ? 'bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 animate-pulse'
                    : timeLeft <= 20 
                    ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400'
                    : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400'
                }`}>
                  <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'animate-spin' : ''}`} />
                  <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}s</span>
                </div>
              )}

              {streak >= 2 && (
                <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-xl text-xs font-bold animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Combo x{streak}!</span>
                </div>
              )}

              <button
                onClick={() => {
                  soundManager.play('click');
                  if (timerRef.current) clearInterval(timerRef.current);
                  setActiveLesson(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Thoát ải
              </button>
            </div>
          </div>

          {/* Time Remaining Bar */}
          {!isLessonFinished && !isAnswerSubmitted && (
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-rose-500' : timeLeft <= 20 ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>
          )}

          {!isLessonFinished ? (
            /* ACTIVE QUESTION VIEW */
            <div className="space-y-6">
              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {activeQuestions[currentQuestionIndex]?.questionText}
                </h3>

                {/* Optional visual simulation container */}
                {activeQuestions[currentQuestionIndex]?.visualType === 'set' && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/50 flex items-center justify-center font-math text-blue-600 dark:text-blue-400 font-bold text-sm">
                    Tập hợp: &#123; 🐱 mèo ; 🐶 chó ; 🐔 gà ; 🦆 vịt &#125;
                  </div>
                )}
                {activeQuestions[currentQuestionIndex]?.visualType === 'power' && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/50 flex items-center justify-center font-math text-amber-600 dark:text-amber-400 font-bold text-base">
                    2³ · 2⁴ = (2 · 2 · 2) · (2 · 2 · 2 · 2) = 2³⁺⁴ = 2⁷
                  </div>
                )}
                {activeQuestions[currentQuestionIndex]?.visualType === 'geometry' && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs gap-3">
                    <span>🔺 Tam giác đều: 3 cạnh a = 6 cm</span>
                    <span>• Chu vi P = a + a + a = 3 · a</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQuestions[currentQuestionIndex]?.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let optionClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer';

                  if (isSelected && !isAnswerSubmitted) {
                    optionClass = 'bg-blue-50 dark:bg-blue-900/40 border-blue-600 text-blue-700 dark:text-blue-300 font-bold shadow-sm';
                  } else if (isAnswerSubmitted) {
                    if (opt.isCorrect) {
                      optionClass = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-400/40';
                    } else if (isSelected && !opt.isCorrect) {
                      optionClass = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-700 dark:text-rose-300 font-bold animate-shake';
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

              {/* Joyful Animated Feedback & Core Concept Tip */}
              {isAnswerSubmitted && (
                <div className={`p-4 rounded-2xl border space-y-2 animate-fadeIn transition-all ${
                  lastAnswerResult === 'correct'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
                    : isTimeOut
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-900 dark:text-rose-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200'
                }`}>
                  <div className="flex items-center gap-2 text-sm font-black">
                    {lastAnswerResult === 'correct' ? (
                      <>
                        <span className="text-xl">🎉</span>
                        <span>CHÍNH XÁC TUYỆT VỜI! BẠN RẤT THÔNG MINH!</span>
                      </>
                    ) : isTimeOut ? (
                      <>
                        <span className="text-xl">⏰</span>
                        <span>HẾT THỜI GIAN 60 GIÂY! HÃY ÔN LẠI CÔNG THỨC DƯỚI ĐÂY:</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">💡</span>
                        <span>SUÝT NỮA LÀ ĐÚNG RỒI! BÍ KÍP GIẢI NHANH DƯỚI ĐÂY:</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {activeQuestions[currentQuestionIndex]?.explanation}
                  </p>
                  <p className="text-xs italic text-blue-600 dark:text-blue-400 font-semibold">
                    💡 Mẹo ghi nhớ: {activeQuestions[currentQuestionIndex]?.funnyTip}
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
                    className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>
                      {currentQuestionIndex < activeQuestions.length - 1
                        ? 'Câu Tiếp Theo'
                        : 'Xem Kết Quả & Hoàn Thành'}
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
                  {isReplayLesson ? 'Luyện Lại Rèn Luyện Trí Nhớ! 🧠' : 'Hoàn Thành Xuất Sắc! 🎉'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  {isReplayLesson
                    ? 'Bạn đã ôn tập bài này thành công. Luyện lại giúp củng cố kiến thức sâu sắc (không cộng thêm Xu & Sao).'
                    : `Bạn đã hoàn thành: ${activeTierConfig.title} - ${activeLesson.title}`}
                </p>
                <div className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                  Điểm số đạt được: {score} / {activeQuestions.length || 15} câu
                </div>
              </div>

              {/* Reward pill */}
              <div className="inline-flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-inner">
                <div className="flex items-center gap-2">
                  <CoinIcon className="w-6 h-6 text-amber-500" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Xu Nhận Được</div>
                    <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                      +{earnedCoinsState} Xu
                    </div>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex items-center gap-2">
                  <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Sao Tích Lũy</div>
                    <div className="text-lg font-black font-mono text-yellow-500">
                      +{earnedStarsState} Sao
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
                <button
                  onClick={() => startTierExercise(activeLesson, selectedTier)}
                  className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Luyện Lại (Đảo Phương Án)
                </button>
                <button
                  onClick={() => {
                    soundManager.play('click');
                    setActiveLesson(null);
                  }}
                  className="py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Chọn Chương Khác
                </button>
                <button
                  onClick={() => {
                    soundManager.play('click');
                    setActiveLesson(null);
                  }}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Chọn Bài Học Mới
                </button>
                <button
                  onClick={() => {
                    soundManager.play('click');
                    onNavigateToShop();
                  }}
                  className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Studio Của Tôi
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
              <div className="text-xs uppercase font-bold tracking-wider text-blue-200 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>Chương Trình Bài Học Chuẩn SGK Hiện Hành</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                {subjectId === 'science' ? `Khoa Học Tự Nhiên ${currentGrade}` : `Chinh Phục Môn Toán Lớp ${currentGrade}`}
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                Mỗi chương là một bài ôn luyện 15 câu trộn đủ mức độ, 60s/câu. Tích lũy Xu & Sao đổi quà tại Studio!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shrink-0 text-center">
              <div className="text-[11px] text-blue-200">Tiến Độ Phần Này</div>
              <div className="text-lg font-black font-mono text-white">
                {currentLessons.filter((l) => !!student.completedLessons[l.id] || !!student.completedLessons[`${l.id}_mixed`]).length}/{currentLessons.length} Bài
              </div>
            </div>
          </div>

          {/* Chapter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
            {availableChapters.map((chap) => {
              return (
                <button
                  key={chap.num}
                  onClick={() => {
                    soundManager.play('click');
                    setSelectedChapter(chap.num);
                  }}
                  className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedChapter === chap.num
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {chap.title}
                </button>
              );
            })}
          </div>

          {/* Lesson Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapterLessons.map((lesson) => {
              const record = student.completedLessons[`${lesson.id}_mixed`];
              const isAnyDone = !!record || !!student.completedLessons[lesson.id];

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleOpenLessonTiers(lesson)}
                  className="group p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full">
                        {lesson.sgkPage.replace(/NXB Giáo Dục Việt Nam/gi, 'SGK')}
                      </span>
                      {isAnyDone ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                            Đã làm
                          </span>
                          <StarIcon className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
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
                      💡 {lesson.conceptSummary[0] ?? 'Ôn luyện trộn mọi mức độ'}
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <CoinIcon className="w-3.5 h-3.5" />
                      <span>15 câu • 60s/câu</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>Làm bài</span>
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
