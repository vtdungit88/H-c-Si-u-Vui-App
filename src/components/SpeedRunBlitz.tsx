import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/audio';
import { updateActiveStudent } from '../utils/studentStorage';
import { Zap, Timer, Flame, Trophy, Coins, RotateCcw, ArrowRight, Sparkles, Star, GraduationCap } from 'lucide-react';

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
  tier: 'primary' | 'secondary';
}

const PRIMARY_QUESTIONS: BlitzQuestion[] = [
  { prompt: '7 + 8 = ?', options: [15, 14, 16, 13], correctAnswer: 15, hint: '7 + 8 = 15', tier: 'primary' },
  { prompt: '5 × 6 = ?', options: [30, 25, 35, 40], correctAnswer: 30, hint: 'Bảng nhân 5', tier: 'primary' },
  { prompt: '45 - 19 = ?', options: [26, 24, 36, 16], correctAnswer: 26, hint: 'Trừ có nhớ', tier: 'primary' },
  { prompt: '9 × 7 = ?', options: [63, 54, 72, 81], correctAnswer: 63, hint: 'Bảng nhân 9', tier: 'primary' },
  { prompt: 'Chu vi hình vuông cạnh 6 cm?', options: [24, 36, 12, 18], correctAnswer: 24, hint: '6 × 4 = 24 cm', tier: 'primary' },
  { prompt: '56 : 8 = ?', options: [7, 8, 6, 9], correctAnswer: 7, hint: '7 × 8 = 56', tier: 'primary' },
  { prompt: '100 - 37 = ?', options: [63, 73, 53, 67], correctAnswer: 63, hint: '100 - 37 = 63', tier: 'primary' },
  { prompt: 'Một nửa của 50 là?', options: [25, 20, 15, 30], correctAnswer: 25, hint: '50 : 2 = 25', tier: 'primary' },
  { prompt: '3 × 8 + 6 = ?', options: [30, 24, 32, 28], correctAnswer: 30, hint: '24 + 6 = 30', tier: 'primary' },
  { prompt: '80 : 4 = ?', options: [20, 40, 25, 15], correctAnswer: 20, hint: '80 : 4 = 20', tier: 'primary' },
  { prompt: '25% của 100 là?', options: [25, 50, 20, 75], correctAnswer: 25, hint: 'Một phần tư của 100', tier: 'primary' },
  { prompt: '12 × 5 = ?', options: [60, 50, 55, 65], correctAnswer: 60, hint: '12 × 5 = 60', tier: 'primary' }
];

const SECONDARY_QUESTIONS: BlitzQuestion[] = [
  { prompt: '2³ = ?', options: [6, 8, 9, 12], correctAnswer: 8, hint: '2 · 2 · 2 = 8', tier: 'secondary' },
  { prompt: '(-6) · (-7) = ?', options: [42, -42, 13, -13], correctAnswer: 42, hint: 'Âm nhân âm ra dương', tier: 'secondary' },
  { prompt: '(-15) + 25 = ?', options: [10, -10, 40, -40], correctAnswer: 10, hint: '25 - 15 = 10', tier: 'secondary' },
  { prompt: '3² + 4² = ?', options: [25, 14, 49, 18], correctAnswer: 25, hint: '9 + 16 = 25', tier: 'secondary' },
  { prompt: 'Số nguyên tố chẵn duy nhất là?', options: [2, 0, 4, 6], correctAnswer: 2, hint: 'Số 2 thần thánh', tier: 'secondary' },
  { prompt: '5³ : 5 = ?', options: [25, 5, 125, 1], correctAnswer: 25, hint: '5² = 25', tier: 'secondary' },
  { prompt: '(-8) · 4 = ?', options: [-32, 32, -12, 12], correctAnswer: -32, hint: 'Âm nhân dương ra âm', tier: 'secondary' },
  { prompt: 'ƯCLN(12, 18) = ?', options: [6, 3, 2, 36], correctAnswer: 6, hint: 'Ước chung lớn nhất là 6', tier: 'secondary' },
  { prompt: 'BCNN(4, 6) = ?', options: [12, 24, 2, 8], correctAnswer: 12, hint: 'Bội chung nhỏ nhất là 12', tier: 'secondary' },
  { prompt: '10⁰ = ?', options: [1, 0, 10, 100], correctAnswer: 1, hint: 'Mọi số mũ 0 đều bằng 1', tier: 'secondary' },
  { prompt: '(-50) - (-20) = ?', options: [-30, -70, 30, 70], correctAnswer: -30, hint: '-50 + 20 = -30', tier: 'secondary' },
  { prompt: 'Góc vuông có số đo bao nhiêu độ?', options: [90, 60, 180, 120], correctAnswer: 90, hint: 'Góc vuông 90°', tier: 'secondary' },
  { prompt: 'Góc bẹt có số đo bao nhiêu độ?', options: [180, 90, 360, 270], correctAnswer: 180, hint: 'Góc bẹt 180°', tier: 'secondary' },
  { prompt: 'Số đối của -15 là?', options: [15, -15, 0, 30], correctAnswer: 15, hint: 'Đối của âm là dương', tier: 'secondary' },
  { prompt: '25% của 200 là bao nhiêu?', options: [50, 40, 25, 75], correctAnswer: 50, hint: '200 : 4 = 50', tier: 'secondary' }
];

export const SpeedRunBlitz: React.FC<SpeedRunBlitzProps> = ({
  student,
  onUpdateStudent,
  onNavigateToShop,
  onRequireLogin
}) => {
  const [selectedTier, setSelectedTier] = useState<'primary' | 'secondary' | 'all'>('all');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [questions, setQuestions] = useState<BlitzQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    if (student.isGuest) {
      soundManager.play('wrong');
      onRequireLogin?.();
      return;
    }
    soundManager.play('fanfare');

    let pool = [...PRIMARY_QUESTIONS, ...SECONDARY_QUESTIONS];
    if (selectedTier === 'primary') {
      pool = PRIMARY_QUESTIONS;
    } else if (selectedTier === 'secondary') {
      pool = SECONDARY_QUESTIONS;
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setQIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(60);
    setEarnedCoins(0);
    setEarnedStars(0);
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
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setGameState('gameover');

    // Phần thưởng thấp nhất bảo toàn giá trị: 1 - 3 Xu tối đa, 1 sao nếu đạt từ 8 điểm trở lên
    const coinsWon = score >= 10 ? 3 : score >= 5 ? 2 : score >= 1 ? 1 : 0;
    const starsWon = score >= 10 ? 1 : 0;

    setEarnedCoins(coinsWon);
    setEarnedStars(starsWon);

    const updated = updateActiveStudent((prev) => ({
      ...prev,
      coins: prev.coins + coinsWon,
      stars: prev.stars + starsWon,
      highScoreBlitz: Math.max(prev.highScoreBlitz || 0, score)
    }));
    onUpdateStudent(updated);
  };

  const handleAnswer = (chosenNumber: number) => {
    if (gameState !== 'playing') return;

    const currentQ = questions[qIndex];
    const isCorrect = chosenNumber === currentQ.correctAnswer;

    if (isCorrect) {
      soundManager.play('correct');
      const newScore = score + 1;
      const newCombo = combo + 1;
      setScore(newScore);
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
    } else {
      soundManager.play('wrong');
      setCombo(0);
    }

    if (qIndex < questions.length - 1) {
      setQIndex((prev) => prev + 1);
    } else {
      // Loop or re-shuffle if user answers faster than bank
      const reshuffled = [...questions].sort(() => 0.5 - Math.random());
      setQuestions(reshuffled);
      setQIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {gameState === 'idle' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 text-white flex items-center justify-center shadow-lg animate-bounce">
            <Zap className="w-10 h-10 fill-white" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Mở Rộng Cho Toàn Bộ Các Lớp SGK</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Đấu Trường Siêu Tốc Toán Học (60 Giây)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg mx-auto">
              Trả lời thật nhanh các phép tính toán học chuẩn SGK trong vòng 60 giây. Thử thách phản xạ nhanh và đua Top Bảng Vàng!
            </p>
          </div>

          {/* Tier Selector: Tiểu học, THCS hoặc Tổng hợp */}
          <div className="max-w-md mx-auto p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 text-xs font-bold">
            <button
              onClick={() => {
                soundManager.play('click');
                setSelectedTier('all');
              }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                selectedTier === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              ⚡ Tổng Hợp
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setSelectedTier('primary');
              }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                selectedTier === 'primary'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🎒 Tiểu Học (1 - 5)
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setSelectedTier('secondary');
              }}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
                selectedTier === 'secondary'
                  ? 'bg-blue-600 text-white shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🎓 THCS (6 - 9)
            </button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Kỷ Lục Của Bạn</div>
              <div className="text-2xl font-black font-mono text-amber-500">
                {student.highScoreBlitz || 0} Điểm
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Thời Gian</div>
              <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
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
              {questions[qIndex].tier === 'primary' ? 'Toán Tiểu Học' : 'Toán THCS'} • Tính Nhanh
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
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {score >= 15 ? 'Bậc Thầy Tính Nhẩm!' : score >= 8 ? 'Rất Tuyệt Vời!' : 'Cố Lên Bạn Ơi!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Bạn đã trả lời đúng <strong>{score} câu</strong> với chuỗi Combo cao nhất là <strong>x{maxCombo}</strong>!
            </p>
          </div>

          {/* Reward Pill (LOWEST REWARDS) */}
          <div className="inline-flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-inner">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-amber-500" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Xu Thưởng</div>
                <div className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                  +{earnedCoins} Xu
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Sao Thưởng</div>
                <div className="text-lg font-black font-mono text-yellow-500">
                  +{earnedStars} Sao
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
            <button
              onClick={startGame}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Chơi Lại (60s)
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                onNavigateToShop();
              }}
              className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Studio Của Tôi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
