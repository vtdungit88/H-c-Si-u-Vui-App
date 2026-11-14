import React from 'react';
import { BookOpen, RotateCcw, Trophy } from 'lucide-react';
import { CoinIcon } from '../GameIcons';
import type { ArenaResult, DuelResult } from '../../lib/api';
import { rankOf } from '../../utils/arenaRank';
import type { WrongItem } from './BlitzEngine';

interface Props {
  result: ArenaResult | null;
  duel?: DuelResult | null;
  saveError: string;
  wrongItems: WrongItem[];
  onAgain: () => void;
  onBack: () => void;
}

/** Result summary plus the "Sổ tay sửa sai" review of every mistake. */
export const PostMatchReview: React.FC<Props> = ({ result, duel, saveError, wrongItems, onAgain, onBack }) => (
  <div className="max-w-xl mx-auto space-y-4">
    <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white p-6 text-center shadow-xl">
      <Trophy className="w-10 h-10 mx-auto mb-1 text-amber-300" />
      {duel ? (
        <>
          <div className="text-2xl font-black">{duel.outcome === 'win' ? '🏆 Bạn thắng!' : duel.outcome === 'draw' ? '🤝 Hòa nhau!' : '💪 Chưa thắng, cố lên!'}</div>
          <div className="text-sm opacity-90 mt-1">Bạn {duel.my_score} – {duel.bot_score} VNPT Vui-Bot [AI]</div>
          <div className="mt-2 text-sm font-bold">Elo {duel.elo_before} → {duel.elo_after} ({duel.elo_delta >= 0 ? '+' : ''}{duel.elo_delta}) • {rankOf(duel.elo_after).icon} {rankOf(duel.elo_after).name}</div>
          <div className="mt-2 flex items-center justify-center gap-1 font-bold">
            {duel.coins > 0 ? <>+{duel.coins} <CoinIcon className="w-5 h-5" /> xu</> : <span className="text-sm opacity-90">Lần này chưa có xu thưởng</span>}
          </div>
          {typeof duel.rewards_left_today === 'number' && <div className="text-xs opacity-80 mt-1">Còn {duel.rewards_left_today}/5 lượt nhận thưởng hôm nay</div>}
        </>
      ) : result ? (
        <>
          <div className="text-4xl font-black">{result.score} điểm</div>
          <div className="text-sm opacity-90 mt-1">Đúng {result.correct} câu{result.max_combo ? ` • Chuỗi dài nhất ${result.max_combo}` : ''}</div>
          {result.is_record && <div className="mt-2 inline-block bg-amber-300 text-amber-900 text-xs font-black rounded-full px-3 py-1">🏅 Kỷ lục mới của bạn!</div>}
          <div className="mt-3 flex items-center justify-center gap-1 font-bold">
            {result.coins > 0 ? <>+{result.coins} <CoinIcon className="w-5 h-5" /> xu</> : <span className="text-sm opacity-90">Lần này chưa có xu thưởng</span>}
          </div>
          {typeof result.rewards_left_today === 'number' && (
            <div className="text-xs opacity-80 mt-1">Còn {result.rewards_left_today}/5 lượt nhận thưởng hôm nay (vẫn chơi và lập kỷ lục thoải mái)</div>
          )}
        </>
      ) : saveError ? (
        <div className="text-sm bg-white/20 rounded-xl p-3">{saveError}</div>
      ) : (
        <div className="font-bold">Đang chấm điểm trên máy chủ…</div>
      )}
    </div>

    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="font-black flex items-center gap-2 mb-2"><BookOpen className="w-5 h-5 text-indigo-600" /> Sổ tay sửa sai</h3>
      {wrongItems.length === 0 ? (
        <p className="text-sm text-emerald-700 font-bold">Tuyệt vời! Bạn không sai câu nào 🎉</p>
      ) : (
        <ul className="space-y-3">
          {wrongItems.slice(0, 12).map((w, i) => {
            const right = w.question.options.find((o) => o.right)?.text;
            return (
              <li key={i} className="text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 p-3">
                <div className="font-bold">{w.question.questionText}</div>
                <div className="mt-1"><span className="text-rose-600">Bạn chọn: {w.chosen}</span> • <span className="text-emerald-700 font-bold">Đáp án: {right}</span></div>
                <div className="text-slate-600 dark:text-slate-300 mt-1">💡 {w.question.explanation}</div>
              </li>
            );
          })}
        </ul>
      )}
    </div>

    <div className="flex gap-3">
      <button onClick={onAgain} className="flex-1 py-3 rounded-2xl bg-sky-600 text-white font-black flex items-center justify-center gap-2 cursor-pointer"><RotateCcw className="w-4 h-4" /> Chơi lại</button>
      <button onClick={onBack} className="flex-1 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 font-black cursor-pointer">Về sảnh</button>
    </div>
  </div>
);
