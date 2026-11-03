import { MathLesson, GradeLevel } from '../types';

export const OTHER_GRADES_MATH_LESSONS: Record<GradeLevel, MathLesson[]> = {
  // ================= TOÁN LỚP 1 (TIỂU HỌC) =================
  '1': [
    {
      id: 'p1_lesson_1',
      chapter: 1,
      chapterTitle: 'Chương 1: Các Số Từ 0 Đến 10 & Hình Phẳng',
      lessonNumber: 1,
      title: 'Đếm Số & So Sánh Nhiều Hơn - Ít Hơn',
      subTitle: 'Nhận biết số lượng 1, 2, 3, 4, 5 và dấu lớn (>), bé (<), bằng (=)',
      sgkPage: 'SGK Toán 1 Tập 1 - Trang 8',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Đếm xuôi từ 1 đến 10: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.',
        'Dấu > (lớn hơn), dấu < (bé hơn), dấu = (bằng nhau).'
      ],
      questions: [
        {
          id: 'p1_q1',
          difficulty: 'easy',
          questionText: 'Có 3 quả táo đỏ 🍎🍎🍎 và 5 quả chuối vàng 🍌🍌🍌🍌🍌. Khẳng định nào ĐÚNG?',
          options: [
            { id: 'opt1', text: 'Số táo ít hơn số chuối (3 < 5)', isCorrect: true },
            { id: 'opt2', text: 'Số táo nhiều hơn số chuối (3 > 5)', isCorrect: false },
            { id: 'opt3', text: 'Số táo bằng số chuối (3 = 5)', isCorrect: false },
            { id: 'opt4', text: 'Có 10 quả táo', isCorrect: false }
          ],
          explanation: '3 bé hơn 5 nên số táo ít hơn số chuối. Viết là: 3 < 5.',
          funnyTip: 'Miệng cá sấu há to về phía số lớn hơn để ăn nhiều chuối hơn!'
        },
        {
          id: 'p1_q2',
          difficulty: 'easy',
          questionText: 'Tính: 4 + 3 = ?',
          options: [
            { id: 'opt1', text: '7', isCorrect: true },
            { id: 'opt2', text: '6', isCorrect: false },
            { id: 'opt3', text: '8', isCorrect: false },
            { id: 'opt4', text: '9', isCorrect: false }
          ],
          explanation: 'Xòe 4 ngón tay, thêm 3 ngón tay nữa ta đếm được 7 ngón tay.',
          funnyTip: 'Đếm ngón tay ngón chân là bí kíp gia truyền của các bạn lớp 1!'
        }
      ]
    },
    {
      id: 'p1_lesson_2',
      chapter: 2,
      chapterTitle: 'Chương 2: Các Số Đến 100 & Phép Tính',
      lessonNumber: 2,
      title: 'Các Số Tròn Chục & Phép Cộng Trừ Đơn Giản',
      subTitle: 'Đếm 10, 20, 30... 100 và cộng trừ số tròn chục',
      sgkPage: 'SGK Toán 1 Tập 2 - Trang 40',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Các số tròn chục: 10, 20, 30, 40, 50, 60, 70, 80, 90.',
        'Khi cộng số tròn chục, ta cộng chữ số hàng chục và giữ nguyên chữ số 0 ở sau.'
      ],
      questions: [
        {
          id: 'p1_q3',
          difficulty: 'easy',
          questionText: 'Tính: 30 + 20 = ?',
          options: [
            { id: 'opt1', text: '50', isCorrect: true },
            { id: 'opt2', text: '40', isCorrect: false },
            { id: 'opt3', text: '60', isCorrect: false },
            { id: 'opt4', text: '500', isCorrect: false }
          ],
          explanation: '3 chục cộng 2 chục bằng 5 chục, tức là 50.',
          funnyTip: '3 que kem cộng 2 que kem thành 5 que kem mát lạnh!'
        }
      ]
    }
  ],

  // ================= TOÁN LỚP 2 (TIỂU HỌC) =================
  '2': [
    {
      id: 'p2_lesson_1',
      chapter: 1,
      chapterTitle: 'Chương 1: Phép Cộng Trừ Có Nhớ & Đo Lường',
      lessonNumber: 1,
      title: 'Phép Cộng (Có Nhớ) Trong Phạm Vi 100',
      subTitle: 'Kỹ thuật đặt tính rồi tính và bảng nhân 2, nhân 5',
      sgkPage: 'SGK Toán 2 Tập 1 - Trang 15',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Đặt tính thẳng cột: hàng đơn vị thẳng hàng đơn vị, hàng chục thẳng hàng chục.',
        'Cộng từ phải sang trái: nếu tổng lớn hơn 9 thì viết số đơn vị và nhớ 1 sang hàng chục.'
      ],
      questions: [
        {
          id: 'p2_q1',
          difficulty: 'medium',
          questionText: 'Tính nhẩm: 38 + 25 = ?',
          options: [
            { id: 'opt1', text: '63', isCorrect: true },
            { id: 'opt2', text: '53', isCorrect: false },
            { id: 'opt3', text: '65', isCorrect: false },
            { id: 'opt4', text: '58', isCorrect: false }
          ],
          explanation: '8 + 5 = 13 (viết 3 nhớ 1). 3 + 2 = 5, thêm 1 bằng 6. Kết quả là 63.',
          funnyTip: 'Nhớ 1 đừng để quên trong túi áo kẻo mẹ đem đi giặt mất nhé!'
        },
        {
          id: 'p2_q2',
          difficulty: 'easy',
          questionText: 'Theo bảng nhân 5: 5 × 6 bằng bao nhiêu?',
          options: [
            { id: 'opt1', text: '30', isCorrect: true },
            { id: 'opt2', text: '25', isCorrect: false },
            { id: 'opt3', text: '35', isCorrect: false },
            { id: 'opt4', text: '40', isCorrect: false }
          ],
          explanation: '5 × 6 = 30.',
          funnyTip: 'Năm sáu ba mươi, vừa tính vừa cười vui vẻ!'
        }
      ]
    },
    {
      id: 'p2_lesson_2',
      chapter: 2,
      chapterTitle: 'Chương 2: Bảng Nhân Chia 2 và 5 & Khối Hình',
      lessonNumber: 2,
      title: 'Khối Trụ, Khối Cầu & Xem Đồng Hồ',
      subTitle: 'Nhận biết hình khối thực tế và xem giờ đúng, giờ rưỡi',
      sgkPage: 'SGK Toán 2 Tập 2 - Trang 28',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Lon sữa có dạng khối trụ, quả bóng có dạng khối cầu.',
        'Kim ngắn chỉ giờ, kim dài chỉ phút. Kim dài chỉ số 6 là 30 phút (giờ rưỡi).'
      ],
      questions: [
        {
          id: 'p2_q3',
          difficulty: 'easy',
          questionText: 'Đồ vật nào sau đây có dạng khối cầu theo chuẩn SGK?',
          options: [
            { id: 'opt1', text: 'Quả bóng đá', isCorrect: true },
            { id: 'opt2', text: 'Hộp sữa tươi giấy', isCorrect: false },
            { id: 'opt3', text: 'Hộp phấn viết bảng', isCorrect: false },
            { id: 'opt4', text: 'Thước kẻ', isCorrect: false }
          ],
          explanation: 'Quả bóng đá tròn xoe lăn được về mọi phía là khối cầu.',
          funnyTip: 'Khối cầu đá một phát lăn tít vào lưới!'
        }
      ]
    }
  ],

  // ================= TOÁN LỚP 3 (TIỂU HỌC) =================
  '3': [
    {
      id: 'p3_lesson_1',
      chapter: 1,
      chapterTitle: 'Chương 1: Bảng Nhân Chia & Chu Vi - Diện Tích',
      lessonNumber: 1,
      title: 'Chu Vi Hình Chữ Nhật & Hình Vuông',
      subTitle: 'Công thức tính chu vi và giải toán có lời văn',
      sgkPage: 'SGK Toán 3 Tập 1 - Trang 42',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Chu vi hình chữ nhật = (chiều dài + chiều rộng) × 2 (cùng đơn vị đo).',
        'Chu vi hình vuông = độ dài một cạnh × 4.'
      ],
      questions: [
        {
          id: 'p3_q1',
          difficulty: 'medium',
          questionText: 'Một sân trường hình chữ nhật có chiều dài 20 m, chiều rộng 10 m. Chu vi sân trường là:',
          options: [
            { id: 'opt1', text: '60 m', isCorrect: true },
            { id: 'opt2', text: '30 m', isCorrect: false },
            { id: 'opt3', text: '200 m', isCorrect: false },
            { id: 'opt4', text: '40 m', isCorrect: false }
          ],
          explanation: 'Chu vi = (20 + 10) × 2 = 30 × 2 = 60 m.',
          funnyTip: 'Chạy một vòng quanh sân hết đúng 60 mét mồ hôi nhễ nhại nhưng khỏe người!'
        }
      ]
    },
    {
      id: 'p3_lesson_2',
      chapter: 2,
      chapterTitle: 'Chương 2: Diện Tích & Số Có Bốn Chữ Số',
      lessonNumber: 2,
      title: 'Diện Tích Hình Chữ Nhật & Đơn Vị cm²',
      subTitle: 'Diện tích = chiều dài × chiều rộng (cùng đơn vị)',
      sgkPage: 'SGK Toán 3 Tập 2 - Trang 65',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Diện tích hình chữ nhật bằng chiều dài nhân với chiều rộng.',
        'Đơn vị đo diện tích là xăng-ti-mét vuông (cm²).'
      ],
      questions: [
        {
          id: 'p3_q2',
          difficulty: 'medium',
          questionText: 'Tấm bìa hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm. Diện tích tấm bìa là:',
          options: [
            { id: 'opt1', text: '40 cm²', isCorrect: true },
            { id: 'opt2', text: '26 cm²', isCorrect: false },
            { id: 'opt3', text: '13 cm²', isCorrect: false },
            { id: 'opt4', text: '80 cm²', isCorrect: false }
          ],
          explanation: 'Diện tích = 8 × 5 = 40 cm².',
          funnyTip: 'Dài nhân rộng là ra diện tích lát gạch thẳng băng!'
        }
      ]
    }
  ],

  // ================= TOÁN LỚP 4 (TIỂU HỌC) =================
  '4': [
    {
      id: 'p4_lesson_1',
      chapter: 1,
      chapterTitle: 'Chương 1: Số Tự Nhiên & Dấu Hiệu Chia Hết',
      lessonNumber: 1,
      title: 'Dấu Hiệu Chia Hết Cho 2, 5, 9, 3 & Phân Số Cơ Bản',
      subTitle: 'Rút gọn phân số và quy đồng mẫu số ở bậc tiểu học',
      sgkPage: 'SGK Toán 4 Tập 2 - Trang 105',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Số chia hết cho 2 có tận cùng là chữ số chẵn (0, 2, 4, 6, 8).',
        'Số chia hết cho 5 có tận cùng là 0 hoặc 5.',
        'Số chia hết cho 9 có tổng các chữ số chia hết cho 9.'
      ],
      questions: [
        {
          id: 'p4_q1',
          difficulty: 'medium',
          questionText: 'Trong các số sau: 234; 155; 480; 781. Số nào vừa chia hết cho 2 vừa chia hết cho 5?',
          options: [
            { id: 'opt1', text: '480', isCorrect: true },
            { id: 'opt2', text: '234', isCorrect: false },
            { id: 'opt3', text: '155', isCorrect: false },
            { id: 'opt4', text: '781', isCorrect: false }
          ],
          explanation: 'Số vừa chia hết cho 2 vừa chia hết cho 5 phải có chữ số tận cùng là 0. Do đó 480 là số chính xác.',
          funnyTip: 'Tận cùng là số 0 tròn xoe là chìa khóa mở cả hai cánh cửa 2 và 5!'
        }
      ]
    },
    {
      id: 'p4_lesson_2',
      chapter: 2,
      chapterTitle: 'Chương 2: Phân Số & Các Phép Tính Phân Số',
      lessonNumber: 2,
      title: 'Cộng Trừ Hai Phân Số Cùng Mẫu Số',
      subTitle: 'Muốn cộng hai phân số cùng mẫu, ta cộng hai tử số và giữ nguyên mẫu số',
      sgkPage: 'SGK Toán 4 Tập 2 - Trang 120',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Muốn cộng (hoặc trừ) hai phân số cùng mẫu số: lấy tử cộng (hoặc trừ) tử, giữ nguyên mẫu số.'
      ],
      questions: [
        {
          id: 'p4_q2',
          difficulty: 'easy',
          questionText: 'Tính: 3/7 + 2/7 = ?',
          options: [
            { id: 'opt1', text: '5 / 7', isCorrect: true },
            { id: 'opt2', text: '5 / 14', isCorrect: false },
            { id: 'opt3', text: '6 / 7', isCorrect: false },
            { id: 'opt4', text: '1 / 7', isCorrect: false }
          ],
          explanation: 'Cùng mẫu 7: (3 + 2) / 7 = 5 / 7.',
          funnyTip: 'Giữ nguyên mẫu số, chỉ cộng hai anh tử số trên tầng thôi!'
        }
      ]
    }
  ],

  // ================= TOÁN LỚP 5 (TIỂU HỌC) =================
  '5': [
    {
      id: 'p5_lesson_1',
      chapter: 1,
      chapterTitle: 'Chương 1: Phân Số & Số Thập Phân & Toán Chuyển Động',
      lessonNumber: 1,
      title: 'Toán Chuyển Động Đều: Vận Tốc, Quãng Đường, Thời Gian',
      subTitle: 'Công thức s = v × t, v = s : t, t = s : v',
      sgkPage: 'SGK Toán 5 Tập 2 - Trang 138',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Vận tốc v = s : t (đơn vị: km/giờ hoặc m/phút).',
        'Quãng đường s = v × t.',
        'Thời gian t = s : v.'
      ],
      questions: [
        {
          id: 'p5_q1',
          difficulty: 'medium',
          questionText: 'Một bạn đi xe đạp với vận tốc 12 km/giờ trong 2,5 giờ. Quãng đường bạn đó đi được là:',
          options: [
            { id: 'opt1', text: '30 km', isCorrect: true },
            { id: 'opt2', text: '25 km', isCorrect: false },
            { id: 'opt3', text: '28 km', isCorrect: false },
            { id: 'opt4', text: '32 km', isCorrect: false }
          ],
          explanation: 'Quãng đường s = v × t = 12 × 2,5 = 30 km.',
          funnyTip: 'Đạp 30 km tha hồ ngắm cảnh phố phường và rèn luyện cơ bắp!'
        }
      ]
    },
    {
      id: 'p5_lesson_2',
      chapter: 2,
      chapterTitle: 'Chương 2: Hình Thang, Hình Tròn & Tỉ Số Phần Trăm',
      lessonNumber: 2,
      title: 'Diện Tích Hình Thang & Diện Tích Hình Tròn',
      subTitle: 'Hình thang: (đáy lớn + đáy nhỏ) × chiều cao : 2',
      sgkPage: 'SGK Toán 5 Tập 2 - Trang 93',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Diện tích hình thang = (a + b) × h : 2.',
        'Diện tích hình tròn = r × r × 3,14.'
      ],
      questions: [
        {
          id: 'p5_q2',
          difficulty: 'medium',
          questionText: 'Hình tròn có bán kính r = 3 cm. Diện tích của hình tròn là:',
          options: [
            { id: 'opt1', text: '28,26 cm²', isCorrect: true },
            { id: 'opt2', text: '18,84 cm²', isCorrect: false },
            { id: 'opt3', text: '9,42 cm²', isCorrect: false },
            { id: 'opt4', text: '27 cm²', isCorrect: false }
          ],
          explanation: 'S = r × r × 3,14 = 3 × 3 × 3,14 = 9 × 3,14 = 28,26 cm².',
          funnyTip: 'Bán kính nhân bán kính rồi nhân ba phẩy mười bốn là xong tròn vo!'
        }
      ]
    }
  ],

  // Lớp 6 được quản lý riêng qua `MATH_LESSONS` (Tập 1) và `MATH_6_TERM_2_LESSONS` (Tập 2)
  '6': [],

  // ================= TOÁN LỚP 7 (THCS) =================
  '7': [
    {
      id: 'g7_lesson_1',
      chapter: 1,
      chapterTitle: 'Chương 1: Số Hữu Tỉ & Số Thực',
      lessonNumber: 1,
      title: 'Tập Hợp Các Số Hữu Tỉ (Q)',
      subTitle: 'Khái niệm số hữu tỉ, biểu diễn trên trục số và số đối',
      sgkPage: 'SGK Toán 7 Tập 1 - Trang 6',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Số hữu tỉ là số viết được dưới dạng phân số a/b với a, b ∈ Z, b ≠ 0. Ký hiệu tập hợp là Q.',
        'Mỗi số hữu tỉ được biểu diễn bởi một điểm trên trục số.',
        'Hai số hữu tỉ có điểm biểu diễn cách đều gốc O và nằm về hai phía gọi là hai số đối nhau.'
      ],
      questions: [
        {
          id: 'g7_q1',
          difficulty: 'easy',
          questionText: 'Khẳng định nào sau đây là SAI về số hữu tỉ theo SGK?',
          options: [
            { id: 'opt1', text: 'Số 0 không phải là số hữu tỉ', isCorrect: true },
            { id: 'opt2', text: 'Mọi số nguyên đều là số hữu tỉ', isCorrect: false },
            { id: 'opt3', text: 'Số -0,75 là một số hữu tỉ', isCorrect: false },
            { id: 'opt4', text: 'Phân số 2/3 là một số hữu tỉ', isCorrect: false }
          ],
          explanation: 'Số 0 viết được dưới dạng 0/1 nên số 0 LÀ số hữu tỉ. Khẳng định "Số 0 không phải là số hữu tỉ" là SAI.',
          funnyTip: 'Số 0 tuy tròn trĩnh giản dị nhưng cũng là thành viên VIP của hội số hữu tỉ Q!'
        },
        {
          id: 'g7_q2',
          difficulty: 'easy',
          questionText: 'Số đối của số hữu tỉ -3/5 là:',
          options: [
            { id: 'opt1', text: '3/5', isCorrect: true },
            { id: 'opt2', text: '-5/3', isCorrect: false },
            { id: 'opt3', text: '5/3', isCorrect: false },
            { id: 'opt4', text: '-3/5', isCorrect: false }
          ],
          explanation: 'Số đối của -x là x. Số đối của -3/5 là 3/5.',
          funnyTip: 'Số đối như soi gương: bên âm nhìn vào gương thấy bên dương mỉm cười!'
        }
      ]
    },
    {
      id: 'g7_lesson_2',
      chapter: 2,
      chapterTitle: 'Chương 2: Góc & Hai Đường Thẳng Song Song',
      lessonNumber: 2,
      title: 'Hai Góc Đối Đỉnh & So Le Trong',
      subTitle: 'Hai góc đối đỉnh thì bằng nhau',
      sgkPage: 'SGK Toán 7 Tập 1 - Trang 70',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Hai góc đối đỉnh là hai góc mà mỗi cạnh của góc này là tia đối của một cạnh của góc kia.',
        'Tính chất quan trọng: Hai góc đối đỉnh thì bằng nhau.'
      ],
      questions: [
        {
          id: 'g7_q3',
          difficulty: 'medium',
          questionText: 'Hai đường thẳng cắt nhau tạo thành 4 góc. Biết một góc bằng 50°, góc đối đỉnh với nó có số đo là:',
          options: [
            { id: 'opt1', text: '50°', isCorrect: true },
            { id: 'opt2', text: '130°', isCorrect: false },
            { id: 'opt3', text: '180°', isCorrect: false },
            { id: 'opt4', text: '40°', isCorrect: false }
          ],
          explanation: 'Vì hai góc đối đỉnh thì bằng nhau nên số đo góc đó cũng bằng 50°.',
          funnyTip: 'Đối đỉnh như hai anh em sinh đôi nhìn nhau qua gương, bằng nhau chằn chặn!'
        }
      ]
    }
  ],

  // ================= TOÁN LỚP 8 (THCS) =================
  '8': [
    {
      id: 'g8_lesson_1',
      chapter: 1,
      chapterTitle: 'Chương 1: Đa Thức & Hằng Đẳng Thức Đáng Nhớ',
      lessonNumber: 1,
      title: '7 Hằng Đẳng Thức Đáng Nhớ',
      subTitle: '(A+B)², (A-B)², A²-B² và ứng dụng biến đổi đại số',
      sgkPage: 'SGK Toán 8 Tập 1 - Trang 18',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        '(A + B)² = A² + 2AB + B²',
        '(A - B)² = A² - 2AB + B²',
        'A² - B² = (A - B)(A + B)'
      ],
      questions: [
        {
          id: 'g8_q1',
          difficulty: 'medium',
          questionText: 'Khai triển hằng đẳng thức (x + 3)² ta được:',
          options: [
            { id: 'opt1', text: 'x² + 6x + 9', isCorrect: true },
            { id: 'opt2', text: 'x² + 9', isCorrect: false },
            { id: 'opt3', text: 'x² + 3x + 9', isCorrect: false },
            { id: 'opt4', text: 'x² + 6x + 6', isCorrect: false }
          ],
          explanation: '(x + 3)² = x² + 2·x·3 + 3² = x² + 6x + 9. Nhớ không được bỏ quên hạng tử 2AB ở giữa!',
          funnyTip: 'Đừng quên 2AB ở giữa kẻo hằng đẳng thức "khóc thét" vì bị bớt xén đấy nhé!'
        },
        {
          id: 'g8_q2',
          difficulty: 'hard',
          questionText: 'Tính nhanh giá trị của 101² - 99² = ?',
          options: [
            { id: 'opt1', text: '400', isCorrect: true },
            { id: 'opt2', text: '200', isCorrect: false },
            { id: 'opt3', text: '1000', isCorrect: false },
            { id: 'opt4', text: '4', isCorrect: false }
          ],
          explanation: 'Áp dụng hiệu hai bình phương: A² - B² = (A - B)(A + B) = (101 - 99)(101 + 99) = 2 · 200 = 400. Cực nhanh!',
          funnyTip: 'Dùng hằng đẳng thức nhẩm 2 giây là ra 400, không cần bấm máy tính!'
        }
      ]
    },
    {
      id: 'g8_lesson_2',
      chapter: 2,
      chapterTitle: 'Chương 2: Định Lí Thalès & Tam Giác Đồng Dạng',
      lessonNumber: 2,
      title: 'Định Lí Thalès Trong Tam Giác',
      subTitle: 'Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ',
      sgkPage: 'SGK Toán 8 Tập 2 - Trang 52',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Tam giác ABC, MN // BC => AM/AB = AN/AC = MN/BC.'
      ],
      questions: [
        {
          id: 'g8_q3',
          difficulty: 'hard',
          questionText: 'Cho tam giác ABC, điểm M thuộc AB, N thuộc AC sao cho MN // BC. Biết AM = 2 cm, MB = 4 cm, AN = 3 cm. Độ dài đoạn NC là:',
          options: [
            { id: 'opt1', text: '6 cm', isCorrect: true },
            { id: 'opt2', text: '4 cm', isCorrect: false },
            { id: 'opt3', text: '5 cm', isCorrect: false },
            { id: 'opt4', text: '8 cm', isCorrect: false }
          ],
          explanation: 'Theo định lí Thalès: AM / MB = AN / NC => 2 / 4 = 3 / NC => NC = (4 × 3) / 2 = 6 cm.',
          funnyTip: 'Tỉ lệ tương ứng: dưới gấp đôi trên thì bên kia dưới cũng gấp đôi trên!'
        }
      ]
    }
  ],

  // ================= TOÁN LỚP 9 (THCS) =================
  '9': [
    {
      id: 'g9_lesson_1',
      chapter: 1,
      chapterTitle: 'Chương 1: Phương Trình & Hệ Phương Trình Bậc Nhất Hai Ẩn',
      lessonNumber: 1,
      title: 'Hệ Hai Phương Trình Bậc Nhất Hai Ẩn & Phương Pháp Giải',
      subTitle: 'Phương pháp cộng đại số & phương pháp thế',
      sgkPage: 'SGK Toán 9 Tập 1 - Trang 8',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Hệ phương trình bậc nhất hai ẩn có dạng: { a x + b y = c ; a\' x + b\' y = c\' }.',
        'Giải bằng phương pháp thế hoặc cộng đại số.'
      ],
      questions: [
        {
          id: 'g9_q1',
          difficulty: 'medium',
          questionText: 'Cho hệ phương trình: { x + y = 10 ; x - y = 4 }. Nghiệm (x; y) của hệ là:',
          options: [
            { id: 'opt1', text: '(7; 3)', isCorrect: true },
            { id: 'opt2', text: '(6; 4)', isCorrect: false },
            { id: 'opt3', text: '(8; 2)', isCorrect: false },
            { id: 'opt4', text: '(5; 5)', isCorrect: false }
          ],
          explanation: 'Cộng từng vế: 2x = 14 => x = 7. Thế vào tìm y = 10 - 7 = 3. Vậy nghiệm là (7; 3).',
          funnyTip: 'Cộng đại số triệt tiêu y trong một nốt nhạc, x hiện ra ngon lành cành đào!'
        },
        {
          id: 'g9_q2',
          difficulty: 'hard',
          questionText: 'Điều kiện xác định của căn thức bậc hai √(2x - 6) là:',
          options: [
            { id: 'opt1', text: 'x ≥ 3', isCorrect: true },
            { id: 'opt2', text: 'x > 3', isCorrect: false },
            { id: 'opt3', text: 'x ≤ 3', isCorrect: false },
            { id: 'opt4', text: 'x ≥ 6', isCorrect: false }
          ],
          explanation: 'Căn thức √A có nghĩa khi A ≥ 0. Ta có 2x - 6 ≥ 0 <=> 2x ≥ 6 <=> x ≥ 3.',
          funnyTip: 'Dưới mái nhà căn bậc hai thì biểu thức không được phép âm!'
        }
      ]
    },
    {
      id: 'g9_lesson_2',
      chapter: 2,
      chapterTitle: 'Chương 2: Phương Trình Bậc Hai & Định Lí Vi-ét',
      lessonNumber: 2,
      title: 'Phương Trình Bậc Hai Một Ẩn ax² + bx + c = 0',
      subTitle: 'Biệt thức Delta = b² - 4ac và định lí Vi-ét x1 + x2 = -b/a, x1·x2 = c/a',
      sgkPage: 'SGK Toán 9 Tập 2 - Trang 45',
      rewardCoins: 2,
      rewardStars: 1,
      conceptSummary: [
        'Phương trình ax² + bx + c = 0 (a ≠ 0).',
        'Δ = b² - 4ac. Nếu Δ > 0: phương trình có 2 nghiệm phân biệt.',
        'Hệ thức Vi-ét: x1 + x2 = -b/a và x1 · x2 = c/a.'
      ],
      questions: [
        {
          id: 'g9_q3',
          difficulty: 'hard',
          questionText: 'Cho phương trình x² - 5x + 6 = 0. Theo hệ thức Vi-ét, tổng hai nghiệm (x1 + x2) bằng:',
          options: [
            { id: 'opt1', text: '5', isCorrect: true },
            { id: 'opt2', text: '-5', isCorrect: false },
            { id: 'opt3', text: '6', isCorrect: false },
            { id: 'opt4', text: '-6', isCorrect: false }
          ],
          explanation: 'Theo Vi-ét: S = x1 + x2 = -b / a = -(-5) / 1 = 5.',
          funnyTip: 'Tổng hai nghiệm là trừ b trên a, âm gặp âm thành dương rực rỡ!'
        }
      ]
    }
  ]
};
