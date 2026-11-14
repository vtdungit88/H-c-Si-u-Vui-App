/**
 * Rule-based answers for the in-app helper "Bé Siêu Vui".
 * It explains how Học Siêu Vui works and chats about learning; it is not a general-purpose AI
 * and does not solve specific homework problems.
 */
export type NavView = 'study' | 'shop' | 'blitz' | 'map' | 'leaderboard' | 'lobby';
export interface BrainContext { name: string; isGuest: boolean; coins: number; stars: number }
export interface BrainAnswer { text: string; actions?: { label: string; view: NavView }[] }

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();

const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

const TIPS = [
  'Đọc kĩ đề hai lần trước khi chọn đáp án: nhiều câu "bẫy" nằm ở một chữ như "không" hay "sai".',
  'Gặp câu khó, hãy loại trừ những đáp án chắc chắn sai trước, rồi chọn trong số còn lại.',
  'Sau mỗi câu, đọc phần lời giải và mẹo. Hiểu vì sao đúng quan trọng hơn là nhớ đáp án.',
  'Làm bài đều mỗi ngày 1 ải nhỏ còn hiệu quả hơn dồn cả tuần mới làm một lần.',
  'Môn Toán: viết nháp từng bước, đừng nhẩm hết trong đầu. Môn Khoa học tự nhiên: hãy hình dung hiện tượng ngoài đời thật.',
  'Nếu sai một câu, đừng buồn: mỗi lần sai là một lần bạn nhớ bài sâu hơn!',
  'Ngủ đủ giấc giúp não ghi nhớ bài tốt hơn thức khuya học thêm.',
  'Thử giải thích lại bài cho một người bạn: nếu bạn nói được, nghĩa là bạn đã hiểu.'
];
const RIDDLES = [
  'Đố bạn: Có 3 quả táo, bạn lấy đi 2 quả. Bạn có mấy quả táo? (Gợi ý: bạn lấy đi bao nhiêu thì có bấy nhiêu!)',
  'Đố bạn: Số nào cộng với chính nó bằng nhân với chính nó? (Có hai đáp án đó!)',
  'Đố bạn: Hình nào có 3 cạnh, 3 góc và tổng ba góc bằng 180°?',
  'Đố bạn: Nước đóng băng ở bao nhiêu độ C?',
  'Đố bạn: Một tuần có 7 ngày, vậy 3 tuần có bao nhiêu ngày?'
];
const FACTS = [
  'Bạn biết không? Số π (pi) xấp xỉ 3,14159… và có vô hạn chữ số thập phân không lặp lại!',
  'Bạn biết không? Ánh sáng Mặt Trời mất khoảng 8 phút để tới Trái Đất.',
  'Bạn biết không? Nước là chất duy nhất trên Trái Đất tồn tại tự nhiên ở cả ba thể: rắn, lỏng, khí.',
  'Bạn biết không? Số 0 được các nhà toán học Ấn Độ cổ đại đưa vào hệ thống số.'
];

interface Intent { keys: string[]; answer: (c: BrainContext) => BrainAnswer }

const INTENTS: Intent[] = [
  { keys: ['xin chao', 'chao ', 'hello', ' hi ', 'alo', 'hey'], answer: (c) => ({ text: `Chào ${c.isGuest ? 'bạn nhỏ' : c.name}! Mình là Bé Siêu Vui 💡. Mình có thể chỉ cách làm bài, kiếm xu, thi đấu, mua đồ cho nhân vật… Bạn muốn hỏi gì nào?` }) },
  { keys: ['ban la ai', 'ten gi', 'ai tao ra', 'be sieu vui'], answer: () => ({ text: 'Mình là Bé Siêu Vui, trợ lý của Học Siêu Vui 💡. Mình hướng dẫn bạn dùng các tính năng và động viên bạn khi học. Mình chưa phải một AI biết trả lời mọi thứ, nhưng cứ hỏi, mình sẽ cố giúp!' }) },
  { keys: ['dang ky', 'tao tai khoan', 'biet danh', 'dang nhap', 'nickname'], answer: (c) => ({ text: c.isGuest ? 'Bấm nút tài khoản ở góc phải trên cùng, chọn "Đăng ký", nhập một biệt danh vui và mật khẩu từ 6 ký tự. Không cần email! Đừng dùng tên thật hay số điện thoại nhé.' : 'Bạn đã đăng nhập rồi đó! Kết quả được lưu trên máy chủ nên đổi máy vẫn đăng nhập lại được bằng biệt danh và mật khẩu.' }) },
  { keys: ['quen mat khau', 'mat khau', 'doi mat khau', 'khong dang nhap duoc'], answer: () => ({ text: 'Nếu quên mật khẩu, hãy nhờ quản trị viên (thầy cô hoặc người quản lý Học Siêu Vui) đặt lại giúp bạn. Vì không dùng email nên mình chưa tự gửi lại mật khẩu được.' }) },
  { keys: ['kiem xu', 'lay xu', 'nhieu xu', 'xu la gi', ' xu ', 'xu?'], answer: (c) => ({ text: `Xu 🪙 kiếm bằng cách làm bài: mỗi câu đúng được 1 xu, chơi Đấu Trường cũng có xu thưởng (tối đa 5 lượt có thưởng mỗi ngày). Hiện bạn có ${c.coins} xu. Xu dùng để mua đồ ở Studio.`, actions: [{ label: 'Đi làm bài', view: 'study' }, { label: 'Tới Studio', view: 'shop' }] }) },
  { keys: ['sao vang', 'kiem sao', 'sao la gi', ' sao ', 'sao?', 'mat sao'], answer: (c) => ({ text: `Sao ⭐ tính theo kết quả tốt nhất ở mỗi ải: đúng từ 60% được 1 sao, từ 80% được 2 sao, đúng hết được 3 sao. Bạn đang có ${c.stars} sao. Một số món đồ cần đủ sao mới mở khóa.`, actions: [{ label: 'Mở bản đồ ải', view: 'map' }] }) },
  { keys: ['cua hang', 'mua do', 'trang phuc', 'avatar', 'nhan vat', 'studio', 'toc ', 'quan ao', 'ruong', 'hau canh', 'bo suu tap'], answer: () => ({ text: 'Vào Studio để đổi tóc, màu da, trang phục, hậu cảnh và mở rương bất ngờ cho nhân vật. Đồ bạn mua được lưu trên tài khoản, đổi máy vẫn còn!', actions: [{ label: 'Tới Studio', view: 'shop' }] }) },
  { keys: ['ban do', 'khoa ', 'mo khoa', ' ai ', 'vuot ai', 'dao ', 'trum'], answer: () => ({ text: 'Trên Bản Đồ Thám Hiểm mỗi chương là một hòn đảo. Đạt ít nhất 1 sao ở ải trước thì ải sau mới mở. Ải giữa chặng có rương, cuối đường là đảo Trùm Cuối. Bạn có thể bật hoặc tắt nhạc ở góc trên bản đồ.', actions: [{ label: 'Mở bản đồ ải', view: 'map' }] }) },
  { keys: ['sieu toc', 'blitz', '60s', '60 giay', 'tinh nhanh'], answer: () => ({ text: 'Siêu Tốc là trò tính nhanh trong 60 giây (lớp 1–2 được 90 giây): trả lời càng nhiều càng đúng liên tiếp càng nhiều điểm. Bạn có thể lập kỷ lục theo từng khối lớp và lên Bảng vàng.', actions: [{ label: 'Vào đấu trường', view: 'blitz' }] }) },
  { keys: ['1v1', 'thach dau', 'vui-bot', 'vui bot', 'vuibot', 'elo', 'hang ', 'xep hang elo', 'rank'], answer: () => ({ text: 'Thách Đấu 1v1: bạn đấu 10 câu với VNPT Vui-Bot (trợ lý AI trong game). Thắng thì lên điểm Elo và thăng hạng: Tân Binh → Chiến Binh Đồng → Hiệp Sĩ Bạc → Kỵ Sĩ Vàng → Tinh Anh Kim Cương → Trạng Nguyên Siêu Vui. Lớp 3–9 có thẻ trợ lực 50/50 loại bớt 2 đáp án sai.', actions: [{ label: 'Vào đấu trường', view: 'blitz' }] }) },
  { keys: ['phong lop', 'ma pin', ' pin', 'kahoot', 'thi dua', 'giao vien tao'], answer: () => ({ text: 'Phòng Lớp Học: thầy/cô chọn khối lớp rồi "Tạo phòng" để nhận mã PIN 6 số. Học sinh vào mục Đấu Trường → Phòng Lớp Học, nhập PIN, chờ thầy/cô bấm Bắt đầu rồi cả lớp làm cùng một bộ 10 câu. Điểm tính theo đúng và nhanh.', actions: [{ label: 'Vào đấu trường', view: 'blitz' }] }) },
  { keys: ['sanh', 'ban be', 'online', 'giao luu', 'tro chuyen voi ban', 'chat voi ban', 'du hanh', 'du lich', 'viet nam'], answer: () => ({ text: 'Sảnh Online là nơi bạn gặp các bạn đang trực tuyến, xem cấp độ của mình và Du hành khắp Việt Nam trên bản đồ 3D, sưu tầm các địa danh. Hãy lịch sự khi trò chuyện và báo cáo nếu thấy tin nhắn không phù hợp nhé.', actions: [{ label: 'Vào Sảnh Online', view: 'lobby' }] }) },
  { keys: ['cap do', 'level', 'len cap', 'kinh nghiem', ' xp'], answer: (c) => ({ text: `Cấp độ tăng khi bạn tích lũy điểm kinh nghiệm (XP) từ việc làm bài. Mỗi mốc cấp độ có phần thưởng riêng, bạn xem ở Sảnh Online. ${c.isGuest ? 'Hãy đăng nhập để lưu cấp độ nhé!' : ''}`.trim(), actions: [{ label: 'Vào Sảnh Online', view: 'lobby' }] }) },
  { keys: ['bang xep hang', 'xep hang', 'bang vang', 'top ', 'thu hang'], answer: () => ({ text: 'Bảng xếp hạng xếp theo thành tích của các bạn học sinh. Ngoài ra: Bản Đồ Ải có Top 10 theo môn và lớp, Đấu Trường có bảng Siêu Tốc và bảng hạng Elo theo từng khối lớp.', actions: [{ label: 'Xem bảng vàng', view: 'leaderboard' }, { label: 'Vào đấu trường', view: 'blitz' }] }) },
  { keys: ['mon nao', 'mon hoc', 'lop nao', 'co mon', 'toan', 'khoa hoc tu nhien', 'khtn', 'tieng anh', 'ngu van', 'lich su', 'dia ly'], answer: () => ({ text: 'Hiện có Toán từ lớp 1 đến lớp 9 và Khoa học tự nhiên từ lớp 6 đến lớp 9 (sách Kết nối tri thức). Các môn khác như Ngữ văn, Tiếng Anh, Lịch sử & Địa lí… đang được chuẩn bị, mình sẽ báo khi mở. Mỗi chương là một bài 15 câu.', actions: [{ label: 'Chọn môn học', view: 'study' }] }) },
  { keys: ['lam bai', 'bat dau', 'cach hoc', 'huong dan', 'choi the nao', 'cach choi'], answer: () => ({ text: 'Rất dễ! (1) Chọn môn và lớp ở trang chủ. (2) Bấm vào một chương. (3) Trả lời 15 câu, mỗi câu có thời gian suy nghĩ. (4) Đọc lời giải để hiểu bài và nhận xu, sao! Mình luôn ở góc màn hình để giúp bạn.', actions: [{ label: 'Bắt đầu học', view: 'study' }] }) },
  { keys: ['phan so', 'can bac', 'cong thuc', 'luy thua', 'hien thi'], answer: () => ({ text: 'Từ lớp 6 trở lên, phân số, căn bậc hai, lũy thừa và các ký hiệu toán được hiển thị dạng công thức đẹp, dễ đọc. Nếu thấy công thức nào hiển thị lỗi, hãy gửi góp ý cho quản trị viên nhé.' }) },
  { keys: ['giai bai', 'dap an', 'giai ho', 'lam ho', 'bai tap nay', 'cau nay'], answer: () => ({ text: 'Mình chưa giải được bài cụ thể cho bạn vì mình là trợ lý hướng dẫn. Nhưng sau mỗi câu có lời giải và mẹo, hãy đọc kĩ nhé. Nếu thấy câu hỏi hay đáp án sai, hãy gửi góp ý cho quản trị viên!' }) },
  { keys: ['meo', 'hoc tot', 'bi quyet', 'khong hieu', 'kho qua', ' chan ', ' met '], answer: () => ({ text: `💡 Mẹo nhỏ: ${pick(TIPS)}` }) },
  { keys: ['do vui', 'cau do', 'tro choi', 'choi gi'], answer: () => ({ text: pick(RIDDLES) }) },
  { keys: ['ban co biet', 'su that', 'ke chuyen', 'thu vi'], answer: () => ({ text: pick(FACTS) }) },
  { keys: [' buon', ' thua ', ' nan ', 'khong gioi', ' dot '], answer: () => ({ text: 'Mình hiểu cảm giác đó. Ai cũng có lúc làm sai, đó là cách não học bài! Bạn thử làm lại một chương dễ để lấy lại tự tin, mình luôn cổ vũ bạn 💪' }) },
  { keys: ['loi ', 'bi loi', 'khong vao duoc', 'khong tai', ' cham ', ' treo ', 'khong choi', 'khong nghe'], answer: () => ({ text: 'Bạn thử tải lại trang hoặc kiểm tra mạng nhé. Nếu vẫn lỗi, hãy mô tả lỗi ở thẻ "Góp ý" (nhớ ghi rõ bạn đang ở mục nào) để quản trị viên sửa giúp bạn.' }) },
  { keys: ['am thanh', 'nhac', 'tat tieng', 'bat tieng'], answer: () => ({ text: 'Bạn bấm biểu tượng loa ở thanh trên cùng để bật hoặc tắt âm thanh. Trên Bản Đồ Ải có thêm nút nhạc ở góc trên để bật tắt nhạc nền riêng.' }) },
  { keys: ['an toan', 'rieng tu', 'thong tin', 'bao mat', 'chinh sach'], answer: () => ({ text: 'Học Siêu Vui chỉ cần biệt danh và mật khẩu, không cần email hay số điện thoại. Hãy đừng chia sẻ tên thật, địa chỉ, trường lớp hay mật khẩu với ai nhé. Bạn xem thêm Chính sách ở cuối trang.' }) },
  { keys: ['cai dat', 'cai app', 'man hinh chinh', 'ung dung', 'pwa'], answer: () => ({ text: 'Bạn bấm nút "App" trên thanh trên để cài Học Siêu Vui ra màn hình điện thoại, mở nhanh như một ứng dụng.' }) },
  { keys: ['cam on', 'thank', 'tuyet', 'gioi qua', 'hay qua'], answer: () => ({ text: 'Không có gì! Chúc bạn học thật vui và gom thật nhiều sao ⭐' }) },
  { keys: ['tam biet', 'bye', 'hen gap'], answer: () => ({ text: 'Hẹn gặp lại bạn nhé! Nhớ quay lại làm một ải mỗi ngày 👋' }) },
  { keys: ['gop y', 'bao loi', 'sai de', 'phan hoi', 'de xuat'], answer: () => ({ text: 'Bạn chuyển sang thẻ "Góp ý" ở trên để gửi phản hồi cho quản trị viên nhé. Cảm ơn bạn đã giúp Học Siêu Vui tốt hơn!' }) }
];

export const QUICK_QUESTIONS = [
  'Làm sao để kiếm xu?', 'Thách đấu 1v1 là gì?', 'Phòng lớp học dùng thế nào?', 'Bản đồ ải là gì?',
  'Sảnh online có gì?', 'Mua đồ cho nhân vật?', 'Cho mình một mẹo học', 'Đố vui đi!'
];

export function answerQuestion(question: string, ctx: BrainContext): BrainAnswer {
  const q = ` ${norm(question)} `;
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const k of intent.keys) {
      const hit = k.startsWith(' ') || k.endsWith(' ') ? q.includes(k) : q.includes(k);
      if (hit) score += k.trim().length;
    }
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  if (best) return best.intent.answer(ctx);
  return {
    text: 'Mình chưa hiểu câu này lắm 🤔. Mình trả lời được về: cách học, xu và sao, bản đồ ải, đấu trường (Siêu Tốc, 1v1, phòng lớp học), Sảnh Online, Studio, cấp độ, mẹo học, đố vui… Bạn thử hỏi theo những chủ đề đó nhé!',
    actions: [{ label: 'Bắt đầu học', view: 'study' }, { label: 'Vào đấu trường', view: 'blitz' }]
  };
}
