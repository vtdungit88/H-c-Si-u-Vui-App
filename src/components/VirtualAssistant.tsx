import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { saveUserFeedback } from '../utils/feedbackStorage';
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
import { APP_LOGO_SRC } from '../data/versionHistory';

interface VirtualAssistantProps {
  student: StudentProfile;
  onNavigateToView: (view: 'study' | 'shop' | 'blitz' | 'map' | 'leaderboard') => void;
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  student,
  onNavigateToView
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'feedback'>('guide');
  const [showBubble, setShowBubble] = useState(true);

  // Feedback form state
  const [feedbackCategory, setFeedbackCategory] = useState<'suggestion' | 'bug' | 'compliment' | 'question'>('suggestion');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackContact, setFeedbackContact] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    soundManager.play('fanfare');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    saveUserFeedback({
      studentName: student.name || 'Học sinh ẩn danh',
      grade: student.grade || 'Chưa cập nhật',
      school: student.school || 'Chưa cập nhật',
      contact: feedbackContact.trim(),
      category: feedbackCategory,
      message: feedbackMessage.trim(),
      rating: feedbackRating
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setFeedbackMessage('');
      setFeedbackContact('');
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
              src={APP_LOGO_SRC}
              alt="Trợ lý Học Siêu Vui"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
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
                  src={APP_LOGO_SRC}
                  alt="Trợ lý ảo"
                  className="w-10 h-10 rounded-xl object-cover border-2 border-white/40 shadow-sm"
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
                  setActiveTab('guide');
                }}
                className={`py-2.5 px-4 font-bold text-xs rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'guide'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-t-2 border-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Chỉ Dẫn & Chức Năng</span>
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
                <span>Gửi Phản Hồi Cho Quản Trị</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {activeTab === 'guide' ? (
                /* TAB 1: SYSTEM INTRO & FEATURE GUIDE */
                <div className="space-y-4">
                  {/* Brief Intro */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-blue-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-xs font-black text-blue-700 dark:text-blue-300 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>HỆ THỐNG VỪA HỌC VỪA CHƠI SGK</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      Chào bạn! <strong>Học Siêu Vui</strong> là nền tảng luyện toán thông minh bám sát chương trình SGK. Mỗi bài học gồm <strong>3 cấp độ (Cơ bản, Tiêu chuẩn, Nâng cao)</strong> với <strong>15 câu/bài (60s/câu)</strong>, giúp bạn ghi nhớ kiến thức sâu sắc, nhận Xu và Sao để thỏa thích nâng cấp Studio!
                    </p>
                  </div>

                  {/* Feature Guide Cards */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Bản Đồ Chỉ Đường Các Chức Năng
                    </h4>

                    {/* Feature 1 */}
                    <div 
                      onClick={() => {
                        soundManager.play('click');
                        onNavigateToView('study');
                        setIsOpen(false);
                      }}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            1. Bài Học SGK (3 Bài Tập 15 Câu)
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Chọn Khởi Động, Tiêu Chuẩn hoặc Nâng Cao. Mỗi câu có 60 giây suy nghĩ kèm giải thích ôn bài.
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-blue-600 shrink-0">Vào Học ➔</span>
                    </div>

                    {/* Feature 2 */}
                    <div 
                      onClick={() => {
                        soundManager.play('click');
                        onNavigateToView('blitz');
                        setIsOpen(false);
                      }}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-500 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                            2. Đấu Trường Siêu Tốc (60 Giây)
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Luyện phản xạ tính nhẩm nhanh cho cả Tiểu học và THCS. Nhận thưởng Xu & Sao!
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-orange-600 shrink-0">Chơi Ngay ➔</span>
                    </div>

                    {/* Feature 3 */}
                    <div 
                      onClick={() => {
                        soundManager.play('click');
                        onNavigateToView('shop');
                        setIsOpen(false);
                      }}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                          <Shirt className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                            3. Studio Của Tôi (Tủ Đồ Avatar)
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Dùng Xu & Sao mở khóa xe đạp thể thao, iPhone 16 Pro Max, laptop, mèo thần tài!
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-amber-600 shrink-0">Vào Studio ➔</span>
                    </div>

                    {/* Feature 4 */}
                    <div 
                      onClick={() => {
                        soundManager.play('click');
                        onNavigateToView('map');
                        setIsOpen(false);
                      }}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                          <Map className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            4. Bản Đồ Thám Hiểm
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Vượt qua các quần đảo kiến thức số tự nhiên, phân số và hình học bí ẩn.
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 shrink-0">Khám Phá ➔</span>
                    </div>

                    {/* Feature 5 */}
                    <div 
                      onClick={() => {
                        soundManager.play('click');
                        onNavigateToView('leaderboard');
                        setIsOpen(false);
                      }}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-yellow-500 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-yellow-100 dark:bg-yellow-950 text-yellow-600 flex items-center justify-center shrink-0">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-yellow-600 transition-colors">
                            5. Đua Top Bảng Vàng
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Vinh danh Top 10 học sinh thật có nhiều Sao và Xu nhất toàn trường!
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-yellow-600 shrink-0">Xem Top ➔</span>
                    </div>
                  </div>
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
                        Cảm ơn bạn! Ý kiến đóng góp của bạn đã được chuyển thẳng tới Quản trị viên <strong>dungvt.hbh@gmail.com</strong> để tiếp tục nâng cấp hệ thống!
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

                      {/* Optional Contact */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Email hoặc số điện thoại (tùy chọn để quản trị viên phản hồi):
                        </label>
                        <input
                          type="text"
                          value={feedbackContact}
                          onChange={(e) => setFeedbackContact(e.target.value)}
                          placeholder="Ví dụ: dungvt.hbh@gmail.com hoặc Zalo..."
                          className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
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
