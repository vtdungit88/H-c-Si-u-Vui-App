import React from 'react';
import { StudentProfile } from '../types';
import { AvatarRenderer } from './AvatarRenderer';
import { soundManager } from '../utils/audio';
import { APP_LOGO_SRC, CURRENT_VERSION } from '../data/versionHistory';
import { X, Award, Printer, Sparkles, School, } from 'lucide-react';
import { CoinIcon, StarIcon } from './GameIcons';

interface StudentIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const StudentIdCardModal: React.FC<StudentIdCardModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundManager.play('click');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Thẻ Vinh Danh • Học Siêu Vui
            </span>
          </div>
          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Card Content */}
        <div className="p-6">
          <div className="relative rounded-2xl p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl overflow-hidden border-2 border-amber-400/50">
            {/* Background watermarks / math symbols */}
            <div className="absolute -top-10 -right-10 text-9xl text-white/5 font-mono select-none pointer-events-none">
              π
            </div>
            <div className="absolute -bottom-8 -left-8 text-8xl text-white/5 font-mono select-none pointer-events-none">
              ∑
            </div>

            {/* School Header with Mascot Logo */}
            <div className="flex items-center justify-between pb-3 border-b border-white/20 gap-3">
              <img 
                src={APP_LOGO_SRC} 
                alt="Logo" 
                className="w-10 h-10 rounded-xl object-cover border border-white/30 shadow-md shrink-0" 
              />
              <div className="text-right flex-1">
                <p className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                  HỌC SIÊU VUI • {CURRENT_VERSION}
                </p>
                <h3 className="font-bold text-xs sm:text-sm tracking-wide truncate mt-0.5 text-white">
                  {student.school.toUpperCase()}
                </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="flex items-center gap-4 py-4">
              {/* Avatar Box */}
              <div className="w-24 h-28 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                <AvatarRenderer config={student.avatarConfig} size="sm" showVehicle={false} showTech={false} showPet={false} />
              </div>

              {/* Student Info */}
              <div className="flex-1 space-y-1">
                <div>
                  <span className="text-[10px] text-blue-200 uppercase tracking-wider">Họ và Tên</span>
                  <p className="text-lg font-black leading-tight text-white drop-shadow-sm">
                    {student.name}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <div>
                    <span className="text-[10px] text-blue-200 uppercase">Lớp</span>
                    <p className="font-bold text-sm text-amber-300">{student.grade}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-200 uppercase">Danh Hiệu</span>
                    <p className="font-bold text-xs text-white">Cấp {student.level} • Số Học</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-md font-mono">
                    <CoinIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>{student.coins}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-md font-mono">
                    <StarIcon className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                    <span>{student.stars}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Motto Footer */}
            <div className="pt-3 border-t border-white/20 text-center">
              <p className="text-[11px] italic text-blue-100 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                "{student.motto}"
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            In / Lưu Thẻ Học Sinh
          </button>
          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="py-2.5 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
