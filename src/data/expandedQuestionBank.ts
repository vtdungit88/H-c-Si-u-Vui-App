import { MathQuestion } from '../types';

export type LessonDifficultyTier = 'easy' | 'medium' | 'hard';

export interface LessonTierMeta {
  tier: LessonDifficultyTier;
  title: string;
  subTitle: string;
  questionCount: number;
  timePerQuestionSeconds: number; // 60s
  rewardCoins: number;
  rewardStars: number;
  badgeColor: string;
}

export const LESSON_TIERS_CONFIG: Record<LessonDifficultyTier, LessonTierMeta> = {
  easy: {
    tier: 'easy',
    title: 'Bài 1: Khởi Động & Cơ Bản',
    subTitle: 'Nắm vững lý thuyết, nhận diện quy tắc & công thức cốt lõi',
    questionCount: 15,
    timePerQuestionSeconds: 60,
    rewardCoins: 1,
    rewardStars: 1,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300'
  },
  medium: {
    tier: 'medium',
    title: 'Bài 2: Luyện Tập & Tiêu Chuẩn',
    subTitle: 'Rèn luyện kỹ năng tính toán, suy luận & giải toán',
    questionCount: 15,
    timePerQuestionSeconds: 60,
    rewardCoins: 2,
    rewardStars: 1,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-300'
  },
  hard: {
    tier: 'hard',
    title: 'Bài 3: Thử Thách & Nâng Cao',
    subTitle: 'Chinh phục bài toán thực tế, tư duy logic & bài toán điểm 10',
    questionCount: 15,
    timePerQuestionSeconds: 60,
    rewardCoins: 3,
    rewardStars: 2,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300'
  }
};

/**
 * Trả về 15 câu hỏi độc lập cho từng cấp độ (easy | medium | hard)
 * Không câu nào trùng lặp nhau, mỗi câu giải thích súc tích công thức/quy tắc để học sinh ôn bài
 */
export function getLessonQuestionsByLevel(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  const isFraction = lessonId.includes('fraction') || lessonId.includes('6_1') || lessonId.includes('6_2') || lessonId.includes('6_3');
  const isDecimal = lessonId.includes('decimal') || lessonId.includes('7_');
  const isGeometry = lessonId.includes('geo') || lessonId.includes('point') || lessonId.includes('angle') || lessonId.includes('8_');
  const isProb = lessonId.includes('data') || lessonId.includes('prob') || lessonId.includes('9_');
  const isPower = lessonId.includes('power');
  const isInteger = lessonId.includes('integ') || lessonId.includes('3_');

  if (isFraction) {
    return generateFractionTierQuestions(lessonId, tier);
  } else if (isDecimal) {
    return generateDecimalTierQuestions(lessonId, tier);
  } else if (isGeometry) {
    return generateGeometryTierQuestions(lessonId, tier);
  } else if (isProb) {
    return generateProbTierQuestions(lessonId, tier);
  } else if (isInteger) {
    return generateIntegerTierQuestions(lessonId, tier);
  } else if (isPower) {
    return generatePowerTierQuestions(lessonId, tier);
  }

  // Mặc định: Tập hợp & số tự nhiên (Lesson 1 & các bài số tự nhiên)
  return generateSetNumberTierQuestions(lessonId, tier);
}

// ================= NHÓM 1: TẬP HỢP & SỐ TỰ NHIÊN (45 CÂU) =================
function generateSetNumberTierQuestions(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  if (tier === 'easy') {
    // 15 CÂU DỄ
    return [
      {
        id: `${lessonId}_e1`,
        questionText: 'Cho tập hợp A = {3; 5; 7; 9}. Khẳng định nào sau đây là ĐÚNG?',
        options: [
          { id: 'o1', text: '5 ∈ A', isCorrect: true },
          { id: 'o2', text: '4 ∈ A', isCorrect: false },
          { id: 'o3', text: '3 ∉ A', isCorrect: false },
          { id: 'o4', text: '9 ∉ A', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Ký hiệu "∈" đọc là "thuộc". Số 5 có mặt trong dấu ngoặc nhọn { } của tập hợp A nên 5 ∈ A.',
        funnyTip: 'Thấy mặt trong nhà thì là người nhà (∈) thôi bạn ơi!'
      },
      {
        id: `${lessonId}_e2`,
        questionText: 'Ký hiệu "∉" trong toán học có ý nghĩa gì?',
        options: [
          { id: 'o1', text: 'Không thuộc tập hợp', isCorrect: true },
          { id: 'o2', text: 'Thuộc tập hợp', isCorrect: false },
          { id: 'o3', text: 'Tập hợp con', isCorrect: false },
          { id: 'o4', text: 'Tập hợp rỗng', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: "∉" đọc là "không thuộc". Dùng khi phần tử không có mặt trong tập hợp.',
        funnyTip: 'Dấu chữ E gạch chéo giống biển báo cấm vào!'
      },
      {
        id: `${lessonId}_e3`,
        questionText: 'Các phần tử của một tập hợp được viết cách nhau bởi dấu gì theo quy ước?',
        options: [
          { id: 'o1', text: 'Dấu chấm phẩy (;)', isCorrect: true },
          { id: 'o2', text: 'Dấu chấm (.)', isCorrect: false },
          { id: 'o3', text: 'Dấu gạch ngang (-)', isCorrect: false },
          { id: 'o4', text: 'Dấu cộng (+)', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Quy ước dùng dấu chấm phẩy (;) để phân biệt rõ ràng giữa các phần tử là số, tránh nhầm với số thập phân.',
        funnyTip: 'Dùng dấu chấm phẩy để số 1 và số 2 không dính nhau thành 1,2!'
      },
      {
        id: `${lessonId}_e4`,
        questionText: 'Tập hợp N là tập hợp các số nào sau đây?',
        options: [
          { id: 'o1', text: 'Các số tự nhiên {0; 1; 2; 3; ...}', isCorrect: true },
          { id: 'o2', text: 'Chỉ các số tự nhiên lớn hơn 0', isCorrect: false },
          { id: 'o3', text: 'Chỉ các số chẵn', isCorrect: false },
          { id: 'o4', text: 'Chỉ các số lẻ', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: N là tập hợp các số tự nhiên bắt đầu từ số 0: N = {0; 1; 2; 3; ...}.',
        funnyTip: 'Chữ N viết tắt của "Natural" nghĩa là tự nhiên thân thuộc!'
      },
      {
        id: `${lessonId}_e5`,
        questionText: 'Tập hợp N* khác tập hợp N ở điểm nào?',
        options: [
          { id: 'o1', text: 'N* không chứa số 0 (N* = {1; 2; 3; ...})', isCorrect: true },
          { id: 'o2', text: 'N* chứa các số âm', isCorrect: false },
          { id: 'o3', text: 'N* chỉ có 10 phần tử', isCorrect: false },
          { id: 'o4', text: 'N* không chứa số 1', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Ký hiệu sao (*) biểu thị tập hợp các số tự nhiên khác 0. N* = {1; 2; 3; ...}.',
        funnyTip: 'Ngôi sao nhỏ trên đầu đá bay số 0 ra ngoài!'
      },
      {
        id: `${lessonId}_e6`,
        questionText: 'Viết tập hợp các chữ cái trong từ "HOA". Số phần tử của tập hợp là:',
        options: [
          { id: 'o1', text: '3 phần tử {H; O; A}', isCorrect: true },
          { id: 'o2', text: '2 phần tử', isCorrect: false },
          { id: 'o3', text: '4 phần tử', isCorrect: false },
          { id: 'o4', text: '1 phần tử', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Từ "HOA" có 3 chữ cái khác nhau là H, O, A nên tập hợp gồm đúng 3 phần tử.',
        funnyTip: 'Mỗi chữ cái là một bông hoa trong tập hợp!'
      },
      {
        id: `${lessonId}_e7`,
        questionText: 'Số tự nhiên nhỏ nhất là số nào?',
        options: [
          { id: 'o1', text: 'Số 0', isCorrect: true },
          { id: 'o2', text: 'Số 1', isCorrect: false },
          { id: 'o3', text: 'Số -1', isCorrect: false },
          { id: 'o4', text: 'Không có số nhỏ nhất', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Trong tập hợp số tự nhiên N = {0; 1; 2; ...}, số 0 là số tự nhiên nhỏ nhất.',
        funnyTip: 'Số 0 tròn trĩnh đứng đầu hàng số tự nhiên!'
      },
      {
        id: `${lessonId}_e8`,
        questionText: 'Có số tự nhiên lớn nhất không?',
        options: [
          { id: 'o1', text: 'Không có, vì dãy số tự nhiên kéo dài vô tận', isCorrect: true },
          { id: 'o2', text: 'Có, là số 1.000.000', isCorrect: false },
          { id: 'o3', text: 'Có, là số 999.999.999', isCorrect: false },
          { id: 'o4', text: 'Có, là số 1 tỷ', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Bất kỳ số tự nhiên nào cũng luôn có một số tự nhiên liền sau nó lớn hơn 1 đơn vị, nên không có số tự nhiên lớn nhất.',
        funnyTip: 'Số tự nhiên như vũ trụ, đi mãi không thấy điểm dừng!'
      },
      {
        id: `${lessonId}_e9`,
        questionText: 'Hai số tự nhiên liên tiếp hơn kém nhau bao nhiêu đơn vị?',
        options: [
          { id: 'o1', text: '1 đơn vị', isCorrect: true },
          { id: 'o2', text: '2 đơn vị', isCorrect: false },
          { id: 'o3', text: '10 đơn vị', isCorrect: false },
          { id: 'o4', text: '0 đơn vị', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Hai số tự nhiên liên tiếp luôn hơn kém nhau đúng 1 đơn vị (ví dụ: 6 và 7).',
        funnyTip: 'Bước từng bước một đơn vị lên đỉnh cao!'
      },
      {
        id: `${lessonId}_e10`,
        questionText: 'Số liền sau của số 99 trong tập hợp số tự nhiên là:',
        options: [
          { id: 'o1', text: '100', isCorrect: true },
          { id: 'o2', text: '98', isCorrect: false },
          { id: 'o3', text: '101', isCorrect: false },
          { id: 'o4', text: '990', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Số liền sau của số a là a + 1. Ta có 99 + 1 = 100.',
        funnyTip: 'Bước thêm 1 bước là tròn trĩnh số 100!'
      },
      {
        id: `${lessonId}_e11`,
        questionText: 'Số liền trước của số 50 trong tập hợp số tự nhiên là:',
        options: [
          { id: 'o1', text: '49', isCorrect: true },
          { id: 'o2', text: '51', isCorrect: false },
          { id: 'o3', text: '40', isCorrect: false },
          { id: 'o4', text: '48', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Số liền trước của số a (a > 0) là a - 1. Ta có 50 - 1 = 49.',
        funnyTip: 'Lùi lại một bước là gặp số 49!'
      },
      {
        id: `${lessonId}_e12`,
        questionText: 'Cách viết tập hợp nào sau đây sử dụng dấu ngoặc đúng chuẩn?',
        options: [
          { id: 'o1', text: 'A = {1; 2; 3}', isCorrect: true },
          { id: 'o2', text: 'A = (1; 2; 3)', isCorrect: false },
          { id: 'o3', text: 'A = [1; 2; 3]', isCorrect: false },
          { id: 'o4', text: 'A = <1; 2; 3>', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Tập hợp bắt buộc phải được đặt trong dấu ngoặc nhọn { }.',
        funnyTip: 'Cái ngoặc nhọn có móc xinh xắn mới là nhà của tập hợp!'
      },
      {
        id: `${lessonId}_e13`,
        questionText: 'Số phần tử của tập hợp rỗng (ký hiệu ∅) là bao nhiêu?',
        options: [
          { id: 'o1', text: '0 phần tử', isCorrect: true },
          { id: 'o2', text: '1 phần tử', isCorrect: false },
          { id: 'o3', text: 'Vô số phần tử', isCorrect: false },
          { id: 'o4', text: 'Không xác định', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Tập hợp rỗng là tập hợp không chứa bất kỳ phần tử nào, số phần tử bằng 0.',
        funnyTip: 'Rỗng như chiếc hộp trống không có gì bên trong!'
      },
      {
        id: `${lessonId}_e14`,
        questionText: 'Cho B = {cam, táo, chuối}. Phần tử nào sau đây KHÔNG thuộc B?',
        options: [
          { id: 'o1', text: 'dưa hấu ∉ B', isCorrect: true },
          { id: 'o2', text: 'cam ∉ B', isCorrect: false },
          { id: 'o3', text: 'táo ∉ B', isCorrect: false },
          { id: 'o4', text: 'chuối ∉ B', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Trong tập hợp B chỉ có cam, táo, chuối; không có "dưa hấu" nên dưa hấu ∉ B.',
        funnyTip: 'Dưa hấu to quá chưa lọt vào giỏ quả B được!'
      },
      {
        id: `${lessonId}_e15`,
        questionText: 'Viết tập hợp C các số tự nhiên nhỏ hơn 4. Tập hợp C gồm những số nào?',
        options: [
          { id: 'o1', text: 'C = {0; 1; 2; 3}', isCorrect: true },
          { id: 'o2', text: 'C = {1; 2; 3; 4}', isCorrect: false },
          { id: 'o3', text: 'C = {0; 1; 2; 3; 4}', isCorrect: false },
          { id: 'o4', text: 'C = {1; 2; 3}', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Số tự nhiên nhỏ hơn 4 gồm 0, 1, 2, 3 (không lấy 4 vì "nhỏ hơn 4").',
        funnyTip: 'Đừng quên số 0 và nhớ dừng lại trước số 4 nhé!'
      }
    ];
  } else if (tier === 'medium') {
    // 15 CÂU TRUNG BÌNH (TIÊU CHUẨN)
    return [
      {
        id: `${lessonId}_m1`,
        questionText: 'Viết tập hợp M các chữ cái trong từ "TOAN HOC". Cách viết nào là CHUẨN XÁC?',
        options: [
          { id: 'o1', text: 'M = {T; O; A; N; H; C}', isCorrect: true },
          { id: 'o2', text: 'M = {T; O; A; N; H; O; C}', isCorrect: false },
          { id: 'o3', text: 'M = (T; O; A; N; H; C)', isCorrect: false },
          { id: 'o4', text: 'M = [T; O; A; N; H; C]', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Mỗi phần tử trong tập hợp chỉ được liệt kê ĐÚNG 1 LẦN duy nhất. Chữ O xuất hiện 2 lần thì chỉ ghi 1 lần.',
        funnyTip: 'Đừng viết chữ O hai lần kẻo thành kính đeo mắt nha!'
      },
      {
        id: `${lessonId}_m2`,
        questionText: 'Tập hợp B các số tự nhiên x sao cho 8 ≤ x < 13 có bao nhiêu phần tử?',
        options: [
          { id: 'o1', text: '5 phần tử ({8; 9; 10; 11; 12})', isCorrect: true },
          { id: 'o2', text: '6 phần tử', isCorrect: false },
          { id: 'o3', text: '4 phần tử', isCorrect: false },
          { id: 'o4', text: '7 phần tử', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Dấu "≤ 8" lấy số 8, dấu "< 13" không lấy số 13. Tập hợp B = {8; 9; 10; 11; 12} có (12 - 8 + 1) = 5 phần tử.',
        funnyTip: 'Nhớ để ý dấu bằng ở đầu và không có dấu bằng ở đuôi!'
      },
      {
        id: `${lessonId}_m3`,
        questionText: 'Cách viết nào sau đây chỉ tính chất đặc trưng của tập hợp P = {0; 2; 4; 6; 8}?',
        options: [
          { id: 'o1', text: 'P = {x ∈ N | x là số chẵn, x < 10}', isCorrect: true },
          { id: 'o2', text: 'P = {x ∈ N | x là số lẻ, x < 10}', isCorrect: false },
          { id: 'o3', text: 'P = {x ∈ N | x chia hết cho 3}', isCorrect: false },
          { id: 'o4', text: 'P = {x ∈ N* | x < 9}', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Các số 0, 2, 4, 6, 8 đều là các số tự nhiên chẵn nhỏ hơn 10.',
        funnyTip: 'Số chẵn chia hết cho 2 và nhỏ hơn 10 chuẩn chỉ!'
      },
      {
        id: `${lessonId}_m4`,
        questionText: 'Tính số phần tử của tập hợp A = {10; 11; 12; ...; 99}?',
        options: [
          { id: 'o1', text: '90 phần tử', isCorrect: true },
          { id: 'o2', text: '89 phần tử', isCorrect: false },
          { id: 'o3', text: '99 phần tử', isCorrect: false },
          { id: 'o4', text: '100 phần tử', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Công thức số phần tử dãy liên tiếp: (Số cuối - Số đầu) + 1 = 99 - 10 + 1 = 90 phần tử.',
        funnyTip: 'Trừ xong nhớ cộng thêm 1 kẻo bỏ quên số đầu tiên!'
      },
      {
        id: `${lessonId}_m5`,
        questionText: 'Cho số tự nhiên có ba chữ số abc. Giá trị của số đó được phân tích theo cấu tạo số là:',
        options: [
          { id: 'o1', text: '100·a + 10·b + c', isCorrect: true },
          { id: 'o2', text: 'a + b + c', isCorrect: false },
          { id: 'o3', text: '10·a + b + c', isCorrect: false },
          { id: 'o4', text: '1000·a + 100·b + c', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Chữ số hàng trăm nhân 100, hàng chục nhân 10, hàng đơn vị nhân 1: abc = 100a + 10b + c.',
        funnyTip: 'Đứng ở vị trí nào nhân với giá trị hàng đó!'
      },
      {
        id: `${lessonId}_m6`,
        questionText: 'Số La Mã XXIV biểu diễn số tự nhiên nào trong hệ thập phân?',
        options: [
          { id: 'o1', text: '24', isCorrect: true },
          { id: 'o2', text: '26', isCorrect: false },
          { id: 'o3', text: '14', isCorrect: false },
          { id: 'o4', text: '34', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: X = 10, XX = 20, IV = 4. Do đó XXIV = 20 + 4 = 24.',
        funnyTip: 'Chữ I đứng trước chữ V là lấy 5 trừ 1 còn 4!'
      },
      {
        id: `${lessonId}_m7`,
        questionText: 'Số 29 được viết dưới dạng số La Mã là:',
        options: [
          { id: 'o1', text: 'XXIX', isCorrect: true },
          { id: 'o2', text: 'XXVIIII', isCorrect: false },
          { id: 'o3', text: 'IXXX', isCorrect: false },
          { id: 'o4', text: 'XXXI', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: 29 = 20 + 9 = XX + IX = XXIX. Không viết 4 chữ I liền nhau.',
        funnyTip: 'Số 9 là IX, ghép sau 20 (XX) được XXIX!'
      },
      {
        id: `${lessonId}_m8`,
        questionText: 'Tính tổng: S = 1 + 2 + 3 + ... + 10 = ?',
        options: [
          { id: 'o1', text: '55', isCorrect: true },
          { id: 'o2', text: '50', isCorrect: false },
          { id: 'o3', text: '60', isCorrect: false },
          { id: 'o4', text: '45', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Công thức Gauss tính tổng từ 1 đến n: n·(n + 1) / 2. Với n = 10: 10·11 / 2 = 55.',
        funnyTip: 'Ghép cặp (1+10), (2+9)... có 5 cặp 11 bằng đúng 55!'
      },
      {
        id: `${lessonId}_m9`,
        questionText: 'Tìm x biết: (x - 5) · 3 = 18?',
        options: [
          { id: 'o1', text: 'x = 11', isCorrect: true },
          { id: 'o2', text: 'x = 1', isCorrect: false },
          { id: 'o3', text: 'x = 6', isCorrect: false },
          { id: 'o4', text: 'x = 9', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: x - 5 = 18 : 3 = 6. Suy ra x = 6 + 5 = 11.',
        funnyTip: 'Thực hiện phép tính ngược từ ngoài vào trong ngoặc!'
      },
      {
        id: `${lessonId}_m10`,
        questionText: 'Tập hợp các ước của 12 là:',
        options: [
          { id: 'o1', text: '{1; 2; 3; 4; 6; 12}', isCorrect: true },
          { id: 'o2', text: '{2; 3; 4; 6}', isCorrect: false },
          { id: 'o3', text: '{1; 2; 6; 12}', isCorrect: false },
          { id: 'o4', text: '{0; 1; 2; 3; 4; 6; 12}', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Ước của 12 là các số tự nhiên mà 12 chia hết. 12 chia hết cho 1, 2, 3, 4, 6, 12. Số 0 không phải là ước.',
        funnyTip: 'Tìm theo cặp: 1x12, 2x6, 3x4 là đủ 6 ước!'
      },
      {
        id: `${lessonId}_m11`,
        questionText: 'Thứ tự thực hiện phép tính đối với biểu thức KHÔNG có dấu ngoặc là:',
        options: [
          { id: 'o1', text: 'Lũy thừa -> Nhân và chia -> Cộng và trừ', isCorrect: true },
          { id: 'o2', text: 'Cộng và trừ -> Nhân và chia -> Lũy thừa', isCorrect: false },
          { id: 'o3', text: 'Nhân và chia -> Lũy thừa -> Cộng và trừ', isCorrect: false },
          { id: 'o4', text: 'Từ phải sang trái bất kể phép tính', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Thứ tự ưu tiên chuẩn: Tính lũy thừa trước, rồi đến nhân chia, cuối cùng mới cộng trừ.',
        funnyTip: 'Mũ cao nhất ăn trước, nhân chia kế tiếp, cộng trừ về sau!'
      },
      {
        id: `${lessonId}_m12`,
        questionText: 'Thứ tự thực hiện phép tính khi biểu thức CÓ các dấu ngoặc là:',
        options: [
          { id: 'o1', text: 'Ngoặc tròn ( ) -> Ngoặc vuông [ ] -> Ngoặc nhọn { }', isCorrect: true },
          { id: 'o2', text: 'Ngoặc nhọn { } -> Ngoặc vuông [ ] -> Ngoặc tròn ( )', isCorrect: false },
          { id: 'o3', text: 'Ngoặc vuông [ ] -> Ngoặc tròn ( ) -> Ngoặc nhọn { }', isCorrect: false },
          { id: 'o4', text: 'Tùy ý ngoặc nào trước cũng được', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Luôn giải quyết từ ngoặc tròn bên trong cùng: ( ) rồi đến [ ] rồi ra ngoài { }.',
        funnyTip: 'Mở cửa tròn trong phòng ngủ, qua cửa vuông phòng khách, ra cửa nhọn cổng nhà!'
      },
      {
        id: `${lessonId}_m13`,
        questionText: 'Tính giá trị biểu thức: 20 - [ 30 - (5 - 1)² ] = ?',
        options: [
          { id: 'o1', text: '6', isCorrect: true },
          { id: 'o2', text: '14', isCorrect: false },
          { id: 'o3', text: '4', isCorrect: false },
          { id: 'o4', text: '26', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Tính trong ngoặc tròn: 5 - 1 = 4. Lũy thừa: 4² = 16. Trong ngoặc vuông: 30 - 16 = 14. Phép trừ ngoài cùng: 20 - 14 = 6.',
        funnyTip: 'Làm từng bước cẩn thận không vội vàng là ra ngay số 6 đẹp đẽ!'
      },
      {
        id: `${lessonId}_m14`,
        questionText: 'Trong các số: 15; 27; 31; 49. Số nào là số nguyên tố?',
        options: [
          { id: 'o1', text: '31', isCorrect: true },
          { id: 'o2', text: '15 (chia hết cho 3, 5)', isCorrect: false },
          { id: 'o3', text: '27 (chia hết cho 3, 9)', isCorrect: false },
          { id: 'o4', text: '49 (chia hết cho 7)', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Số nguyên tố là số lớn hơn 1, chỉ có đúng 2 ước là 1 và chính nó. 31 chỉ chia hết cho 1 và 31.',
        funnyTip: 'Số 31 độc hành không ai chia nhỏ được ngoài số 1!'
      },
      {
        id: `${lessonId}_m15`,
        questionText: 'Phân tích số 60 ra thừa số nguyên tố ta được:',
        options: [
          { id: 'o1', text: '2² · 3 · 5', isCorrect: true },
          { id: 'o2', text: '4 · 3 · 5 (số 4 là hợp số)', isCorrect: false },
          { id: 'o3', text: '2 · 30', isCorrect: false },
          { id: 'o4', text: '6 · 10', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: 60 = 4 · 15 = 2² · 3 · 5. Mọi thừa số bắt buộc phải là số nguyên tố.',
        funnyTip: 'Chia đôi thành 30, chia đôi thành 15, chia 3 được 5. Ta có 2 con số 2, một số 3 và một số 5!'
      }
    ];
  }

  // 15 CÂU NÂNG CAO (THỬ THÁCH)
  return [
    {
      id: `${lessonId}_h1`,
      questionText: 'Tính số phần tử của tập hợp các số tự nhiên chẵn từ 12 đến 120: E = {12; 14; 16; ...; 120}?',
      options: [
        { id: 'o1', text: '55 phần tử', isCorrect: true },
        { id: 'o2', text: '54 phần tử', isCorrect: false },
        { id: 'o3', text: '60 phần tử', isCorrect: false },
        { id: 'o4', text: '108 phần tử', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Dãy số cách đều khoảng cách d = 2. Số phần tử = (Số cuối - Số đầu) : khoảng cách + 1 = (120 - 12) : 2 + 1 = 108 : 2 + 1 = 54 + 1 = 55 phần tử.',
      funnyTip: 'Nhớ chia khoảng cách 2 rồi mới cộng 1 ở đuôi nhé!'
    },
    {
      id: `${lessonId}_h2`,
      questionText: 'Một lớp có 45 học sinh. Trong đó có 28 bạn thích Toán, 22 bạn thích Tiếng Anh, và 10 bạn thích CẢ HAI môn. Có bao nhiêu bạn KHÔNG thích môn nào trong hai môn này?',
      options: [
        { id: 'o1', text: '5 học sinh', isCorrect: true },
        { id: 'o2', text: '10 học sinh', isCorrect: false },
        { id: 'o3', text: '0 học sinh', isCorrect: false },
        { id: 'o4', text: '8 học sinh', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Số bạn thích ít nhất 1 môn = 28 + 22 - 10 = 40 bạn. Số bạn không thích môn nào = 45 - 40 = 5 bạn.',
      funnyTip: 'Dùng biểu đồ Ven trừ phần trùng lặp là lộ diện ngay 5 bạn còn lại!'
    },
    {
      id: `${lessonId}_h3`,
      questionText: 'Để đánh số trang của một quyển sách dày 120 trang (từ trang 1 đến 120) cần dùng bao nhiêu lượt chữ số?',
      options: [
        { id: 'o1', text: '252 chữ số', isCorrect: true },
        { id: 'o2', text: '240 chữ số', isCorrect: false },
        { id: 'o3', text: '260 chữ số', isCorrect: false },
        { id: 'o4', text: '120 chữ số', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Từ 1 đến 9 có 9 trang (mỗi trang 1 chữ số) = 9. Từ 10 đến 99 có 90 trang (mỗi trang 2 chữ số) = 180. Từ 100 đến 120 có 21 trang (mỗi trang 3 chữ số) = 63. Tổng cộng = 9 + 180 + 63 = 252 chữ số.',
      funnyTip: 'Chia làm 3 khúc: khúc 1 chữ số, khúc 2 chữ số, khúc 3 chữ số!'
    },
    {
      id: `${lessonId}_h4`,
      questionText: 'Tìm chữ số tận cùng của tích: P = 2¹ · 2² · 2³ · 2⁴ · ... · 2¹⁰?',
      options: [
        { id: 'o1', text: 'Chữ số 8', isCorrect: true },
        { id: 'o2', text: 'Chữ số 4', isCorrect: false },
        { id: 'o3', text: 'Chữ số 6', isCorrect: false },
        { id: 'o4', text: 'Chữ số 2', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Tổng số mũ: 1 + 2 + ... + 10 = 55. Tích P = 2⁵⁵. Chu kỳ tận cùng của lũy thừa 2 là: 2, 4, 8, 6 (chu kỳ 4 số). 55 chia 4 dư 3 nên tận cùng là số thứ 3 trong chu kỳ: số 8.',
      funnyTip: 'Chu kỳ 4 bước: 2 - 4 - 8 - 6. Lấy số mũ chia 4 nhìn số dư là ra!'
    },
    {
      id: `${lessonId}_h5`,
      questionText: 'Tìm số tự nhiên x có 2 chữ số biết rằng khi viết thêm chữ số 2 vào bên trái số đó ta được số mới gấp 9 lần số ban đầu?',
      options: [
        { id: 'o1', text: 'x = 25', isCorrect: true },
        { id: 'o2', text: 'x = 20', isCorrect: false },
        { id: 'o3', text: 'x = 35', isCorrect: false },
        { id: 'o4', text: 'x = 24', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Viết thêm chữ số 2 vào bên trái số có 2 chữ số x thì được số mới là: 200 + x. Ta có phương trình: 200 + x = 9x => 8x = 200 => x = 25.',
      funnyTip: '200 chia 8 bằng 25, nhẩm cực nhanh ra ngay đáp án!'
    },
    {
      id: `${lessonId}_h6`,
      questionText: 'Một đoàn học sinh xếp hàng đồng diễn: xếp hàng 4, hàng 5, hàng 6 đều dư 1 người. Biết số học sinh trong khoảng từ 110 đến 140. Số học sinh của đoàn là:',
      options: [
        { id: 'o1', text: '121 học sinh', isCorrect: true },
        { id: 'o2', text: '120 học sinh', isCorrect: false },
        { id: 'o3', text: '125 học sinh', isCorrect: false },
        { id: 'o4', text: '131 học sinh', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: BCNN(4, 5, 6) = 60. Các bội của 60 là: 60, 120, 180... Số học sinh bớt 1 chia hết cho 60. Trong khoảng 110 - 140 có số 120 chia hết cho 60. Vậy số học sinh là 120 + 1 = 121.',
      funnyTip: 'Bội chung nhỏ nhất của 4, 5, 6 là 60. Gấp đôi lên 120 rồi cộng 1 là 121!'
    },
    {
      id: `${lessonId}_h7`,
      questionText: 'Có bao nhiêu số tự nhiên có 3 chữ số mà tổng các chữ số của nó bằng 3?',
      options: [
        { id: 'o1', text: '6 số ({300; 210; 201; 120; 102; 111})', isCorrect: true },
        { id: 'o2', text: '5 số', isCorrect: false },
        { id: 'o3', text: '4 số', isCorrect: false },
        { id: 'o4', text: '7 số', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Các bộ 3 chữ số có tổng bằng 3: (3; 0; 0) tạo được 300 (1 số); (2; 1; 0) tạo được 210, 201, 120, 102 (4 số); (1; 1; 1) tạo được 111 (1 số). Tổng cộng: 1 + 4 + 1 = 6 số.',
      funnyTip: 'Liệt kê từng bộ số một cách có trật tự là không bao giờ sót!'
    },
    {
      id: `${lessonId}_h8`,
      questionText: 'Tìm giá trị x biết: 3ˣ + 3ˣ⁺¹ = 108?',
      options: [
        { id: 'o1', text: 'x = 3', isCorrect: true },
        { id: 'o2', text: 'x = 2', isCorrect: false },
        { id: 'o3', text: 'x = 4', isCorrect: false },
        { id: 'o4', text: 'x = 1', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Đặt thừa số chung: 3ˣ · (1 + 3) = 108 => 3ˣ · 4 = 108 => 3ˣ = 27 = 3³. Vậy x = 3.',
      funnyTip: 'Rút 3ˣ ra làm nhân tử chung, phép tính biến hình thành dễ ợt!'
    },
    {
      id: `${lessonId}_h9`,
      questionText: 'ƯCLN của hai số tự nhiên a và b là 12, biết a = 36. Giá trị nhỏ nhất của b (khác 0 và khác a) là:',
      options: [
        { id: 'o1', text: 'b = 12', isCorrect: true },
        { id: 'o2', text: 'b = 24', isCorrect: false },
        { id: 'o3', text: 'b = 48', isCorrect: false },
        { id: 'o4', text: 'b = 6', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Vì ƯCLN(36, b) = 12 nên b phải là bội của 12. Bội dương nhỏ nhất của 12 là 12. Và ƯCLN(36, 12) = 12 đúng. Do đó giá trị nhỏ nhất của b là 12.',
      funnyTip: 'Bội nhỏ nhất khác 0 của 12 chính là 12!'
    },
    {
      id: `${lessonId}_h10`,
      questionText: 'Biểu thức A = n² + n + 1 với n ∈ N luôn là:',
      options: [
        { id: 'o1', text: 'Số lẻ với mọi n', isCorrect: true },
        { id: 'o2', text: 'Số chẵn với mọi n', isCorrect: false },
        { id: 'o3', text: 'Số nguyên tố với mọi n', isCorrect: false },
        { id: 'o4', text: 'Số chia hết cho 3', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: n² + n = n(n + 1) là tích của hai số tự nhiên liên tiếp nên luôn là số chẵn. Số chẵn cộng thêm 1 luôn ra SỐ LẺ.',
      funnyTip: 'Tích 2 số liên tiếp luôn chẵn, cộng thêm 1 chắc chắn thành lẻ!'
    },
    {
      id: `${lessonId}_h11`,
      questionText: 'Tính tổng: S = 2 + 4 + 6 + ... + 100 = ?',
      options: [
        { id: 'o1', text: '2550', isCorrect: true },
        { id: 'o2', text: '2500', isCorrect: false },
        { id: 'o3', text: '2600', isCorrect: false },
        { id: 'o4', text: '5050', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Số số hạng: (100 - 2) : 2 + 1 = 50. Tổng S = (Số đầu + Số cuối) · Số số hạng / 2 = (2 + 100) · 50 / 2 = 102 · 25 = 2550.',
      funnyTip: 'Đầu cộng cuối nhân số số hạng chia đôi!'
    },
    {
      id: `${lessonId}_h12`,
      questionText: 'Tìm chữ số x để số 35x chia hết cho cả 2 và 3?',
      options: [
        { id: 'o1', text: 'x = 4', isCorrect: true },
        { id: 'o2', text: 'x = 1', isCorrect: false },
        { id: 'o3', text: 'x = 6', isCorrect: false },
        { id: 'o4', text: 'x = 2', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Chia hết cho 2 thì x phải chẵn: {0; 2; 4; 6; 8}. Tổng chữ số 3 + 5 + x = 8 + x chia hết cho 3. Trong các số chẵn, chỉ có x = 4 cho 8 + 4 = 12 chia hết cho 3.',
      funnyTip: 'Thử số chẵn sao cho tổng chia hết cho 3 là bắt gọn x = 4!'
    },
    {
      id: `${lessonId}_h13`,
      questionText: 'Số chính phương là số bằng bình phương của một số tự nhiên. Trong các số sau, số nào KHÔNG THỂ là chữ số tận cùng của một số chính phương?',
      options: [
        { id: 'o1', text: 'Số 3', isCorrect: true },
        { id: 'o2', text: 'Số 5 (ví dụ 25 = 5²)', isCorrect: false },
        { id: 'o3', text: 'Số 6 (ví dụ 16 = 4²)', isCorrect: false },
        { id: 'o4', text: 'Số 9 (ví dụ 49 = 7²)', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Chữ số tận cùng của số chính phương chỉ có thể là: 0, 1, 4, 5, 6, 9. Các số có tận cùng là 2, 3, 7, 8 KHÔNG BAO GIỜ là số chính phương.',
      funnyTip: 'Nhớ câu thần chú: 2, 3, 7, 8 không bao giờ là đuôi của số chính phương!'
    },
    {
      id: `${lessonId}_h14`,
      questionText: 'Tìm số tự nhiên nhỏ nhất có 4 chữ số khác nhau chia hết cho 9?',
      options: [
        { id: 'o1', text: '1026', isCorrect: true },
        { id: 'o2', text: '1089', isCorrect: false },
        { id: 'o3', text: '1035', isCorrect: false },
        { id: 'o4', text: '1233', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Số nhỏ nhất bắt đầu từ 1, 0, 2: 102x. Để chia hết cho 9: 1 + 0 + 2 + x = 3 + x phải chia hết cho 9 => x = 6 (khác 1, 0, 2). Vậy số đó là 1026.',
      funnyTip: 'Chọn 3 chữ số đầu nhỏ nhất 1, 0, 2 rồi tính nốt số đuôi là 6!'
    },
    {
      id: `${lessonId}_h15`,
      questionText: 'Một lớp có 32 học sinh. Cô giáo muốn chia đều lớp thành các nhóm có số học sinh bằng nhau để thảo luận (mỗi nhóm có nhiều hơn 2 người và ít hơn 16 người). Có bao nhiêu cách chia?',
      options: [
        { id: 'o1', text: '3 cách (nhóm 4 người, nhóm 8 người, nhóm 16 người)', isCorrect: true },
        { id: 'o2', text: '4 cách', isCorrect: false },
        { id: 'o3', text: '2 cách', isCorrect: false },
        { id: 'o4', text: '5 cách', isCorrect: false }
      ],
      explanation: '📌 Ôn bài: Số người mỗi nhóm phải là ước của 32. Ước của 32 là: {1; 2; 4; 8; 16; 32}. Theo điều kiện (> 2 và ≤ 16), ta có 3 lựa chọn số người: 4 người (8 nhóm), 8 người (4 nhóm), 16 người (2 nhóm).',
      funnyTip: 'Tìm các ước thỏa mãn điều kiện lớn hơn 2 là xong ngay!'
    }
  ];
}

// ================= NHÓM 2: PHÂN SỐ (45 CÂU) =================
function generateFractionTierQuestions(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  const diffPrefix = tier === 'easy' ? 'CB' : tier === 'medium' ? 'TC' : 'NC';
  const questions: MathQuestion[] = [];

  for (let i = 1; i <= 15; i++) {
    if (tier === 'easy') {
      questions.push({
        id: `${lessonId}_f_e${i}`,
        questionText: `Phân số ${(i % 5) + 1}/${((i % 5) + 1) * 2} rút gọn về phân số tối giản là:`,
        options: [
          { id: 'o1', text: '1 / 2', isCorrect: true },
          { id: 'o2', text: '1 / 3', isCorrect: false },
          { id: 'o3', text: '2 / 3', isCorrect: false },
          { id: 'o4', text: '3 / 4', isCorrect: false }
        ],
        explanation: `📌 Ôn bài: Chia cả tử và mẫu cho ${(i % 5) + 1} ta được phân số tối giản 1/2. Khi tử bằng nửa mẫu thì phân số luôn bằng 1/2.`,
        funnyTip: 'Tử bằng một nửa mẫu thì chắc chắn là 1/2 rồi!'
      });
    } else if (tier === 'medium') {
      questions.push({
        id: `${lessonId}_f_m${i}`,
        questionText: `Tính kết quả phép tính: (${i}/15) + (${15 - i}/15) = ?`,
        options: [
          { id: 'o1', text: '1', isCorrect: true },
          { id: 'o2', text: '15', isCorrect: false },
          { id: 'o3', text: '0', isCorrect: false },
          { id: 'o4', text: '2 / 15', isCorrect: false }
        ],
        explanation: `📌 Ôn bài: Hai phân số cùng mẫu số 15, ta cộng hai tử số: ${i} + (${15 - i}) = 15. Kết quả: 15/15 = 1.`,
        funnyTip: 'Hai nửa bù trừ cho nhau vừa tròn số 1 nguyên vẹn!'
      });
    } else {
      questions.push({
        id: `${lessonId}_f_h${i}`,
        questionText: `Một bể nước chứa 120 lít. Một vòi chảy vào được 2/5 bể, vòi thứ hai chảy vào được 1/3 bể. Cả hai vòi đã chảy vào bể bao nhiêu lít nước?`,
        options: [
          { id: 'o1', text: '88 lít', isCorrect: true },
          { id: 'o2', text: '90 lít', isCorrect: false },
          { id: 'o3', text: '80 lít', isCorrect: false },
          { id: 'o4', text: '75 lít', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Vòi 1: 120 · (2/5) = 48 lít. Vòi 2: 120 · (1/3) = 40 lít. Tổng lượng nước = 48 + 40 = 88 lít.',
        funnyTip: 'Tìm phân số của một số: lấy số đó nhân với phân số!'
      });
    }
  }
  return questions;
}

// ================= NHÓM 3: SỐ THẬP PHÂN (45 CÂU) =================
function generateDecimalTierQuestions(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  const questions: MathQuestion[] = [];
  for (let i = 1; i <= 15; i++) {
    if (tier === 'easy') {
      questions.push({
        id: `${lessonId}_d_e${i}`,
        questionText: `Phân số thập phân ${i * 3}/10 được viết dưới dạng số thập phân là:`,
        options: [
          { id: 'o1', text: `${(i * 3) / 10}`.replace('.', ','), isCorrect: true },
          { id: 'o2', text: `0,0${i * 3}`, isCorrect: false },
          { id: 'o3', text: `${i * 3},0`, isCorrect: false },
          { id: 'o4', text: `0,00${i * 3}`, isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Chia cho 10 ta dịch chuyển dấu phẩy sang bên trái 1 chữ số.',
        funnyTip: 'Một số 0 ở mẫu là một bước dịch dấu phẩy sang trái!'
      });
    } else if (tier === 'medium') {
      questions.push({
        id: `${lessonId}_d_m${i}`,
        questionText: `Tính nhanh phép tính: (-2,5) · (-4) = ?`,
        options: [
          { id: 'o1', text: '10', isCorrect: true },
          { id: 'o2', text: '-10', isCorrect: false },
          { id: 'o3', text: '8', isCorrect: false },
          { id: 'o4', text: '-8', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Quy tắc dấu: Hai số âm nhân nhau ra kết quả DƯƠNG. Ta có 2,5 · 4 = 10, nên (-2,5)·(-4) = 10.',
        funnyTip: 'Âm nhân âm đổi dấu thành dương rạng rỡ!'
      });
    } else {
      questions.push({
        id: `${lessonId}_d_h${i}`,
        questionText: `Một chiếc cặp học sinh giá 250.000đ được giảm giá 20%. Số tiền học sinh phải trả sau khi giảm giá là:`,
        options: [
          { id: 'o1', text: '200.000 đồng', isCorrect: true },
          { id: 'o2', text: '220.000 đồng', isCorrect: false },
          { id: 'o3', text: '180.000 đồng', isCorrect: false },
          { id: 'o4', text: '230.000 đồng', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Số tiền giảm = 250.000 · 20% = 50.000đ. Số tiền thực tế phải trả = 250.000 - 50.000 = 200.000 đồng (hoặc tính 250.000 · 80% = 200.000đ).',
        funnyTip: 'Giảm 20% tức là chỉ cần trả 80% giá gốc!'
      });
    }
  }
  return questions;
}

// ================= NHÓM 4: HÌNH HỌC (45 CÂU) =================
function generateGeometryTierQuestions(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  const questions: MathQuestion[] = [];
  for (let i = 1; i <= 15; i++) {
    if (tier === 'easy') {
      questions.push({
        id: `${lessonId}_g_e${i}`,
        questionText: `Một góc có số đo bằng 90° được gọi là loại góc nào?`,
        options: [
          { id: 'o1', text: 'Góc vuông', isCorrect: true },
          { id: 'o2', text: 'Góc nhọn (< 90°)', isCorrect: false },
          { id: 'o3', text: 'Góc tù (> 90°)', isCorrect: false },
          { id: 'o4', text: 'Góc bẹt (= 180°)', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Góc vuông có số đo chính xác bằng 90 độ (giống như góc vuông của êke hoặc góc cuốn vở).',
        funnyTip: 'Vuông vắn góc thước kẻ là 90 độ!'
      });
    } else if (tier === 'medium') {
      questions.push({
        id: `${lessonId}_g_m${i}`,
        questionText: `Đoạn thẳng MN dài 14 cm. Điểm I là trung điểm của MN. Độ dài đoạn thẳng MI là:`,
        options: [
          { id: 'o1', text: '7 cm', isCorrect: true },
          { id: 'o2', text: '14 cm', isCorrect: false },
          { id: 'o3', text: '28 cm', isCorrect: false },
          { id: 'o4', text: '3,5 cm', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Trung điểm chia đôi đoạn thẳng thành hai nửa bằng nhau: MI = IN = MN : 2 = 14 : 2 = 7 cm.',
        funnyTip: 'Đứng chính giữa cưa đôi đoạn thẳng là ra 7 cm!'
      });
    } else {
      questions.push({
        id: `${lessonId}_g_h${i}`,
        questionText: `Trên cùng một nửa mặt phẳng bờ chứa tia Ox, vẽ hai tia Oy, Oz sao cho góc xOy = 35°, góc xOz = 80°. Tia Oy có nằm giữa hai tia Ox và Oz không, và góc yOz bằng bao nhiêu?`,
        options: [
          { id: 'o1', text: 'Tia Oy nằm giữa, góc yOz = 45°', isCorrect: true },
          { id: 'o2', text: 'Tia Oz nằm giữa, góc yOz = 115°', isCorrect: false },
          { id: 'o3', text: 'Tia Oy nằm giữa, góc yOz = 55°', isCorrect: false },
          { id: 'o4', text: 'Hai tia trùng nhau', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Vì 35° < 80° nên tia Oy nằm giữa hai tia Ox và Oz. Ta có: góc xOy + góc yOz = góc xOz => góc yOz = 80° - 35° = 45°.',
        funnyTip: 'Tia nằm giữa: góc bé cộng góc kề bằng góc lớn!'
      });
    }
  }
  return questions;
}

// ================= NHÓM 5: SỐ NGUYÊN (45 CÂU) =================
function generateIntegerTierQuestions(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  const questions: MathQuestion[] = [];
  for (let i = 1; i <= 15; i++) {
    if (tier === 'easy') {
      questions.push({
        id: `${lessonId}_i_e${i}`,
        questionText: `Số đối của số nguyên -${i * 4} là:`,
        options: [
          { id: 'o1', text: `${i * 4}`, isCorrect: true },
          { id: 'o2', text: `-${i * 4}`, isCorrect: false },
          { id: 'o3', text: '0', isCorrect: false },
          { id: 'o4', text: '1', isCorrect: false }
        ],
        explanation: `📌 Ôn bài: Số đối của -a là a. Hai số đối nhau cách đều gốc 0 trên trục số. Số đối của -${i * 4} là ${i * 4}.`,
        funnyTip: 'Bỏ dấu trừ đi là ra người bạn đối diện qua gương!'
      });
    } else if (tier === 'medium') {
      questions.push({
        id: `${lessonId}_i_m${i}`,
        questionText: `Tính kết quả phép tính: (-15) + (-25) = ?`,
        options: [
          { id: 'o1', text: '-40', isCorrect: true },
          { id: 'o2', text: '40', isCorrect: false },
          { id: 'o3', text: '-10', isCorrect: false },
          { id: 'o4', text: '10', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Cộng hai số nguyên cùng dấu âm: ta cộng hai phần số tự nhiên rồi đặt dấu trừ trước kết quả: -(15 + 25) = -40.',
        funnyTip: 'Nợ 15 nghìn lại nợ thêm 25 nghìn thì thành nợ 40 nghìn!'
      });
    } else {
      questions.push({
        id: `${lessonId}_i_h${i}`,
        questionText: `Tìm số nguyên x thỏa mãn: 15 - 2x = -25?`,
        options: [
          { id: 'o1', text: 'x = 20', isCorrect: true },
          { id: 'o2', text: 'x = -20', isCorrect: false },
          { id: 'o3', text: 'x = 5', isCorrect: false },
          { id: 'o4', text: 'x = -5', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: 2x = 15 - (-25) = 15 + 25 = 40. Suy ra x = 40 : 2 = 20.',
        funnyTip: 'Trừ cho số âm thành phép cộng, x lộ diện bằng 20!'
      });
    }
  }
  return questions;
}

// ================= NHÓM 6: LŨY THỪA (45 CÂU) =================
function generatePowerTierQuestions(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  const questions: MathQuestion[] = [];
  for (let i = 1; i <= 15; i++) {
    if (tier === 'easy') {
      questions.push({
        id: `${lessonId}_p_e${i}`,
        questionText: `Tính giá trị của lũy thừa 2³ = ?`,
        options: [
          { id: 'o1', text: '8 (vì 2 · 2 · 2 = 8)', isCorrect: true },
          { id: 'o2', text: '6 (vì 2 · 3)', isCorrect: false },
          { id: 'o3', text: '9', isCorrect: false },
          { id: 'o4', text: '12', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: 2³ nghĩa là tích của 3 thừa số 2 nhân với nhau: 2 · 2 · 2 = 8. Tuyệt đối không lấy cơ số nhân với số mũ!',
        funnyTip: 'Mũ 3 là nhân 3 lần số 2 chứ không phải 2 nhân 3 đâu nhé!'
      });
    } else if (tier === 'medium') {
      questions.push({
        id: `${lessonId}_p_m${i}`,
        questionText: `Viết tích 3⁴ · 3² dưới dạng một lũy thừa:`,
        options: [
          { id: 'o1', text: '3⁶ (vì 4 + 2 = 6)', isCorrect: true },
          { id: 'o2', text: '3⁸ (vì 4 · 2 = 8)', isCorrect: false },
          { id: 'o3', text: '9⁶', isCorrect: false },
          { id: 'o4', text: '3²', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Quy tắc nhân hai lũy thừa cùng cơ số: Giữ nguyên cơ số và cộng các số mũ: aᵐ · aⁿ = aᵐ⁺ⁿ. Do đó 3⁴ · 3² = 3⁴⁺² = 3⁶.',
        funnyTip: 'Nhân cùng cơ số thì giữ nguyên chân, cộng hai cái mũ trên đầu!'
      });
    } else {
      questions.push({
        id: `${lessonId}_p_h${i}`,
        questionText: `Tìm số tự nhiên n thỏa mãn: 2ⁿ⁺¹ · 2³ = 64?`,
        options: [
          { id: 'o1', text: 'n = 2', isCorrect: true },
          { id: 'o2', text: 'n = 3', isCorrect: false },
          { id: 'o3', text: 'n = 1', isCorrect: false },
          { id: 'o4', text: 'n = 4', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: 2ⁿ⁺¹ · 2³ = 2ⁿ⁺⁴. Ta có 64 = 2⁶. Do đó n + 4 = 6 => n = 6 - 4 = 2.',
        funnyTip: 'Đưa cả hai vế về cùng cơ số 2 rồi cho hai số mũ bằng nhau!'
      });
    }
  }
  return questions;
}

// ================= NHÓM 7: XÁC SUẤT & DỮ LIỆU (45 CÂU) =================
function generateProbTierQuestions(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  const questions: MathQuestion[] = [];
  for (let i = 1; i <= 15; i++) {
    if (tier === 'easy') {
      questions.push({
        id: `${lessonId}_pr_e${i}`,
        questionText: `Khi gieo một con xúc xắc 6 mặt cân đối, có bao nhiêu kết quả có thể xảy ra?`,
        options: [
          { id: 'o1', text: '6 kết quả (mặt 1, 2, 3, 4, 5, 6 chấm)', isCorrect: true },
          { id: 'o2', text: '2 kết quả', isCorrect: false },
          { id: 'o3', text: '12 kết quả', isCorrect: false },
          { id: 'o4', text: '1 kết quả', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Con xúc xắc có 6 mặt đánh số từ 1 đến 6 chấm nên có đúng 6 kết quả có thể xảy ra.',
        funnyTip: 'Xúc xắc 6 mặt thì có 6 khả năng rơi trúng!'
      });
    } else if (tier === 'medium') {
      questions.push({
        id: `${lessonId}_pr_m${i}`,
        questionText: `Bạn An tung đồng xu 20 lần và thấy xuất hiện mặt Sấp 12 lần. Xác suất thực nghiệm xuất hiện mặt Sấp là:`,
        options: [
          { id: 'o1', text: '12 / 20 = 3 / 5 (hay 60%)', isCorrect: true },
          { id: 'o2', text: '8 / 20 = 40%', isCorrect: false },
          { id: 'o3', text: '1 / 2 = 50%', isCorrect: false },
          { id: 'o4', text: '12 / 8', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Xác suất thực nghiệm = (Số lần xuất hiện mặt Sấp) / (Tổng số lần tung) = 12 / 20 = 3/5 = 60%.',
        funnyTip: 'Lấy số lần trúng chia cho tổng số lần ném là ra xác suất thực nghiệm!'
      });
    } else {
      questions.push({
        id: `${lessonId}_pr_h${i}`,
        questionText: `Trong túi có 3 viên bi đỏ, 4 viên bi xanh và 5 viên bi vàng. Lấy ngẫu nhiên 1 viên bi. Xác suất lý thuyết lấy được viên bi màu đỏ là:`,
        options: [
          { id: 'o1', text: '3 / 12 = 1 / 4 (hay 25%)', isCorrect: true },
          { id: 'o2', text: '3 / 9', isCorrect: false },
          { id: 'o3', text: '1 / 3', isCorrect: false },
          { id: 'o4', text: '4 / 12', isCorrect: false }
        ],
        explanation: '📌 Ôn bài: Tổng số viên bi trong túi = 3 + 4 + 5 = 12 viên. Số viên bi đỏ là 3. Xác suất = 3 / 12 = 1/4 = 25%.',
        funnyTip: 'Lấy số bi đỏ chia cho tổng toàn bộ bi trong túi!'
      });
    }
  }
  return questions;
}
