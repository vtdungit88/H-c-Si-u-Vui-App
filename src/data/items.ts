import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // --- TRANG PHỤC (OUTFITS) ---
  {
    id: 'outfit_uniform',
    name: 'Đồng Phục Khăn Quàng Đỏ',
    category: 'outfit',
    costCoins: 0,
    costStars: 0,
    description: 'Áo sơ mi trắng tinh khôi, thắt khăn quàng đỏ tươi thắm. Chuẩn tác phong Đội viên gương mẫu!',
    rarity: 'base',
    iconName: 'Shirt',
    tagline: 'Học sinh chăm ngoan',
    renderType: 'uniform'
  },
  {
    id: 'outfit_sport',
    name: 'Áo Thể Dục Năng Động 3 Sọc',
    category: 'outfit',
    costCoins: 80,
    costStars: 0,
    description: 'Thoáng mát, co giãn cực tốt để chạy bền 100m hay nhảy dây giờ giải lao.',
    rarity: 'popular',
    iconName: 'Shirt',
    tagline: 'Khỏe để học tốt',
    renderType: 'sport'
  },
  {
    id: 'outfit_hoodie',
    name: 'Hoodie Biệt Đội Số Học',
    category: 'outfit',
    costCoins: 200,
    costStars: 3,
    description: 'Áo hoodie ấm áp in logo Số Pi & Dấu Vô Cùng. Giữ ấm lúc thức đêm ôn thi học kỳ!',
    rarity: 'popular',
    iconName: 'Sparkles',
    tagline: 'Ấm áp mùa ôn thi',
    renderType: 'hoodie'
  },
  {
    id: 'outfit_detective',
    name: 'Vest Thám Tử Lừng Danh Số Học',
    category: 'outfit',
    costCoins: 450,
    costStars: 8,
    description: 'Bộ vest thanh lịch với nơ đỏ. Chuyên gia phá án các bài toán tìm X hóc búa nhất!',
    rarity: 'vip',
    iconName: 'Crown',
    tagline: 'Chân lý chỉ có một!',
    renderType: 'detective'
  },
  {
    id: 'outfit_scholar',
    name: 'Áo Choàng Pháp Sư Toán Học',
    category: 'outfit',
    costCoins: 900,
    costStars: 20,
    description: 'Áo choàng nhung tím thêu chòm sao Euler, tỏa ánh sáng tri thức huyền bí.',
    rarity: 'vip',
    iconName: 'Sparkles',
    tagline: 'Phép thuật tính nhẩm',
    renderType: 'scholar'
  },
  {
    id: 'outfit_cyber',
    name: 'Bộ Giáp Phi Hành Gia Lượng Tử',
    category: 'outfit',
    costCoins: 1800,
    costStars: 40,
    description: 'Trang phục công nghệ vũ trụ siêu cấp. Sẵn sàng bay ra dải ngân hà giải toán!',
    rarity: 'mythic',
    iconName: 'Rocket',
    tagline: 'Đỉnh cao tương lai',
    renderType: 'cyber'
  },

  // --- PHỤ KIỆN CẦM TAY (HANDHELD) ---
  {
    id: 'hand_pencil',
    name: 'Bút Chì 2B Cắn Cụt Đuôi',
    category: 'handheld',
    costCoins: 0,
    costStars: 0,
    description: 'Cây bút chì dã chiến vẽ hình học, kẻ trục số không bao giờ hỏng.',
    rarity: 'base',
    iconName: 'PenTool',
    tagline: 'Vũ khí cơ bản',
    renderType: 'pencil'
  },
  {
    id: 'hand_ruler',
    name: 'Thước Kẻ Dẻo Bẻ Cong Không Gãy',
    category: 'handheld',
    costCoins: 60,
    costStars: 0,
    description: 'Thước nhựa dẻo cầu vồng, bẻ cong 180 độ vẫn nguyên vẹn. Kiêm đồ chơi bật tanh tách.',
    rarity: 'popular',
    iconName: 'Ruler',
    tagline: 'Đo chuẩn từng milimet',
    renderType: 'ruler'
  },
  {
    id: 'hand_compass',
    name: 'Bộ Compa & Eke Hợp Kim Titan',
    category: 'handheld',
    costCoins: 160,
    costStars: 2,
    description: 'Vẽ tam giác đều, lục giác đều, hình vuông sắc nét đến từng micromet!',
    rarity: 'popular',
    iconName: 'Compass',
    tagline: 'Tuyệt đỉnh hình học',
    renderType: 'compass'
  },
  {
    id: 'hand_casio',
    name: 'Máy Tính Casio FX-580VN X Bốc Lửa',
    category: 'handheld',
    costCoins: 380,
    costStars: 6,
    description: 'Chiếc máy tính huyền thoại của mọi học sinh lớp 6. Tốc độ xử lý nhanh gấp 4 lần!',
    rarity: 'vip',
    iconName: 'Calculator',
    tagline: 'Bảo bối phòng thi',
    renderType: 'casio'
  },
  {
    id: 'hand_laser',
    name: 'Gậy Ánh Sáng Laser Toán Học',
    category: 'handheld',
    costCoins: 850,
    costStars: 18,
    description: 'Phát ra tia laser xanh neon chỉ đúng vào đáp án trắc nghiệm trên bảng!',
    rarity: 'vip',
    iconName: 'Zap',
    tagline: 'Chỉ đâu trúng đó',
    renderType: 'laser'
  },
  {
    id: 'hand_tome',
    name: 'Đại Bí Kíp Toán 6 Bất Bại Dát Vàng',
    category: 'handheld',
    costCoins: 1600,
    costStars: 35,
    description: 'Quyển cổ thư nghìn năm ghi lại toàn bộ tuyệt kỹ chia hết, số nguyên và diện tích tứ giác.',
    rarity: 'mythic',
    iconName: 'BookOpen',
    tagline: 'Bí kíp trấn phái',
    renderType: 'tome'
  },

  // --- ĐIỆN THOẠI (PHONE) ---
  {
    id: 'phone_brick',
    name: 'Điện Thoại Cục Gạch "Đập Đá"',
    category: 'phone',
    costCoins: 0,
    costStars: 0,
    description: 'Pin chờ 1 tháng, chơi Rắn săn mồi mỏi tay, lỡ tay làm rơi thì sàn nhà nứt còn máy nguyên vẹn.',
    rarity: 'base',
    iconName: 'Phone',
    tagline: 'Nồi đồng cối đá',
    renderType: 'brick'
  },
  {
    id: 'phone_flip',
    name: 'Điện Thoại Nắp Gập Cổ Điển',
    category: 'phone',
    costCoins: 120,
    costStars: 1,
    description: 'Gập kêu tanh tách cực kỳ phong cách, chuông đơn âm vui tai.',
    rarity: 'popular',
    iconName: 'Smartphone',
    tagline: 'Phong cách Y2K',
    renderType: 'flip'
  },
  {
    id: 'phone_smart',
    name: 'Smartphone Màn Hình Tràn Viền 120Hz',
    category: 'phone',
    costCoins: 400,
    costStars: 7,
    description: 'Lướt xem bài giảng điện tử mượt mà, camera nét căng chụp bảng phụ của giáo viên.',
    rarity: 'vip',
    iconName: 'Smartphone',
    tagline: 'Thông minh đa năng',
    renderType: 'smart'
  },
  {
    id: 'phone_promax',
    name: 'iPhone 16 Pro Max Titan Sa Mạc',
    category: 'phone',
    costCoins: 950,
    costStars: 22,
    description: 'Bộ khung titan sáng bóng, 3 camera to đùng, cầm vào là cả lớp phải trầm trồ!',
    rarity: 'vip',
    iconName: 'Crown',
    tagline: 'Đẳng cấp học đường',
    renderType: 'promax'
  },
  {
    id: 'phone_holo',
    name: 'Thiết Bị Hologram 3D Tương Lai',
    category: 'phone',
    costCoins: 2100,
    costStars: 45,
    description: 'Chiếu hình 3D lơ lửng trong không trung, hiển thị các khối đa diện trực quan sống động!',
    rarity: 'mythic',
    iconName: 'Radio',
    tagline: 'Công nghệ viễn tưởng',
    renderType: 'holo'
  },

  // --- XE CỘ & DI CHUYỂN (VEHICLE) ---
  {
    id: 'veh_honeycomb',
    name: 'Đi Bộ Với Dép Tổ Ong Huyền Thoại',
    category: 'vehicle',
    costCoins: 0,
    costStars: 0,
    description: 'Đôi dép huyền thoại êm ái, lội bùn lội suối băng qua sân trường không ngại vết bẩn.',
    rarity: 'base',
    iconName: 'Footprints',
    tagline: 'Bước chân dũng cảm',
    renderType: 'honeycomb'
  },
  {
    id: 'veh_bike_mini',
    name: 'Xe Đạp Mini Martin 107 Màu Xanh',
    category: 'vehicle',
    costCoins: 190,
    costStars: 3,
    description: 'Xe có giỏ sắt đựng cặp sách, chuông reng reng vui vẻ dạo mát quanh hồ gươm.',
    rarity: 'popular',
    iconName: 'Bike',
    tagline: 'Kỷ niệm tuổi thơ',
    renderType: 'bike_mini'
  },
  {
    id: 'veh_mountain',
    name: 'Xe Đạp Thể Thao Địa Hình Cào Cào',
    category: 'vehicle',
    costCoins: 480,
    costStars: 10,
    description: 'Bánh xe gai hầm hố, đề số 21 tốc độ, vượt dốc cổng trường nhẹ như không.',
    rarity: 'vip',
    iconName: 'Bike',
    tagline: 'Vua leo dốc',
    renderType: 'mountain'
  },
  {
    id: 'veh_ebike',
    name: 'Xe Đạp Điện VinFast Lướt Như Gió',
    category: 'vehicle',
    costCoins: 980,
    costStars: 24,
    description: 'Chạy điện êm ru, bảo vệ môi trường, không lo muộn giờ điểm danh 7h sáng!',
    rarity: 'vip',
    iconName: 'Zap',
    tagline: 'Êm ái thần tốc',
    renderType: 'ebike'
  },
  {
    id: 'veh_hoverboard',
    name: 'Ván Trượt Phản Trọng Lực Neon',
    category: 'vehicle',
    costCoins: 1750,
    costStars: 38,
    description: 'Lơ lửng cách mặt đất 20cm, lướt ngang qua hành lang lớp học cực ngầu.',
    rarity: 'mythic',
    iconName: 'Sparkles',
    tagline: 'Bay trên mặt đất',
    renderType: 'hoverboard'
  },
  {
    id: 'veh_magic_carpet',
    name: 'Thảm Bay Thần Thoại Số Học',
    category: 'vehicle',
    costCoins: 2800,
    costStars: 60,
    description: 'Thảm bay hoa văn Fibonacci dát vàng, chở bạn thẳng đến Đỉnh Cao Tri Thức!',
    rarity: 'mythic',
    iconName: 'Star',
    tagline: 'Thần thoại vô đối',
    renderType: 'carpet'
  },

  // --- LAPTOP & CÔNG NGHỆ (TECH) ---
  {
    id: 'tech_notebook',
    name: 'Vở Ô Ly Bãi Bằng 96 Trang',
    category: 'tech',
    costCoins: 0,
    costStars: 0,
    description: 'Giấy trắng định lượng 100g/m2, ô ly rõ nét, viết mực tím không nhòe không lem.',
    rarity: 'base',
    iconName: 'Book',
    tagline: 'Nét chữ nết người',
    renderType: 'notebook'
  },
  {
    id: 'tech_tablet',
    name: 'Máy Tính Bảng Đọc SGK Điện Tử',
    category: 'tech',
    costCoins: 250,
    costStars: 4,
    description: 'Màn hình bảo vệ mắt, lật từng trang SGK Toán 6 Tập 1 sắc nét và sống động.',
    rarity: 'popular',
    iconName: 'Tablet',
    tagline: 'Học tập tiện lợi',
    renderType: 'tablet'
  },
  {
    id: 'tech_ultrabook',
    name: 'Laptop Văn Phòng Mỏng Nhẹ Nhôm Nguyên Khối',
    category: 'tech',
    costCoins: 550,
    costStars: 12,
    description: 'Nặng chỉ 1kg, pin dùng cả ngày để soạn bài thuyết trình hình học và số học.',
    rarity: 'vip',
    iconName: 'Laptop',
    tagline: 'Làm việc nhóm đỉnh cao',
    renderType: 'ultrabook'
  },
  {
    id: 'tech_gaming',
    name: 'Laptop Gaming RGB Tản Nhiệt Nước',
    category: 'tech',
    costCoins: 1200,
    costStars: 28,
    description: 'Bàn phím cơ led đổi màu rực rỡ, xử lý đồ họa mô phỏng hình học không giật lag!',
    rarity: 'vip',
    iconName: 'Cpu',
    tagline: 'Chiến mượt mọi tác vụ',
    renderType: 'gaming'
  },
  {
    id: 'tech_quantum',
    name: 'Siêu Máy Tính Lượng Tử AI Mini',
    category: 'tech',
    costCoins: 2400,
    costStars: 50,
    description: 'Tính toán hàng triệu phép tính trong chớp mắt. Bạn của thần đồng toán học thế giới!',
    rarity: 'mythic',
    iconName: 'Server',
    tagline: 'Trí tuệ vũ trụ',
    renderType: 'quantum'
  },

  // --- THÚ CƯNG ĐỒNG HÀNH (PET) ---
  {
    id: 'pet_none',
    name: 'Tự Lực Cánh Sinh',
    category: 'pet',
    costCoins: 0,
    costStars: 0,
    description: 'Một mình một ngựa, rèn luyện tính tự giác và độc lập khi làm bài tập về nhà.',
    rarity: 'base',
    iconName: 'Smile',
    tagline: 'Tự tin tự giác',
    renderType: 'none'
  },
  {
    id: 'pet_cat',
    name: 'Mèo Mướp Thích Học Toán',
    category: 'pet',
    costCoins: 260,
    costStars: 5,
    description: 'Chú mèo mướp lười nhưng cực thông minh, meo meo nhắc nhở mỗi khi bạn chọn đúng đáp án!',
    rarity: 'popular',
    iconName: 'Cat',
    tagline: 'Bạn thân chăm chỉ',
    renderType: 'cat'
  },
  {
    id: 'pet_owl',
    name: 'Cú Vọ Bác Học Đeo Kính Cận',
    category: 'pet',
    costCoins: 650,
    costStars: 15,
    description: 'Đội mũ tiến sĩ tí hon, đậu trên vai nhắc nhở thứ tự thực hiện phép tính chuẩn chỉ.',
    rarity: 'vip',
    iconName: 'Feather',
    tagline: 'Biểu tượng thông thái',
    renderType: 'owl'
  },
  {
    id: 'pet_robot',
    name: 'Robot Trợ Lý AI Tính Nhẩm',
    category: 'pet',
    costCoins: 1350,
    costStars: 30,
    description: 'Mắt led phát sáng, xoay đầu 360 độ và phát ra âm thanh cổ vũ cực kỳ hưng phấn!',
    rarity: 'vip',
    iconName: 'Bot',
    tagline: 'Công nghệ siêu việt',
    renderType: 'robot'
  },
  {
    id: 'pet_dragon',
    name: 'Rồng Con Tí Nị Phun Phép Nhân',
    category: 'pet',
    costCoins: 2500,
    costStars: 55,
    description: 'Bé rồng huyền thoại bay lơ lửng, phun ra đốm lửa ấm áp mỗi khi bạn đạt chuỗi Combo x5!',
    rarity: 'mythic',
    iconName: 'Flame',
    tagline: 'Thần thú may mắn',
    renderType: 'dragon'
  }
];

export const HAIR_STYLES = [
  { id: 'short_neat', name: 'Ngắn Gọn Gàng', forGender: ['boy', 'scholar'] },
  { id: 'undercut', name: 'Undercut Sành Điệu', forGender: ['boy'] },
  { id: 'messy_spiky', name: 'Tóc Nhím Năng Động', forGender: ['boy', 'scholar'] },
  { id: 'ponytail', name: 'Đuôi Ngựa Năng Động', forGender: ['girl'] },
  { id: 'twintails', name: 'Buộc Hai Bên Chibi', forGender: ['girl'] },
  { id: 'bob_bangs', name: 'Mái Ngố Đáng Yêu', forGender: ['girl', 'scholar'] },
  { id: 'curly_wave', name: 'Xoăn Mì Tôm Cá Tính', forGender: ['boy', 'girl', 'scholar'] }
];

export const HAIR_COLORS = [
  { id: '#1E293B', name: 'Đen Tuyển' },
  { id: '#78350F', name: 'Nâu Hạt Dẻ' },
  { id: '#D97706', name: 'Vàng Nắng' },
  { id: '#DC2626', name: 'Đỏ Năng Lượng' },
  { id: '#7C3AED', name: 'Tím Khói' },
  { id: '#0284C7', name: 'Xanh Biển' }
];

export const SKIN_TONES = [
  { id: '#FDDFC6', name: 'Sáng Hồng' },
  { id: '#F7CEB2', name: 'Tự Nhiên' },
  { id: '#E8B693', name: 'Bánh Mật' },
  { id: '#C68B59', name: 'Rắn Rỏi' }
];

export const EYE_EXPRESSIONS = [
  { id: 'glasses_happy', name: 'Kính Cận Bác Học & Cười Tươi' },
  { id: 'sparkle_joy', name: 'Mắt Long Lanh Tinh Anh' },
  { id: 'cool_wink', name: 'Nháy Mắt Tự Tin' },
  { id: 'focused_scholar', name: 'Tập Trung Cao Độ' },
  { id: 'sunglasses_boss', name: 'Kính Đen Cool Ngầu' }
];
