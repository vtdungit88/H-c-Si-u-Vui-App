import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/audio';
import { updateActiveStudent } from '../utils/studentStorage';
import { Zap, Timer, Flame, Trophy, Coins, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface SpeedRunBlitzProps {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onNavigateToShop: () => void;
  onRequireLogin?: () => void;
}

interface BlitzQuestion {
  prompt: string;
  options: number[];
  correctAnswer: number;
  hint: string;
}

const GENERATE_QUESTIONS = (): BlitzQuestion[] => [
  { prompt: '2³ = ?', options: [6, 8, 9, 12], correctAnswer: 8, hint: '2 · 2 · 2 = 8' },
  { prompt: '(-6) · (-7) = ?', options: [42, -42, 13, -13], correctAnswer: 42, hint: 'Âm nhân âm ra dương' },
  { prompt: '(-15) + 25 = ?', options: [10, -10, 40, -40], correctAnswer: 10, hint: '25 - 15 = 10' },
  { prompt: '3² + 4² = ?', options: [25, 14, 49, 18], correctAnswer: 25, hint: '9 + 16 = 25' },
  { prompt: 'Số nguyên tố chẵn duy nhất là?', options: [2, 0, 4, 6], correctAnswer: 2, hint: 'Số 2 thần thánh' },
  { prompt: '5³ : 5 = ?', options: [25, 5, 125, 1], correctAnswer: 25, hint: '5² = 25' },
  { prompt: 'Chu vi hình vuông cạnh 7 cm?', options: [28, 49, 14, 21], correctAnswer: 28, hint: '7 · 4 = 28 cm' },
  { prompt: 'Tổng các chữ số của 549 là?', options: [18, 15, 20, 16], correctAnswer: 18, hint: '5 + 4 + 9 = 18 chia hết cho 9' },
  { prompt: '(-8) · 4 = ?', options: [-32, 32, -12, 12], correctAnswer: -32, hint: 'Âm nhân dương ra âm' },
  { prompt: 'ƯCLN(12, 18) = ?', options: [6, 3, 2, 36], correctAnswer: 6, hint: 'Ước chung lớn nhất là 6' },
  { prompt: 'BCNN(4, 6) = ?', options: [12, 24, 2, 8], correctAnswer: 12, hint: 'Bội chung nhỏ nhất là 12' },
  { prompt: 'Diện tích tam giác đều cạnh 0? Đùa thôi! 10⁰ = ?', options: [1, 0, 10, 100], correctAnswer: 1, hint: 'Mọi số mũ 0 đều bằng 1' },
  { prompt: '(-50) - (-20) = ?', options: [-30, -70, 30, 70], correctAnswer: -30, hint: '-50 + 20 = -30' },
  { prompt: 'Số chia hết cho 5 có tận cùng là?', options: [0, 2, 3, 7], correctAnswer: 0, hint: 'Tận cùng 0 hoặc 5' }
];

export const SpeedRunBlitz: React.FC<SpeedRunBlitzProps> = ({
  student,
  onUpdateStudent,
  onNavigateToShop,
  onRequireLogin
}) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [questions, setQuestions] = useState<BlitzQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    if (student.isGuest) {
      soundManager.play('wrong');
      onRequireLogin?.();
      return;
    }
    soundManager.play('fanfare');
    const shuffled = [...GENERATE_QUESTIONS()].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(60);
    setEarnedCoins(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 5 && prev > 1) {
            soundManager.play('countdown');
          }
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, score, maxCombo]);

  const handleGameOver = () => {
    soundManager.play('fanfare');
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });

    setGameState('gameover');

    // Calculate coins: base score * 15 + maxCombo * 10
    const coinsWon = score * 15 + maxCombo * 10;
    setEarnedCoins(coinsWon);

    const updated = updateActiveStudent((prev) => ({
      ...prev,
      coins: prev.coins + coinsWon,
      highScoreBlitz: Math.max(prev.highScoreBlitz || 0, score)
    }));
    onUpdateStudent(updated);
  };

  const handleAnswer = (chosen: number) => {
    if (gameState !== 'playing') return;
    const currentQ = questions[qIndex];
    if (chosen === currentQ.correctAnswer) {
      soundManager.play('correct');
      const newCombo = combo + 1;
      setScore((s) => s + 1);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
    } else {
      soundManager.play('wrong');
      setCombo(0);
    }

    // Next question (cycle if needed)
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      const reshuffled = [...GENERATE_QUESTIONS()].sort(() => 0.5 - Math.random());
      setQuestions(reshuffled);
      setQIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {gameState === 'idle' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
              Thử Thách Tốc Độ • Bấm Giờ 60 Giây
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              Đấu Trường Siêu Tốc Toán 6
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              Trả lời liên hoàn các phép tính lũy thừa, số nguyên, quy tắc dấu và hình phẳng trong 60 giây. Chuỗi combo càng cao, xu vàng càng nổ tung!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Kỷ Lục Điểm</div>
              <div className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
                {student.highScoreBlitz || 0} câu
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Thời Gian</div>
              <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                60 Giây
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="py-4 px-8 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            Bắt Đầu Ngay!
          </button>
        </div>
      )}

      {gameState === 'playing' && questions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Top HUD */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            {/* Timer */}
            <div className="flex items-center gap-2">
              <Timer className={`w-6 h-6 ${timeLeft <= 10 ? 'text-rose-500 animate-spin' : 'text-blue-600'}`} />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Còn Lại</div>
                <div className={`text-2xl font-black font-mono ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-900 dark:text-white'}`}>
                  {timeLeft}s
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Điểm Số</div>
              <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                {score}
              </div>
            </div>

            {/* Combo */}
            <div className="flex items-center gap-2">
              <Flame className={`w-6 h-6 ${combo >= 3 ? 'text-orange-500 animate-bounce' : 'text-slate-400'}`} />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Combo</div>
                <div className="text-2xl font-black font-mono text-orange-500">
                  x{combo}
                </div>
              </div>
            </div>
          </div>

          {/* Question Box */}
          <div className="py-8 text-center bg-gradient-to-b from-blue-50/50 to-indigo-50/30 dark:from-slate-800/60 dark:to-slate-850 rounded-3xl border border-blue-100 dark:border-slate-700">
            <span className="text-xs uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
              Tính Nhanh
            </span>
            <div className="text-3xl sm:text-4xl font-black font-math text-slate-900 dark:text-white mt-2">
              {questions[qIndex].prompt}
            </div>
          </div>

          {/* Rapid 4 Options */}
          <div className="grid grid-cols-2 gap-4">
            {questions[qIndex].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="py-5 px-4 bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-white font-black text-xl rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-600 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full">
              Hết Giờ! Hoàn Thành Thử Thách
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              Kết Quả Đấu Trường Tốc Độ
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Trả Lời Đúng</div>
              <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
                {score}
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Chuỗi Max</div>
              <div className="text-2xl font-black font-mono text-orange-500">
                x{maxCombo}
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Xu Thưởng</div>
              <div className="text-2xl font-black font-mono text-amber-500 flex items-center justify-center gap-1">
                <Coins className="w-5 h-5" />
                +{earnedCoins}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={startGame}
              className="py-3 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Chơi Lại 60s
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                onNavigateToShop();
              }}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Dùng Xu Sắm Đồ!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
