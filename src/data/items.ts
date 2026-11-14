import { ShopItem, StudioSet } from '../types';

export const STUDIO_SETS: StudioSet[] = [
  {
    id: 'set_explorer',
    name: 'Bộ Thám Hiểm Rừng Tri Thức',
    titleReward: 'Nhà Thám Hiểm Nhí',
    description: 'Sưu tầm trọn bộ thám hiểm để băng rừng vượt suối chinh phục mọi bản đồ ải SGK.',
    accentColor: 'emerald',
    itemIds: ['outfit_scout', 'hand_magnifier', 'veh_mountain', 'bg_forest']
  },
  {
    id: 'set_scientist',
    name: 'Bộ Nhà Khoa Học Công Nghệ VNPT',
    titleReward: 'Kỹ Sư Tương Lai',
    description: 'Trang bị chuẩn phòng thí nghiệm công nghệ cao kết hợp trợ lý Robot thông minh.',
    accentColor: 'blue',
    itemIds: ['outfit_lab', 'hand_casio', 'pet_vuibot', 'bg_lab', 'aura_electric']
  },
  {
    id: 'set_cosmic',
    name: 'Bộ Chiến Binh Vũ Trụ Lượng Tử',
    titleReward: 'Huyền Thoại Ngân Hà',
    description: 'Set trang bị đỉnh cao tỏa hào quang rực rỡ trên Bảng Vàng và Đấu Trường 1v1.',
    accentColor: 'amber',
    itemIds: ['outfit_cyber', 'hand_laser', 'veh_spaceship', 'bg_galaxy', 'aura_flame']
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  // =========================================================================
  // 1. TRANG PHỤC (OUTFITS - 10 món)
  // =========================================================================
  {
    id: 'outfit_uniform',
    name: 'Đồng Phục Khăn Quàng Đỏ',
    category: 'outfit',
    costCoins: 0,
    costStars: 0,
    description: 'Áo sơ mi trắng tinh khôi thắt khăn quàng đỏ tươi. Chuẩn tác phong học sinh gương mẫu.',
    rarity: 'base',
    iconName: 'Shirt',
    tagline: 'Học sinh chăm ngoan',
    renderType: 'uniform'
  },
  {
    id: 'outfit_scout',
    name: 'Áo Gile Thám Hiểm Bản Đồ',
    category: 'outfit',
    costCoins: 12,
    costStars: 0,
    description: 'Áo túi hộp kaki năng động gắn huy hiệu la bàn, sẵn sàng vượt ải trên Bản đồ thám hiểm.',
    rarity: 'popular',
    iconName: 'Compass',
    tagline: 'Sẵn sàng vượt ải',
    renderType: 'scout',
    setId: 'set_explorer'
  },
  {
    id: 'outfit_sport',
    name: 'Áo Thể Dục Năng Động 3 Sọc',
    category: 'outfit',
    costCoins: 18,
    costStars: 0,
    description: 'Thoáng mát, co giãn cực tốt cho những giờ thể dục và đấu trường siêu tốc.',
    rarity: 'popular',
    iconName: 'Shirt',
    tagline: 'Khỏe để học tốt',
    renderType: 'sport'
  },
  {
    id: 'outfit_hoodie',
    name: 'Hoodie Biệt Đội Tri Thức',
    category: 'outfit',
    costCoins: 24,
    costStars: 2,
    description: 'Áo hoodie in biểu tượng Số Pi và Vô Cùng, giữ ấm mỗi tối ôn bài chuẩn bị kiểm tra.',
    rarity: 'popular',
    iconName: 'Sparkles',
    tagline: 'Ấm áp mùa ôn thi',
    renderType: 'hoodie'
  },
  {
    id: 'outfit_lab',
    name: 'Áo Blouse Nhà Khoa Học Nhí',
    category: 'outfit',
    costCoins: 42,
    costStars: 4,
    description: 'Áo choàng trắng phòng thí nghiệm kèm kính bảo hộ gắn trán cho tín đồ Khoa học tự nhiên.',
    rarity: 'vip',
    iconName: 'Atom',
    tagline: 'Say mê khám phá',
    renderType: 'lab',
    setId: 'set_scientist'
  },
  {
    id: 'outfit_detective',
    name: 'Vest Thám Tử Lừng Danh',
    category: 'outfit',
    costCoins: 52,
    costStars: 5,
    description: 'Bộ vest lịch lãm thắt nơ đỏ, chuyên gia phá giải các bài toán hóc búa nhất.',
    rarity: 'vip',
    iconName: 'Crown',
    tagline: 'Chân lý chỉ có một',
    renderType: 'detective'
  },
  {
    id: 'outfit_varsity',
    name: 'Áo Khoác Bóng Chày Học Đường',
    category: 'outfit',
    costCoins: 65,
    costStars: 6,
    description: 'Áo khoác Varsity xanh navy phối tay kem cực chất dành cho thủ lĩnh đội tuyển lớp.',
    rarity: 'vip',
    iconName: 'Award',
    tagline: 'Phong cách thủ lĩnh',
    renderType: 'varsity'
  },
  {
    id: 'outfit_aodai_tech',
    name: 'Cổ Phục Trạng Nguyên Hiện Đại',
    category: 'outfit',
    costCoins: 82,
    costStars: 8,
    description: 'Lấy cảm hứng từ trang phục Trạng Nguyên Việt Nam hòa quyện hoa văn công nghệ ánh kim.',
    rarity: 'vip',
    iconName: 'Crown',
    tagline: 'Vinh danh Bảng Vàng',
    renderType: 'aodai_tech'
  },
  {
    id: 'outfit_scholar',
    name: 'Áo Choàng Pháp Sư Tri Thức',
    category: 'outfit',
    costCoins: 120,
    costStars: 12,
    description: 'Áo choàng nhung tím thêu chòm sao vàng kim, tỏa ánh sáng trí tuệ cổ điển.',
    rarity: 'mythic',
    iconName: 'Sparkles',
    tagline: 'Phép thuật tính nhẩm',
    renderType: 'scholar'
  },
  {
    id: 'outfit_cyber',
    name: 'Bộ Giáp Phi Hành Gia Lượng Tử',
    category: 'outfit',
    costCoins: 165,
    costStars: 18,
    description: 'Trang phục công nghệ vũ trụ tối tân, sẵn sàng chinh phục dải ngân hà tri thức.',
    rarity: 'mythic',
    iconName: 'Rocket',
    tagline: 'Đỉnh cao tương lai',
    renderType: 'cyber',
    setId: 'set_cosmic'
  },

  // =========================================================================
  // 2. PHỤ KIỆN CẦM TAY (HANDHELD - 9 món)
  // =========================================================================
  {
    id: 'hand_pencil',
    name: 'Bút Chì 2B Cổ Điển',
    category: 'handheld',
    costCoins: 0,
    costStars: 0,
    description: 'Cây bút chì quen thuộc vẽ hình, nháp phép tính không bao giờ thiếu trong cặp sách.',
    rarity: 'base',
    iconName: 'PenTool',
    tagline: 'Vũ khí khởi đầu',
    renderType: 'pencil'
  },
  {
    id: 'hand_ruler',
    name: 'Thước Kẻ Dẻo Cầu Vồng',
    category: 'handheld',
    costCoins: 10,
    costStars: 0,
    description: 'Thước nhựa dẻo uốn cong không gãy, đo chuẩn từng milimet trên vở ô ly.',
    rarity: 'popular',
    iconName: 'Ruler',
    tagline: 'Đo chuẩn từng ly',
    renderType: 'ruler'
  },
  {
    id: 'hand_star_wand',
    name: 'Gậy Phép Ngôi Sao Tri Thức',
    category: 'handheld',
    costCoins: 15,
    costStars: 1,
    description: 'Đầu gậy gắn ngôi sao vàng lấp lánh, vung lên là giải xong phép tính khó.',
    rarity: 'popular',
    iconName: 'Sparkles',
    tagline: 'Tỏa sáng mỗi câu đúng',
    renderType: 'star_wand'
  },
  {
    id: 'hand_compass',
    name: 'Bộ Compa Hợp Kim Titan',
    category: 'handheld',
    costCoins: 22,
    costStars: 2,
    description: 'Vẽ đường tròn, tam giác đều và hình lục giác sắc nét đến từng milimet.',
    rarity: 'popular',
    iconName: 'Compass',
    tagline: 'Tuyệt đỉnh hình học',
    renderType: 'compass'
  },
  {
    id: 'hand_magnifier',
    name: 'Kính Lúp Thám Tử Bạc',
    category: 'handheld',
    costCoins: 36,
    costStars: 3,
    description: 'Soi rõ từng chi tiết bẫy đề bài trong SGK và thí nghiệm khoa học tự nhiên.',
    rarity: 'vip',
    iconName: 'Search',
    tagline: 'Bắt trọn mọi bẫy đề',
    renderType: 'magnifier',
    setId: 'set_explorer'
  },
  {
    id: 'hand_casio',
    name: 'Máy Tính Khoa Học FX Pro',
    category: 'handheld',
    costCoins: 48,
    costStars: 5,
    description: 'Chiếc máy tính bỏ túi huyền thoại của mọi học sinh phổ thông, bấm nhanh như chớp.',
    rarity: 'vip',
    iconName: 'Calculator',
    tagline: 'Bảo bối phòng thi',
    renderType: 'casio',
    setId: 'set_scientist'
  },
  {
    id: 'hand_trophy_mini',
    name: 'Cúp Pha Lê Đấu Trường',
    category: 'handheld',
    costCoins: 72,
    costStars: 7,
    description: 'Chiếc cúp pha lê lấp lánh biểu tượng của nhà vô địch Đấu Trường 60 giây.',
    rarity: 'vip',
    iconName: 'Trophy',
    tagline: 'Chiến thắng vang dội',
    renderType: 'trophy_mini'
  },
  {
    id: 'hand_laser',
    name: 'Kiếm Ánh Sáng Số Học',
    category: 'handheld',
    costCoins: 115,
    costStars: 12,
    description: 'Phát ra chùm tia sáng ngọc lục bảo chỉ thẳng vào đáp án chính xác.',
    rarity: 'mythic',
    iconName: 'Zap',
    tagline: 'Chỉ đâu trúng đó',
    renderType: 'laser',
    setId: 'set_cosmic'
  },
  {
    id: 'hand_tome',
    name: 'Đại Bí Kíp Tri Thức Dát Vàng',
    category: 'handheld',
    costCoins: 150,
    costStars: 16,
    description: 'Cuốn cổ thư dát vàng tổng hợp trọn vẹn công thức Toán và Khoa học từ Lớp 1 đến Lớp 9.',
    rarity: 'mythic',
    iconName: 'BookOpen',
    tagline: 'Bí kíp trấn phái',
    renderType: 'tome'
  },

  // =========================================================================
  // 3. ĐIỆN THOẠI & LIÊN LẠC (PHONE - 6 món)
  // =========================================================================
  {
    id: 'phone_brick',
    name: 'Điện Thoại Cục Gạch Huyền Thoại',
    category: 'phone',
    costCoins: 0,
    costStars: 0,
    description: 'Pin bền cả tháng, rơi xuống sân trường không một vết xước.',
    rarity: 'base',
    iconName: 'Phone',
    tagline: 'Nồi đồng cối đá',
    renderType: 'brick'
  },
  {
    id: 'phone_walkie',
    name: 'Bộ Đàm Thám Hiểm Rừng Xanh',
    category: 'phone',
    costCoins: 12,
    costStars: 0,
    description: 'Bắt sóng cực khỏe để gọi đồng đội cùng vượt ải trên Bản đồ.',
    rarity: 'popular',
    iconName: 'Radio',
    tagline: 'Kết nối đồng đội',
    renderType: 'walkie'
  },
  {
    id: 'phone_flip',
    name: 'Điện Thoại Nắp Gập Retro',
    category: 'phone',
    costCoins: 20,
    costStars: 1,
    description: 'Gập kêu tanh tách sành điệu với sắc hồng pastel trẻ trung.',
    rarity: 'popular',
    iconName: 'Smartphone',
    tagline: 'Phong cách cổ điển',
    renderType: 'flip'
  },
  {
    id: 'phone_smart',
    name: 'Smartphone Màn Hình Tràn Viền',
    category: 'phone',
    costCoins: 45,
    costStars: 4,
    description: 'Lướt học siêu mượt, màn hình sắc nét bảo vệ mắt cho học sinh.',
    rarity: 'vip',
    iconName: 'Smartphone',
    tagline: 'Thông minh đa năng',
    renderType: 'smart'
  },
  {
    id: 'phone_promax',
    name: 'Flagship Titan Sa Mạc',
    category: 'phone',
    costCoins: 75,
    costStars: 8,
    description: 'Khung viền titan vàng cát sang trọng với cụm 3 camera siêu nét.',
    rarity: 'vip',
    iconName: 'Crown',
    tagline: 'Đẳng cấp học đường',
    renderType: 'promax'
  },
  {
    id: 'phone_holo',
    name: 'Máy Chiếu Hologram 3D AI',
    category: 'phone',
    costCoins: 140,
    costStars: 15,
    description: 'Chiếu mô hình hình học không gian lơ lửng 3D ngay trên lòng bàn tay.',
    rarity: 'mythic',
    iconName: 'Radio',
    tagline: 'Công nghệ viễn tưởng',
    renderType: 'holo'
  },

  // =========================================================================
  // 4. XE CỘ & DI CHUYỂN (VEHICLE - 9 món)
  // =========================================================================
  {
    id: 'veh_honeycomb',
    name: 'Dép Tổ Ong Huyền Thoại',
    category: 'vehicle',
    costCoins: 0,
    costStars: 0,
    description: 'Đôi dép quốc dân êm ái, đồng hành cùng biết bao thế hệ học trò Việt Nam.',
    rarity: 'base',
    iconName: 'Footprints',
    tagline: 'Bước chân dũng cảm',
    renderType: 'honeycomb'
  },
  {
    id: 'veh_skateboard',
    name: 'Ván Trượt Đường Phố Năng Động',
    category: 'vehicle',
    costCoins: 14,
    costStars: 1,
    description: 'Ván gỗ phong 7 lớp họa tiết đường phố cực ngầu để lướt qua sân trường.',
    rarity: 'popular',
    iconName: 'Zap',
    tagline: 'Lướt nhanh như gió',
    renderType: 'skateboard'
  },
  {
    id: 'veh_bike_mini',
    name: 'Xe Đạp Mini Cổ Điển Có Giỏ',
    category: 'vehicle',
    costCoins: 24,
    costStars: 2,
    description: 'Xe đạp màu xanh ngọc có giỏ đựng sách vở và chuông reng reng vui tai.',
    rarity: 'popular',
    iconName: 'Bike',
    tagline: 'Kỷ niệm tuổi thơ',
    renderType: 'bike_mini'
  },
  {
    id: 'veh_scooter_pastel',
    name: 'Xe Tay Ga Mini Pastel',
    category: 'vehicle',
    costCoins: 42,
    costStars: 4,
    description: 'Nhỏ gọn, xinh xắn màu xanh bạc hà cùng đèn pha tròn cổ điển.',
    rarity: 'vip',
    iconName: 'Bike',
    tagline: 'Dạo phố siêu xinh',
    renderType: 'scooter_pastel'
  },
  {
    id: 'veh_mountain',
    name: 'Xe Đạp Địa Hình Thể Thao',
    category: 'vehicle',
    costCoins: 55,
    costStars: 5,
    description: 'Bánh gai hầm hố, bộ đề 21 tốc độ chinh phục mọi cung đường đồi núi.',
    rarity: 'vip',
    iconName: 'Bike',
    tagline: 'Vua leo dốc',
    renderType: 'mountain',
    setId: 'set_explorer'
  },
  {
    id: 'veh_ebike',
    name: 'Xe Điện Thông Minh Xanh',
    category: 'vehicle',
    costCoins: 78,
    costStars: 7,
    description: 'Chạy điện êm ru, thân thiện môi trường, không lo trễ giờ vào lớp.',
    rarity: 'vip',
    iconName: 'Zap',
    tagline: 'Êm ái thần tốc',
    renderType: 'ebike'
  },
  {
    id: 'veh_hoverboard',
    name: 'Ván Trượt Phản Trọng Lực',
    category: 'vehicle',
    costCoins: 120,
    costStars: 12,
    description: 'Lơ lửng cách mặt đất 20cm với ánh sáng xanh dương công nghệ cao.',
    rarity: 'mythic',
    iconName: 'Sparkles',
    tagline: 'Bay trên mặt đất',
    renderType: 'hoverboard'
  },
  {
    id: 'veh_spaceship',
    name: 'Phi Thuyền Mini VNPT Cloud',
    category: 'vehicle',
    costCoins: 170,
    costStars: 18,
    description: 'Tàu vũ trụ cá nhân động cơ phản lực ánh sáng đưa bạn du hành qua các thiên hà.',
    rarity: 'mythic',
    iconName: 'Rocket',
    tagline: 'Chinh phục ngân hà',
    renderType: 'spaceship',
    setId: 'set_cosmic'
  },
  {
    id: 'veh_magic_carpet',
    name: 'Thảm Bay Thần Thoại Fibonacci',
    category: 'vehicle',
    costCoins: 195,
    costStars: 22,
    description: 'Thảm bay dệt hoa văn dãy số vàng, lơ lửng đưa bạn tới đỉnh cao Bảng Vàng.',
    rarity: 'mythic',
    iconName: 'Star',
    tagline: 'Thần thoại vô đối',
    renderType: 'carpet'
  },

  // =========================================================================
  // 5. VỞ & CÔNG NGHỆ HỌC TẬP (TECH - 6 món)
  // =========================================================================
  {
    id: 'tech_notebook',
    name: 'Vở Ô Ly Tinh Khôi 96 Trang',
    category: 'tech',
    costCoins: 0,
    costStars: 0,
    description: 'Giấy trắng chống lóa, kẻ ô ly sắc nét để rèn chữ và ghi chép công thức.',
    rarity: 'base',
    iconName: 'Book',
    tagline: 'Nét chữ nết người',
    renderType: 'notebook'
  },
  {
    id: 'tech_abacus',
    name: 'Bàn Tính Gẩy Soroban Gỗ',
    category: 'tech',
    costCoins: 15,
    costStars: 1,
    description: 'Bàn tính hạt gỗ giúp tăng tốc khả năng tính nhẩm siêu tốc cho Tiểu học.',
    rarity: 'popular',
    iconName: 'Grid',
    tagline: 'Tính nhẩm siêu phàm',
    renderType: 'abacus'
  },
  {
    id: 'tech_tablet',
    name: 'Máy Tính Bảng SGK Điện Tử',
    category: 'tech',
    costCoins: 35,
    costStars: 3,
    description: 'Màn hình bảo vệ mắt, mở nhanh toàn bộ sách giáo khoa Lớp 1 đến Lớp 9.',
    rarity: 'vip',
    iconName: 'Tablet',
    tagline: 'Học tập mọi nơi',
    renderType: 'tablet'
  },
  {
    id: 'tech_ultrabook',
    name: 'Laptop Nhôm Mỏng Nhẹ Pro',
    category: 'tech',
    costCoins: 62,
    costStars: 6,
    description: 'Mỏng nhẹ chỉ 1kg, pin dùng cả ngày để lập trình và làm bài thuyết trình nhóm.',
    rarity: 'vip',
    iconName: 'Laptop',
    tagline: 'Làm việc nhóm đỉnh cao',
    renderType: 'ultrabook'
  },
  {
    id: 'tech_gaming',
    name: 'Laptop Đồ Họa RGB Tản Nhiệt',
    category: 'tech',
    costCoins: 110,
    costStars: 11,
    description: 'Bàn phím đổi màu rực rỡ, mô phỏng hình học 3D và thí nghiệm mượt mà.',
    rarity: 'mythic',
    iconName: 'Cpu',
    tagline: 'Chiến mượt mọi tác vụ',
    renderType: 'gaming'
  },
  {
    id: 'tech_quantum',
    name: 'Lõi Máy Tính Lượng Tử AI',
    category: 'tech',
    costCoins: 160,
    costStars: 17,
    description: 'Khối năng lượng xoay quanh hạt nhân lượng tử, xử lý hàng triệu phép tính trong chớp mắt.',
    rarity: 'mythic',
    iconName: 'Server',
    tagline: 'Trí tuệ vũ trụ',
    renderType: 'quantum'
  },

  // =========================================================================
  // 6. THÚ CƯNG ĐỒNG HÀNH (PET - 7 món)
  // =========================================================================
  {
    id: 'pet_none',
    name: 'Tự Lực Cánh Sinh',
    category: 'pet',
    costCoins: 0,
    costStars: 0,
    description: 'Rèn luyện tinh thần độc lập và tự giác khi chinh phục các bài học.',
    rarity: 'base',
    iconName: 'Smile',
    tagline: 'Tự tin tự giác',
    renderType: 'none'
  },
  {
    id: 'pet_corgi',
    name: 'Cún Corgi Đeo Nơ Đỏ',
    category: 'pet',
    costCoins: 18,
    costStars: 1,
    description: 'Chú cún chân ngắn tinh nghịch luôn vẫy đuôi cổ vũ mỗi khi bạn ghi điểm.',
    rarity: 'popular',
    iconName: 'Heart',
    tagline: 'Người bạn trung thành',
    renderType: 'corgi'
  },
  {
    id: 'pet_cat',
    name: 'Mèo Mướp Ham Học',
    category: 'pet',
    costCoins: 24,
    costStars: 2,
    description: 'Chú mèo mướp thông minh meo meo ăn mừng khi bạn đạt chuỗi Combo.',
    rarity: 'popular',
    iconName: 'Cat',
    tagline: 'Bạn thân chăm chỉ',
    renderType: 'cat'
  },
  {
    id: 'pet_bunny',
    name: 'Thỏ Ngọc Đeo Kính Tri Thức',
    category: 'pet',
    costCoins: 42,
    costStars: 4,
    description: 'Tai dài đáng yêu, nhảy tưng tưng mỗi lần bạn hoàn thành xuất sắc 15 câu.',
    rarity: 'vip',
    iconName: 'Sparkles',
    tagline: 'Nhanh nhẹn tinh anh',
    renderType: 'bunny'
  },
  {
    id: 'pet_owl',
    name: 'Cú Vọ Tiến Sĩ Mũ Vuông',
    category: 'pet',
    costCoins: 68,
    costStars: 7,
    description: 'Đội mũ tốt nghiệp tí hon, biểu tượng thông thái nhắc bạn đọc kỹ đề bài.',
    rarity: 'vip',
    iconName: 'Feather',
    tagline: 'Biểu tượng thông thái',
    renderType: 'owl'
  },
  {
    id: 'pet_vuibot',
    name: 'Robot VNPT Vui-Bot Mini',
    category: 'pet',
    costCoins: 85,
    costStars: 8,
    description: 'Phiên bản đồng hành thu nhỏ của linh vật VNPT Vui-Bot, mắt LED biết cười cực dễ thương.',
    rarity: 'vip',
    iconName: 'Bot',
    tagline: 'Trợ thủ công nghệ',
    renderType: 'robot',
    setId: 'set_scientist'
  },
  {
    id: 'pet_dragon',
    name: 'Rồng Con Tí Nị Lửa Vàng',
    category: 'pet',
    costCoins: 155,
    costStars: 16,
    description: 'Bé rồng huyền thoại bay lơ lửng vỗ cánh, mang lại may mắn trên mọi đấu trường.',
    rarity: 'mythic',
    iconName: 'Flame',
    tagline: 'Thần thú may mắn',
    renderType: 'dragon'
  },

  // =========================================================================
  // 7. PHÔNG NỀN SÂN KHẤU (BACKDROP - 5 món)
  // =========================================================================
  {
    id: 'bg_classroom',
    name: 'Lớp Học Nắng Mai',
    category: 'backdrop',
    costCoins: 0,
    costStars: 0,
    description: 'Khung cảnh lớp học sáng sủa ngập tràn ánh nắng ban mai và bảng xanh thân quen.',
    rarity: 'base',
    iconName: 'Image',
    tagline: 'Khởi đầu quen thuộc',
    renderType: 'bg_classroom'
  },
  {
    id: 'bg_forest',
    name: 'Đảo Thám Hiểm Rừng Xanh',
    category: 'backdrop',
    costCoins: 20,
    costStars: 2,
    description: 'Thảm cỏ xanh mướt cùng thác pha lê lấp lánh trên quần đảo Thám Hiểm.',
    rarity: 'popular',
    iconName: 'Trees',
    tagline: 'Thiên nhiên tươi mát',
    renderType: 'bg_forest',
    setId: 'set_explorer'
  },
  {
    id: 'bg_lab',
    name: 'Phòng Lab Công Nghệ VNPT',
    category: 'backdrop',
    costCoins: 46,
    costStars: 5,
    description: 'Phòng thí nghiệm công nghệ cao với màn hình hình học và ánh sáng xanh dịu.',
    rarity: 'vip',
    iconName: 'Atom',
    tagline: 'Khoa học hiện đại',
    renderType: 'bg_lab',
    setId: 'set_scientist'
  },
  {
    id: 'bg_arena',
    name: 'Đấu Trường Ánh Dương',
    category: 'backdrop',
    costCoins: 74,
    costStars: 8,
    description: 'Khán đài rực rỡ cờ hoa chào đón những nhà vô địch leo Top Bảng Vàng.',
    rarity: 'vip',
    iconName: 'Trophy',
    tagline: 'Sân khấu vinh quang',
    renderType: 'bg_arena'
  },
  {
    id: 'bg_galaxy',
    name: 'Vũ Trụ Tri Thức Lượng Tử',
    category: 'backdrop',
    costCoins: 135,
    costStars: 14,
    description: 'Bầu trời cực quang sâu thẳm với các chòm sao và khối đa diện trôi lơ lửng.',
    rarity: 'mythic',
    iconName: 'Sparkles',
    tagline: 'Bao la vô tận',
    renderType: 'bg_galaxy',
    setId: 'set_cosmic'
  },

  // =========================================================================
  // 8. HÀO QUANG NHÂN VẬT (AURA - 4 món)
  // =========================================================================
  {
    id: 'aura_none',
    name: 'Mặc Định Tự Nhiên',
    category: 'aura',
    costCoins: 0,
    costStars: 0,
    description: 'Hiển thị nhân vật mộc mạc, gọn gàng không kèm hiệu ứng vòng sáng.',
    rarity: 'base',
    iconName: 'Circle',
    tagline: 'Đơn giản tinh tế',
    renderType: 'aura_none'
  },
  {
    id: 'aura_sparkle',
    name: 'Bụi Sao Lấp Lánh',
    category: 'aura',
    costCoins: 22,
    costStars: 2,
    description: 'Những ngôi sao vàng nhỏ xoay nhẹ xung quanh nhân vật đầy sinh động.',
    rarity: 'popular',
    iconName: 'Sparkles',
    tagline: 'Lấp lánh tỏa sáng',
    renderType: 'aura_sparkle'
  },
  {
    id: 'aura_electric',
    name: 'Vòng Năng Lượng Xanh VNPT',
    category: 'aura',
    costCoins: 54,
    costStars: 5,
    description: 'Vòng quỹ đạo điện tích xanh dương xoay đều chuẩn công nghệ số.',
    rarity: 'vip',
    iconName: 'Zap',
    tagline: 'Tốc độ ánh sáng',
    renderType: 'aura_electric',
    setId: 'set_scientist'
  },
  {
    id: 'aura_flame',
    name: 'Hào Quang Phượng Hoàng Vàng',
    category: 'aura',
    costCoins: 125,
    costStars: 13,
    description: 'Vầng hào quang rực lửa vàng kim uy nghiêm của bậc Trạng Nguyên Đấu Trường.',
    rarity: 'mythic',
    iconName: 'Flame',
    tagline: 'Khí chất vô địch',
    renderType: 'aura_flame',
    setId: 'set_cosmic'
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
