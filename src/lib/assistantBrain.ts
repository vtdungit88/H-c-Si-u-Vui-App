/**
 * Rule-based answers for the in-app helper "Bé Siêu Vui".
 * It explains how Học Siêu Vui works; it is not a general-purpose AI and does not solve homework.
 */
export type NavView = 'study' | 'shop' | 'blitz' | 'map' | 'leaderboard';
export interface BrainContext { name: string; isGuest: boolean; coins: number; stars: number }
export interface BrainAnswer { text: string; actions?: { label: string; view: NavView }[] }

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();

const TIPS = [
  'Đọc kĩ đề hai lần trước khi chọn đáp án: nhiều câu "bẫy" nằm ở một chữ như "không" hay "sai".',
  'Gặp câu khó, hãy loại trừ những đáp án chắc chắn sai trước, rồi chọn trong số còn lại.',
  'Sau mỗi câu, đọc phần lời giải và mẹo. Hiểu vì sao đúng quan trọng hơn là nhớ đáp án.',
  'Làm bài đều mỗi ngày 1 ải nhỏ còn hiệu quả hơn dồn cả tuần mới làm một lần.',
  'Môn Toán: viết nháp từng bước, đừng nhẩm hết trong đầu. Môn Khoa học tự nhiên: hãy hình dung hiện tượng ngoài đời thật.',
  'Nếu sai một câu, đừng buồn: mỗi lần sai là một lần bạn nhớ bài sâu hơn!'
];

interface Intent { keys: string[]; answer: (c: BrainContext) => BrainAnswer }

const INTENTS: Intent[] = [
  { keys: ['xin chao', 'chao', 'hello', 'hi ', 'alo'], answer: (c) => ({ text: `Chào ${c.isGuest ? 'bạn nhỏ' : c.name}! Mình là Bé Siêu Vui 💡. Mình có thể chỉ bạn cách làm bài, kiếm xu, sao, mua đồ cho nhân vật… Bạn muốn hỏi gì nào?` }) },
  { keys: ['dang ky', 'tao tai khoan', 'biet danh', 'dang nhap'], answer: (c) => ({ text: c.isGuest ? 'Bấm nút tài khoản ở góc phải trên cùng, chọn "Đăng ký", nhập một biệt danh vui và mật khẩu từ 6 ký tự. Không cần email! Đừng dùng tên thật hay số điện thoại nhé.' : 'Bạn đã đăng nhập rồi đó! Kết quả của bạn được lưu trên máy chủ nên đổi máy vẫn đăng nhập lại được bằng biệt danh và mật khẩu.' }) },
  { keys: ['quen mat khau', 'mat khau', 'doi mat khau'], answer: () => ({ text: 'Nếu quên mật khẩu, hãy nhờ quản trị viên (thầy cô hoặc người quản lý Học Siêu Vui) đặt lại giúp bạn. Vì không dùng email nên mình chưa tự gửi lại mật khẩu được.' }) },
  { keys: ['kiem xu', 'lay xu', 'nhieu xu', 'xu la gi', ' xu'], answer: (c) => ({ text: `Xu 🪙 kiếm bằng cách làm bài: mỗi câu đúng được 1 xu, làm tốt còn được thêm thưởng. Hiện bạn có ${c.coins} xu. Xu dùng để mua đồ cho nhân vật ở Studio.`, actions: [{ label: 'Đi làm bài', view: 'study' }, { label: 'Tới Studio', view: 'shop' }] }) },
  { keys: ['sao vang', 'kiem sao', 'sao la gi', ' sao'], answer: (c) => ({ text: `Sao ⭐ tính theo kết quả tốt nhất ở mỗi ải: đúng từ 60% được 1 sao, từ 80% được 2 sao, đúng hết được 3 sao. Bạn đang có ${c.stars} sao. Một số món đồ cần đủ sao mới mở khóa.`, actions: [{ label: 'Mở bản đồ ải', view: 'map' }] }) },
  { keys: ['cua hang', 'mua do', 'trang phuc', 'avatar', 'nhan vat', 'studio', 'toc', 'quan ao'], answer: () => ({ text: 'Vào Studio của tôi để đổi tóc, màu da, gương mặt và mua đồ cho nhân vật. Đồ bạn mua được lưu trên tài khoản, đổi máy vẫn còn!', actions: [{ label: 'Tới Studio', view: 'shop' }] }) },
  { keys: ['ban do', 'khoa', 'mo khoa', 'ai ', 'vuot ai', 'dao'], answer: () => ({ text: 'Trên Bản Đồ Thám Hiểm mỗi chương là một hòn đảo. Đạt ít nhất 1 sao ở ải trước thì ải sau mới mở. Cuối đường có đảo Trùm Cuối!', actions: [{ label: 'Mở bản đồ ải', view: 'map' }] }) },
  { keys: ['dau truong', 'blitz', '60s', 'tinh nhanh'], answer: () => ({ text: 'Đấu trường 60s là trò tính nhanh trong 60 giây để thử phản xạ. Chơi thử xem bạn được bao nhiêu điểm nhé!', actions: [{ label: 'Vào đấu trường', view: 'blitz' }] }) },
  { keys: ['bang xep hang', 'xep hang', 'bang vang', 'top '], answer: () => ({ text: 'Bảng xếp hạng xếp theo thành tích của các bạn học sinh. Trên Bản Đồ Ải còn có Top 10 riêng cho từng môn và từng lớp.', actions: [{ label: 'Xem bảng vàng', view: 'leaderboard' }] }) },
  { keys: ['mon nao', 'mon hoc', 'lop nao', 'co mon', 'toan', 'khoa hoc tu nhien', 'khtn'], answer: () => ({ text: 'Hiện có Toán từ lớp 1 đến lớp 9 và Khoa học tự nhiên từ lớp 6 đến lớp 9. Các môn khác như Ngữ văn, Tiếng Anh… đang được chuẩn bị. Mỗi chương là một bài 15 câu.', actions: [{ label: 'Chọn môn học', view: 'study' }] }) },
  { keys: ['lam bai', 'bat dau', 'cach hoc', 'huong dan', 'choi the nao', 'cach choi'], answer: () => ({ text: 'Rất dễ! (1) Chọn môn và lớp ở trang chủ. (2) Bấm vào một chương. (3) Trả lời 15 câu, mỗi câu 60 giây. (4) Đọc lời giải để hiểu bài và nhận xu, sao!', actions: [{ label: 'Bắt đầu học', view: 'study' }] }) },
  { keys: ['giai bai', 'dap an', 'giai ho', 'lam ho'], answer: () => ({ text: 'Mình chưa giải được bài cụ thể cho bạn, vì mình là trợ lý hướng dẫn. Nhưng sau mỗi câu có lời giải và mẹo, hãy đọc kĩ nhé. Nếu thấy câu hỏi sai, hãy gửi góp ý cho quản trị viên!' }) },
  { keys: ['meo', 'hoc tot', 'bi quyet', 'khong hieu', 'kho qua'], answer: () => ({ text: `💡 Mẹo nhỏ: ${TIPS[Math.floor(Math.random() * TIPS.length)]}` }) },
  { keys: ['cam on', 'thank', 'tuyet', 'gioi qua'], answer: () => ({ text: 'Không có gì! Chúc bạn học thật vui và gom thật nhiều sao ⭐' }) },
  { keys: ['gop y', 'bao loi', 'loi ', 'sai de', 'phan hoi'], answer: () => ({ text: 'Bạn chuyển sang thẻ "Góp ý" ở trên để gửi phản hồi cho quản trị viên nhé. Cảm ơn bạn đã giúp Học Siêu Vui tốt hơn!' }) }
];

export const QUICK_QUESTIONS = ['Làm sao để kiếm xu?', 'Sao dùng để làm gì?', 'Mua đồ cho nhân vật?', 'Bản đồ ải là gì?', 'Cho mình một mẹo học'];

export function answerQuestion(question: string, ctx: BrainContext): BrainAnswer {
  const q = ` ${norm(question)} `;
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    const score = intent.keys.reduce((s, k) => (q.includes(k.includes(' ') || k.endsWith(' ') || k.startsWith(' ') ? k : ` ${k}`) || q.includes(k) ? s + k.trim().length : s), 0);
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }
  if (best) return best.intent.answer(ctx);
  return { text: 'Mình chưa hiểu câu này lắm 🤔. Bạn thử hỏi về: kiếm xu, sao, mua đồ, bản đồ ải, đấu trường 60s, hoặc xin một mẹo học nhé!' };
}
