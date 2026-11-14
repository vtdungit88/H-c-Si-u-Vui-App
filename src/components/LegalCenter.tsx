import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Baby, Cookie, Mail } from 'lucide-react';

export type LegalPageKey = 'privacy' | 'terms' | 'children' | 'cookies';
type Props = { page: LegalPageKey; onClose: () => void; onNavigate: (page: LegalPageKey) => void };

const EMAIL = 'dungvt.hbh@gmail.com';
const VERSION = 'HSV-POLICY-0.2';
const UPDATED = '14/11/2026';

const pages: { key: LegalPageKey; label: string; icon: React.ReactNode }[] = [
  { key: 'privacy', label: 'Chính sách quyền riêng tư', icon: <ShieldCheck className="w-4 h-4" /> },
  { key: 'terms', label: 'Điều khoản sử dụng', icon: <FileText className="w-4 h-4" /> },
  { key: 'children', label: 'Chính sách bảo vệ trẻ em', icon: <Baby className="w-4 h-4" /> },
  { key: 'cookies', label: 'Chính sách Cookie', icon: <Cookie className="w-4 h-4" /> },
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h3>
    <div className="space-y-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{children}</div>
  </section>
);

const Contact = () => (
  <div className="border-t border-slate-200 dark:border-slate-700 pt-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
    <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
      <Mail className="w-4 h-4" />{EMAIL}
    </a>
    <span className="text-xs text-slate-500">Học Siêu Vui · ${VERSION}</span>
  </div>
);

export const LegalCenter: React.FC<Props> = ({ page, onClose, onNavigate }) => {
  const selected = pages.find((p) => p.key === page) ?? pages[0];
  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/70 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true" aria-label="Chính sách Học Siêu Vui">
      <div className="min-h-full bg-slate-50 dark:bg-slate-950">
        <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Quay lại">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="font-black text-slate-900 dark:text-white">Chính sách và điều khoản</div>
              <div className="text-xs text-slate-500">Phiên bản {VERSION} · Cập nhật {UPDATED}</div>
            </div>
          </div>
          <nav className="max-w-5xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto" aria-label="Danh mục chính sách">
            {pages.map((p) => (
              <button key={p.key} onClick={() => onNavigate(p.key)} aria-current={page === p.key ? 'page' : undefined}
                className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border ${page === p.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
                {p.icon}{p.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-7 sm:py-10 space-y-6">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900 p-4 text-sm leading-6 text-blue-900 dark:text-blue-100">
            Học Siêu Vui tôn trọng quyền riêng tư, quyền trẻ em và quyền lợi hợp pháp của người sử dụng. Các chính sách dưới đây được xây dựng trên cơ sở pháp luật Việt Nam hiện hành và được cập nhật khi có thay đổi phù hợp.
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 space-y-6 shadow-sm">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">HỌC SIÊU VUI</div>
              <h1 className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white">{selected.label}</h1>
              <p className="text-xs text-slate-500 mt-2">Phiên bản {VERSION} · Có hiệu lực từ ngày công bố · Cập nhật {UPDATED}</p>
            </div>

            {page === 'privacy' && <>
              <Section title="1. Cam kết bảo vệ quyền riêng tư">
                <p>Học Siêu Vui tôn trọng và bảo vệ dữ liệu cá nhân của người sử dụng. Việc thu thập, sử dụng, lưu trữ và chia sẻ dữ liệu được thực hiện đúng mục đích, trong phạm vi cần thiết, minh bạch và phù hợp với quy định pháp luật Việt Nam.</p>
              </Section>
              <Section title="2. Dữ liệu được thu thập">
                <p>Tùy theo tính năng được sử dụng, Học Siêu Vui có thể xử lý các nhóm dữ liệu sau:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Thông tin tài khoản: tên hiển thị, mã tài khoản và thông tin cần thiết để xác thực, bảo vệ tài khoản.</li>
                  <li>Dữ liệu học tập: bài học, câu trả lời, kết quả, tiến độ và lịch sử học tập.</li>
                  <li>Dữ liệu trải nghiệm: hình đại diện, điểm thưởng, vật phẩm và thành tích trong trò chơi.</li>
                  <li>Thông tin hỗ trợ: nội dung phản hồi, yêu cầu trợ giúp hoặc báo cáo do người sử dụng gửi.</li>
                  <li>Dữ liệu phát sinh khi sử dụng dịch vụ: thời điểm truy cập, thông tin phiên và nhật ký cần thiết để bảo đảm an toàn, ổn định.</li>
                </ul>
                <p>Học Siêu Vui không khuyến khích người dùng cung cấp thông tin không cần thiết, đặc biệt là thông tin nhạy cảm hoặc thông tin định danh của trẻ em.</p>
              </Section>
              <Section title="3. Mục đích xử lý dữ liệu">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tạo lập, quản lý và bảo vệ tài khoản.</li>
                  <li>Cung cấp bài học, ghi nhận kết quả và đồng bộ tiến độ học tập.</li>
                  <li>Vận hành tính năng trò chơi, phần thưởng và bảng xếp hạng theo thiết lập được công bố.</li>
                  <li>Tiếp nhận yêu cầu hỗ trợ, xử lý sự cố và ngăn ngừa hành vi vi phạm.</li>
                  <li>Thực hiện nghĩa vụ theo quy định pháp luật hoặc yêu cầu hợp pháp của cơ quan có thẩm quyền.</li>
                </ul>
                <p>Dữ liệu không được sử dụng cho mục đích khác với mục đích đã thông báo, trừ trường hợp pháp luật cho phép hoặc có căn cứ hợp pháp phù hợp.</p>
              </Section>
              <Section title="4. Chia sẻ và chuyển dữ liệu">
                <p>Học Siêu Vui không mua bán dữ liệu cá nhân. Dữ liệu chỉ được cung cấp cho người có thẩm quyền hoặc bên hỗ trợ cần thiết để duy trì dịch vụ, bảo đảm an toàn và xử lý yêu cầu hợp pháp; việc cung cấp phải giới hạn trong phạm vi cần thiết và có biện pháp bảo vệ phù hợp.</p>
                <p>Trong trường hợp dữ liệu được xử lý hoặc chuyển ra ngoài lãnh thổ Việt Nam, Học Siêu Vui thực hiện các nghĩa vụ đánh giá, lập hồ sơ và bảo vệ dữ liệu theo quy định pháp luật áp dụng.</p>
              </Section>
              <Section title="5. Thời hạn lưu trữ">
                <p>Dữ liệu được lưu giữ trong thời gian cần thiết để thực hiện các mục đích đã thông báo, giải quyết yêu cầu phát sinh và đáp ứng nghĩa vụ pháp lý. Khi không còn cần thiết, dữ liệu được xóa, hủy hoặc ẩn danh theo quy định, trừ trường hợp pháp luật yêu cầu tiếp tục lưu trữ.</p>
              </Section>
              <Section title="6. Quyền của người sử dụng">
                <p>Người sử dụng và chủ thể dữ liệu có các quyền theo quy định pháp luật, bao gồm quyền được biết, đồng ý hoặc không đồng ý trong trường hợp cần có sự đồng ý, truy cập, chỉnh sửa, yêu cầu cung cấp, hạn chế hoặc phản đối xử lý, rút lại sự đồng ý, yêu cầu xóa dữ liệu và khiếu nại theo điều kiện luật định.</p>
                <p>Yêu cầu liên quan đến dữ liệu cá nhân có thể gửi tới <a className="text-blue-600 underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>. Học Siêu Vui có thể yêu cầu thông tin cần thiết để xác minh người gửi và bảo vệ dữ liệu khỏi việc cung cấp sai đối tượng.</p>
              </Section>
              <Section title="7. Bảo vệ dữ liệu">
                <p>Học Siêu Vui áp dụng các biện pháp quản lý và kỹ thuật phù hợp nhằm ngăn ngừa truy cập, sử dụng, thay đổi, tiết lộ hoặc mất dữ liệu trái phép; đồng thời xem xét và xử lý sự cố theo trách nhiệm pháp luật quy định.</p>
              </Section>
              <Section title="8. Cập nhật chính sách">
                <p>Chính sách có thể được điều chỉnh để phù hợp với hoạt động của dịch vụ và quy định pháp luật. Phiên bản mới sẽ được công bố tại trang này cùng ngày cập nhật. Trường hợp thay đổi ảnh hưởng đến quyền và lợi ích của người sử dụng, Học Siêu Vui sẽ thông báo và thực hiện việc lấy ý kiến hoặc sự đồng ý lại khi pháp luật yêu cầu.</p>
              </Section>
            </>}

            {page === 'terms' && <>
              <Section title="1. Phạm vi áp dụng">
                <p>Điều khoản này quy định quyền và trách nhiệm của người sử dụng khi truy cập, đăng ký hoặc sử dụng Học Siêu Vui. Khi sử dụng dịch vụ, người dùng có trách nhiệm đọc, hiểu và tuân thủ các quy định áp dụng cho tính năng mình sử dụng.</p>
              </Section>
              <Section title="2. Tài khoản và trách nhiệm">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cung cấp thông tin phù hợp, chính xác trong phạm vi được yêu cầu và không mạo danh người khác.</li>
                  <li>Bảo mật thông tin đăng nhập; thông báo kịp thời khi phát hiện nguy cơ mất an toàn tài khoản.</li>
                  <li>Không sử dụng tên hiển thị, hình ảnh hoặc nội dung xâm phạm quyền và lợi ích hợp pháp của người khác.</li>
                  <li>Người chưa thành niên cần có sự hướng dẫn, hỗ trợ và xác nhận của cha mẹ hoặc người đại diện hợp pháp khi pháp luật yêu cầu.</li>
                </ul>
              </Section>
              <Section title="3. Quy tắc sử dụng">
                <p>Người sử dụng không được:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Đăng tải nội dung vi phạm pháp luật, xúc phạm, bắt nạt hoặc xâm phạm quyền riêng tư của người khác.</li>
                  <li>Truy cập trái phép, can thiệp, làm gián đoạn hoặc gây ảnh hưởng đến hoạt động của dịch vụ.</li>
                  <li>Phát tán mã độc, gian lận kết quả hoặc lợi dụng dịch vụ cho mục đích trái pháp luật.</li>
                  <li>Sao chép, khai thác hoặc sử dụng nội dung khi chưa có quyền hoặc sự cho phép cần thiết.</li>
                </ul>
              </Section>
              <Section title="4. Nội dung học tập và tính năng">
                <p>Nội dung trên Học Siêu Vui nhằm hỗ trợ học tập và rèn luyện. Nội dung không thay thế chương trình, tài liệu giảng dạy chính thức, sự hướng dẫn của giáo viên hoặc kết quả đánh giá của cơ sở giáo dục. Nội dung và tính năng có thể được cập nhật, điều chỉnh hoặc tạm ngừng để bảo trì, sửa lỗi và bảo đảm an toàn.</p>
              </Section>
              <Section title="5. Điểm thưởng và vật phẩm">
                <p>Điểm kinh nghiệm, Xu, sao và vật phẩm là quyền lợi ảo phục vụ trải nghiệm trong phạm vi dịch vụ; không phải tiền, không phải phương tiện thanh toán và không có giá trị quy đổi thành tiền thật. Mọi tính năng thu phí, nếu được cung cấp trong tương lai, sẽ có thông tin và điều kiện riêng trước khi người dùng thực hiện giao dịch.</p>
              </Section>
              <Section title="6. Quyền sở hữu trí tuệ">
                <p>Giao diện, phần mềm, hình ảnh, âm thanh, nhãn hiệu và nội dung thuộc quyền của chủ sở hữu hợp pháp hoặc bên cấp phép. Người sử dụng không được sao chép, sửa đổi, phân phối hoặc khai thác trái phép các tài sản này.</p>
              </Section>
              <Section title="7. Tiếp nhận phản ánh và giải quyết tranh chấp">
                <p>Phản ánh, khiếu nại hoặc yêu cầu hỗ trợ có thể gửi tới <a className="text-blue-600 underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>. Các bên ưu tiên giải quyết trên tinh thần thiện chí, tôn trọng quyền lợi hợp pháp của người sử dụng và tuân thủ pháp luật Việt Nam. Điều khoản này không loại trừ hoặc hạn chế quyền bắt buộc của người tiêu dùng theo quy định pháp luật.</p>
              </Section>
            </>}

            {page === 'children' && <>
              <Section title="1. Nguyên tắc bảo vệ trẻ em">
                <p>Học Siêu Vui hướng tới môi trường học tập tích cực, an toàn và phù hợp với lứa tuổi. Quyền, lợi ích tốt nhất và sự an toàn của trẻ em luôn được ưu tiên trong quá trình cung cấp dịch vụ.</p>
              </Section>
              <Section title="2. Hạn chế thu thập và công khai thông tin">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Khuyến khích sử dụng tên hiển thị thay cho họ tên thật.</li>
                  <li>Không yêu cầu trẻ công khai địa chỉ, số điện thoại hoặc thông tin liên hệ riêng tư.</li>
                  <li>Không khuyến khích trẻ chia sẻ hình ảnh, vị trí hoặc thông tin gia đình lên môi trường công khai.</li>
                  <li>Chỉ hiển thị thông tin cần thiết cho tính năng đã được thông báo và có cơ chế bảo vệ phù hợp.</li>
                </ul>
              </Section>
              <Section title="3. Vai trò của cha mẹ và người đại diện">
                <p>Cha mẹ hoặc người đại diện hợp pháp có trách nhiệm hướng dẫn, đồng hành và giám sát việc sử dụng dịch vụ của trẻ. Khi pháp luật yêu cầu phải có sự đồng ý của cha mẹ, người đại diện hoặc của chính trẻ, Học Siêu Vui sẽ thực hiện việc thông báo và ghi nhận sự đồng ý tương ứng trước khi xử lý dữ liệu thuộc trường hợp đó.</p>
                <p>Trẻ em không được tự xác nhận thay cho cha mẹ hoặc người đại diện hợp pháp đối với những nội dung pháp luật yêu cầu người đại diện chấp thuận.</p>
              </Section>
              <Section title="4. An toàn trong quá trình sử dụng">
                <p>Người sử dụng cần thông báo cho cha mẹ, giáo viên hoặc Học Siêu Vui khi gặp nội dung không phù hợp, hành vi bắt nạt, giả mạo hoặc nguy cơ mất an toàn. Học Siêu Vui xem xét phản ánh và áp dụng biện pháp phù hợp trong phạm vi quản lý của mình.</p>
              </Section>
              <Section title="5. Yêu cầu liên quan đến dữ liệu của trẻ">
                <p>Cha mẹ hoặc người đại diện hợp pháp có thể gửi yêu cầu truy cập, chỉnh sửa, hạn chế xử lý, rút lại sự đồng ý hoặc xóa dữ liệu của trẻ theo quy định pháp luật tới <a className="text-blue-600 underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>. Học Siêu Vui sẽ xác minh tư cách người yêu cầu trước khi xử lý.</p>
              </Section>
            </>}

            {page === 'cookies' && <>
              <Section title="1. Cookie là gì?">
                <p>Cookie là các tệp dữ liệu nhỏ được lưu trên thiết bị khi người dùng truy cập website. Cookie và công nghệ lưu trữ tương tự có thể giúp ghi nhớ lựa chọn, duy trì phiên sử dụng, bảo vệ tài khoản và cải thiện trải nghiệm.</p>
              </Section>
              <Section title="2. Mục đích sử dụng">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Cookie thiết yếu: hỗ trợ chức năng cơ bản, bảo mật và duy trì phiên sử dụng.</li>
                  <li>Cookie tùy chọn: ghi nhớ lựa chọn và thiết lập trải nghiệm của người dùng.</li>
                  <li>Cookie phân tích hoặc quảng cáo: chỉ được sử dụng khi được triển khai, có thông báo rõ ràng và có cơ chế lựa chọn phù hợp theo quy định pháp luật.</li>
                </ul>
              </Section>
              <Section title="3. Lựa chọn và quản lý">
                <p>Người dùng có thể quản lý hoặc xóa cookie thông qua cài đặt trình duyệt. Việc tắt cookie thiết yếu có thể làm một số chức năng không hoạt động bình thường. Các lựa chọn liên quan đến cookie không thiết yếu sẽ được tôn trọng theo cơ chế lựa chọn được cung cấp.</p>
              </Section>
              <Section title="4. Thay đổi chính sách">
                <p>Chính sách Cookie có thể được cập nhật khi mục đích sử dụng hoặc tính năng thay đổi. Phiên bản mới nhất luôn được công bố tại trang này.</p>
              </Section>
            </>}

            <Contact />
          </div>
          <div className="text-center text-xs text-slate-500 pb-8">Học Siêu Vui · Phiên bản {VERSION} · Cập nhật {UPDATED}</div>
        </main>
      </div>
    </div>
  );
};
