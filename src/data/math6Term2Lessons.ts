import { MathLesson } from '../types';

export const MATH_6_TERM_2_LESSONS: MathLesson[] = [
  // ================= CHƯƠNG 6: PHÂN SỐ =================
  {
    id: 'lesson_6_1_fraction_concept',
    chapter: 6,
    chapterTitle: 'Chương 6: Phân Số',
    lessonNumber: 11,
    title: 'Khái Niệm & Tính Chất Cơ Bản Của Phân Số',
    subTitle: 'Mở rộng phân số a/b với a, b ∈ Z, b ≠ 0 & phân số bằng nhau',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 6',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Phân số là biểu thức có dạng a/b trong đó a, b là các số nguyên và mẫu b phải khác 0.',
      'Hai phân số a/b = c/d khi và chỉ khi tích chéo a · d = b · c.',
      'Tính chất cơ bản: Nhân hoặc chia cả tử và mẫu với cùng một số nguyên khác 0 ta được phân số bằng phân số đã cho.'
    ],
    questions: [
      {
        id: 'q6_1_1',
        questionText: 'Trong các cách viết sau, cách viết nào cho ta một phân số theo đúng định nghĩa SGK Toán 6 Tập 2?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '-3 / 7', isCorrect: true },
          { id: 'opt2', text: '4.5 / 9', isCorrect: false },
          { id: 'opt3', text: '8 / 0', isCorrect: false },
          { id: 'opt4', text: '√5 / 3', isCorrect: false }
        ],
        explanation: '-3/7 có tử là -3 (thuộc Z) và mẫu là 7 (thuộc Z, khác 0), hoàn toàn chuẩn định nghĩa phân số!',
        funnyTip: 'Mẫu số bằng 0 là "vùng cấm địa", không máy tính nào trên đời chịu tính đâu nhé!'
      },
      {
        id: 'q6_1_2',
        questionText: 'Cặp phân số nào sau đây bằng nhau theo quy tắc nhân chéo a · d = b · c?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '-2/3 và 6/-9', isCorrect: true },
          { id: 'opt2', text: '1/2 và 2/3', isCorrect: false },
          { id: 'opt3', text: '-3/4 và 3/4', isCorrect: false },
          { id: 'opt4', text: '5/7 và 7/5', isCorrect: false }
        ],
        explanation: 'Ta có (-2) · (-9) = 18 và 3 · 6 = 18. Vì (-2) · (-9) = 3 · 6 nên -2/3 = 6/-9.',
        funnyTip: 'Nhân chéo hai bên bằng nhau giống như hai hiệp sĩ so kiếm cân sức vậy!'
      },
      {
        id: 'q6_1_3',
        questionText: 'Rút gọn phân số 18 / (-24) về phân số tối giản với mẫu dương ta được:',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '-3 / 4', isCorrect: true },
          { id: 'opt2', text: '3 / -4', isCorrect: false },
          { id: 'opt3', text: '-9 / 12', isCorrect: false },
          { id: 'opt4', text: '9 / -12', isCorrect: false }
        ],
        explanation: 'Chia cả tử và mẫu cho ƯCLN(18, 24) = 6 ta được 3/-4, chuyển dấu trừ lên tử số được -3/4.',
        funnyTip: 'Luôn đẩy dấu trừ lên tử số để phân số trông lịch sự và chuẩn SGK bạn nhé!'
      }
    ]
  },
  {
    id: 'lesson_6_2_fraction_operations',
    chapter: 6,
    chapterTitle: 'Chương 6: Phân Số',
    lessonNumber: 12,
    title: 'So Sánh & Các Phép Tính Cộng, Trừ, Nhân, Chia Phân Số',
    subTitle: 'Quy đồng mẫu số, quy tắc dấu và hỗn số dương',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 14',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Muốn cộng hoặc trừ hai phân số không cùng mẫu, ta quy đồng mẫu số rồi cộng hoặc trừ tử, giữ nguyên mẫu.',
      'Muốn nhân hai phân số, ta nhân tử với tử và mẫu với mẫu: (a/b) · (c/d) = (a·c)/(b·d).',
      'Muốn chia một phân số cho một phân số khác 0, ta nhân số bị chia với phân số nghịch đảo của số chia.'
    ],
    questions: [
      {
        id: 'q6_2_1',
        questionText: 'Tính kết quả của phép cộng: (-2 / 5) + (3 / 5) = ?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '1 / 5', isCorrect: true },
          { id: 'opt2', text: '-1 / 5', isCorrect: false },
          { id: 'opt3', text: '5 / 5', isCorrect: false },
          { id: 'opt4', text: '-5 / 5', isCorrect: false }
        ],
        explanation: 'Cùng mẫu số 5, ta lấy tử cộng tử: (-2) + 3 = 1. Giữ nguyên mẫu được 1/5.',
        funnyTip: 'Nợ 2 nghìn mẹ cho 3 nghìn, trả nợ xong còn dư hẳn 1 nghìn ăn kem!'
      },
      {
        id: 'q6_2_2',
        questionText: 'Tính: (3 / 4) · (-8 / 9) = ? (chọn phân số tối giản)',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '-2 / 3', isCorrect: true },
          { id: 'opt2', text: '-24 / 36', isCorrect: false },
          { id: 'opt3', text: '2 / 3', isCorrect: false },
          { id: 'opt4', text: '-1 / 2', isCorrect: false }
        ],
        explanation: '(3 · (-8)) / (4 · 9) = -24 / 36. Rút gọn chia cả tử và mẫu cho 12 ta được -2/3.',
        funnyTip: 'Rút gọn chéo trước khi nhân sẽ giúp bạn không phải còng lưng tính số to!'
      },
      {
        id: 'q6_2_3',
        questionText: 'Phân số nghịch đảo của phân số -5 / 7 là:',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '-7 / 5', isCorrect: true },
          { id: 'opt2', text: '5 / 7', isCorrect: false },
          { id: 'opt3', text: '7 / 5', isCorrect: false },
          { id: 'opt4', text: '-5 / -7', isCorrect: false }
        ],
        explanation: 'Phân số nghịch đảo của a/b (a, b ≠ 0) là b/a. Do đó nghịch đảo của -5/7 là 7/(-5) hay -7/5.',
        funnyTip: 'Nghịch đảo giống như trồng cây chuối, tử lộn xuống mẫu và mẫu trèo lên tử!'
      }
    ]
  },
  {
    id: 'lesson_6_3_fraction_word_problems',
    chapter: 6,
    chapterTitle: 'Chương 6: Phân Số',
    lessonNumber: 13,
    title: 'Hai Bài Toán Về Phân Số',
    subTitle: 'Tìm giá trị phân số của một số & Tìm một số biết giá trị phân số',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 23',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Bài toán 1: Muốn tìm m/n của số b cho trước, ta tính: b · (m/n).',
      'Bài toán 2: Muốn tìm một số biết m/n của nó bằng a, ta tính: a : (m/n).'
    ],
    questions: [
      {
        id: 'q6_3_1',
        questionText: 'Một lớp 6A có 40 học sinh, trong đó 3/5 số học sinh là học sinh giỏi. Hỏi lớp 6A có bao nhiêu học sinh giỏi?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '24 học sinh', isCorrect: true },
          { id: 'opt2', text: '20 học sinh', isCorrect: false },
          { id: 'opt3', text: '18 học sinh', isCorrect: false },
          { id: 'opt4', text: '30 học sinh', isCorrect: false }
        ],
        explanation: 'Số học sinh giỏi là: 40 · (3/5) = (40 · 3) / 5 = 120 / 5 = 24 học sinh.',
        funnyTip: '24 học sinh giỏi tha hồ gánh team kéo rank học tập của lớp lên đỉnh!'
      },
      {
        id: 'q6_3_2',
        questionText: 'Tìm một số biết rằng 2/3 của số đó bằng 18?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '27', isCorrect: true },
          { id: 'opt2', text: '12', isCorrect: false },
          { id: 'opt3', text: '36', isCorrect: false },
          { id: 'opt4', text: '24', isCorrect: false }
        ],
        explanation: 'Số cần tìm là: 18 : (2/3) = 18 · (3/2) = 27.',
        funnyTip: 'Nhớ kỹ: Tìm một số biết phân số của nó thì làm phép CHIA, đừng nhầm sang nhân nhé!'
      }
    ]
  },

  // ================= CHƯƠNG 7: SỐ THẬP PHÂN =================
  {
    id: 'lesson_7_1_decimal_numbers',
    chapter: 7,
    chapterTitle: 'Chương 7: Số Thập Phân',
    lessonNumber: 14,
    title: 'Số Thập Phân & Các Phép Tính Với Số Thập Phân',
    subTitle: 'Số thập phân âm, so sánh và quy tắc cộng trừ nhân chia',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 30',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Phân số thập phân là phân số có mẫu là lũy thừa của 10. Số thập phân gồm phần nguyên và phần thập phân.',
      'Số thập phân âm có dấu "-" đằng trước, ví dụ: -2,5; -0,125.',
      'Khi nhân hai số thập phân cùng dấu ta được kết quả dương, khác dấu ta được kết quả âm.'
    ],
    questions: [
      {
        id: 'q7_1_1',
        questionText: 'Phân số thập phân -37 / 100 được viết dưới dạng số thập phân là:',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '-0,37', isCorrect: true },
          { id: 'opt2', text: '-3,7', isCorrect: false },
          { id: 'opt3', text: '-0,037', isCorrect: false },
          { id: 'opt4', text: '0,37', isCorrect: false }
        ],
        explanation: 'Mẫu 100 có hai chữ số 0 nên sau dấu phẩy có 2 chữ số: -37/100 = -0,37.',
        funnyTip: 'Dấu phẩy dịch sang trái bao nhiêu bước tùy thuộc mẫu có bao nhiêu số 0!'
      },
      {
        id: 'q7_1_2',
        questionText: 'Tính: (-1,2) · (-0,5) = ?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '0,6', isCorrect: true },
          { id: 'opt2', text: '-0,6', isCorrect: false },
          { id: 'opt3', text: '6,0', isCorrect: false },
          { id: 'opt4', text: '-6,0', isCorrect: false }
        ],
        explanation: 'Âm nhân âm ra dương: 1,2 · 0,5 = 0,6.',
        funnyTip: 'Hai người bạn cùng "âm" tính gặp nhau sinh ra năng lượng "dương" tích cực!'
      }
    ]
  },
  {
    id: 'lesson_7_2_percentage_rounding',
    chapter: 7,
    chapterTitle: 'Chương 7: Số Thập Phân',
    lessonNumber: 15,
    title: 'Làm Tròn Số & Tỉ Số Phần Trăm (%)',
    subTitle: 'Quy tắc làm tròn số và ứng dụng tính phần trăm thực tế',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 40',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Quy tắc làm tròn: Nếu chữ số đầu tiên bỏ đi nhỏ hơn 5 thì giữ nguyên, nếu từ 5 trở lên thì cộng thêm 1 vào chữ số ngay trước.',
      'Tỉ số phần trăm của a và b là: (a / b) · 100%.'
    ],
    questions: [
      {
        id: 'q7_2_1',
        questionText: 'Làm tròn số 4,785 đến hàng phần mười (chữ số thập phân thứ nhất) ta được:',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '4,8', isCorrect: true },
          { id: 'opt2', text: '4,7', isCorrect: false },
          { id: 'opt3', text: '4,79', isCorrect: false },
          { id: 'opt4', text: '5,0', isCorrect: false }
        ],
        explanation: 'Chữ số ngay sau hàng phần mười là chữ số 8 (lớn hơn hoặc bằng 5), nên ta tăng chữ số hàng phần mười thêm 1 đơn vị: 4,7 -> 4,8.',
        funnyTip: 'Số 8 mập mạp đẩy số 7 tăng thêm 1 bậc thành số 4,8 xinh tươi!'
      },
      {
        id: 'q7_2_2',
        questionText: 'Một chiếc áo khoác thể thao có giá gốc 200.000đ, cửa hàng giảm giá 20%. Số tiền được giảm là bao nhiêu?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '40.000 đồng', isCorrect: true },
          { id: 'opt2', text: '20.000 đồng', isCorrect: false },
          { id: 'opt3', text: '50.000 đồng', isCorrect: false },
          { id: 'opt4', text: '160.000 đồng', isCorrect: false }
        ],
        explanation: 'Số tiền được giảm là: 200.000 · 20% = 200.000 · (20 / 100) = 40.000 đồng.',
        funnyTip: 'Tiết kiệm được hẳn 40.000đ để nạp Xu vào Studio của tôi mua đồ xịn!'
      }
    ]
  },

  // ================= CHƯƠNG 8: NHỮNG HÌNH HÌNH HỌC CƠ BẢN =================
  {
    id: 'lesson_8_1_point_line_segment',
    chapter: 8,
    chapterTitle: 'Chương 8: Những Hình Hình Học Cơ Bản',
    lessonNumber: 16,
    title: 'Điểm, Đường Thẳng, Tia & Đoạn Thẳng',
    subTitle: 'Trung điểm của đoạn thẳng và vị trí tương đối giữa các đường thẳng',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 50',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Điểm được đặt tên bằng chữ cái in hoa (A, B, C...). Đường thẳng đặt tên bằng chữ cái thường (a, b, m...) hoặc hai điểm đi qua (AB).',
      'Hai đường thẳng phân biệt có thể cắt nhau (có 1 điểm chung) hoặc song song (không có điểm chung nào).',
      'Trung điểm M của đoạn thẳng AB là điểm nằm giữa A, B và cách đều hai đầu mút: MA = MB = AB / 2.'
    ],
    questions: [
      {
        id: 'q8_1_1',
        questionText: 'Cho đoạn thẳng AB dài 8 cm. Điểm M là trung điểm của đoạn thẳng AB. Độ dài đoạn thẳng AM là:',
        visualType: 'geometry',
        options: [
          { id: 'opt1', text: '4 cm', isCorrect: true },
          { id: 'opt2', text: '8 cm', isCorrect: false },
          { id: 'opt3', text: '2 cm', isCorrect: false },
          { id: 'opt4', text: '16 cm', isCorrect: false }
        ],
        explanation: 'Vì M là trung điểm của AB nên AM = MB = AB : 2 = 8 : 2 = 4 cm.',
        funnyTip: 'Trung điểm là trọng tài đứng chính giữa, chia đều bánh cho 2 bên không thiên vị ai!'
      },
      {
        id: 'q8_1_2',
        questionText: 'Hai đường thẳng song song là hai đường thẳng:',
        visualType: 'none',
        options: [
          { id: 'opt1', text: 'Không có điểm chung nào', isCorrect: true },
          { id: 'opt2', text: 'Có đúng 1 điểm chung', isCorrect: false },
          { id: 'opt3', text: 'Có vô số điểm chung', isCorrect: false },
          { id: 'opt4', text: 'Vuông góc với nhau', isCorrect: false }
        ],
        explanation: 'Theo định nghĩa SGK, hai đường thẳng song song là hai đường thẳng không có bất kỳ điểm chung nào.',
        funnyTip: 'Hai đường ray xe lửa song song đi mãi bên nhau mà không bao giờ va vào nhau!'
      }
    ]
  },
  {
    id: 'lesson_8_2_angles',
    chapter: 8,
    chapterTitle: 'Chương 8: Những Hình Hình Học Cơ Bản',
    lessonNumber: 17,
    title: 'Góc & Số Đo Góc',
    subTitle: 'Góc nhọn, góc vuông, góc tù, góc bẹt và cách đo bằng thước đo độ',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 62',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Góc là hình tạo bởi hai tia chung gốc. Gốc chung gọi là đỉnh, hai tia là hai cạnh của góc.',
      'Góc vuông có số đo bằng 90°. Góc nhọn nhỏ hơn 90°. Góc tù lớn hơn 90° và nhỏ hơn 180°. Góc bẹt bằng 180°.'
    ],
    questions: [
      {
        id: 'q8_2_1',
        questionText: 'Một góc có số đo bằng 125° được gọi là:',
        visualType: 'none',
        options: [
          { id: 'opt1', text: 'Góc tù', isCorrect: true },
          { id: 'opt2', text: 'Góc nhọn', isCorrect: false },
          { id: 'opt3', text: 'Góc vuông', isCorrect: false },
          { id: 'opt4', text: 'Góc bẹt', isCorrect: false }
        ],
        explanation: 'Vì 90° < 125° < 180° nên góc có số đo 125° là góc tù.',
        funnyTip: 'Góc tù há miệng to hơn 90 độ nhưng chưa kịp bẹt thành một đường thẳng!'
      },
      {
        id: 'q8_2_2',
        questionText: 'Khi đồng hồ chỉ đúng 6 giờ đúng, kim giờ và kim phút tạo thành một góc bằng bao nhiêu độ?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '180° (Góc bẹt)', isCorrect: true },
          { id: 'opt2', text: '90° (Góc vuông)', isCorrect: false },
          { id: 'opt3', text: '120° (Góc tù)', isCorrect: false },
          { id: 'opt4', text: '60° (Góc nhọn)', isCorrect: false }
        ],
        explanation: 'Lúc 6 giờ, kim phút chỉ số 12 và kim giờ chỉ số 6, tạo thành một đường thẳng tức là góc bẹt có số đo 180°.',
        funnyTip: '6 giờ tối là góc bẹt, vừa vặn thẳng hàng để gấp sách đi ăn cơm tối!'
      }
    ]
  },

  // ================= CHƯƠNG 9: DỮ LIỆU & XÁC SUẤT THỰC NGHIỆM =================
  {
    id: 'lesson_9_1_data_and_charts',
    chapter: 9,
    chapterTitle: 'Chương 9: Dữ Liệu & Xác Suất Thực Nghiệm',
    lessonNumber: 18,
    title: 'Thu Thập Dữ Liệu & Đọc Biểu Đồ',
    subTitle: 'Bảng thống kê, biểu đồ tranh, biểu đồ cột & biểu đồ cột kép',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 74',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Dữ liệu gồm số liệu hoặc thông tin không phải số (văn bản, hình ảnh, phân loại).',
      'Biểu đồ tranh dùng biểu tượng hình vẽ đại diện cho số lượng đồ vật.',
      'Biểu đồ cột dùng chiều cao của các cột hình chữ nhật để so sánh các đại lượng.'
    ],
    questions: [
      {
        id: 'q9_1_1',
        questionText: 'Trong một biểu đồ tranh, mỗi biểu tượng 🌟 đại diện cho 5 ngôi sao danh dự. Nếu tổ 1 có 4 biểu tượng 🌟 thì tổ 1 có bao nhiêu ngôi sao?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '20 ngôi sao', isCorrect: true },
          { id: 'opt2', text: '4 ngôi sao', isCorrect: false },
          { id: 'opt3', text: '9 ngôi sao', isCorrect: false },
          { id: 'opt4', text: '25 ngôi sao', isCorrect: false }
        ],
        explanation: 'Mỗi 🌟 = 5 sao, có 4 hình thì tổng cộng là: 4 · 5 = 20 ngôi sao.',
        funnyTip: 'Nhìn biểu đồ tranh nhớ xem bảng chú thích kẻo đếm nhầm 4 hình thành 4 cái nhé!'
      },
      {
        id: 'q9_1_2',
        questionText: 'Dãy dữ liệu nào sau đây là dữ liệu SỐ LIỆU (định lượng)?',
        visualType: 'none',
        options: [
          { id: 'opt1', text: 'Chiều cao các bạn trong lớp (145 cm, 150 cm, 152 cm)', isCorrect: true },
          { id: 'opt2', text: 'Màu sắc yêu thích (Xanh, Đỏ, Vàng)', isCorrect: false },
          { id: 'opt3', text: 'Học lực (Tốt, Khá, Đạt)', isCorrect: false },
          { id: 'opt4', text: 'Tên các môn học (Toán, Văn, Anh)', isCorrect: false }
        ],
        explanation: 'Chiều cao đo bằng các con số cụ thể kèm đơn vị cm nên là dữ liệu số liệu.',
        funnyTip: 'Con số cụ thể cân đo đong đếm được thì là dữ liệu số liệu!'
      }
    ]
  },
  {
    id: 'lesson_9_2_experimental_probability',
    chapter: 9,
    chapterTitle: 'Chương 9: Dữ Liệu & Xác Suất Thực Nghiệm',
    lessonNumber: 19,
    title: 'Xác Suất Thực Nghiệm',
    subTitle: 'Trò chơi tung đồng xu, gieo xúc xắc & tính xác suất xuất hiện',
    sgkPage: 'SGK Toán 6 Tập 2 - Trang 88',
    rewardCoins: 2,
    rewardStars: 1,
    conceptSummary: [
      'Xác suất thực nghiệm xuất hiện mặt A khi tung đồng xu nhiều lần = (Số lần mặt A xuất hiện) / (Tổng số lần tung).',
      'Khi số lần thực nghiệm càng lớn, xác suất thực nghiệm càng gần với xác suất lý thuyết (50% cho đồng xu đồng chất).'
    ],
    questions: [
      {
        id: 'q9_2_1',
        questionText: 'Bạn An tung một đồng xu 20 lần và quan sát thấy mặt Sấp xuất hiện 12 lần. Xác suất thực nghiệm xuất hiện mặt Sấp là:',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '12 / 20 = 3 / 5 (hay 60%)', isCorrect: true },
          { id: 'opt2', text: '8 / 20 = 2 / 5 (hay 40%)', isCorrect: false },
          { id: 'opt3', text: '12 / 8', isCorrect: false },
          { id: 'opt4', text: '1 / 2 (hay 50%)', isCorrect: false }
        ],
        explanation: 'Xác suất thực nghiệm = Số lần xuất hiện mặt Sấp / Tổng số lần tung = 12/20 = 3/5 = 60%.',
        funnyTip: 'An có "bàn tay vàng" hay sao mà tung ra mặt Sấp nhiều thế nhỉ!'
      },
      {
        id: 'q9_2_2',
        questionText: 'Gieo một con xúc xắc 6 mặt cân đối 30 lần, thấy mặt 6 chấm xuất hiện 5 lần. Xác suất thực nghiệm xuất hiện mặt 6 chấm là:',
        visualType: 'none',
        options: [
          { id: 'opt1', text: '5 / 30 = 1 / 6', isCorrect: true },
          { id: 'opt2', text: '6 / 30 = 1 / 5', isCorrect: false },
          { id: 'opt3', text: '5 / 6', isCorrect: false },
          { id: 'opt4', text: '1 / 30', isCorrect: false }
        ],
        explanation: 'Xác suất thực nghiệm = 5 : 30 = 1/6.',
        funnyTip: 'Đúng chuẩn tỉ lệ vàng của xúc xắc may mắn luôn, 1/6 chuẩn không cần chỉnh!'
      }
    ]
  }
];
