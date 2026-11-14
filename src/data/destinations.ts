export interface CityTrivia {
  question: string;
  options: string[];
  correctIndex: number;
  fact: string;
}

export interface DestinationCity {
  destKey: string;
  name: string;
  shortName: string;
  region: string;
  distanceKm: number;
  ticketCoins: number;
  requiredLevel: number;
  description: string;
  funFact: string;
  mapX: number;
  mapY: number;
  accentColor: string;
  trivia: CityTrivia;
}

export const DESTINATIONS: DestinationCity[] = [
  {
    destKey: 'hanoi_school',
    name: 'Hà Nội — Sân Trường & Công Viên',
    shortName: 'Hà Nội (Km 0)',
    region: 'Trung tâm Thủ đô',
    distanceKm: 0,
    ticketCoins: 0,
    requiredLevel: 1,
    description: 'Điểm xuất phát Km 0 tại Thủ đô Hà Nội với sân trường nắng mai, ghế đá và công viên xanh mát.',
    funFact: 'Thủ đô Hà Nội hơn 1.000 năm văn hiến là trạm khởi hành mọi chuyến du hành tri thức.',
    mapX: 44.5,
    mapY: 18.0,
    accentColor: '#2563eb',
    trivia: {
      question: 'Hà Nội được chọn là điểm Km 0 trung tâm của bản đồ Du Hành. Từ Hà Nội đi TP.HCM dài khoảng 1.720 km, nếu đi tàu tốc độ 86 km/h liên tục mất mấy giờ?',
      options: ['15 giờ', '20 giờ', '24 giờ', '30 giờ'],
      correctIndex: 1,
      fact: '1.720 : 86 = 20 giờ!'
    }
  },
  {
    destKey: 'hanoi_ho_guom',
    name: 'Hồ Gươm — Tháp Rùa & Cầu Thê Húc',
    shortName: 'Hồ Gươm',
    region: 'Trung tâm Hà Nội',
    distanceKm: 2,
    ticketCoins: 8,
    requiredLevel: 1,
    description: 'Dạo bước quanh Hồ Hoàn Kiếm soi bóng Tháp Rùa cổ kính và cây cầu Thê Húc đỏ son rực rỡ.',
    funFact: 'Cầu Thê Húc có nghĩa là "nơi đậu ánh sáng Mặt Trời buổi sáng sớm".',
    mapX: 49.0,
    mapY: 20.5,
    accentColor: '#dc2626',
    trivia: {
      question: 'Chu vi đường đi bộ quanh Hồ Gươm dài khoảng 1.750 mét. Nếu bạn đi dạo đủ 2 vòng thì đi được quãng đường bao nhiêu km?',
      options: ['2,5 km', '3,5 km', '4,0 km', '5,0 km'],
      correctIndex: 1,
      fact: '1.750 × 2 = 3.500 mét = 3,5 km!'
    }
  },
  {
    destKey: 'halong_bay',
    name: 'Vịnh Hạ Long — Đảo Ngọc',
    shortName: 'Hạ Long',
    region: 'Đông Bắc Bộ',
    distanceKm: 160,
    ticketCoins: 18,
    requiredLevel: 2,
    description: 'Chiêm ngưỡng hàng nghìn hòn đảo đá vôi kỳ vĩ nhấp nhô trên làn nước ngọc bích xanh thẳm.',
    funFact: 'Vịnh Hạ Long được UNESCO nhiều lần vinh danh là Di sản Thiên nhiên Thế giới.',
    mapX: 60.5,
    mapY: 17.5,
    accentColor: '#0284c7',
    trivia: {
      question: 'Vịnh Hạ Long có khoảng 1.969 hòn đảo lớn nhỏ. Số 1969 làm tròn đến hàng trăm gần nhất là bao nhiêu?',
      options: ['1.900', '1.960', '2.000', '1.970'],
      correctIndex: 2,
      fact: 'Vì chữ số hàng chục là 6 (≥ 5), 1.969 làm tròn đến hàng trăm là 2.000!'
    }
  },
  {
    destKey: 'sapa_fansipan',
    name: 'Sa Pa — Đỉnh Fansipan',
    shortName: 'Sa Pa',
    region: 'Tây Bắc Bộ',
    distanceKm: 315,
    ticketCoins: 28,
    requiredLevel: 3,
    description: 'Săn mây trên Nóc nhà Đông Dương cao 3.143 m giữa thung lũng ruộng bậc thang vàng óng.',
    funFact: 'Đỉnh Fansipan nằm trên dãy Hoàng Liên Sơn hùng vĩ của tỉnh Lào Cai.',
    mapX: 31.0,
    mapY: 10.5,
    accentColor: '#4f46e5',
    trivia: {
      question: 'Đỉnh Fansipan cao 3.143 m so với mực nước biển. Đỉnh cao hơn mặt bằng trung tâm Hà Nội (cao khoảng 13 m) bao nhiêu mét?',
      options: ['3.120 m', '3.130 m', '3.140 m', '3.156 m'],
      correctIndex: 1,
      fact: '3.143 - 13 = 3.130 mét!'
    }
  },
  {
    destKey: 'hue_imperial',
    name: 'Cố Đô Huế — Kinh Thành',
    shortName: 'Cố Đô Huế',
    region: 'Bắc Trung Bộ',
    distanceKm: 670,
    ticketCoins: 42,
    requiredLevel: 5,
    description: 'Ngắm dòng sông Hương thơ mộng, Cầu Trường Tiền sáu vài mười hai nhịp và Ngọ Môn uy nghi.',
    funFact: 'Quần thể Di tích Cố đô Huế là Di sản Văn hóa Thế giới đầu tiên của Việt Nam được UNESCO công nhận.',
    mapX: 52.0,
    mapY: 43.0,
    accentColor: '#9333ea',
    trivia: {
      question: 'Cầu Trường Tiền bắc qua sông Hương gồm 6 nhịp vòm thép, mỗi nhịp dài 67 mét. Tổng chiều dài 6 nhịp là bao nhiêu?',
      options: ['392 m', '402 m', '412 m', '420 m'],
      correctIndex: 1,
      fact: '6 × 67 = 402 mét!'
    }
  },
  {
    destKey: 'danang_dragon',
    name: 'Đà Nẵng — Cầu Rồng',
    shortName: 'Đà Nẵng',
    region: 'Duyên hải Miền Trung',
    distanceKm: 765,
    ticketCoins: 52,
    requiredLevel: 6,
    description: 'Check-in Cầu Rồng rực rỡ bên sông Hàn cùng bãi biển Mỹ Khê nắng vàng cát mịn.',
    funFact: 'Vào tối cuối tuần, Cầu Rồng Đà Nẵng có màn trình diễn phun lửa và phun nước độc đáo.',
    mapX: 57.0,
    mapY: 48.0,
    accentColor: '#0ea5e9',
    trivia: {
      question: 'Nếu một đoàn xe đạp vượt chặng Hà Nội → Đà Nẵng dài 765 km trong 9 ngày đều đặn, trung bình mỗi ngày đi bao nhiêu km?',
      options: ['75 km', '80 km', '85 km', '90 km'],
      correctIndex: 2,
      fact: '765 : 9 = 85 km mỗi ngày!'
    }
  },
  {
    destKey: 'nhatrang_beach',
    name: 'Nha Trang — Biển Xanh',
    shortName: 'Nha Trang',
    region: 'Nam Trung Bộ',
    distanceKm: 1280,
    ticketCoins: 68,
    requiredLevel: 8,
    description: 'Đón gió biển xanh biếc, tháp Trầm Hương rạng ngời và khu vui chơi Đảo Hòn Tre.',
    funFact: 'Vịnh Nha Trang được công nhận là một trong những vịnh biển đẹp nhất hành tinh.',
    mapX: 64.5,
    mapY: 66.0,
    accentColor: '#06b6d4',
    trivia: {
      question: 'Từ Hà Nội đi Nha Trang dài 1.280 km. Quãng đường đi và về (khứ hồi) tổng cộng dài bao nhiêu km?',
      options: ['2.460 km', '2.560 km', '2.660 km', '2.500 km'],
      correctIndex: 1,
      fact: '1.280 × 2 = 2.560 km!'
    }
  },
  {
    destKey: 'dalat_flowers',
    name: 'Đà Lạt — Thành Phố Ngàn Hoa',
    shortName: 'Đà Lạt',
    region: 'Tây Nguyên',
    distanceKm: 1420,
    ticketCoins: 80,
    requiredLevel: 10,
    description: 'Hít thở khí trời se lạnh giữa rừng thông reo, Hồ Xuân Hương và quảng trường hoa Dã Quỳ.',
    funFact: 'Đà Lạt nằm trên cao nguyên Lâm Viên ở độ cao khoảng 1.500 m nên mát mẻ quanh năm.',
    mapX: 58.5,
    mapY: 71.0,
    accentColor: '#a855f7',
    trivia: {
      question: 'Hồ nước thơ mộng hình trăng lưỡi liềm nằm ngay giữa trung tâm thành phố Đà Lạt tên là gì?',
      options: ['Hồ Tuyền Lâm', 'Hồ Xuân Hương', 'Hồ Tây', 'Hồ Ba Bể'],
      correctIndex: 1,
      fact: 'Hồ Xuân Hương là trái tim xanh của thành phố ngàn hoa Đà Lạt!'
    }
  },
  {
    destKey: 'hcm_landmark',
    name: 'TP. Hồ Chí Minh — Bến Thành',
    shortName: 'TP. Hồ Chí Minh',
    region: 'Miền Nam',
    distanceKm: 1720,
    ticketCoins: 98,
    requiredLevel: 12,
    description: 'Hội ngộ tại thành phố năng động bậc nhất phía Nam với Chợ Bến Thành và tòa tháp Landmark 81.',
    funFact: 'Khoảng cách tuyến Bắc-Nam từ Hà Nội đến TP.HCM hơn 1.700 km.',
    mapX: 49.5,
    mapY: 79.0,
    accentColor: '#ea580c',
    trivia: {
      question: 'Tòa tháp Landmark 81 tại TP.HCM cao 461,2m với 81 tầng nổi. Nếu 1 tòa nhà khác có 27 tầng, Landmark 81 nhiều gấp mấy lần số tầng?',
      options: ['2 lần', '3 lần', '4 lần', '5 lần'],
      correctIndex: 1,
      fact: '81 : 27 = 3 lần!'
    }
  },
  {
    destKey: 'phuquoc_island',
    name: 'Đảo Ngọc Phú Quốc',
    shortName: 'Phú Quốc',
    region: 'Cực Nam Tổ Quốc',
    distanceKm: 2050,
    ticketCoins: 120,
    requiredLevel: 15,
    description: 'Đi cáp treo vượt biển dài nhất và ngắm hoàng hôn rực rỡ trên bờ cát trắng Đảo Ngọc.',
    funFact: 'Phú Quốc là hòn đảo lớn nhất Việt Nam nằm tại vùng biển Tây Nam thanh bình.',
    mapX: 34.5,
    mapY: 86.0,
    accentColor: '#f97316',
    trivia: {
      question: 'Nếu máy bay bay từ Hà Nội tới Phú Quốc mất 2 giờ 10 phút và cất cánh lúc 08:30, bạn sẽ hạ cánh lúc mấy giờ?',
      options: ['10:10', '10:30', '10:40', '11:00'],
      correctIndex: 2,
      fact: '08:30 + 2 giờ 10 phút = 10:40 sáng!'
    }
  }
];

export const QUICK_CHAT_PRESETS: { label: string; text: string }[] = [
  { label: 'Chào cả Sảnh!', text: 'Chào mọi người ở Sảnh nhé!' },
  { label: 'Thi Đấu Trường!', text: 'Có bạn nào muốn thi Đấu Trường 60s không?' },
  { label: 'Đồ đẹp quá!', text: 'Bộ trang bị của bạn ngầu quá đi!' },
  { label: 'Đi du hành!', text: 'Cày thêm Xu để bay đi Đà Lạt & Phú Quốc thôi!' },
  { label: 'Cố lên nhé!', text: 'Chúc các bạn hôm nay đạt điểm 10/10 nha!' },
  { label: 'Thân thiện', text: 'Rất vui được làm quen cùng bạn!' }
];

export const EMOTE_STICKERS: { id: string; symbol: string; label: string }[] = [
  { id: 'wave', symbol: '👋', label: 'Vẫy tay' },
  { id: 'heart', symbol: '❤️', label: 'Thả tim' },
  { id: 'star', symbol: '⭐', label: 'Tặng sao' },
  { id: 'party', symbol: '🎉', label: 'Ăn mừng' },
  { id: 'rocket', symbol: '🚀', label: 'Lên đường' },
  { id: 'spark', symbol: '🔥', label: 'Siêu đỉnh' }
];

export function getVehicleDiscountPct(vehicleId?: string): number {
  if (!vehicleId) return 0;
  if (['veh_hoverboard', 'veh_spaceship', 'veh_magic_carpet'].includes(vehicleId)) return 30;
  if (['veh_scooter_pastel', 'veh_mountain', 'veh_ebike'].includes(vehicleId)) return 15;
  return 0;
}

export function getDiscountedTicketPrice(baseCoins: number, vehicleId?: string): number {
  if (baseCoins <= 0) return 0;
  const pct = getVehicleDiscountPct(vehicleId);
  return Math.max(1, Math.round((baseCoins * (100 - pct)) / 100));
}
