import { SubjectMeta } from '../types';

export const SUBJECTS_CATALOG: SubjectMeta[] = [
  {
    id: 'math',
    name: 'Toán Học',
    iconName: 'Calculator',
    color: 'from-blue-600 to-indigo-600',
    description: 'Chương trình chuẩn SGK từ Tiểu học (Lớp 1-5) đến THCS (Lớp 6-9). Đầy đủ Tập 1 & Tập 2.',
    status: 'active',
    availableGrades: [
      { grade: '1', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '2', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '3', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '4', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '5', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '6', term1Available: true, term2Available: true, notes: 'Đầy đủ Tập 1 (5 chương) & Tập 2 (Chương 6-9)' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'literature',
    name: 'Ngữ Văn',
    iconName: 'BookMarked',
    color: 'from-rose-500 to-pink-600',
    description: 'Thơ ca, truyện ngắn, nghị luận văn học, thực hành tiếng Việt và viết đoạn văn.',
    status: 'coming_soon',
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'Đang biên soạn câu hỏi hài hước' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'science',
    name: 'Khoa Học Tự Nhiên',
    iconName: 'Atom',
    color: 'from-emerald-500 to-teal-600',
    description: 'Khám phá thế giới vật lý, phản ứng hóa học kỳ thú và thế giới sinh học diệu kỳ.',
    status: 'coming_soon',
    availableGrades: [
      { grade: '6', term1Available: true, term2Available: true, notes: '10 chương, 150 câu (Kết nối tri thức, đã được chủ dự án duyệt) – dùng chung cho cả 2 học kỳ' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'english',
    name: 'Tiếng Anh',
    iconName: 'Languages',
    color: 'from-amber-500 to-orange-600',
    description: 'Vocabulary, Grammar quiz, Nghe phát âm và đố vui hội thoại trường học.',
    status: 'coming_soon',
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'Đang thu âm audio vui nhộn' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'history_geo',
    name: 'Lịch Sử & Địa Lý',
    iconName: 'Compass',
    color: 'from-cyan-600 to-blue-700',
    description: 'Khám phá nền văn minh cổ đại, các triều đại lịch sử Việt Nam và bản đồ thế giới.',
    status: 'coming_soon',
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'Đang tạo bản đồ tương tác' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'informatics',
    name: 'Tin Học',
    iconName: 'Cpu',
    color: 'from-violet-600 to-purple-700',
    description: 'Lập trình Scratch, tư duy thuật toán, an toàn Internet và sáng tạo số.',
    status: 'coming_soon',
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'Đang hoàn thiện mini-game thuật toán' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'civic_edu',
    name: 'Giáo Dục Công Dân',
    iconName: 'Shield',
    color: 'from-red-500 to-rose-600',
    description: 'Xử lý tình huống đạo đức học đường, pháp luật và kỹ năng sống văn minh.',
    status: 'coming_soon',
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  },
  {
    id: 'technology',
    name: 'Công Nghệ',
    iconName: 'Wrench',
    color: 'from-yellow-600 to-amber-700',
    description: 'Công nghệ đời sống, mô hình nhà thông minh và dinh dưỡng học đường.',
    status: 'coming_soon',
    availableGrades: [
      { grade: '6', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '7', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '8', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' },
      { grade: '9', term1Available: false, term2Available: false, notes: 'Sắp ra mắt' }
    ]
  }
];
