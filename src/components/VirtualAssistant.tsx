import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { submitFeedback } from '../lib/api';
import { StudentProfile } from '../types';
import confetti from 'canvas-confetti';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  BookOpen, 
  Zap, 
  Map, 
  Shirt, 
  Trophy, 
  CheckCircle2, 
  MessageSquareHeart, 
  Lightbulb,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { StarIcon } from './GameIcons';
import { answerQuestion, QUICK_QUESTIONS, type BrainAnswer, type NavView } from '../lib/assistantBrain';

const GUIDE_ITEMS: { title: string; desc: string; cta: string; view: NavView; Icon: React.ComponentType<{ className?: string }>; tone: string }[] = [
  { title: 'Bài Học', desc: 'Chọn môn, lớp, tập và chương rồi làm 15 câu. Đúng mỗi câu được xu.', cta: 'Bắt đầu học', view: 'study', Icon: BookOpen, tone: 'bg-blue-100 text-blue-600' },
  { title: 'Bản Đồ Ải', desc: 'Mỗi chương là một hòn đảo. Đạt 1–3 sao để mở ải sau, đánh bại Trùm Cuối.', cta: 'Mở bản đồ', view: 'map', Icon: Map, tone: 'bg-emerald-100 text-emerald-600' },
  { title: 'Đấu Trường', desc: 'Siêu Tốc 60 giây, Thách Đấu 1v1 với Vui-Bot để lên hạng Elo, hoặc Phòng Lớp Học bằng mã PIN.', cta: 'Vào đấu trường', view: 'blitz', Icon: Zap, tone: 'bg-orange-100 text-orange-600' },
  { title: 'Studio của tôi', desc: 'Đổi tóc, trang phục, hậu cảnh cho nhân vật và mở rương. Đồ lưu trên tài khoản.', cta: 'Tới Studio', view: 'shop', Icon: Shirt, tone: 'bg-amber-100 text-amber-600' },
  { title: 'Sảnh Online & Du hành', desc: 'Gặp bạn bè trực tuyến, xem cấp độ và du hành khắp Việt Nam.', cta: 'Vào sảnh', view: 'lobby', Icon: Compass, tone: 'bg-teal-100 text-teal-600' },
  { title: 'Bảng Xếp Hạng', desc: 'Xem Top học sinh nhiều sao và xu nhất.', cta: 'Xem bảng vàng', view: 'leaderboard', Icon: Trophy, tone: 'bg-yellow-100 text-yellow-600' }
];

const MASCOT_FACE = `${import.meta.env.BASE_URL}assets/icons/mascot-face.webp`;
const MASCOT_FULL = `${import.meta.env.BASE_URL}assets/icons/mascot-full.webp`;


interface VirtualAssistantProps {
  student: StudentProfile;
  onNavigateToView: (view: NavView) => void;
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  student,
  onNavigateToView
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'guide' | 'feedback'>('chat');
  const [showBubble, setShowBubble] = useState(true);

  // Chat state (rule-based helper; no external AI service)
  type ChatMsg = { from: 'bot' | 'me'; text: string; actions?: BrainAnswer['actions'] };
  const [chat, setChat] = useState<ChatMsg[]>([{ from: 'bot', text: 'Xin chào! Mình là Bé Siêu Vui 💡 – người bạn đồng hành của bạn. Hỏi mình cách làm bài, kiếm xu, mua đồ… hoặc bấm một gợi ý bên dưới nhé!' }]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { chatEndRef.current?.scrollIntoView({ block: 'end' }); }, [chat]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text) return;
    soundManager.play('click');
    const a = answerQuestion(text, { name: student.name, isGuest: !!student.isGuest, coins: student.coins, stars: student.stars });
    setChat((c) => [...c, { from: 'me', text }, { from: 'bot', text: a.text, actions: a.actions }]);
    setChatInput('');
  };

  // Feedback form state
  const [feedbackCategory, setFeedbackCategory] = useState<'suggestion' | 'bug' | 'compliment' | 'question'>('suggestion');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [sending, setSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim() || sending) return;
    setSending(true); setFeedbackError('');
    try {
      await submitFeedback(feedbackCategory, feedbackRating, feedbackMessage.trim());
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Không gửi được, thử lại sau nhé.');
      setSending(false);
      return;
    }
    setSending(false);
    soundManager.play('fanfare');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setIsSubmitted(true);
    setTimeout(() => {
      setFeedbackMessage('');
      setIsSubmitted(false);
      setActiveTab('guide');
    }, 2500);
  };

  return (
    <>
      {/* FLOATING ASSISTANT TRIGGER BUTTON */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-end gap-2.5">
        {/* Welcome Speech Bubble */}
        {showBubble && !isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-xl rounded-2xl px-3.5 py-2 animate-bounce select-none">
            <span className="text-sm">👋</span>
            <div className="text-left">
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Chào bạn! Cần trợ giúp không?
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                Bấm vào đây để xem hướng dẫn & góp ý!
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBubble(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Mascot Avatar Button */}
        <button
          onClick={() => {
            soundManager.play('click');
            setIsOpen(true);
            setShowBubble(false);
          }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 p-0.5 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Trợ lý ảo Học Siêu Vui"
        >
          <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center p-1 border-2 border-white/60">
            <img
              src={MASCOT_FACE}
              alt="Bé Siêu Vui – trợ lý ảo"
              className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform"
            />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-ping" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
        </button>
      </div>

      {/* ASSISTANT MODAL DIALOG */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={MASCOT_FACE}
                  alt="Bé Siêu Vui"
                  className="w-10 h-10 rounded-xl object-cover border-2 border-white/40 shadow-sm bg-sky-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg">
                      Trợ Lý Ảo Học Siêu Vui
                    </h3>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      Hỗ trợ 24/7
                    </span>
                  </div>
                  <p className="text-xs text-blue-100">
                    Hướng dẫn sử dụng & tiếp nhận phản hồi học sinh
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.play('click');
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-4 pt-2 gap-2 shrink-0">
              <button
                onClick={() => {
                  soundManager.play('click');
                  setActiveTab('chat');
                }}
                className={`py-2.5 px-4 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Hỏi Bé Siêu Vui</span>
              </button>

              <button
                onClick={() => {
                  soundManager.play('click');
                  setActiveTab('guide');
                }}
                className={`py-2.5 px-4 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Chỉ Dẫn</span>
              </button>

              <button
                onClick={() => {
                  soundManager.play('click');
                  setActiveTab('feedback');
                }}
                className={`py-2.5 px-4 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'feedback'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <MessageSquareHeart className="w-4 h-4" />
                <span>Góp Ý</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {activeTab === 'chat' ? (
                <div className="flex flex-col gap-3">
                  <img src={MASCOT_FULL} alt="" className="mx-auto h-24 w-auto rounded-2xl" />
                  <div className="space-y-2.5" aria-live="polite">
                    {chat.map((m, i) => (
                      <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.from === 'me' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm'}`}>
                          {m.text}
                          {m.actions && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {m.actions.map((a) => (
                                <button key={a.label} onClick={() => { soundManager.play('click'); onNavigateToView(a.view); setIsOpen(false); }}
                                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-slate-600 cursor-pointer">{a.label} →</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_QUESTIONS.map((q) => (
                      <button key={q} onClick={() => ask(q)} className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-slate-700 cursor-pointer">{q}</button>
                    ))}
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); ask(chatInput); }} className="flex gap-2">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} maxLength={200} placeholder="Gõ câu hỏi của bạn…"
                      className="flex-1 min-w-0 px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
                    <button type="submit" aria-label="Gửi" className="px-3 rounded-2xl bg-blue-600 text-white cursor-pointer"><Send className="w-4 h-4" /></button>
                  </form>
                  <p className="text-[11px] text-slate-400">Bé Siêu Vui là trợ lý hướng dẫn của Học Siêu Vui, chưa giải được bài tập cụ thể.</p>
                </div>
              ) : activeTab === 'guide' ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-200 dark:border-slate-700 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <strong>Học Siêu Vui</strong> giúp bạn luyện <strong>Toán lớp 1–9</strong> và <strong>Khoa học tự nhiên lớp 6–9</strong> bám sát SGK. Mỗi chương có một bài 15 câu trộn đủ mức dễ đến khó, có lời giải sau mỗi câu. Làm bài để nhận <strong>xu</strong> và <strong>sao</strong>!
                  </div>
                  {GUIDE_ITEMS.map((g) => (
                    <button key={g.title} onClick={() => { soundManager.play('click'); onNavigateToView(g.view); setIsOpen(false); }}
                      className="w-full text-left p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 flex items-start gap-3 cursor-pointer">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${g.tone}`}><g.Icon className="w-5 h-5" /></span>
                      <span className="min-w-0">
                        <span className="block text-sm font-black text-slate-900 dark:text-white">{g.title}</span>
                        <span className="block text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{g.desc}</span>
                        <span className="block text-xs font-bold text-blue-600 mt-0.5">{g.cta} →</span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                /* TAB 2: USER FEEDBACK FORM */
                <div className="space-y-4">
                  {isSubmitted ? (
                    <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 rounded-3xl animate-fadeIn">
                      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-base font-black text-emerald-900 dark:text-emerald-200">
                        Gửi Phản Hồi Thành Công!
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto leading-relaxed">
                        Cảm ơn bạn! Ý kiến đóng góp của bạn đã được gửi tới quản trị viên để giúp Học Siêu Vui tốt hơn mỗi ngày!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Học sinh gửi: <strong>{student.name}</strong> ({student.grade} • {student.school})
                        </span>
                        <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full font-bold">
                          Gửi tới Quản trị viên
                        </span>
                      </div>

                      {/* Feedback Category */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Bạn muốn gửi điều gì?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'suggestion', label: '💡 Ý Tưởng / Góp Ý' },
                            { id: 'bug', label: '🐞 Báo Lỗi Bài Học' },
                            { id: 'compliment', label: '❤️ Lời Khen & Cảm Ơn' },
                            { id: 'question', label: '❓ Câu Hỏi & Thắc Mắc' }
                          ].map((cat) => (
                            <button
                              type="button"
                              key={cat.id}
                              onClick={() => setFeedbackCategory(cat.id as any)}
                              className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                                feedbackCategory === cat.id
                                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 shadow-sm'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Đánh giá độ vui của ứng dụng:
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => {
                                soundManager.play('click');
                                setFeedbackRating(star);
                              }}
                              className="p-1 cursor-pointer transition-transform hover:scale-125"
                            >
                              <StarIcon
                                className={`w-6 h-6 ${
                                  star <= feedbackRating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-slate-300 dark:text-slate-700'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-amber-500 ml-2">
                            {feedbackRating === 5 ? 'Quá Tuyệt Vời! 🌟' : `${feedbackRating} Sao`}
                          </span>
                        </div>
                      </div>

                      {/* Message Textarea */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Nội dung chi tiết:
                        </label>
                        <textarea
                          rows={3}
                          value={feedbackMessage}
                          onChange={(e) => setFeedbackMessage(e.target.value)}
                          placeholder="Nhập cảm nghĩ, đề xuất bài toán mới, góp ý giao diện hoặc tính năng bạn mong muốn..."
                          className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                          required
                        />
                      </div>

                      <p className="text-[11px] text-slate-500">Đừng ghi tên thật, số điện thoại hay email nhé. Góp ý sẽ được gửi tới quản trị viên.</p>
                      {feedbackError && <div role="alert" className="text-xs text-rose-700 bg-rose-50 p-2 rounded-xl">{feedbackError}</div>}

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-3 px-4 disabled:opacity-60 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Send className="w-4 h-4" />
                        <span>Gửi Phản Hồi Về Quản Trị Viên</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
