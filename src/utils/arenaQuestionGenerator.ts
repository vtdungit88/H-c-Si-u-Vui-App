import type { GradeLevel } from '../types';

/**
 * Lưu ý: đề tính nhanh được sinh ngay trên trình duyệt nên đáp án không thể bí mật.
 * Vì vậy thưởng/kỷ lục được giới hạn phía máy chủ; đây KHÔNG phải ngân hàng câu hỏi của hệ thống.
 */
export interface ArenaQuestion {
  id: string;
  questionText: string;
  contextHint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  visualType?: string;
  visualData?: unknown;
  options: { id: string; text: string; right: boolean }[];
  explanation: string;
  funnyTip: string;
  grade: GradeLevel;
  topicTag: string;
  source: 'generated';
  recommendedSeconds: number;
}

/**
 * PRNG có seed (Mulberry32) để 1v1 và Phòng Lớp Học sinh ra bộ đề giống hệt nhau
 * trên mọi thiết bị khi dùng chung 1 matchSeed.
 */
class SeededRandom {
  private state: number;

  constructor(seed?: number) {
    this.state = seed ?? Math.floor(Math.random() * 2147483647);
    if (this.state <= 0) this.state = 123456789;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  shuffle<T>(arr: readonly T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function formatVNDecimal(num: number): string {
  const rounded = Math.round(num * 10000) / 10000;
  return String(rounded).replace('.', ',');
}

function formatSigned(n: number): string {
  return n < 0 ? `(${n})` : `${n}`;
}

/**
 * Đảm bảo luôn có đúng 4 đáp án khác nhau hoàn toàn, giữ nguyên thứ tự xáo trộn theo rng
 */
function buildUniqueOptions(
  rng: SeededRandom,
  correctText: string,
  pedagogicalDistractors: string[],
  fallbackFn: (attempt: number) => string
) {
  const seen = new Set<string>([correctText]);
  const distractors: string[] = [];

  for (const cand of pedagogicalDistractors) {
    if (!seen.has(cand)) {
      seen.add(cand);
      distractors.push(cand);
    }
    if (distractors.length === 3) break;
  }

  let attempt = 1;
  while (distractors.length < 3 && attempt < 50) {
    const fb = fallbackFn(attempt);
    if (!seen.has(fb)) {
      seen.add(fb);
      distractors.push(fb);
    }
    attempt++;
  }

  const rawOptions = [
    { id: 'opt_correct', text: correctText, right: true },
    ...distractors.slice(0, 3).map((text, idx) => ({
      id: `opt_wrong_${idx}`,
      text,
      right: false
    }))
  ];

  return rng.shuffle(rawOptions).map((opt, idx) => ({
    ...opt,
    id: `opt_${idx}`
  }));
}

function makeNumericFallback(
  rng: SeededRandom,
  correctNum: number,
  allowNegative: boolean
): (attempt: number) => string {
  return (attempt) => {
    const delta = (rng.pick([-1, 1]) * (attempt + rng.int(1, 3)));
    let candidate = correctNum + delta;
    if (!allowNegative && candidate < 0) {
      candidate = correctNum + attempt + 1;
    }
    return String(candidate);
  };
}

// ============================================================================
// LỚP 1: Số đến 100, Cộng/Trừ KHÔNG NHỚ, Liền trước/sau, So sánh
// ============================================================================
function genGrade1(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 4);
  const id = `ARENA_G1_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Cộng không nhớ trong phạm vi 100 (ưu tiên phạm vi 20 hoặc cộng tròn chục / không nhớ)
    const isRoundTen = rng.next() < 0.35;
    let a: number, b: number;
    if (isRoundTen) {
      a = rng.int(1, 8) * 10;
      b = rng.int(1, 9 - a / 10) * 10;
    } else {
      const aTen = rng.int(0, 8);
      const aUnit = rng.int(1, 8);
      const bTen = rng.int(0, 9 - aTen);
      const bUnit = rng.int(1, 9 - aUnit); // Đảm bảo KHÔNG NHỚ: aUnit + bUnit <= 9
      a = aTen * 10 + aUnit;
      b = bTen * 10 + bUnit;
    }
    const ans = a + b;
    return {
      id,
      grade: '1',
      topicTag: 'Cộng không nhớ',
      source: 'generated',
      recommendedSeconds: 20,
      questionText: `Tính nhẩm: ${a} + ${b} = ?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(ans + 1), String(Math.max(0, ans - 1)), String(ans + 10), String(Math.abs(a - b))],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `Cộng hàng đơn vị rồi cộng hàng chục: ${a} + ${b} = ${ans}.`,
      funnyTip: '💡 Cộng hàng đơn vị trước, giữ nguyên chục nếu chưa qua 10!'
    };
  }

  if (pattern === 2) {
    // Trừ không nhớ trong phạm vi 100 (hàng đơn vị số bị trừ >= số trừ)
    const bTen = rng.int(0, 5);
    const bUnit = rng.int(1, 7);
    const aTen = rng.int(bTen + (bTen === 0 ? 1 : 0), 9);
    const aUnit = rng.int(bUnit, 9); // Đảm bảo KHÔNG NHỚ
    const a = aTen * 10 + aUnit;
    const b = bTen * 10 + bUnit;
    const ans = a - b;
    return {
      id,
      grade: '1',
      topicTag: 'Trừ không nhớ',
      source: 'generated',
      recommendedSeconds: 20,
      questionText: `Tính nhẩm: ${a} - ${b} = ?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(ans + 1), String(Math.max(0, ans - 1)), String(ans + 10), String(a + b)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `Trừ từ phải sang trái: ${a} - ${b} = ${ans}.`,
      funnyTip: '💡 Nhìn kỹ dấu trừ (-) để không bấm nhầm thành phép cộng nhé!'
    };
  }

  if (pattern === 3) {
    // Số liền trước / liền sau
    const isNext = rng.next() < 0.5;
    const n = rng.int(2, 98);
    const ans = isNext ? n + 1 : n - 1;
    return {
      id,
      grade: '1',
      topicTag: 'Dãy số đến 100',
      source: 'generated',
      recommendedSeconds: 18,
      questionText: isNext ? `Số liền sau của số ${n} là số nào?` : `Số liền trước của số ${n} là số nào?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(isNext ? n - 1 : n + 1), String(n + 2), String(Math.max(0, n - 2))],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: isNext ? `Số liền sau của ${n} là ${n} + 1 = ${ans}.` : `Số liền trước của ${n} là ${n} - 1 = ${ans}.`,
      funnyTip: '💡 Liền sau thì thêm 1 (+1), liền trước thì bớt 1 (-1)!'
    };
  }

  // So sánh 2 biểu thức hoặc 2 số trong phạm vi 100
  const a = rng.int(10, 95);
  const offset = rng.pick([-10, -2, 0, 2, 10]);
  const b = Math.min(99, Math.max(1, a + offset));
  const correctSign = a > b ? '>' : a < b ? '<' : '=';
  return {
    id,
    grade: '1',
    topicTag: 'So sánh số',
    source: 'generated',
    recommendedSeconds: 18,
    questionText: `Điền dấu thích hợp: ${a} ... ${b}`,
    options: buildUniqueOptions(rng, correctSign, ['>', '<', '=', '+'], () => '?'),
    explanation: `So sánh hàng chục trước rồi đến hàng đơn vị: ${a} ${correctSign} ${b}.`,
    funnyTip: '💡 Miệng cá sấu há về phía số lớn hơn!'
  };
}

// ============================================================================
// LỚP 2: Cộng/Trừ CÓ NHỚ trong phạm vi 100, Bảng nhân/chia 2 và 5, dm/cm
// ============================================================================
function genGrade2(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 4);
  const id = `ARENA_G2_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Cộng CÓ NHỚ trong phạm vi 100
    const aUnit = rng.int(4, 9);
    const bUnit = rng.int(10 - aUnit, 9); // aUnit + bUnit >= 10
    const aTen = rng.int(1, 6);
    const bTen = rng.int(1, 8 - aTen); // Đảm bảo tổng <= 99
    const a = aTen * 10 + aUnit;
    const b = bTen * 10 + bUnit;
    const ans = a + b;
    return {
      id,
      grade: '2',
      topicTag: 'Cộng có nhớ',
      source: 'generated',
      recommendedSeconds: 18,
      questionText: `Tính nhanh: ${a} + ${b} = ?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(ans - 10), String(ans + 10), String(ans - 1), String(ans + 1)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `${aUnit} + ${bUnit} = ${aUnit + bUnit} (viết ${(aUnit + bUnit) % 10} nhớ 1). Vậy ${a} + ${b} = ${ans}.`,
      funnyTip: '💡 Đừng quên cộng thêm 1 vào hàng chục khi hàng đơn vị vượt quá 10!'
    };
  }

  if (pattern === 2) {
    // Trừ CÓ NHỚ trong phạm vi 100
    const aUnit = rng.int(0, 7);
    const bUnit = rng.int(aUnit + 1, 9); // Phải mượn 1 chục
    const bTen = rng.int(1, 6);
    const aTen = rng.int(bTen + 1, 9);
    const a = aTen * 10 + aUnit;
    const b = bTen * 10 + bUnit;
    const ans = a - b;
    return {
      id,
      grade: '2',
      topicTag: 'Trừ có nhớ',
      source: 'generated',
      recommendedSeconds: 18,
      questionText: `Tính nhanh: ${a} - ${b} = ?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(ans + 10), String(Math.max(0, ans - 10)), String(ans + 2)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `Mượn 1 chục ở hàng chục nên nhớ trừ bớt 1 chục khi hạ kết quả: ${a} - ${b} = ${ans}.`,
      funnyTip: '💡 Có vay có trả: mượn 1 chục ở hàng đơn vị thì hàng chục phải bớt đi 1!'
    };
  }

  if (pattern === 3) {
    // Bảng nhân / chia 2 và 5 (chuẩn GDPT 2018 Lớp 2)
    const factor = rng.pick([2, 5]);
    const k = rng.int(2, 10);
    const product = factor * k;
    const isMul = rng.next() < 0.5;
    if (isMul) {
      return {
        id,
        grade: '2',
        topicTag: `Bảng nhân ${factor}`,
        source: 'generated',
        recommendedSeconds: 15,
        questionText: `${factor} × ${k} = ?`,
        options: buildUniqueOptions(
          rng,
          String(product),
          [String(product + factor), String(Math.max(0, product - factor)), String(factor + k)],
          makeNumericFallback(rng, product, false)
        ),
        explanation: `Theo bảng nhân ${factor}: ${factor} × ${k} = ${product}.`,
        funnyTip: `💡 Đọc nhẩm nhanh bảng nhân ${factor}!`
      };
    }
    return {
      id,
      grade: '2',
      topicTag: `Bảng chia ${factor}`,
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `${product} : ${factor} = ?`,
      options: buildUniqueOptions(
        rng,
        String(k),
        [String(k + 1), String(Math.max(1, k - 1)), String(k + 2)],
        makeNumericFallback(rng, k, false)
      ),
      explanation: `Vì ${factor} × ${k} = ${product} nên ${product} : ${factor} = ${k}.`,
      funnyTip: '💡 Phép chia là phép tính ngược của phép nhân!'
    };
  }

  // Đổi đơn vị dm <-> cm hoặc m <-> dm
  const val = rng.int(2, 9);
  const isDmToCm = rng.next() < 0.5;
  const ans = isDmToCm ? val * 10 : val * 100;
  return {
    id,
    grade: '2',
    topicTag: 'Đo độ dài',
    source: 'generated',
    recommendedSeconds: 18,
    questionText: isDmToCm ? `${val} dm = ... cm?` : `${val} m = ... cm?`,
    options: buildUniqueOptions(
      rng,
      String(ans),
      [String(val * 10), String(val * 100), String(val * 1000), String(val)],
      makeNumericFallback(rng, ans, false)
    ),
    explanation: isDmToCm ? `1 dm = 10 cm nên ${val} dm = ${ans} cm.` : `1 m = 100 cm nên ${val} m = ${ans} cm.`,
    funnyTip: '💡 1 m = 10 dm = 100 cm!'
  };
}

// ============================================================================
// LỚP 3: Bảng nhân chia 3-9, Tìm x, Chu vi & Diện tích HCN / Hình vuông
// ============================================================================
function genGrade3(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 3);
  const id = `ARENA_G3_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Bảng nhân chia 3, 4, 6, 7, 8, 9
    const factor = rng.pick([3, 4, 6, 7, 8, 9]);
    const k = rng.int(3, 9);
    const prod = factor * k;
    const isDiv = rng.next() < 0.45;
    if (!isDiv) {
      return {
        id,
        grade: '3',
        topicTag: `Bảng nhân ${factor}`,
        source: 'generated',
        recommendedSeconds: 15,
        questionText: `${factor} × ${k} = ?`,
        options: buildUniqueOptions(
          rng,
          String(prod),
          [String(prod + factor), String(prod - factor), String(factor * (k + 1) - 1)],
          makeNumericFallback(rng, prod, false)
        ),
        explanation: `Theo bảng cửu chương ${factor}: ${factor} × ${k} = ${prod}.`,
        funnyTip: `💡 Mẹo: ${factor} × ${k} = ${factor} × ${k - 1} + ${factor}.`
      };
    }
    return {
      id,
      grade: '3',
      topicTag: `Bảng chia ${factor}`,
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `${prod} : ${factor} = ?`,
      options: buildUniqueOptions(
        rng,
        String(k),
        [String(k + 1), String(k - 1), String(factor)],
        makeNumericFallback(rng, k, false)
      ),
      explanation: `Nhẩm lại bảng nhân ${factor}: ${factor} × ${k} = ${prod} nên kết quả là ${k}.`,
      funnyTip: '💡 Đọc ngược bảng nhân để tìm thương siêu tốc!'
    };
  }

  if (pattern === 2) {
    // Tìm thành phần chưa biết x (x * a = b hoặc x : a = b)
    const a = rng.int(3, 9);
    const x = rng.int(4, 12);
    const prod = a * x;
    const isMul = rng.next() < 0.6;
    return {
      id,
      grade: '3',
      topicTag: 'Tìm thành phần chưa biết',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: isMul ? `Tìm x biết: x × ${a} = ${prod}` : `Tìm x biết: x : ${a} = ${x}`,
      options: buildUniqueOptions(
        rng,
        isMul ? String(x) : String(prod),
        isMul
          ? [String(x + 1), String(x - 1), String(prod - a)]
          : [String(Math.floor(x / a) || 2), String(x + a), String(prod + a)],
        makeNumericFallback(rng, isMul ? x : prod, false)
      ),
      explanation: isMul
        ? `Muốn tìm thừa số chưa biết, lấy tích chia thừa số kia: x = ${prod} : ${a} = ${x}.`
        : `Muốn tìm số bị chia, lấy thương nhân số chia: x = ${x} × ${a} = ${prod}.`,
      funnyTip: '💡 Tìm số bị chia thì NHÂN lên; tìm thừa số thì CHIA xuống!'
    };
  }

  // Chu vi / Diện tích hình chữ nhật hoặc hình vuông
  const isSquare = rng.next() < 0.45;
  if (isSquare) {
    const side = rng.int(3, 9);
    const askPerimeter = rng.next() < 0.5;
    const ans = askPerimeter ? side * 4 : side * side;
    const trap = askPerimeter ? side * side : side * 4;
    return {
      id,
      grade: '3',
      topicTag: 'Hình vuông',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: askPerimeter
        ? `Chu vi hình vuông có cạnh ${side} cm là bao nhiêu?`
        : `Diện tích hình vuông có cạnh ${side} cm là bao nhiêu?`,
      options: buildUniqueOptions(
        rng,
        `${ans} ${askPerimeter ? 'cm' : 'cm²'}`,
        [`${trap} ${askPerimeter ? 'cm' : 'cm²'}`, `${side * 2} ${askPerimeter ? 'cm' : 'cm²'}`, `${ans + 4} ${askPerimeter ? 'cm' : 'cm²'}`],
        (att) => `${ans + att * 2} ${askPerimeter ? 'cm' : 'cm²'}`
      ),
      explanation: askPerimeter
        ? `Chu vi hình vuông = cạnh × 4 = ${side} × 4 = ${ans} cm.`
        : `Diện tích hình vuông = cạnh × cạnh = ${side} × ${side} = ${ans} cm².`,
      funnyTip: '💡 Chu vi là nhân 4 (cm), Diện tích là cạnh nhân cạnh (cm²)!'
    };
  }

  const w = rng.int(3, 7);
  const l = rng.int(w + 2, 12);
  const askPerimeter = rng.next() < 0.5;
  const ans = askPerimeter ? (l + w) * 2 : l * w;
  const trap = askPerimeter ? l + w : (l + w) * 2;
  return {
    id,
    grade: '3',
    topicTag: 'Hình chữ nhật',
    source: 'generated',
    recommendedSeconds: 15,
    questionText: askPerimeter
      ? `Chu vi hình chữ nhật dài ${l} cm, rộng ${w} cm là:`
      : `Diện tích hình chữ nhật dài ${l} cm, rộng ${w} cm là:`,
    options: buildUniqueOptions(
      rng,
      `${ans} ${askPerimeter ? 'cm' : 'cm²'}`,
      [`${trap} ${askPerimeter ? 'cm' : 'cm²'}`, `${l * w} ${askPerimeter ? 'cm' : 'cm²'}`, `${ans + 2} ${askPerimeter ? 'cm' : 'cm²'}`],
      (att) => `${ans + att * 3} ${askPerimeter ? 'cm' : 'cm²'}`
    ),
    explanation: askPerimeter
      ? `Chu vi = (dài + rộng) × 2 = (${l} + ${w}) × 2 = ${ans} cm.`
      : `Diện tích = dài × rộng = ${l} × ${w} = ${ans} cm².`,
    funnyTip: '💡 Tính chu vi hình chữ nhật nhớ cộng dài với rộng rồi NHÂN ĐÔI nhé!'
  };
}

// ============================================================================
// LỚP 4: Tính chất kết hợp, Trung bình cộng, Phân số cơ bản, Đổi tấn/tạ
// ============================================================================
function genGrade4(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 4);
  const id = `ARENA_G4_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Tính nhanh phân phối: a * b + a * c
    const a = rng.pick([12, 15, 25, 36, 45]);
    const b = rng.int(3, 8);
    const c = 10 - b;
    const ans = a * 10;
    return {
      id,
      grade: '4',
      topicTag: 'Tính nhanh biểu thức',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Tính nhanh: ${a} × ${b} + ${a} × ${c} = ?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(a * 100), String(a * (b + c + 1)), String(a + 10)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `Áp dụng tính chất phân phối: ${a} × (${b} + ${c}) = ${a} × 10 = ${ans}.`,
      funnyTip: '💡 Thấy thừa số giống nhau thì gộp lại thành nhân với 10 cực nhanh!'
    };
  }

  if (pattern === 2) {
    // Trung bình cộng của 2 hoặc 3 số (đảm bảo chia hết nguyên)
    const count = rng.pick([2, 3]);
    const avg = rng.int(12, 45);
    const diff = rng.int(2, 8);
    const nums = count === 2 ? [avg - diff, avg + diff] : [avg - diff, avg, avg + diff];
    const shuffledNums = rng.shuffle(nums);
    return {
      id,
      grade: '4',
      topicTag: 'Trung bình cộng',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Trung bình cộng của ${shuffledNums.join(', ')} là:`,
      options: buildUniqueOptions(
        rng,
        String(avg),
        [String(avg * count), String(avg + 2), String(avg - 2)],
        makeNumericFallback(rng, avg, false)
      ),
      explanation: `Tổng = ${avg * count}. Chia cho ${count} số được trung bình cộng là ${avg}.`,
      funnyTip: '💡 Trung bình cộng = Tổng các số : Số các số hạng!'
    };
  }

  if (pattern === 3) {
    // Cộng / Trừ hai phân số cùng mẫu hoặc Rút gọn phân số
    const den = rng.pick([5, 7, 9, 11]);
    const n1 = rng.int(1, den - 2);
    const n2 = rng.int(1, den - n1); // Đảm bảo tổng <= den
    const sumNum = n1 + n2;
    const g = gcd(sumNum, den);
    const correctText = sumNum === den ? '1' : `${sumNum / g}/${den / g}`;
    return {
      id,
      grade: '4',
      topicTag: 'Phân số',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Kết quả tối giản của phép tính ${n1}/${den} + ${n2}/${den} là:`,
      options: buildUniqueOptions(
        rng,
        correctText,
        [`${n1 + n2}/${den * 2}`, `${n1 * n2}/${den}`, `${Math.max(1, sumNum - 1)}/${den}`],
        (att) => `${sumNum + att}/${den}`
      ),
      explanation: `Cùng mẫu thì cộng tử, giữ nguyên mẫu: (${n1} + ${n2})/${den} = ${sumNum}/${den}${sumNum === den ? ' = 1' : ''}.`,
      funnyTip: '💡 Cộng 2 phân số cùng mẫu tuyệt đối KHÔNG cộng 2 mẫu với nhau nhé!'
    };
  }

  // Đổi đơn vị khối lượng / thời gian
  const choice = rng.int(1, 2);
  if (choice === 1) {
    const tons = rng.int(2, 9);
    const ans = tons * 1000;
    return {
      id,
      grade: '4',
      topicTag: 'Đo khối lượng',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `${tons} tấn = ... kg?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(tons * 10), String(tons * 100), String(tons * 10000)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `1 tấn = 1000 kg nên ${tons} tấn = ${ans} kg.`,
      funnyTip: '💡 Thứ tự: Tấn ➔ Tạ ➔ Yến ➔ Kg (mỗi bước gấp 10 lần)!'
    };
  }
  const mins = rng.int(2, 5);
  const ans = mins * 60;
  return {
    id,
    grade: '4',
    topicTag: 'Đo thời gian',
    source: 'generated',
    recommendedSeconds: 15,
    questionText: `${mins} phút = ... giây?`,
    options: buildUniqueOptions(
      rng,
      String(ans),
      [String(mins * 100), String(mins * 60 + 60), String(mins * 30)],
      makeNumericFallback(rng, ans, false)
    ),
    explanation: `1 phút = 60 giây nên ${mins} phút = ${mins} × 60 = ${ans} giây.`,
    funnyTip: '💡 Thời gian tính theo hệ 60 (1 giờ = 60 phút, 1 phút = 60 giây)!'
  };
}

// ============================================================================
// LỚP 5: Số thập phân, Tỉ số phần trăm, Chuyển động đều, Diện tích tam giác
// ============================================================================
function genGrade5(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 4);
  const id = `ARENA_G5_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Nhân / Chia nhẩm số thập phân với 10, 100, 0.1
    const base = rng.int(12, 98) / 10; // vd 3.4
    const isMul10 = rng.next() < 0.5;
    const ans = isMul10 ? Math.round(base * 100) / 10 : Math.round(base * 10) / 100;
    const textA = formatVNDecimal(base);
    const correctStr = formatVNDecimal(ans);
    return {
      id,
      grade: '5',
      topicTag: 'Số thập phân',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: isMul10 ? `Tính nhẩm: ${textA} × 10 = ?` : `Tính nhẩm: ${textA} × 0,1 = ?`,
      options: buildUniqueOptions(
        rng,
        correctStr,
        [
          formatVNDecimal(isMul10 ? base / 10 : base * 10),
          formatVNDecimal(base * 100),
          formatVNDecimal(ans + 1)
        ],
        (att) => formatVNDecimal(ans + att * 0.5)
      ),
      explanation: isMul10
        ? `Nhân với 10 thì chuyển dấu phẩy sang phải 1 chữ số: ${textA} × 10 = ${correctStr}.`
        : `Nhân với 0,1 (tức chia cho 10) thì chuyển dấu phẩy sang trái 1 chữ số: ${correctStr}.`,
      funnyTip: '💡 Nhân 10 dịch phải, nhân 0,1 (hoặc chia 10) dịch trái!'
    };
  }

  if (pattern === 2) {
    // Tỉ số phần trăm chuẩn
    const pct = rng.pick([10, 20, 25, 50, 75]);
    const whole = rng.pick([40, 80, 120, 200, 400]);
    const ans = (whole * pct) / 100;
    return {
      id,
      grade: '5',
      topicTag: 'Tỉ số phần trăm',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `${pct}% của ${whole} là bao nhiêu?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(ans * 2), String(Math.max(1, Math.floor(ans / 2))), String(whole - ans)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `Tính ${whole} × ${pct} : 100 = ${ans}.`,
      funnyTip: '💡 Mẹo: 50% là chia đôi, 25% là chia 4, 10% là chia 10!'
    };
  }

  if (pattern === 3) {
    // Chuyển động đều (s = v * t)
    const v = rng.pick([30, 40, 45, 50, 60]);
    const t = rng.pick([2, 3, 4]);
    const s = v * t;
    const askV = rng.next() < 0.5;
    return {
      id,
      grade: '5',
      topicTag: 'Chuyển động đều',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: askV
        ? `Một xe đi quãng đường ${s} km trong ${t} giờ. Vận tốc của xe là:`
        : `Một xe đi với vận tốc ${v} km/giờ trong ${t} giờ. Quãng đường đi được là:`,
      options: buildUniqueOptions(
        rng,
        askV ? `${v} km/giờ` : `${s} km`,
        askV
          ? [`${s * t} km/giờ`, `${v + 10} km/giờ`, `${v - 5} km/giờ`]
          : [`${Math.floor(v / t)} km`, `${s + v} km`, `${s - 10} km`],
        (att) => `${(askV ? v : s) + att * 5} ${askV ? 'km/giờ' : 'km'}`
      ),
      explanation: askV ? `v = s : t = ${s} : ${t} = ${v} km/giờ.` : `s = v × t = ${v} × ${t} = ${s} km.`,
      funnyTip: '💡 Nhớ câu thần chú: Quãng đường = Vận tốc × Thời gian (s = v × t)!'
    };
  }

  // Diện tích tam giác
  const baseLen = rng.pick([6, 8, 10, 12]);
  const height = rng.int(3, 9);
  const ans = (baseLen * height) / 2;
  return {
    id,
    grade: '5',
    topicTag: 'Diện tích tam giác',
    source: 'generated',
    recommendedSeconds: 15,
    questionText: `Diện tích hình tam giác có đáy ${baseLen} cm và chiều cao ${height} cm là:`,
    options: buildUniqueOptions(
      rng,
      `${ans} cm²`,
      [`${baseLen * height} cm²`, `${ans + 2} cm²`, `${baseLen + height} cm²`],
      (att) => `${ans + att * 2} cm²`
    ),
    explanation: `S = (đáy × cao) : 2 = (${baseLen} × ${height}) : 2 = ${ans} cm².`,
    funnyTip: '💡 Tính diện tích tam giác đừng bao giờ quên CHIA CHO 2!'
  };
}

// ============================================================================
// LỚP 6: Số nguyên âm, Lũy thừa tự nhiên, ƯCLN/BCNN, Góc vuông/bẹt
// ============================================================================
function genGrade6(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 4);
  const id = `ARENA_G6_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Cộng / Trừ / Nhân số nguyên âm
    const subType = rng.int(1, 3);
    const a = -rng.int(3, 15);
    const b = rng.pick([-1, 1]) * rng.int(2, 12);
    let expr = '';
    let ans = 0;
    if (subType === 1) {
      expr = `${formatSigned(a)} + ${formatSigned(b)}`;
      ans = a + b;
    } else if (subType === 2) {
      expr = `${formatSigned(a)} - ${formatSigned(b)}`;
      ans = a - b;
    } else {
      expr = `${formatSigned(a)} · ${formatSigned(b)}`;
      ans = a * b;
    }
    return {
      id,
      grade: '6',
      topicTag: 'Số nguyên',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Tính nhanh: ${expr} = ?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(-ans), String(ans + 2), String(ans - 2)],
        makeNumericFallback(rng, ans, true)
      ),
      explanation: `Áp dụng quy tắc dấu số nguyên: ${expr} = ${ans}.`,
      funnyTip: '💡 Nhân hai số cùng dấu ra DƯƠNG (+), trái dấu ra ÂM (-)!'
    };
  }

  if (pattern === 2) {
    // Lũy thừa số tự nhiên & số mũ 0
    const base = rng.int(2, 5);
    const exp = rng.pick([0, 2, 3]);
    const ans = Math.pow(base, exp);
    const trap = exp === 0 ? 0 : base * exp;
    return {
      id,
      grade: '6',
      topicTag: 'Lũy thừa',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Giá trị của ${base}^${exp} bằng bao nhiêu?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(trap), String(ans + base), String(base)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: exp === 0 ? `Mọi số khác 0 mũ 0 đều bằng 1.` : `${base}^${exp} là tích ${exp} thừa số ${base}, bằng ${ans}.`,
      funnyTip: '💡 Cẩn thận: a^n là nhân n số a với nhau, KHÔNG phải lấy a × n!'
    };
  }

  if (pattern === 3) {
    // ƯCLN hoặc BCNN của 2 số nhỏ
    const pairs: [number, number][] = [
      [12, 18], [8, 12], [6, 9], [10, 15], [14, 21], [15, 20], [16, 24]
    ];
    const [a, b] = rng.pick(pairs);
    const askGcd = rng.next() < 0.5;
    const g = gcd(a, b);
    const l = lcm(a, b);
    const ans = askGcd ? g : l;
    return {
      id,
      grade: '6',
      topicTag: askGcd ? 'ƯCLN' : 'BCNN',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: askGcd ? `ƯCLN(${a}, ${b}) = ?` : `BCNN(${a}, ${b}) = ?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(askGcd ? l : g), String(a * b), String(ans + 2)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: askGcd
        ? `Số lớn nhất mà cả ${a} và ${b} cùng chia hết là ${g}.`
        : `Số dương nhỏ nhất khác 0 cùng chia hết cho ${a} và ${b} là ${l}.`,
      funnyTip: '💡 ƯCLN luôn nhỏ hơn hoặc bằng hai số; BCNN luôn lớn hơn hoặc bằng hai số!'
    };
  }

  // Góc bổ sung / góc đặc biệt
  const alpha = rng.pick([30, 45, 60, 75, 110, 120]);
  const ans = 180 - alpha;
  return {
    id,
    grade: '6',
    topicTag: 'Góc cơ bản',
    source: 'generated',
    recommendedSeconds: 15,
    questionText: `Góc kề bù với góc ${alpha}° có số đo bằng bao nhiêu độ?`,
    options: buildUniqueOptions(
      rng,
      `${ans}°`,
      [`${Math.abs(90 - alpha)}°`, `${360 - alpha}°`, `${alpha}°`],
      (att) => `${ans + att * 5}°`
    ),
    explanation: `Hai góc kề bù có tổng số đo bằng 180° nên góc cần tìm là 180° - ${alpha}° = ${ans}°.`,
    funnyTip: '💡 Góc bẹt = 180°, góc vuông = 90°!'
  };
}

// ============================================================================
// LỚP 7: Căn bậc hai số học, Lũy thừa của lũy thừa, Tỉ lệ thức, Tổng 3 góc tam giác
// ============================================================================
function genGrade7(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 4);
  const id = `ARENA_G7_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Căn bậc hai số học (CHỈ LẤY GIÁ TRỊ KHÔNG ÂM)
    const k = rng.int(3, 15);
    const sq = k * k;
    return {
      id,
      grade: '7',
      topicTag: 'Số thực & Căn bậc hai',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Giá trị của √${sq} bằng:`,
      options: buildUniqueOptions(
        rng,
        String(k),
        [`±${k}`, String(-k), String(Math.floor(sq / 2))],
        makeNumericFallback(rng, k, false)
      ),
      explanation: `Vì ${k} > 0 và ${k}² = ${sq} nên căn bậc hai số học √${sq} = ${k}.`,
      funnyTip: '💡 Ký hiệu √a là căn bậc hai SỐ HỌC, luôn ra số KHÔNG ÂM (không chọn ±)!'
    };
  }

  if (pattern === 2) {
    // Lũy thừa của lũy thừa: (x^m)^n
    const base = rng.pick(['x', '2', '3']);
    const m = rng.int(2, 4);
    const n = rng.int(2, 3);
    const ansExp = m * n;
    return {
      id,
      grade: '7',
      topicTag: 'Số hữu tỉ & Lũy thừa',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Thu gọn biểu thức (${base}^${m})^${n} ta được:`,
      options: buildUniqueOptions(
        rng,
        `${base}^${ansExp}`,
        [`${base}^${m + n}`, `${base}^${Math.pow(m, n)}`, `${base}^${Math.abs(m - n) || 1}`],
        (att) => `${base}^${ansExp + att}`
      ),
      explanation: `Áp dụng công thức (a^m)^n = a^(m·n): (${base}^${m})^${n} = ${base}^(${m}·${n}) = ${base}^${ansExp}.`,
      funnyTip: '💡 Lũy thừa của lũy thừa thì NHÂN hai số mũ (không phải cộng)!'
    };
  }

  if (pattern === 3) {
    // Tỉ lệ thức a/b = x/d
    const b = rng.int(2, 6);
    const k = rng.int(2, 5);
    const a = rng.int(1, 7);
    const d = b * k;
    const x = a * k;
    return {
      id,
      grade: '7',
      topicTag: 'Tỉ lệ thức',
      source: 'generated',
      recommendedSeconds: 18,
      questionText: `Tìm x trong tỉ lệ thức: ${a}/${b} = x/${d}`,
      options: buildUniqueOptions(
        rng,
        String(x),
        [String(a + k), String(b * k), String(x + a)],
        makeNumericFallback(rng, x, false)
      ),
      explanation: `Nhân chéo: x = (${a} · ${d}) / ${b} = ${x}.`,
      funnyTip: '💡 Quy tắc tam suất: Nhân chéo chia ngang!'
    };
  }

  // Tổng 3 góc tam giác
  const g1 = rng.pick([35, 40, 45, 50, 60, 70]);
  const g2 = rng.pick([40, 50, 55, 65, 75]);
  const g3 = 180 - g1 - g2;
  return {
    id,
    grade: '7',
    topicTag: 'Tam giác',
    source: 'generated',
    recommendedSeconds: 15,
    questionText: `Tam giác ABC có góc A = ${g1}°, góc B = ${g2}°. Số đo góc C là:`,
    options: buildUniqueOptions(
      rng,
      `${g3}°`,
      [`${Math.abs(90 - g1)}°`, `${g1 + g2}°`, `${g3 + 10}°`],
      (att) => `${g3 + att * 5}°`
    ),
    explanation: `Tổng 3 góc trong một tam giác bằng 180° nên góc C = 180° - (${g1}° + ${g2}°) = ${g3}°.`,
    funnyTip: '💡 Tổng 3 góc mọi tam giác luôn là 180°!'
  };
}

// ============================================================================
// LỚP 8: Hằng đẳng thức, Phương trình bậc nhất, Hàm số y=ax+b, Tỉ số đồng dạng
// ============================================================================
function genGrade8(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 4);
  const id = `ARENA_G8_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Khai triển hằng đẳng thức (x ± k)² — Gài bẫy thiếu 2ab!
    const k = rng.int(2, 7);
    const isPlus = rng.next() < 0.5;
    const sign = isPlus ? '+' : '-';
    const correct = `x² ${sign} ${2 * k}x + ${k * k}`;
    return {
      id,
      grade: '8',
      topicTag: 'Hằng đẳng thức',
      source: 'generated',
      recommendedSeconds: 18,
      questionText: `Khai triển hằng đẳng thức (x ${sign} ${k})² ta được:`,
      options: buildUniqueOptions(
        rng,
        correct,
        [
          `x² ${sign} ${k * k}`,             // Bẫy kinh điển: quên 2ab!
          `x² ${sign} ${k}x + ${k * k}`,     // Bẫy quên nhân 2!
          `x² ${isPlus ? '-' : '+'} ${2 * k}x - ${k * k}`
        ],
        (att) => `x² ${sign} ${2 * k + att}x + ${k * k}`
      ),
      explanation: `Áp dụng (A ${sign} B)² = A² ${sign} 2AB + B² ta được ${correct}.`,
      funnyTip: '💡 Đừng bao giờ rơi mất "2 lần tích" (2AB) ở giữa nhé!'
    };
  }

  if (pattern === 2) {
    // Tính nhanh hiệu hai bình phương a² - b²
    const b = rng.int(1, 5);
    const a = rng.pick([20, 30, 50, 100]) + b; // Để (a - b) tròn chục, nhưng a² - b² = (a-b)(a+b)
    const diff = a - b;
    const sum = a + b;
    const ans = diff * sum;
    return {
      id,
      grade: '8',
      topicTag: 'Hằng đẳng thức số học',
      source: 'generated',
      recommendedSeconds: 20,
      questionText: `Tính nhanh: ${a}² - ${b}² = ?`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String((a - b) * (a - b)), String(a * a + b * b), String(ans + 10)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `${a}² - ${b}² = (${a} - ${b})(${a} + ${b}) = ${diff} · ${sum} = ${ans}.`,
      funnyTip: '💡 Dùng a² - b² = (a - b)(a + b) tính nhẩm nhanh gấp 5 lần!'
    };
  }

  if (pattern === 3) {
    // Hệ số góc hàm số bậc nhất y = ax + b
    const a = rng.pick([-5, -3, -2, 2, 3, 4, 6]);
    const b = rng.pick([-7, -4, 3, 5, 9]);
    const bStr = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
    return {
      id,
      grade: '8',
      topicTag: 'Hàm số bậc nhất',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Hệ số góc của đường thẳng y = ${a}x ${bStr} là:`,
      options: buildUniqueOptions(
        rng,
        String(a),
        [String(b), String(-a), String(a + b)],
        makeNumericFallback(rng, a, true)
      ),
      explanation: `Đường thẳng y = ax + b (a ≠ 0) có hệ số góc là a = ${a}.`,
      funnyTip: '💡 Hệ số góc là số đứng ngay trước x!'
    };
  }

  // Tam giác đồng dạng: tỉ số diện tích = k²
  const k = rng.int(2, 5);
  const sSmall = rng.int(4, 12);
  const sLarge = sSmall * k * k;
  return {
    id,
    grade: '8',
    topicTag: 'Tam giác đồng dạng',
    source: 'generated',
    recommendedSeconds: 20,
    questionText: `ΔABC ~ ΔDEF theo tỉ số đồng dạng k = ${k}. Nếu diện tích ΔDEF là ${sSmall} cm² thì diện tích ΔABC là:`,
    options: buildUniqueOptions(
      rng,
      `${sLarge} cm²`,
      [`${sSmall * k} cm²`, `${sSmall + k * k} cm²`, `${sSmall * k * 2} cm²`],
      (att) => `${sLarge + att * 4} cm²`
    ),
    explanation: `Tỉ số diện tích hai tam giác đồng dạng bằng BÌNH PHƯƠNG tỉ số đồng dạng: ${sSmall} × ${k}² = ${sLarge} cm².`,
    funnyTip: '💡 Tỉ số chu vi là k, nhưng tỉ số DIỆN TÍCH phải là k²!'
  };
}

// ============================================================================
// LỚP 9: Căn thức √(A²)=|A|, Vi-ét, Tỉ số lượng giác đặc biệt, Góc nội tiếp
// ============================================================================
function genGrade9(rng: SeededRandom, index: number): ArenaQuestion {
  const pattern = rng.int(1, 4);
  const id = `ARENA_G9_${index}_${rng.int(100, 999)}`;

  if (pattern === 1) {
    // Hằng đẳng thức √((a - b)²) = |a - b| với a < b -> Kết quả đảo dấu!
    const small = rng.int(2, 5);
    const large = rng.int(small + 2, 9);
    const exprInside = `${small} - √${large * large}`;
    const ans = large - small;
    return {
      id,
      grade: '9',
      topicTag: 'Căn bậc hai',
      source: 'generated',
      recommendedSeconds: 18,
      questionText: `Giá trị của biểu thức √((${small} - ${large})²) bằng:`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(-ans), String(small + large), String(ans * ans)],
        makeNumericFallback(rng, ans, false)
      ),
      explanation: `√(A²) = |A|. Vì ${small} - ${large} = ${small - large} < 0 nên |${small - large}| = ${ans}.`,
      funnyTip: '💡 Cẩn thận bẫy √(A²) = |A| (luôn không âm), không bỏ trị tuyệt đối ẩu!'
    };
  }

  if (pattern === 2) {
    // Định lí Vi-ét: x² + bx + c = 0 -> hỏi tổng hoặc tích 2 nghiệm
    const x1 = rng.pick([-4, -3, -2, 1, 2, 3, 5]);
    const x2 = rng.pick([-2, 1, 2, 4, 6]);
    const S = x1 + x2;
    const P = x1 * x2;
    // x² - Sx + P = 0
    const bCoeff = -S;
    const bStr = bCoeff === 0 ? '' : bCoeff > 0 ? `+ ${bCoeff}x` : `- ${Math.abs(bCoeff)}x`;
    const cStr = P === 0 ? '' : P > 0 ? `+ ${P}` : `- ${Math.abs(P)}`;
    const askSum = rng.next() < 0.6;
    const ans = askSum ? S : P;
    return {
      id,
      grade: '9',
      topicTag: 'Hệ thức Vi-ét',
      source: 'generated',
      recommendedSeconds: 20,
      questionText: `Phương trình x² ${bStr} ${cStr} = 0 có hai nghiệm x₁, x₂. Giá trị của ${askSum ? 'x₁ + x₂' : 'x₁ · x₂'} là:`,
      options: buildUniqueOptions(
        rng,
        String(ans),
        [String(-ans), String(askSum ? P : S), String(ans + 2)],
        makeNumericFallback(rng, ans, true)
      ),
      explanation: askSum
        ? `Theo Vi-ét: x₁ + x₂ = -b/a = ${S}.`
        : `Theo Vi-ét: x₁ · x₂ = c/a = ${P}.`,
      funnyTip: '💡 Vi-ét: Tổng = -b/a (nhớ ĐỔI DẤU b!), Tích = c/a!'
    };
  }

  if (pattern === 3) {
    // Tỉ số lượng giác góc đặc biệt
    const trigBank = [
      { q: 'sin 30°', a: '1/2', traps: ['√3/2', '√2/2', '1'] },
      { q: 'cos 60°', a: '1/2', traps: ['√3/2', '√2/2', '0'] },
      { q: 'tan 45°', a: '1', traps: ['1/2', '√2/2', '√3'] },
      { q: 'sin 45°', a: '√2/2', traps: ['1/2', '√3/2', '1'] },
      { q: 'cos 30°', a: '√3/2', traps: ['1/2', '√2/2', '√3'] },
      { q: 'tan 60°', a: '√3', traps: ['√3/3', '1', '1/2'] }
    ] as const;
    const item = rng.pick(trigBank);
    return {
      id,
      grade: '9',
      topicTag: 'Lượng giác tam giác vuông',
      source: 'generated',
      recommendedSeconds: 15,
      questionText: `Giá trị lượng giác của ${item.q} bằng:`,
      options: buildUniqueOptions(
        rng,
        item.a,
        [...item.traps],
        (att) => `${att}`
      ),
      explanation: `Theo bảng giá trị lượng giác góc đặc biệt: ${item.q} = ${item.a}.`,
      funnyTip: '💡 Mẹo: Hai góc phụ nhau (30° và 60°) thì sin góc này = cos góc kia!'
    };
  }

  // Góc nội tiếp & Góc ở tâm đường tròn
  const centralAngle = rng.pick([60, 70, 80, 90, 100, 110, 120, 140]);
  const inscribedAngle = centralAngle / 2;
  const askInscribed = rng.next() < 0.5;
  const ans = askInscribed ? inscribedAngle : centralAngle;
  return {
    id,
    grade: '9',
    topicTag: 'Đường tròn & Góc nội tiếp',
    source: 'generated',
    recommendedSeconds: 18,
    questionText: askInscribed
      ? `Góc ở tâm chắn cung AB có số đo ${centralAngle}°. Góc nội tiếp chắn cung AB bằng:`
      : `Góc nội tiếp chắn cung AB có số đo ${inscribedAngle}°. Góc ở tâm chắn cung AB bằng:`,
    options: buildUniqueOptions(
      rng,
      `${ans}°`,
      [
        `${askInscribed ? centralAngle * 2 : inscribedAngle / 2}°`,
        `${askInscribed ? centralAngle : inscribedAngle}°`,
        `${180 - ans}°`
      ],
      (att) => `${ans + att * 10}°`
    ),
    explanation: `Trong một đường tròn, góc nội tiếp bằng nửa số đo góc ở tâm cùng chắn một cung.`,
    funnyTip: '💡 Góc ở TÂM luôn gấp ĐÔI góc NỘI TIẾP cùng chắn 1 cung!'
  };
}

// ============================================================================
// HÀM TỔNG HỢP: SINH BỘ ĐỀ ĐẤU TRƯỜNG CHUẨN CHO MỌI LỚP 1 -> 9
// ============================================================================
const GRADE_GENERATORS: Record<GradeLevel, (rng: SeededRandom, idx: number) => ArenaQuestion> = {
  '1': genGrade1,
  '2': genGrade2,
  '3': genGrade3,
  '4': genGrade4,
  '5': genGrade5,
  '6': genGrade6,
  '7': genGrade7,
  '8': genGrade8,
  '9': genGrade9
};

/**
 * Sinh bộ câu hỏi tính nhanh chuẩn SGK cho lớp 1..9.
 * Cùng `matchSeed` thì mọi máy nhận đề giống hệt nhau (dùng cho 1v1 / phòng lớp học).
 */
export function buildArenaQuestionDeck(params: {
  grade: GradeLevel;
  totalQuestions?: number;
  matchSeed?: number;
}): ArenaQuestion[] {
  const { grade, totalQuestions = 20, matchSeed } = params;
  const rng = new SeededRandom(matchSeed);
  const generator = GRADE_GENERATORS[grade];
  const out: ArenaQuestion[] = [];
  const seen = new Set<string>();
  let guard = 0;
  while (out.length < totalQuestions && guard < totalQuestions * 8) {
    const q = generator(rng, guard);
    if (!seen.has(q.questionText)) { seen.add(q.questionText); out.push(q); }
    guard++;
  }
  return out;
}
