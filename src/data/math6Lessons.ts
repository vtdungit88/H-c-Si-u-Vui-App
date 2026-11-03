import { MathLesson } from '../types';

export const MATH_LESSONS: MathLesson[] = [
  // ================= CHAPTER 1 =================
  {
    id: 'lesson_1_set',
    chapter: 1,
    chapterTitle: 'Chương 1: Tập Hợp Các Số Tự Nhiên',
    lessonNumber: 1,
    title: 'Tập Hợp & Phần Tử Của Tập Hợp',
    subTitle: 'Ký hiệu thuộc (∈), không thuộc (∉) & hai cách viết tập hợp',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 6',
    rewardCoins: 60,
    rewardStars: 3,
    conceptSummary: [
      'Tập hợp gồm các phần tử được đặt trong dấu ngoặc nhọn { } và cách nhau bởi dấu chấm phẩy ";".',
      'Mỗi phần tử chỉ được liệt kê 1 lần duy nhất.',
      'Ký hiệu: a ∈ X (a thuộc X), b ∉ X (b không thuộc X).'
    ],
    questions: [
      {
        id: 'q1_1',
        questionText: 'Cho tập hợp A = {mèo; chó; gà; vịt}. Khẳng định nào sau đây là ĐÚNG?',
        visualType: 'set',
        visualData: { setName: 'A', elements: ['mèo', 'chó', 'gà', 'vịt'] },
        options: [
          { id: 'opt1', text: 'mèo ∈ A', isCorrect: true },
          { id: 'opt2', text: 'khủng long ∈ A', isCorrect: false },
          { id: 'opt3', text: 'chó ∉ A', isCorrect: false },
          { id: 'opt4', text: 'vịt ∉ A', isCorrect: false }
        ],
        explanation: 'Vì "mèo" có mặt trong dấu ngoặc nhọn của tập hợp A nên ta viết: mèo ∈ A.',
        funnyTip: 'Mèo thích ăn cá và thích thuộc tập hợp A, còn khủng long tuyệt chủng rồi nên không thuộc!'
      },
      {
        id: 'q1_2',
        questionText: 'Viết tập hợp B các chữ cái trong từ "TOAN HOC". Cách viết nào là CHUẨN XÁC theo SGK?',
        visualType: 'set',
        visualData: { word: 'TOAN HOC' },
        options: [
          { id: 'opt1', text: 'B = {T; O; A; N; H; C}', isCorrect: true },
          { id: 'opt2', text: 'B = {T; O; A; N; H; O; C}', isCorrect: false },
          { id: 'opt3', text: 'B = (T; O; A; N; H; C)', isCorrect: false },
          { id: 'opt4', text: 'B = [T, O, A, N, H, C]', isCorrect: false }
        ],
        explanation: 'Quy tắc vàng của SGK Toán 6: Trong một tập hợp, mỗi phần tử chỉ được liệt kê ĐÚNG MỘT LẦN! Chữ O xuất hiện 2 lần thì chỉ ghi 1 lần.',
        funnyTip: 'Đừng ghi chữ O hai lần kẻo thầy cô tưởng bạn đang ngáp ngủ nhé!'
      },
      {
        id: 'q1_3',
        questionText: 'Tập hợp C các số tự nhiên x sao cho x < 5 là:',
        options: [
          { id: 'opt1', text: 'C = {0; 1; 2; 3; 4}', isCorrect: true },
          { id: 'opt2', text: 'C = {1; 2; 3; 4; 5}', isCorrect: false },
          { id: 'opt3', text: 'C = {0; 1; 2; 3; 4; 5}', isCorrect: false },
          { id: 'opt4', text: 'C = {1; 2; 3; 4}', isCorrect: false }
        ],
        explanation: 'Số tự nhiên nhỏ hơn 5 bắt đầu từ 0 và dừng lại ở 4 (không lấy số 5 vì x < 5).',
        funnyTip: 'Đừng bỏ quên số 0 tội nghiệp nhé, số 0 cũng là số tự nhiên chân chính đấy!'
      }
    ]
  },
  {
    id: 'lesson_2_power',
    chapter: 1,
    chapterTitle: 'Chương 1: Tập Hợp Các Số Tự Nhiên',
    lessonNumber: 4,
    title: 'Lũy Thừa Với Số Mũ Tự Nhiên',
    subTitle: 'Nhân & chia hai lũy thừa cùng cơ số: aᵐ · aⁿ = aᵐ⁺ⁿ',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 16',
    rewardCoins: 75,
    rewardStars: 3,
    conceptSummary: [
      'aⁿ = a · a · ... · a (n thừa số a, với n ≠ 0).',
      'Nhân hai lũy thừa cùng cơ số: Giữ nguyên cơ số, CỘNG các số mũ: aᵐ · aⁿ = aᵐ⁺ⁿ.',
      'Chia hai lũy thừa cùng cơ số: Giữ nguyên cơ số, TRỪ các số mũ: aᵐ : aⁿ = aᵐ⁻ⁿ (a ≠ 0, m ≥ n).'
    ],
    questions: [
      {
        id: 'q2_1',
        questionText: 'Viết tích 2³ · 2⁴ dưới dạng một lũy thừa duy nhất:',
        visualType: 'power',
        visualData: { base: 2, m: 3, n: 4 },
        options: [
          { id: 'opt1', text: '2⁷', isCorrect: true },
          { id: 'opt2', text: '2¹²', isCorrect: false },
          { id: 'opt3', text: '4⁷', isCorrect: false },
          { id: 'opt4', text: '4¹²', isCorrect: false }
        ],
        explanation: 'Áp dụng quy tắc nhân hai lũy thừa cùng cơ số: 2³ · 2⁴ = 2³⁺⁴ = 2⁷.',
        funnyTip: 'Hai bạn số 2 bắt tay nhau giữ nguyên, số mũ 3 và 4 nhảy lên ôm nhau thành 7!'
      },
      {
        id: 'q2_2',
        questionText: 'Giá trị của lũy thừa 3³ bằng bao nhiêu?',
        options: [
          { id: 'opt1', text: '27', isCorrect: true },
          { id: 'opt2', text: '9', isCorrect: false },
          { id: 'opt3', text: '6', isCorrect: false },
          { id: 'opt4', text: '81', isCorrect: false }
        ],
        explanation: '3³ = 3 · 3 · 3 = 9 · 3 = 27. (Rất nhiều bạn nhầm 3 · 3 = 9 là sai nhé!).',
        funnyTip: '3 mũ 3 là 3 nhân 3 rồi lại nhân 3. Nhớ kỹ kẻo nhầm thành 3 x 3 = 9 là bị phạt trực nhật đấy!'
      },
      {
        id: 'q2_3',
        questionText: 'Kết quả của phép chia 5⁶ : 5² là:',
        options: [
          { id: 'opt1', text: '5⁴', isCorrect: true },
          { id: 'opt2', text: '5³', isCorrect: false },
          { id: 'opt3', text: '1⁴', isCorrect: false },
          { id: 'opt4', text: '5⁸', isCorrect: false }
        ],
        explanation: 'Giữ nguyên cơ số 5, trừ hai số mũ: 6 - 2 = 4. Kết quả là 5⁴.',
        funnyTip: 'Phép chia lũy thừa như gọt bớt tầng tháp: tháp 6 tầng bị gọt đi 2 tầng còn 4 tầng!'
      }
    ]
  },
  {
    id: 'lesson_3_order_ops',
    chapter: 1,
    chapterTitle: 'Chương 1: Tập Hợp Các Số Tự Nhiên',
    lessonNumber: 5,
    title: 'Thứ Tự Thực Hiện Các Phép Tính',
    subTitle: 'Ngoặc tròn ( ) → Ngoặc vuông [ ] → Ngoặc nhọn { }',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 20',
    rewardCoins: 85,
    rewardStars: 3,
    conceptSummary: [
      'Không có ngoặc: Lũy thừa → Nhân & Chia → Cộng & Trừ.',
      'Có ngoặc: Thực hiện trong ngoặc tròn ( ) trước → rồi đến ngoặc vuông [ ] → cuối cùng ngoặc nhọn { }.'
    ],
    questions: [
      {
        id: 'q3_1',
        questionText: 'Tính giá trị của biểu thức: 20 - 2 · 3²',
        options: [
          { id: 'opt1', text: '2', isCorrect: true },
          { id: 'opt2', text: '162', isCorrect: false },
          { id: 'opt3', text: '54', isCorrect: false },
          { id: 'opt4', text: '14', isCorrect: false }
        ],
        explanation: 'Bước 1: Tính lũy thừa 3² = 9. Bước 2: Nhân 2 · 9 = 18. Bước 3: Trừ 20 - 18 = 2.',
        funnyTip: 'Ai vội vàng lấy 20 - 2 = 18 rồi nhân 9 là rơi thẳng vào bẫy của đề bài!'
      },
      {
        id: 'q3_2',
        questionText: 'Trong biểu thức có các dấu ngoặc ( ), [ ], { }, thứ tự ưu tiên nào ĐÚNG?',
        options: [
          { id: 'opt1', text: '( ) trước → [ ] → { } sau cùng', isCorrect: true },
          { id: 'opt2', text: '{ } trước → [ ] → ( ) sau cùng', isCorrect: false },
          { id: 'opt3', text: '[ ] trước → ( ) → { } sau cùng', isCorrect: false },
          { id: 'opt4', text: 'Ngoặc nào to nhất tính trước', isCorrect: false }
        ],
        explanation: 'Quy tắc SGK: ( ) là trong cùng tính trước nhất, tiếp theo đến [ ], cuối cùng mới mở tung ngoặc nhọn { }.',
        funnyTip: 'Ngoặc tròn như quả trứng bên trong, phải bóc trứng trước mới đến hộp vuông và vali nhọn!'
      }
    ]
  },

  // ================= CHAPTER 2 =================
  {
    id: 'lesson_4_divisibility',
    chapter: 2,
    chapterTitle: 'Chương 2: Tính Chia Hết Trong Tập Hợp Số Tự Nhiên',
    lessonNumber: 7,
    title: 'Dấu Hiệu Chia Hết Cho 2, 5, 3, 9',
    subTitle: 'Quy tắc chữ số tận cùng và tổng các chữ số siêu nhanh',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 36',
    rewardCoins: 90,
    rewardStars: 3,
    conceptSummary: [
      'Chia hết cho 2: Chữ số tận cùng là 0, 2, 4, 6, 8 (số chẵn).',
      'Chia hết cho 5: Chữ số tận cùng là 0 hoặc 5.',
      'Chia hết cho cả 2 và 5: Tận cùng bắt buộc là 0.',
      'Chia hết cho 3: Tổng các chữ số chia hết cho 3.',
      'Chia hết cho 9: Tổng các chữ số chia hết cho 9.'
    ],
    questions: [
      {
        id: 'q4_1',
        questionText: 'Số nào sau đây chia hết cho CẢ 2 VÀ 5?',
        options: [
          { id: 'opt1', text: '2020', isCorrect: true },
          { id: 'opt2', text: '2025', isCorrect: false },
          { id: 'opt3', text: '2022', isCorrect: false },
          { id: 'opt4', text: '2023', isCorrect: false }
        ],
        explanation: 'Số chia hết cho cả 2 và 5 phải có chữ số tận cùng là 0. Số 2020 có tận cùng là 0.',
        funnyTip: 'Muốn vừa lòng cả bạn 2 và bạn 5 thì đuôi số phải tròn vo như quả trứng số 0!'
      },
      {
        id: 'q4_2',
        questionText: 'Trong các số sau, số nào chia hết cho 9?',
        options: [
          { id: 'opt1', text: '738', isCorrect: true },
          { id: 'opt2', text: '645', isCorrect: false },
          { id: 'opt3', text: '512', isCorrect: false },
          { id: 'opt4', text: '811', isCorrect: false }
        ],
        explanation: 'Xét số 738: Tổng các chữ số là 7 + 3 + 8 = 18. Vì 18 chia hết cho 9 nên 738 chia hết cho 9.',
        funnyTip: 'Cộng dồn chữ số lại: 7 + 3 + 8 = 18, 18 chia hết cho 9 mượt mà như bơ!'
      },
      {
        id: 'q4_3',
        questionText: 'Thay chữ số * vào số 1*5 để số đó chia hết cho 3 nhưng KHÔNG chia hết cho 9:',
        options: [
          { id: 'opt1', text: '* = 0 (Số 105)', isCorrect: true },
          { id: 'opt2', text: '* = 3 (Số 135)', isCorrect: false },
          { id: 'opt3', text: '* = 4 (Số 145)', isCorrect: false },
          { id: 'opt4', text: '* = 1 (Số 115)', isCorrect: false }
        ],
        explanation: 'Với * = 0, số 105 có tổng chữ số là 1 + 0 + 5 = 6. 6 chia hết cho 3 nhưng không chia hết cho 9! (Nếu chọn * = 3 thì 1+3+5 = 9 chia hết cho 9 mất rồi).',
        funnyTip: 'Đọc kỹ đề bài: "chia hết cho 3 nhưng KHÔNG chia hết cho 9". Bẫy ngọt ngào đấy!'
      }
    ]
  },
  {
    id: 'lesson_5_primes',
    chapter: 2,
    chapterTitle: 'Chương 2: Tính Chia Hết Trong Tập Hợp Số Tự Nhiên',
    lessonNumber: 8,
    title: 'Số Nguyên Tố & Hợp Số',
    subTitle: 'Những viên gạch nguyên tử kỳ diệu cấu tạo nên thế giới số',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 40',
    rewardCoins: 95,
    rewardStars: 3,
    conceptSummary: [
      'Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có đúng 2 ước là 1 và chính nó.',
      'Hợp số là số tự nhiên lớn hơn 1, có nhiều hơn 2 ước.',
      'Số 0 và số 1 không phải là số nguyên tố cũng không phải là hợp số.',
      'Số 2 là số nguyên tố chẵn DUY NHẤT!'
    ],
    questions: [
      {
        id: 'q5_1',
        questionText: 'Khẳng định nào sau đây là ĐÚNG NHẤT về số nguyên tố?',
        options: [
          { id: 'opt1', text: 'Số 2 là số nguyên tố chẵn duy nhất', isCorrect: true },
          { id: 'opt2', text: 'Mọi số nguyên tố đều là số lẻ', isCorrect: false },
          { id: 'opt3', text: 'Số 1 là số nguyên tố nhỏ nhất', isCorrect: false },
          { id: 'opt4', text: 'Số 0 là hợp số nhỏ nhất', isCorrect: false }
        ],
        explanation: 'Số 2 là số chẵn nhưng chỉ có 2 ước là 1 và 2 nên là số nguyên tố. Tất cả số chẵn khác > 2 đều chia hết cho 2 nên là hợp số.',
        funnyTip: 'Số 2 như người hùng độc nhất vô nhị: vừa chẵn vừa nguyên tố!'
      },
      {
        id: 'q5_2',
        questionText: 'Tập hợp nào dưới đây CHỈ GỒM các số nguyên tố?',
        options: [
          { id: 'opt1', text: '{2; 3; 5; 7; 11}', isCorrect: true },
          { id: 'opt2', text: '{1; 3; 5; 7; 9}', isCorrect: false },
          { id: 'opt3', text: '{3; 5; 7; 9; 11}', isCorrect: false },
          { id: 'opt4', text: '{2; 4; 6; 8; 10}', isCorrect: false }
        ],
        explanation: '{2; 3; 5; 7; 11} đều chỉ có 2 ước. Các tập khác có số 1 (không nguyên tố), số 9 (chia hết cho 3), hoặc các số chẵn 4, 6, 8 (hợp số).',
        funnyTip: 'Số 9 trông hiền lành thế thôi nhưng chia hết cho 3 nên là hợp số nhé!'
      }
    ]
  },

  // ================= CHAPTER 3 =================
  {
    id: 'lesson_6_integers',
    chapter: 3,
    chapterTitle: 'Chương 3: Số Nguyên',
    lessonNumber: 10,
    title: 'Số Nguyên Âm & Trục Số',
    subTitle: 'Nhiệt độ dưới 0°C, độ sâu đáy biển và tiền nợ căng tin!',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 58',
    rewardCoins: 110,
    rewardStars: 3,
    conceptSummary: [
      'Tập hợp số nguyên Z gồm: các số nguyên âm, số 0 và các số nguyên dương.',
      'Số nguyên âm biểu diễn nhiệt độ dưới 0°C, độ sâu dưới mực nước biển, số tiền nợ...',
      'Trên trục số nằm ngang: Số bên trái luôn nhỏ hơn số bên phải. Số âm càng xa số 0 thì càng nhỏ (-10 < -2).'
    ],
    questions: [
      {
        id: 'q6_1',
        questionText: 'Nhiệt độ ở Sa Pa lúc nửa đêm là 3 độ dưới 0°C. Ta dùng số nào để biểu diễn nhiệt độ này?',
        options: [
          { id: 'opt1', text: '-3°C', isCorrect: true },
          { id: 'opt2', text: '+3°C', isCorrect: false },
          { id: 'opt3', text: '0°C', isCorrect: false },
          { id: 'opt4', text: '-0.3°C', isCorrect: false }
        ],
        explanation: 'Dưới 0°C ta dùng số nguyên âm có dấu trừ đằng trước: -3°C.',
        funnyTip: 'Âm 3 độ C lạnh run răng, nhớ mặc áo hoodie Toán học vào cho ấm nhé!'
      },
      {
        id: 'q6_2',
        questionText: 'So sánh hai số nguyên âm: -15 và -8. Kết luận nào ĐÚNG?',
        options: [
          { id: 'opt1', text: '-15 < -8', isCorrect: true },
          { id: 'opt2', text: '-15 > -8', isCorrect: false },
          { id: 'opt3', text: '-15 = -8', isCorrect: false },
          { id: 'opt4', text: 'Không so sánh được số âm', isCorrect: false }
        ],
        explanation: 'Với hai số nguyên âm, số nào có khoảng cách tới 0 xa hơn thì số đó NHỎ HƠN: -15 < -8.',
        funnyTip: 'Nợ cô bán bánh tráng 15 nghìn thì "nghèo" hơn là chỉ nợ 8 nghìn, nên -15 < -8!'
      },
      {
        id: 'q6_3',
        questionText: 'Tính: (-12) + 20',
        options: [
          { id: 'opt1', text: '8', isCorrect: true },
          { id: 'opt2', text: '-8', isCorrect: false },
          { id: 'opt3', text: '-32', isCorrect: false },
          { id: 'opt4', text: '32', isCorrect: false }
        ],
        explanation: 'Cộng hai số nguyên khác dấu: Lấy số lớn trừ số bé (20 - 12 = 8), mang dấu của số có giá trị lớn hơn (+). Kết quả là +8.',
        funnyTip: 'Nợ 12k được mẹ cho 20k, trả nợ xong trong túi vẫn rủng rỉnh 8k ăn kem!'
      }
    ]
  },
  {
    id: 'lesson_7_integer_multiply',
    chapter: 3,
    chapterTitle: 'Chương 3: Số Nguyên',
    lessonNumber: 13,
    title: 'Phép Nhân Hai Số Nguyên',
    subTitle: 'Quy tắc dấu thần thánh: Âm nhân Âm hóa ra Dương!',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 70',
    rewardCoins: 120,
    rewardStars: 3,
    conceptSummary: [
      'Dương · Dương = Dương (+ · + = +)',
      'Âm · Âm = Dương (- · - = +)',
      'Khác dấu nhân nhau = Âm (+ · - = - hoặc - · + = -)'
    ],
    questions: [
      {
        id: 'q7_1',
        questionText: 'Tính: (-5) · (-8)',
        options: [
          { id: 'opt1', text: '40', isCorrect: true },
          { id: 'opt2', text: '-40', isCorrect: false },
          { id: 'opt3', text: '-13', isCorrect: false },
          { id: 'opt4', text: '13', isCorrect: false }
        ],
        explanation: 'Tích của hai số nguyên cùng dấu âm là một số nguyên dương: (-5) · (-8) = +(5 · 8) = 40.',
        funnyTip: 'Quy tắc thần thánh: Âm gặp Âm thì trừ trừ hóa cộng, vui như Tết!'
      },
      {
        id: 'q7_2',
        questionText: 'Tích của một số nguyên âm với một số nguyên dương luôn là:',
        options: [
          { id: 'opt1', text: 'Một số nguyên âm', isCorrect: true },
          { id: 'opt2', text: 'Một số nguyên dương', isCorrect: false },
          { id: 'opt3', text: 'Số 0', isCorrect: false },
          { id: 'opt4', text: 'Tùy vào số nào lớn hơn', isCorrect: false }
        ],
        explanation: 'Hai số nguyên trái dấu nhân với nhau luôn luôn cho ra kết quả mang dấu âm (-).',
        funnyTip: 'Khác dấu đánh nhau thì dấu Âm luôn chiếm ưu thế!'
      }
    ]
  },

  // ================= CHAPTER 4 =================
  {
    id: 'lesson_8_geometry_shapes',
    chapter: 4,
    chapterTitle: 'Chương 4: Một Số Hình Phẳng Trong Thực Tiễn',
    lessonNumber: 14,
    title: 'Tam Giác Đều, Hình Vuông & Lục Giác Đều',
    subTitle: 'Cạnh bằng nhau, góc bằng nhau - Tuyệt tác của tự nhiên',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 78',
    rewardCoins: 130,
    rewardStars: 3,
    conceptSummary: [
      'Tam giác đều: 3 cạnh bằng nhau, 3 góc bằng nhau và bằng 60°.',
      'Hình vuông: 4 cạnh bằng nhau, 4 góc vuông (90°), 2 đường chéo bằng nhau và vuông góc.',
      'Lục giác đều: Ghép từ 6 tam giác đều bằng nhau, 6 cạnh bằng nhau, 3 đường chéo chính bằng nhau.'
    ],
    questions: [
      {
        id: 'q8_1',
        questionText: 'Một tam giác đều có độ dài một cạnh là 6 cm. Chu vi của tam giác đều đó là:',
        visualType: 'geometry',
        visualData: { shape: 'equilateral_triangle', side: 6 },
        options: [
          { id: 'opt1', text: '18 cm', isCorrect: true },
          { id: 'opt2', text: '12 cm', isCorrect: false },
          { id: 'opt3', text: '36 cm', isCorrect: false },
          { id: 'opt4', text: '24 cm', isCorrect: false }
        ],
        explanation: 'Tam giác đều có 3 cạnh bằng nhau nên chu vi P = 3 · a = 3 · 6 = 18 cm.',
        funnyTip: '3 cạnh đều tăm tắp, chỉ việc nhân 3 là ra ngay chu vi!'
      },
      {
        id: 'q8_2',
        questionText: 'Tổ ong trong tự nhiên thường có cấu trúc dạng hình gì giúp tiết kiệm sáp và chịu lực tốt nhất?',
        options: [
          { id: 'opt1', text: 'Lục giác đều', isCorrect: true },
          { id: 'opt2', text: 'Hình tròn', isCorrect: false },
          { id: 'opt3', text: 'Hình chữ nhật', isCorrect: false },
          { id: 'opt4', text: 'Tam giác cân', isCorrect: false }
        ],
        explanation: 'Các chú ong là nhà toán học thiên tài! Tổ ong luôn được tạo bởi các lỗ hình lục giác đều hoàn hảo.',
        funnyTip: 'Ong cũng học Toán 6 chương 4 để xây tổ ong đấy các bạn ạ!'
      }
    ]
  },
  {
    id: 'lesson_9_quadrilaterals_area',
    chapter: 4,
    chapterTitle: 'Chương 4: Một Số Hình Phẳng Trong Thực Tiễn',
    lessonNumber: 16,
    title: 'Chu Vi & Diện Tích Hình Thoi, Hình Bình Hành, Hình Thang Cân',
    subTitle: 'Ứng dụng lát gạch sân trường và trang trí phòng học',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 88',
    rewardCoins: 140,
    rewardStars: 3,
    conceptSummary: [
      'Diện tích hình bình hành: S = a · h (đáy nhân chiều cao).',
      'Diện tích hình thoi: S = 1/2 · m · n (nửa tích hai đường chéo).',
      'Diện tích hình thang: S = 1/2 · (a + b) · h (đáy lớn đáy nhỏ ta đem cộng vào, nhân với chiều cao, chia đôi lấy nửa).'
    ],
    questions: [
      {
        id: 'q9_1',
        questionText: 'Một tấm bảng hình thoi trang trí lớp học có độ dài hai đường chéo là 8 dm và 6 dm. Diện tích tấm bảng là:',
        options: [
          { id: 'opt1', text: '24 dm²', isCorrect: true },
          { id: 'opt2', text: '48 dm²', isCorrect: false },
          { id: 'opt3', text: '14 dm²', isCorrect: false },
          { id: 'opt4', text: '28 dm²', isCorrect: false }
        ],
        explanation: 'Diện tích hình thoi bằng nửa tích hai đường chéo: S = (8 · 6) : 2 = 48 : 2 = 24 dm².',
        funnyTip: 'Đừng quên chia cho 2 nhé, quên chia đôi là diện tích to gấp đôi phòng học đấy!'
      },
      {
        id: 'q9_2',
        questionText: 'Sân bóng rổ trường em hình chữ nhật có chiều dài 28 m và chiều rộng 15 m. Chu vi sân bóng rổ là:',
        options: [
          { id: 'opt1', text: '86 m', isCorrect: true },
          { id: 'opt2', text: '420 m', isCorrect: false },
          { id: 'opt3', text: '43 m', isCorrect: false },
          { id: 'opt4', text: '100 m', isCorrect: false }
        ],
        explanation: 'Chu vi hình chữ nhật: P = (dài + rộng) · 2 = (28 + 15) · 2 = 43 · 2 = 86 m.',
        funnyTip: 'Chạy một vòng quanh sân bóng rổ là chạy đúng 86 mét, vừa rèn thể lực vừa nhớ công thức!'
      }
    ]
  },

  // ================= CHAPTER 5 =================
  {
    id: 'lesson_10_symmetry',
    chapter: 5,
    chapterTitle: 'Chương 5: Tính Đối Xứng Của Hình Phẳng',
    lessonNumber: 17,
    title: 'Hình Có Trục Đối Xứng & Tâm Đối Xứng',
    subTitle: 'Nét đẹp cân đối trong lá cờ Tổ quốc, cánh bướm và cỏ bốn lá',
    sgkPage: 'SGK Toán 6 Tập 1 - Trang 100',
    rewardCoins: 150,
    rewardStars: 3,
    conceptSummary: [
      'Trục đối xứng: Khi gấp hình theo một đường thẳng, hai nửa của hình trùng khít lên nhau.',
      'Tâm đối xứng: Khi quay hình một góc 180° quanh điểm O, hình mới trùng khít với hình ban đầu.',
      'Ví dụ: Chữ A, M, Y có trục đối xứng. Chữ N, S có tâm đối xứng. Chữ H, O vừa có trục vừa có tâm đối xứng!'
    ],
    questions: [
      {
        id: 'q10_1',
        questionText: 'Chữ cái in hoa nào sau đây CÓ TÂM ĐỐI XỨNG nhưng KHÔNG CÓ TRỤC ĐỐI XỨNG?',
        options: [
          { id: 'opt1', text: 'Chữ N', isCorrect: true },
          { id: 'opt2', text: 'Chữ A', isCorrect: false },
          { id: 'opt3', text: 'Chữ H', isCorrect: false },
          { id: 'opt4', text: 'Chữ M', isCorrect: false }
        ],
        explanation: 'Chữ N khi quay 180° quanh tâm vẫn thành chữ N (có tâm đối xứng). Nhưng gấp đôi chữ N theo bất kỳ đường nào cũng không trùng khít (không có trục đối xứng).',
        funnyTip: 'Chữ N quay đầu 180 độ lộn ngược vẫn là bạn N, không chạy đi đâu được!'
      },
      {
        id: 'q10_2',
        questionText: 'Ngôi sao 5 cánh trên Quốc kỳ Việt Nam có bao nhiêu trục đối xứng?',
        options: [
          { id: 'opt1', text: '5 trục đối xứng', isCorrect: true },
          { id: 'opt2', text: '1 trục đối xứng', isCorrect: false },
          { id: 'opt3', text: '10 trục đối xứng', isCorrect: false },
          { id: 'opt4', text: 'Không có trục đối xứng', isCorrect: false }
        ],
        explanation: 'Ngôi sao 5 cánh đều có 5 trục đối xứng, mỗi trục đi qua một đỉnh của ngôi sao và trung điểm cạnh đối diện.',
        funnyTip: '5 cánh sao vàng tươi sáng tương ứng với 5 trục đối xứng hoàn hảo của non sông!'
      }
    ]
  }
];
