import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundManager } from '../utils/audio';
import { APP_LOGO_SRC } from '../data/versionHistory';
import { 
  Download, 
  Share2, 
  Smartphone, 
  Monitor, 
  Apple, 
  Check, 
  Copy, 
  QrCode, 
  ExternalLink, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe,
  MessageSquare
} from 'lucide-react';

interface InstallShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallShareModal: React.FC<InstallShareModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'install' | 'share'>('install');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<'standard' | 'zalo' | 'facebook' | 'ads'>('standard');

  if (!isOpen) return null;

  // Base URL calculation (safe for dev preview & production shared URL)
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://hocsieuvui.vn';
  
  const getShareUrl = () => {
    switch (selectedChannel) {
      case 'zalo':
        return `${currentUrl}?utm_source=zalo&utm_medium=social_share&utm_campaign=hocsieuvui`;
      case 'facebook':
        return `${currentUrl}?utm_source=facebook&utm_medium=social_post&utm_campaign=hocsieuvui`;
      case 'ads':
        return `${currentUrl}?utm_source=marketing_ads&utm_medium=cpc&utm_campaign=hocsieuvui`;
      default:
        return currentUrl;
    }
  };

  const shareText = `🎉 Mời bạn cùng chơi Học Siêu Vui - Nền tảng vừa học vừa chơi Toán và Khoa học tự nhiên bám sát SGK! Đấu trường tính nhanh 60s, tạo Avatar 3D cực chất và nhận 120 Xu khởi nghiệp. Tham gia ngay tại: ${getShareUrl()}`;

  const handleCopyLink = (textToCopy: string, type: string) => {
    soundManager.play('click');
    navigator.clipboard.writeText(textToCopy);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleTriggerInstall = async () => {
    soundManager.play('click');
    const success = await install();
    if (success) {
      soundManager.play('fanfare');
    }
  };

  // Quick QR Code generator URL using public standard QR service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(getShareUrl())}&color=1d4ed8&bgcolor=ffffff&qzone=2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src={APP_LOGO_SRC} 
              alt="Học Siêu Vui" 
              className="w-11 h-11 rounded-2xl object-cover shadow-md border-2 border-white/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">Cài Đặt & Chia Sẻ Ứng Dụng</h2>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  PWA Web App
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Chơi mượt mà không cần cài đặt cồng kềnh • Tối ưu chia sẻ Zalo, Facebook
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-2 gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => {
              soundManager.play('click');
              setActiveTab('install');
            }}
            className={`flex-1 py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'install'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Cài Đặt App Ra Màn Hình</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              setActiveTab('share');
            }}
            className={`flex-1 py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'share'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Chia Sẻ Zalo / Facebook / QR</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          
          {/* TAB 1: INSTALLATION GUIDE & 1-CLICK PROMPT */}
          {activeTab === 'install' && (
            <div className="space-y-6">
              
              {/* Direct 1-Click Install Card (Chromium, Android, Edge, PC) */}
              {isInstallable && (
                <div className="p-5 bg-gradient-to-r from-blue-500 via-indigo-600 to-sky-500 rounded-3xl text-white shadow-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm">Trình duyệt đã sẵn sàng cài đặt!</h3>
                      <p className="text-xs text-blue-100">
                        Chỉ với 1 chạm để thêm Học Siêu Vui thành ứng dụng riêng biệt ngoài màn hình.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleTriggerInstall}
                    className="w-full py-3 px-4 bg-white hover:bg-blue-50 text-blue-700 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Download className="w-5 h-5" />
                    <span>Cài Đặt Ứng Dụng Ngay (1 Chạm)</span>
                  </button>
                </div>
              )}

              {isInstalled && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
                  <Check className="w-5 h-5 shrink-0" />
                  <span>Ứng dụng Học Siêu Vui đã được cài đặt và đang chạy ở chế độ App độc lập!</span>
                </div>
              )}

              {/* Step-by-Step Platform Guides */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Hướng Dẫn Cài Đặt Theo Từng Thiết Bị
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Android Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      <Smartphone className="w-4 h-4" />
                      <span>Điện Thoại Android</span>
                    </div>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                      <li>Mở trang bằng <strong>Chrome</strong> hoặc <strong>Cốc Cốc</strong>.</li>
                      <li>Nhấn nút <strong>"Cài Đặt"</strong> ở thông báo hoặc biểu tượng menu <strong>(3 chấm dọc)</strong>.</li>
                      <li>Chọn <strong>"Thêm vào Màn hình chính"</strong> hoặc <strong>"Cài đặt ứng dụng"</strong>.</li>
                    </ul>
                  </div>

                  {/* iOS / iPhone / iPad Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                      <Apple className="w-4 h-4" />
                      <span>iPhone / iPad (iOS)</span>
                    </div>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                      <li>Mở trang bằng trình duyệt <strong>Safari</strong>.</li>
                      <li>Bấm biểu tượng <strong>Chia sẻ (Share)</strong> hình ô vuông có mũi tên lên ở góc dưới màn hình.</li>
                      <li>Cuộn xuống và chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.</li>
                    </ul>
                  </div>

                  {/* PC / Laptop Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      <Monitor className="w-4 h-4" />
                      <span>Máy Tính PC / Laptop</span>
                    </div>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                      <li>Dùng Chrome hoặc Edge, nhìn vào <strong>thanh địa chỉ</strong> góc phải.</li>
                      <li>Bấm biểu tượng <strong>Cài đặt ứng dụng (màn hình có mũi tên)</strong>.</li>
                      <li>Học Siêu Vui sẽ mở thành cửa sổ riêng biệt như ứng dụng máy tính!</li>
                    </ul>
                  </div>

                </div>
              </div>

              {/* Why install PWA benefits */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
                <h4 className="font-bold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>Lợi Ích Khi Cài Đặt Web App Học Siêu Vui:</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-medium">
                    ⚡ Mở siêu tốc trong 0.5s
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-medium">
                    📱 Toàn màn hình không bị che
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-medium">
                    💾 Không tốn dung lượng máy
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-medium">
                    🔄 Tự cập nhật bản mới nhất
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: SOCIAL SHARE & MARKETING CHANNELS */}
          {activeTab === 'share' && (
            <div className="space-y-6">

              {/* Channel Selector for Campaign Tracking */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Chọn Kênh Quảng Bá Để Tạo Link Tối Ưu (Kèm Tham Số Đo Lường):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  <button
                    onClick={() => setSelectedChannel('standard')}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      selectedChannel === 'standard'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🔗 Link Tiêu Chuẩn
                  </button>
                  <button
                    onClick={() => setSelectedChannel('zalo')}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      selectedChannel === 'zalo'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    💬 Zalo Chia Sẻ
                  </button>
                  <button
                    onClick={() => setSelectedChannel('facebook')}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      selectedChannel === 'facebook'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🌐 Facebook Post
                  </button>
                  <button
                    onClick={() => setSelectedChannel('ads')}
                    className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                      selectedChannel === 'ads'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🚀 Quảng Cáo (Ads)
                  </button>
                </div>
              </div>

              {/* Share Link Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Đường Dẫn Rút Gọn Tối Ưu:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl()}
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-medium text-slate-800 dark:text-slate-200 focus:outline-none select-all"
                  />
                  <button
                    onClick={() => handleCopyLink(getShareUrl(), 'link')}
                    className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedType === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'link' ? 'Đã Chép' : 'Sao Chép Link'}</span>
                  </button>
                </div>
              </div>

              {/* QR Code and Social Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* QR Code Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>Quét Mã QR Để Mở Trên Điện Thoại</span>
                  </div>

                  <div className="p-2 bg-white rounded-2xl shadow-inner border border-slate-100 shrink-0">
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code Học Siêu Vui" 
                      className="w-40 h-40 rounded-xl object-contain"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mở camera hoặc Zalo trên điện thoại quét để mở ngay trang web và cài đặt ra màn hình.
                  </p>
                </div>

                {/* Social Card Preview */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Xem Trước Thẻ Hiển Thị Khi Gửi Zalo / Facebook:</span>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs bg-slate-50 dark:bg-slate-900">
                    <img 
                      src={APP_LOGO_SRC} 
                      alt="Preview Card" 
                      className="w-full h-28 object-cover"
                    />
                    <div className="p-2.5 space-y-1">
                      <div className="text-[10px] text-blue-600 font-bold uppercase">HOCSIEUVUI.VN</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        Học Siêu Vui – Vừa Học Vừa Chơi Bám Sát SGK
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        Vừa học vừa chơi, thi đấu tốc độ 60s, gom Sao đổi quà cực ngầu!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyLink(shareText, 'message')}
                    className="w-full py-2 px-3 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedType === 'message' ? <Check className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'message' ? 'Đã Sao Chép Lời Mời' : 'Sao Chép Lời Mời Kèm Link'}</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 dark:text-slate-400">
            Học Siêu Vui by dungvt.hbh VNPT
          </span>
          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="py-1.5 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
