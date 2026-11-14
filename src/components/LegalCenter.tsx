import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Baby, Cookie, Mail } from 'lucide-react';

export type LegalPageKey = 'privacy' | 'terms' | 'children' | 'cookies';
type Props = { page: LegalPageKey; onClose: () => void; onNavigate: (page: LegalPageKey) => void };

const EMAIL = 'dungvt.hbh@gmail.com';
const VERSION = 'HSV-POLICY-DRAFT-0.1';
const updated = '14/11/2026';

const pages: { key: LegalPageKey; label: string; icon: React.ReactNode }[] = [
  { key: 'privacy', label: 'Quyền riêng tư', icon: <ShieldCheck className="w-4 h-4" /> },
  { key: 'terms', label: 'Điều khoản sử dụng', icon: <FileText className="w-4 h-4" /> },
  { key: 'children', label: 'Bảo vệ trẻ em', icon: <Baby className="w-4 h-4" /> },
  { key: 'cookies', label: 'Cookie & lưu trữ', icon: <Cookie className="w-4 h-4" /> },
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h3>
    <div className="space-y-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{children}</div>
  </section>
);

export const LegalCenter: React.FC<Props> = ({ page, onClose, onNavigate }) => {
  const selected = pages.find((p) => p.key === page) ?? pages[0];
  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" aria-label="Chính sách Học Siêu Vui">
      <div className="min-h-full bg-slate-50 dark:bg-slate-950">
        <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Quay lại"><ArrowLeft className="w-5 h-5" /></button>
            <div className="min-w-0 flex-1">
              <div className="font-black text-slate-900 dark:text-white">Trung tâm chính sách</div>
              <div className="text-xs text-slate-500">Học Siêu Vui · {VERSION} · Cập nhật {updated}</div>
            </div>
          </div>
          <nav className="max-w-5xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto" aria-label="Các chính sách">
            {pages.map((p) => <button key={p.key} onClick={() => onNavigate(p.key)} aria-current={page === p.key ? 'page' : undefined}
              className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${page === p.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
              {p.icon}{p.label}
            </button>)}
          </nav>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-7 sm:py-10 space-y-6">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 text-sm leading-6 text-amber-900 dark:text-amber-200">
            <strong>Thông tin chính sách – bản 0.1.</strong> Đây là nội dung công khai ban đầu, đang chờ hoàn tất xác minh chủ thể vận hành, thời hạn lưu dữ liệu, nhà cung cấp và rà soát pháp lý chuyên môn. Không coi việc xem trang này hoặc tiếp tục sử dụng website là bằng chứng đồng ý riêng của cha mẹ/người đại diện.
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 space-y-6 shadow-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Học Siêu Vui · Dự án độc lập</div>
              <h1 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white">{selected.label}</h1>
              <p className="text-xs text-slate-500 mt-2">Phiên bản {VERSION} · Cập nhật {updated}</p>
            </div>

            {page === 'privacy' && <>
              <Section title="1. Ai vận hành Học Siêu Vui?">
                <p>Học Siêu Vui do cá nhân vận hành độc lập; không phải sản phẩm chính thức, không đại diện và không được hiểu là sản phẩm do VNPT bảo trợ. Thông tin liên hệ về quyền riêng tư: <a className="text-blue-600 underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
                <p>Họ tên đầy đủ và địa chỉ liên hệ của cá nhân vận hành cần được bổ sung sau khi hoàn tất xác minh trước khi chính sách được xác nhận là bản chính thức.</p>
              </Section>
              <Section title="2. Dữ liệu nào có thể được xử lý?">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Thông tin tài khoản: biệt danh, mã tài khoản và thông tin xác thực do Supabase Auth quản lý; website không cần học sinh cung cấp email cá nhân để đăng ký theo luồng hiện tại.</li>
                  <li>Dữ liệu học tập: bài học đã làm, câu trả lời, kết quả, tiến độ và thời điểm hoạt động.</li>
                  <li>Dữ liệu trò chơi: XP, Xu, vật phẩm, avatar và thành tích.</li>
                  <li>Thông tin hỗ trợ: nội dung góp ý hoặc báo lỗi nếu người dùng chủ động gửi.</li>
                  <li>Dữ liệu kỹ thuật: thông tin phiên đăng nhập, nhật ký bảo mật, thông tin truy cập và trạng thái kết nối cần thiết để vận hành dịch vụ.</li>
                </ul>
                <p>Không gửi mật khẩu, mã xác thực hoặc giấy tờ định danh qua biểu mẫu góp ý.</p>
              </Section>
              <Section title="3. Mục đích sử dụng">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tạo và bảo vệ tài khoản; xác thực người dùng.</li>
                  <li>Cung cấp bài học, lưu kết quả và đồng bộ tiến độ.</li>
                  <li>Tính điểm thưởng, quản lý vật phẩm và chống gian lận.</li>
                  <li>Hỗ trợ người dùng, xử lý sự cố, bảo vệ hệ thống và thực hiện nghĩa vụ pháp luật.</li>
                  <li>Hiển thị bảng xếp hạng bằng biệt danh theo cài đặt và cơ chế được công bố.</li>
                </ul>
              </Section>
              <Section title="4. Nhà cung cấp và nơi xử lý">
                <p>Hệ thống hiện tích hợp Supabase cho cơ sở dữ liệu và xác thực; dự án Supabase đang được cấu hình tại khu vực Seoul, Hàn Quốc. Website cũng tải phông chữ từ Google Fonts. Nhà cung cấp hosting và các dịch vụ kỹ thuật liên quan phải được rà soát, cập nhật đầy đủ trong bản chính thức.</p>
                <p>Việc sử dụng hạ tầng ngoài Việt Nam có thể phát sinh nghĩa vụ về chuyển dữ liệu cá nhân xuyên biên giới. Chủ thể vận hành phải hoàn tất đánh giá và hồ sơ pháp lý áp dụng trước khi tuyên bố đã tuân thủ đầy đủ.</p>
              </Section>
              <Section title="5. Thời hạn lưu trữ">
                <p>Dữ liệu được lưu trong thời gian cần thiết cho mục đích đã nêu hoặc theo thời hạn pháp luật yêu cầu. Bảng thời hạn cụ thể theo từng loại dữ liệu, nhật ký và bản sao lưu hiện đang được hoàn thiện; không cam kết xóa tức thời khỏi mọi bản sao lưu.</p>
              </Section>
              <Section title="6. Quyền của người dùng và người đại diện">
                <p>Người dùng hoặc cha mẹ/người đại diện hợp pháp có thể gửi yêu cầu truy cập, chỉnh sửa, hạn chế, phản đối, rút lại sự đồng ý hoặc xóa dữ liệu trong phạm vi pháp luật cho phép. Gửi yêu cầu tới <a className="text-blue-600 underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>. HSV sẽ xác minh hợp lý người yêu cầu trước khi cung cấp hoặc thay đổi dữ liệu.</p>
              </Section>
              <Section title="7. Bảo mật">
                <p>HSV áp dụng phân quyền tài khoản, kiểm soát truy cập, xác thực và các biện pháp kỹ thuật phù hợp. Không có hệ thống nào bảo đảm an toàn tuyệt đối; khi phát hiện sự cố, HSV sẽ đánh giá, khắc phục và thông báo theo nghĩa vụ pháp luật.</p>
              </Section>
            </>}

            {page === 'terms' && <>
              <Section title="1. Phạm vi">
                <p>Điều khoản này áp dụng khi truy cập và sử dụng Học Siêu Vui, nền tảng học tập trực tuyến do cá nhân vận hành độc lập, không phải sản phẩm chính thức của VNPT.</p>
              </Section>
              <Section title="2. Tài khoản">
                <p>Người dùng cần cung cấp biệt danh phù hợp, giữ bí mật mật khẩu và thông báo khi nghi ngờ tài khoản bị truy cập trái phép. Không dùng tên thật, địa chỉ, số điện thoại hoặc thông tin nhận dạng của trẻ làm biệt danh. Cha mẹ/người đại diện cần trực tiếp tham gia việc tạo và quản lý tài khoản của trẻ.</p>
              </Section>
              <Section title="3. Quy tắc sử dụng">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sử dụng nền tảng cho mục đích học tập và giải trí lành mạnh.</li>
                  <li>Không giả mạo, quấy rối, bắt nạt hoặc đăng thông tin riêng tư của người khác.</li>
                  <li>Không tìm cách truy cập trái phép tài khoản, lớp học hoặc dữ liệu.</li>
                  <li>Không can thiệp, phá hoại hoặc làm gián đoạn hệ thống.</li>
                </ul>
              </Section>
              <Section title="4. Nội dung học tập và kết quả">
                <p>Nội dung hỗ trợ ôn tập, không thay thế sách giáo khoa, giáo viên hoặc đánh giá chính thức của nhà trường. Một số nội dung có thể được cập nhật, sửa lỗi hoặc tạm ẩn để thẩm định.</p>
              </Section>
              <Section title="5. XP, Xu và vật phẩm">
                <p>XP, Xu, sao và vật phẩm là thành phần ảo trong trò chơi, không phải tiền hoặc phương tiện thanh toán và không được quy đổi thành tiền thật. Nếu sau này có dịch vụ thu phí hoặc giao dịch bằng tiền thật, điều kiện, giá, thanh toán và hoàn tiền phải được công bố riêng trước khi kích hoạt.</p>
              </Section>
              <Section title="6. Bảng xếp hạng và quyền sở hữu">
                <p>Bảng xếp hạng sử dụng biệt danh, không phải nơi công khai hồ sơ cá nhân. Phần mềm, giao diện, hình ảnh, âm thanh và nội dung thuộc chủ sở hữu tương ứng hoặc bên cấp phép; người dùng không được sao chép hoặc khai thác trái phép.</p>
              </Section>
              <Section title="7. Hỗ trợ và khiếu nại">
                <p>Gửi phản ánh về dịch vụ hoặc điều khoản tới <a className="text-blue-600 underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>. Các quyền bắt buộc của người tiêu dùng theo pháp luật không bị loại trừ bởi điều khoản này.</p>
              </Section>
            </>}

            {page === 'children' && <>
              <Section title="1. Nguyên tắc an toàn">
                <p>Học Siêu Vui hướng tới học sinh. Chúng tôi ưu tiên lợi ích tốt nhất, sự an toàn và quyền riêng tư của trẻ; khuyến khích trẻ nhờ cha mẹ hoặc giáo viên hỗ trợ khi sử dụng dịch vụ.</p>
              </Section>
              <Section title="2. Giảm thiểu thông tin nhận dạng">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Dùng biệt danh thay cho tên thật.</li>
                  <li>Không hiển thị email, số điện thoại, địa chỉ hoặc vị trí.</li>
                  <li>Không yêu cầu ảnh chân dung thật để tạo avatar.</li>
                  <li>Không khuyến khích liên hệ riêng với người lạ hoặc chia sẻ thông tin gia đình.</li>
                  <li>Không bật trò chuyện công khai giữa học sinh trong MVP.</li>
                </ul>
              </Section>
              <Section title="3. Vai trò của cha mẹ/người đại diện">
                <p>Cha mẹ/người đại diện hợp pháp cần trực tiếp đọc chính sách, xem xét việc tạo tài khoản, hỗ trợ trẻ và thực hiện các yêu cầu liên quan đến dữ liệu của trẻ. Trẻ không được thay cha mẹ/người đại diện xác nhận tư cách hoặc đồng ý thay cho người lớn.</p>
                <p>Trang này và việc bấm nút đóng không tạo ra hoặc chứng minh sự đồng ý của cha mẹ/người đại diện.</p>
              </Section>
              <Section title="4. Bảng xếp hạng và công khai thông tin">
                <p>Chỉ sử dụng biệt danh/mã hiển thị; không công khai tên thật, ảnh, email, trường/lớp hoặc kết quả chi tiết. Mọi tính năng công khai thông tin nhận diện trẻ phải được đánh giá riêng và có cơ chế đồng ý phù hợp pháp luật.</p>
              </Section>
              <Section title="5. Báo cáo nội dung hoặc sự cố">
                <p>Cha mẹ, giáo viên hoặc học sinh có thể báo cáo nội dung không phù hợp, bắt nạt, giả mạo hoặc nguy cơ lộ dữ liệu qua <a className="text-blue-600 underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>. Không gửi giấy tờ tùy thân hoặc thông tin nhạy cảm qua email thông thường.</p>
              </Section>
              <Section title="6. Căn cứ và quyền dữ liệu">
                <p>Việc xử lý dữ liệu trẻ em phải tuân thủ Luật Trẻ em 2016, Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15, Nghị định 56/2017/NĐ-CP, Nghị định 356/2025/NĐ-CP và quy định liên quan. Cơ chế xác minh người đại diện, lưu bằng chứng đồng ý và xử lý yêu cầu dữ liệu đang được hoàn thiện; trang này không thay thế quy trình đó.</p>
              </Section>
            </>}

            {page === 'cookies' && <>
              <Section title="1. Cookie và công nghệ tương tự">
                <p>Website có thể dùng cookie, localStorage và sessionStorage để duy trì phiên đăng nhập, ghi nhớ tùy chọn, hỗ trợ bảo mật và lưu trạng thái giao diện. Supabase Auth lưu thông tin phiên trên trình duyệt theo cấu hình client hiện tại.</p>
              </Section>
              <Section title="2. Phân loại">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Thiết yếu: phiên đăng nhập, bảo mật và chức năng cốt lõi.</li>
                  <li>Tùy chọn: âm thanh, tùy chọn giao diện hoặc trạng thái trải nghiệm.</li>
                  <li>Phân tích: chỉ được mô tả/bật sau khi kiểm kê công cụ, mục đích và cơ chế đồng ý tương ứng.</li>
                  <li>Quảng cáo/tiếp thị: không được mặc định bật cho trẻ em.</li>
                </ul>
              </Section>
              <Section title="3. Bên thứ ba">
                <p>Website hiện tải phông chữ từ Google Fonts và sử dụng Supabase cho xác thực/cơ sở dữ liệu. Trình duyệt có thể gửi thông tin kết nối tới các nhà cung cấp này. Danh sách cookie/storage thực tế cần được kiểm tra trên trình duyệt trước khi xác nhận bản chính thức.</p>
              </Section>
              <Section title="4. Quản lý">
                <p>Người dùng có thể xóa dữ liệu website trong cài đặt trình duyệt; thao tác này có thể làm đăng xuất hoặc mất tùy chọn cục bộ. Không xóa dữ liệu trình duyệt của trẻ khi chưa trao đổi với cha mẹ/người đại diện nếu dữ liệu học tập chưa được đồng bộ.</p>
              </Section>
            </>}

            <div className="border-t border-slate-200 dark:border-slate-700 pt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><Mail className="w-4 h-4" />{EMAIL}</a>
              <span className="text-xs text-slate-500">Chủ thể vận hành: cá nhân · Dự án độc lập</span>
            </div>
          </div>
          <div className="text-center text-xs text-slate-500 pb-8">Học Siêu Vui · Thông tin chính sách phiên bản {VERSION}</div>
        </main>
      </div>
    </div>
  );
};
