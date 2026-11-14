import { GradeLevel, SchoolLevel, SubjectMeta } from '../types';

const PRIMARY_GRADE_SET = new Set<GradeLevel>(['1', '2', '3', '4', '5']);
const SECONDARY_GRADE_SET = new Set<GradeLevel>(['6', '7', '8', '9']);

export const SUBJECTS_CATALOG: SubjectMeta[] = [
  {
    id: 'math',
    dbCode: 'toan',
    name: 'Toán Học',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-600',
    description: 'Toán chuẩn SGK Kết nối tri thức từ Lớp 1 đến Lớp 9: mỗi chương một bài ôn luyện 15 câu.',
    status: 'active',
    tagline: 'Lớp 1 → 9 · 66 chương · 990 câu',
    schoolLevels: ['primary', 'secondary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · 27 chương · 405 câu',
        description: 'Đếm số, phép tính, phân số, số thập phân, hình học & chuyển động (Kết nối tri thức).',
        gradeRangeLabel: 'Lớp 1 – 5'
      },
      secondary: {
        tagline: 'Lớp 6 → 9 · 39 chương · 585 câu',
        description: 'Số học, đại số, hàm số, hình học phẳng & không gian (Kết nối tri thức).',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: true, term2Available: true, notes: '5 chương, 75 câu trộn mọi mức độ' },
      { grade: '2', term1Available: true, term2Available: true, notes: '5 chương, 75 câu trộn mọi mức độ' },
      { grade: '3', term1Available: true, term2Available: true, notes: '6 chương, 90 câu trộn mọi mức độ' },
      { grade: '4', term1Available: true, term2Available: true, notes: '5 chương, 75 câu trộn mọi mức độ' },
      { grade: '5', term1Available: true, term2Available: true, notes: '6 chương, 90 câu trộn mọi mức độ' },
      { grade: '6', term1Available: true, term2Available: true, notes: '9 chương, 135 câu trộn mọi mức độ' },
      { grade: '7', term1Available: true, term2Available: true, notes: '10 chương, 150 câu trộn mọi mức độ' },
      { grade: '8', term1Available: true, term2Available: true, notes: '10 chương, 150 câu trộn mọi mức độ' },
      { grade: '9', term1Available: true, term2Available: true, notes: '10 chương, 150 câu trộn mọi mức độ' }
    ]
  },
  {
    id: 'science',
    dbCode: 'khtn',
    name: 'Khoa Học Tự Nhiên',
    iconName: 'Atom',
    color: 'from-emerald-500 to-teal-600',
    description: 'Tích hợp Vật lí, Hóa học & Sinh học theo chương trình GDPT 2018 THCS.',
    status: 'active',
    tagline: 'Lớp 6 → 9 · 45 chương · 675 câu',
    schoolLevels: ['secondary'],
    levelMeta: {
      secondary: {
        tagline: 'Lớp 6 → 9 · 45 chương · 675 câu',
        description: 'Tích hợp Vật lí, Hóa học, Sinh học theo bộ SGK Kết nối tri thức.',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '6', term1Available: true, term2Available: true, notes: '10 chương, 150 câu (Kết nối tri thức)' },
      { grade: '7', term1Available: true, term2Available: true, notes: '11 chương, 165 câu (Kết nối tri thức)' },
      { grade: '8', term1Available: true, term2Available: true, notes: '9 chương, 135 câu (Kết nối tri thức)' },
      { grade: '9', term1Available: true, term2Available: true, notes: '15 chương, 225 câu (Kết nối tri thức)' }
    ]
  },
  {
    id: 'vietnamese',
    dbCode: 'tiengviet',
    name: 'Tiếng Việt',
    iconName: 'BookOpenText',
    color: 'from-rose-500 to-pink-600',
    description: 'Đọc hiểu, luyện từ và câu, chính tả và tập làm văn chuẩn SGK Tập 1 & Tập 2.',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 5 · Tập 1 & 2',
    schoolLevels: ['primary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · Tập 1 & 2',
        description: 'Đọc hiểu, từ vựng, câu văn và chính tả theo bộ SGK NXB Giáo Dục.',
        gradeRangeLabel: 'Lớp 1 – 5'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Đang chuẩn bị bộ câu hỏi Tiếng Việt 1' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Đang chuẩn bị bộ câu hỏi Tiếng Việt 2' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Đang chuẩn bị bộ câu hỏi Tiếng Việt 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Đang chuẩn bị bộ câu hỏi Tiếng Việt 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Đang chuẩn bị bộ câu hỏi Tiếng Việt 5' }
    ]
  },
  {
    id: 'nature_society',
    dbCode: 'tnxh',
    name: 'Tự Nhiên và Xã Hội',
    iconName: 'Leaf',
    color: 'from-lime-500 to-emerald-600',
    description: 'Gia đình, trường học, cộng đồng, thực vật, động vật và Trái Đất quanh em (Lớp 1–3).',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 3 · Môn Tiểu học',
    schoolLevels: ['primary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 3 · Sắp mở',
        description: 'Khám phá gia đình, trường học, thiên nhiên & sức khỏe cho Lớp 1, 2, 3.',
        gradeRangeLabel: 'Lớp 1 – 3'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Môn bắt buộc Lớp 1–3' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Môn bắt buộc Lớp 1–3' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Môn bắt buộc Lớp 1–3' }
    ]
  },
  {
    id: 'primary_science',
    dbCode: 'khoahoc',
    name: 'Khoa Học',
    iconName: 'FlaskConical',
    color: 'from-teal-500 to-cyan-600',
    description: 'Chất, năng lượng, thực vật – động vật, con người, sức khỏe và môi trường (Lớp 4–5).',
    status: 'coming_soon',
    tagline: 'Lớp 4 → 5 · Môn Tiểu học',
    schoolLevels: ['primary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 4 → 5 · Sắp mở',
        description: 'Thí nghiệm vui về chất, ánh sáng, âm thanh, sinh vật và sức khỏe Lớp 4–5.',
        gradeRangeLabel: 'Lớp 4 – 5'
      }
    },
    availableGrades: [
      { grade: '4', term1Available: false, term2Available: false, notes: 'Phát triển từ Tự nhiên và Xã hội ở Lớp 4–5' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Chuẩn bị kiến thức nền lên KHTN Lớp 6' }
    ]
  },
  {
    id: 'literature',
    dbCode: 'nguvan',
    name: 'Ngữ Văn',
    iconName: 'BookMarked',
    color: 'from-rose-500 to-pink-600',
    description: 'Thơ ca, truyện ngắn, nghị luận văn học, thực hành tiếng Việt và viết đoạn văn.',
    status: 'coming_soon',
    tagline: 'Lớp 6 → 9 · Tập 1 & 2',
    schoolLevels: ['secondary'],
    levelMeta: {
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Thơ ca, truyện ngắn, nghị luận văn học và thực hành tiếng Việt THCS.',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'Đang biên soạn câu hỏi Ngữ văn 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'english',
    dbCode: 'tienganh',
    name: 'Tiếng Anh',
    iconName: 'Languages',
    color: 'from-amber-500 to-orange-600',
    description: 'Từ vựng, ngữ pháp, hội thoại (Global Success & Ngoại ngữ tự chọn từ Lớp 1–9).',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 9 · Sắp mở',
    schoolLevels: ['primary', 'secondary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · Sắp mở',
        description: 'Phonics, từ vựng và mẫu câu giao tiếp thiếu nhi (Global Success 1–5).',
        gradeRangeLabel: 'Lớp 1 – 5'
      },
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Vocabulary, Grammar quiz và giao tiếp tiếng Anh THCS (Global Success 6–9).',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Tiếng Anh 1 (Global Success)' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Tiếng Anh 2 (Global Success)' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Tiếng Anh 3 (môn bắt buộc từ Lớp 3)' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Tiếng Anh 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Tiếng Anh 5' },
      { grade: '6', term1Available: false, term2Available: false, notes: 'Tiếng Anh 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Tiếng Anh 7' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Tiếng Anh 8' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Tiếng Anh 9' }
    ]
  },
  {
    id: 'history_geo',
    dbCode: 'lsdl',
    name: 'Lịch Sử và Địa Lí',
    iconName: 'Compass',
    color: 'from-cyan-600 to-blue-700',
    description: 'Khám phá bản đồ Việt Nam, vùng miền, các triều đại lịch sử và văn minh nhân loại.',
    status: 'coming_soon',
    tagline: 'Lớp 4 → 9 · Sắp mở',
    schoolLevels: ['primary', 'secondary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 4 → 5 · Sắp mở',
        description: 'Lịch sử dựng nước, giữ nước và địa lí các vùng miền Việt Nam (Lớp 4–5).',
        gradeRangeLabel: 'Lớp 4 – 5'
      },
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Lịch sử Việt Nam, thế giới cổ – cận – hiện đại và địa lí tự nhiên – kinh tế.',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '4', term1Available: false, term2Available: false, notes: 'Bắt đầu từ Lớp 4 ở Tiểu học' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Lịch sử và Địa lí 5' },
      { grade: '6', term1Available: false, term2Available: false, notes: 'Lịch sử và Địa lí 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'informatics',
    dbCode: 'tinhoc',
    name: 'Tin Học',
    iconName: 'Cpu',
    color: 'from-violet-600 to-purple-700',
    description: 'Làm quen máy tính, lập trình kéo thả Scratch, tư duy thuật toán & an toàn số.',
    status: 'coming_soon',
    tagline: 'Lớp 3 → 9 · Sắp mở',
    schoolLevels: ['primary', 'secondary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 3 → 5 · Sắp mở',
        description: 'Làm quen máy tính, an toàn Internet và lập trình kéo thả cơ bản (Lớp 3–5).',
        gradeRangeLabel: 'Lớp 3 – 5'
      },
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Tư duy thuật toán, lập trình Scratch/Python và sáng tạo nội dung số.',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '3', term1Available: false, term2Available: false, notes: 'Môn bắt buộc từ Lớp 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Tin học 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Tin học 5' },
      { grade: '6', term1Available: false, term2Available: false, notes: 'Tin học 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'technology',
    dbCode: 'congnghe',
    name: 'Công Nghệ',
    iconName: 'Wrench',
    color: 'from-yellow-600 to-amber-700',
    description: 'Thủ công kĩ thuật, công nghệ đời sống, lắp ghép mô hình & định hướng nghề nghiệp.',
    status: 'coming_soon',
    tagline: 'Lớp 3 → 9 · Sắp mở',
    schoolLevels: ['primary', 'secondary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 3 → 5 · Sắp mở',
        description: 'Sử dụng đồ dùng công nghệ gia đình, lắp ghép mô hình & trồng hoa cây cảnh (Lớp 3–5).',
        gradeRangeLabel: 'Lớp 3 – 5'
      },
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Công nghệ đời sống, trồng trọt – chăn nuôi, điện kỹ thuật & mô đun nghề nghiệp.',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '3', term1Available: false, term2Available: false, notes: 'Môn bắt buộc từ Lớp 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Công nghệ 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Công nghệ 5' },
      { grade: '6', term1Available: false, term2Available: false, notes: 'Công nghệ 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'ethics',
    dbCode: 'daoduc',
    name: 'Đạo Đức',
    iconName: 'HeartHandshake',
    color: 'from-pink-500 to-rose-600',
    description: 'Lễ phép, yêu thương gia đình, trung thực, đoàn kết và bảo vệ môi trường (Lớp 1–5).',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 5 · Sắp mở',
    schoolLevels: ['primary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · Sắp mở',
        description: 'Tình huống đạo đức học đường, lễ phép, trung thực và trách nhiệm (Lớp 1–5).',
        gradeRangeLabel: 'Lớp 1 – 5'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Đạo đức 1' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Đạo đức 2' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Đạo đức 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Đạo đức 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Đạo đức 5' }
    ]
  },
  {
    id: 'life_skills',
    dbCode: 'lssong',
    name: 'Giáo Dục Lối Sống',
    iconName: 'Sun',
    color: 'from-amber-400 to-yellow-600',
    description: 'Rèn thói quen sinh hoạt văn minh, an toàn giao thông và ứng xử đẹp (NXBGD Lớp 1–5).',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 5 · Sắp mở',
    schoolLevels: ['primary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · Sắp mở',
        description: 'Kĩ năng tự phục vụ, an toàn và nếp sống văn minh hàng ngày (chuẩn NXBGD).',
        gradeRangeLabel: 'Lớp 1 – 5'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Giáo dục lối sống 1' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Giáo dục lối sống 2' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Giáo dục lối sống 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Giáo dục lối sống 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Giáo dục lối sống 5' }
    ]
  },
  {
    id: 'civic_edu',
    dbCode: 'gdcd',
    name: 'Giáo Dục Công Dân',
    iconName: 'Shield',
    color: 'from-red-500 to-rose-600',
    description: 'Xử lý tình huống đạo đức học đường, pháp luật và kỹ năng sống văn minh.',
    status: 'coming_soon',
    tagline: 'Lớp 6 → 9 · Sắp mở',
    schoolLevels: ['secondary'],
    levelMeta: {
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Tình huống công dân, pháp luật, quyền trẻ em và kỹ năng sống THCS.',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'GDCD 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'music',
    dbCode: 'amnhac',
    name: 'Âm Nhạc',
    iconName: 'Music',
    color: 'from-fuchsia-500 to-purple-600',
    description: 'Cảm thụ tiết tấu, đọc nhạc, nhạc cụ dân tộc và các bài hát thiếu nhi – học đường.',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 9 · Sắp mở',
    schoolLevels: ['primary', 'secondary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · Sắp mở',
        description: 'Hát, đọc nhạc nốt cơ bản, nhịp phách và nhạc cụ gõ thiếu nhi (Lớp 1–5).',
        gradeRangeLabel: 'Lớp 1 – 5'
      },
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Nhạc lí, thưởng thức âm nhạc dân gian – thế giới và hợp xướng (Lớp 6–9).',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Âm nhạc 1' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Âm nhạc 2' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Âm nhạc 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Âm nhạc 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Âm nhạc 5' },
      { grade: '6', term1Available: false, term2Available: false, notes: 'Âm nhạc 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Âm nhạc 7' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Âm nhạc 8' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Âm nhạc 9' }
    ]
  },
  {
    id: 'art',
    dbCode: 'mithuat',
    name: 'Mĩ Thuật',
    iconName: 'Palette',
    color: 'from-orange-500 to-red-500',
    description: 'Màu sắc, bố cục tạo hình, vẽ tranh sáng tạo và thưởng thức di sản mĩ thuật.',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 9 · Sắp mở',
    schoolLevels: ['primary', 'secondary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · Sắp mở',
        description: 'Chấm nét, hình khối, pha màu cơ bản và sáng tạo thủ công (Lớp 1–5).',
        gradeRangeLabel: 'Lớp 1 – 5'
      },
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Mĩ thuật tạo hình, thiết kế đồ họa – thời trang và lịch sử mĩ thuật (Lớp 6–9).',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Mĩ thuật 1' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Mĩ thuật 2' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Mĩ thuật 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Mĩ thuật 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Mĩ thuật 5' },
      { grade: '6', term1Available: false, term2Available: false, notes: 'Mĩ thuật 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Mĩ thuật 7' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Mĩ thuật 8' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Mĩ thuật 9' }
    ]
  },
  {
    id: 'pe',
    dbCode: 'gdtc',
    name: 'Giáo Dục Thể Chất',
    iconName: 'Dumbbell',
    color: 'from-sky-500 to-blue-600',
    description: 'Kiến thức rèn luyện thể lực, tư thế vận động, thể thao tự chọn và dinh dưỡng.',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 9 · Sắp mở',
    schoolLevels: ['primary', 'secondary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · Sắp mở',
        description: 'Đội hình đội ngũ, bài tập thể dục buổi sáng và trò chơi vận động (Lớp 1–5).',
        gradeRangeLabel: 'Lớp 1 – 5'
      },
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Điền kinh, thể dục nhịp điệu, bóng đá, cầu lông và an toàn tập luyện (Lớp 6–9).',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 1' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 2' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 5' },
      { grade: '6', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 7' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 8' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Giáo dục thể chất 9' }
    ]
  },
  {
    id: 'experience',
    dbCode: 'hdtn',
    name: 'Hoạt Động Trải Nghiệm',
    iconName: 'Sparkles',
    color: 'from-emerald-500 to-green-600',
    description: 'Khám phá bản thân, giao lưu tập thể, bảo vệ môi trường & hoạt động cộng đồng (Lớp 1–5).',
    status: 'coming_soon',
    tagline: 'Lớp 1 → 5 · Sắp mở',
    schoolLevels: ['primary'],
    levelMeta: {
      primary: {
        tagline: 'Lớp 1 → 5 · Sắp mở',
        description: 'Tự lập, kết bạn, bảo vệ thiên nhiên và truyền thống quê hương (Lớp 1–5).',
        gradeRangeLabel: 'Lớp 1 – 5'
      }
    },
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Hoạt động trải nghiệm 1' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Hoạt động trải nghiệm 2' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Hoạt động trải nghiệm 3' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Hoạt động trải nghiệm 4' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Hoạt động trải nghiệm 5' }
    ]
  },
  {
    id: 'career_experience',
    dbCode: 'hdtn_hn',
    name: 'HĐ Trải Nghiệm, Hướng Nghiệp',
    iconName: 'Sparkles',
    color: 'from-indigo-500 to-violet-600',
    description: 'Phát triển bản thân, trách nhiệm cộng đồng và khám phá nghề nghiệp tương lai (Lớp 6–9).',
    status: 'coming_soon',
    tagline: 'Lớp 6 → 9 · Sắp mở',
    schoolLevels: ['secondary'],
    levelMeta: {
      secondary: {
        tagline: 'Lớp 6 → 9 · Sắp mở',
        description: 'Kỹ năng học tập, quản lý tài chính nhỏ và định hướng nghề nghiệp THCS.',
        gradeRangeLabel: 'Lớp 6 – 9'
      }
    },
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'HĐTN, HN 6' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'HĐTN, HN 7' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'HĐTN, HN 8' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'HĐTN, HN 9' }
    ]
  }
];

export const SUBJECT_DB_CODES: Record<string, string> = Object.fromEntries(
  SUBJECTS_CATALOG.map((s) => [s.id, s.dbCode])
);

export function getSubjectsForLevel(level: SchoolLevel): SubjectMeta[] {
  return SUBJECTS_CATALOG
    .filter((s) => s.schoolLevels.includes(level))
    .sort((a, b) => Number(b.status === 'active') - Number(a.status === 'active'));
}

export function getGradesForSubject(subj: SubjectMeta, level?: SchoolLevel) {
  if (!level) return subj.availableGrades;
  const set = level === 'primary' ? PRIMARY_GRADE_SET : SECONDARY_GRADE_SET;
  return subj.availableGrades.filter((g) => set.has(g.grade));
}

export function getSubjectLevelInfo(subj: SubjectMeta, level: SchoolLevel) {
  const override = subj.levelMeta?.[level];
  const grades = getGradesForSubject(subj, level);
  const first = grades[0]?.grade;
  const last = grades[grades.length - 1]?.grade;
  const fallbackRange = first && last ? (first === last ? `Lớp ${first}` : `Lớp ${first} → ${last}`) : '';
  return {
    tagline: override?.tagline ?? subj.tagline ?? fallbackRange,
    description: override?.description ?? subj.description,
    gradeRangeLabel: override?.gradeRangeLabel ?? fallbackRange
  };
}
