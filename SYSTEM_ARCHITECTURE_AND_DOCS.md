# HỌC SIÊU VUI – TÀI LIỆU KIẾN TRÚC HỆ THỐNG & ĐẶC TẢ TÍNH NĂNG TOÀN DIỆN
**Nền Tảng Vừa Học Vừa Chơi Bám Sát Sách Giáo Khoa Toán Lớp 6 (NXB Giáo Dục Việt Nam)**
*Phiên bản hệ thống: hocsieuvui ver 5*
*Đại diện phát triển: dungvt.hbh VNPT (dungvt.hbh@gmail.com)*

---

## 1. TỔNG QUAN HỆ THỐNG & TRIẾT LÝ THIẾT KẾ
**Học Siêu Vui** là nền tảng giáo dục game hóa (Gamified EdTech Web Application) tiên phong dành cho học sinh THCS, khởi đầu với chương trình **Toán lớp 6 - Tập 1**. 

### 1.1. Triết lý cốt lõi:
- **Biến giờ học Toán thành cuộc phiêu lưu thú vị:** Loại bỏ cảm giác khô khan, áp lực; thay bằng cơ chế giải đố thông minh, hình ảnh minh họa vector sinh động, mẹo học hài hước và tích lũy điểm thưởng.
- **Bám sát 100% chương trình SGK chuẩn:** Hệ thống bài học, thuật ngữ toán học, ví dụ và bài tập bám sát theo bộ SGK hiện hành (Kết nối tri thức với cuộc sống / Chân trời sáng tạo / Cánh diều) của Nhà Xuất Bản Giáo Dục Việt Nam.
- **Cơ chế kinh tế học đường (Gamification Economy):** Học sinh giải đúng bài tập để nhận **Xu 🪙** và **Sao ⭐**, dùng để nâng cấp nhân vật trong **Studio của tôi**, sắm phụ kiện (xe đạp, máy tính, điện thoại, pet cưng) và leo bảng vàng toàn trường.
- **Tiếp cận đa nền tảng (PWA Ready):** Hoạt động mượt mà trên cả điện thoại (iOS Safari, Android Chrome), máy tính bảng và máy tính để bàn (PC/Laptop Windows, Mac, Linux) với khả năng cài đặt ra màn hình như ứng dụng gốc không cần tải app store.

---

## 2. NGĂN XẾP CÔNG NGHỆ (TECH STACK)
| Thành Phần | Công Nghệ Sử Dụng | Vai Trò & Ưu Điểm |
| :--- | :--- | :--- |
| **Giao Diện (Frontend)** | React 19 + TypeScript | Hiệu năng cao, type-safety tuyệt đối, quản lý state linh hoạt |
| **Công Cụ Build & PWA** | Vite 8 + `vite-plugin-pwa` | Khởi động siêu tốc, tự động sinh Service Worker, Web App Manifest |
| **Kiểu Dáng & Đồ Họa** | Tailwind CSS v4 + Motion | Thiết kế hiện đại, responsive hoàn hảo trên mọi kích thước màn hình |
| **Hiệu Ứng Game** | Canvas Confetti + Web Audio API | Âm thanh retro 8-bit, pháo hoa mừng chiến thắng không phụ thuộc file mp3 ngoài |
| **Lưu Trữ Dữ Liệu** | LocalStorage + JSON Export | Lưu trữ an toàn trên thiết bị người dùng, xuất file sao lưu JSON chuẩn hóa |
| **Nhận Diện Thương Hiệu** | 3D Mascot Icon (1024x1024) | Hình ảnh học sinh đeo kính thông thái, thân thiện, bản quyền độc quyền |

---

## 3. CẤU TRÚC THƯ MỤC NGUỒN (SOURCE CODE STRUCTURE)
```
/
├── public/
│   ├── assets/aistudio/image_f524b230.png  # Biểu tượng 3D Mascot chính thức
│   ├── favicon.png                         # Favicon trình duyệt
│   ├── apple-touch-icon.png                # Icon màn hình chính iOS
│   ├── pwa-192x192.png                     # Icon PWA chuẩn Android
│   ├── pwa-512x512.png                     # Icon PWA độ phân giải cao
│   └── pwa-maskable-512x512.png            # Icon PWA Maskable Android
├── data-export/
│   ├── database-schema.json                # Lược đồ cơ sở dữ liệu quan hệ & NoSQL
│   ├── math-lessons-sgk6.json              # Toàn bộ dữ liệu 10 bài học SGK Toán 6
│   ├── shop-items.json                     # Danh mục 35+ phụ kiện Studio
│   └── initial-seed-data.json              # Dữ liệu ban đầu để khởi tạo server mới
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                      # Thanh điều hướng 3 vùng, wallet, online count
│   │   ├── MathGameArena.tsx               # Đấu trường giải bài học SGK Toán 6
│   │   ├── SpeedRunBlitz.tsx               # Chế độ đấu trường tốc độ 60 giây
│   │   ├── AdventureMap.tsx                # Bản đồ hải trình 10 ải vector phiêu lưu
│   │   ├── AvatarStudio.tsx                # Studio tạo hình nhân vật & sắm đồ
│   │   ├── AvatarRenderer.tsx              # Component dựng hình Avatar vector đa lớp
│   │   ├── GlobalLeaderboard.tsx           # Bảng xếp hạng vinh danh học sinh
│   │   ├── SubjectCourseSelector.tsx       # Bộ chọn môn học & khối lớp mở rộng
│   │   ├── LoginModal.tsx                  # Đăng nhập, đăng ký biệt danh, gợi ý vui
│   │   ├── StudentIdCardModal.tsx          # Thẻ học sinh thông minh kèm mã QR
│   │   ├── AdminPanelModal.tsx             # Cổng quản trị viên, tinh chỉnh, xuất DB
│   │   └── InstallShareModal.tsx           # Hướng dẫn cài PWA & tạo link Zalo/Facebook
│   ├── hooks/
│   │   └── usePWAInstall.ts                # Hook quản lý trạng thái cài đặt PWA
│   ├── data/
│   │   ├── math6Lessons.ts                 # Ngân hàng đề bài SGK Toán 6 Tập 1
│   │   ├── items.ts                        # Dữ liệu vật phẩm, giá Xu, giá Sao
│   │   ├── subjectsCatalog.ts              # Danh mục các môn học mở rộng
│   │   ├── leaderboardData.ts              # Dữ liệu bảng xếp hạng học sinh
│   │   └── versionHistory.ts               # Hằng số phiên bản & đường dẫn logo
│   ├── utils/
│   │   ├── audio.ts                        # Hệ thống âm thanh Synthesizer không cần file
│   │   └── studentStorage.ts               # Tầng lưu trữ dữ liệu & xử lý tài khoản
│   ├── types.ts                            # Khai báo TypeScript types toàn hệ thống
│   ├── App.tsx                             # Component trung tâm ứng dụng
│   ├── main.tsx                            # Điểm khởi chạy React DOM
│   └── index.css                           # Import Tailwind CSS
├── index.html                              # Entry HTML, SEO OpenGraph, Schema.org
├── vite.config.ts                          # Cấu hình Vite & plugin VitePWA
└── package.json                            # Danh sách thư viện và scripts
```

---

## 4. CHI TIẾT CÁC TÍNH NĂNG & GAMEPLAY (GAMEPLAY MECHANICS)

### 4.1. Chế độ học tập bám sát SGK Toán 6 Tập 1 (`MathGameArena.tsx`)
- **Nội dung 10 bài học chuẩn SGK:**
  1. *Bài 1:* Tập hợp & Phần tử của tập hợp (ký hiệu ∈, ∉, cách viết chỉ liệt kê 1 lần).
  2. *Bài 2:* Tập hợp các số tự nhiên & Ghi số tự nhiên (hệ thập phân, số La Mã).
  3. *Bài 3:* Các phép tính cộng, trừ, nhân, chia trong tập hợp số tự nhiên (tính chất phân phối, chia hết, chia có dư).
  4. *Bài 4:* Lũy thừa với số mũ tự nhiên (nhân chia hai lũy thừa cùng cơ số $a^m \cdot a^n = a^{m+n}$).
  5. *Bài 5:* Thứ tự thực hiện các phép tính (ngoặc tròn `()`, ngoặc vuông `[]`, ngoặc nhọn `{}`).
  6. *Bài 6:* Dấu hiệu chia hết cho 2, 3, 5, 9 (tổng các chữ số, chữ số tận cùng).
  7. *Bài 7:* Số nguyên tố, Hợp số, Phân tích một số ra thừa số nguyên tố (sàng Eratosthenes).
  8. *Bài 8:* Ước chung & Ước chung lớn nhất (ƯCLN - thuật toán phân tích thừa số nguyên tố chung).
  9. *Bài 9:* Bội chung & Bội chung nhỏ nhất (BCNN - thừa số nguyên tố chung và riêng với số mũ lớn nhất).
  10. *Bài 10:* Tập hợp các số nguyên (biểu diễn số âm trên trục số, độ sâu mực nước biển, nhiệt độ âm).
- **Trải nghiệm học sinh:**
  - Tóm tắt lý thuyết bằng gạch đầu dòng ngắn gọn trước khi làm bài.
  - Mỗi bài gồm 3-4 câu hỏi trắc nghiệm với hình ảnh minh họa vector (tập hợp, trục số, sơ đồ phân tích thừa số).
  - Chọn đúng: Âm thanh chúc mừng `correct`, cộng Xu 🪙 và Sao ⭐, hiển thị lời giải thích chi tiết.
  - Chọn sai: Âm thanh `wrong`, học sinh được đọc **Mẹo học vui (Funny Tip)** để nhớ lâu hơn và làm lại.
  - Hoàn thành bài học: Hiệu ứng pháo hoa `canvas-confetti` rực rỡ và cấp huy hiệu sao tương ứng.

### 4.2. Đấu trường tốc độ 60 giây (`SpeedRunBlitz.tsx`)
- **Luật chơi:** Học sinh có đúng 60 giây đếm ngược để giải nhiều phép tính nhẩm Toán 6 nhất có thể.
- **Hệ thống câu hỏi động:** Tự động sinh ngẫu nhiên các phép toán: lũy thừa ($2^3, 3^2, 5^2$), chia có dư, tìm ước chung, tính nhẩm số nguyên âm $(-5 + 8, -3 \times 4)$.
- **Combo nhân điểm:** Trả lời đúng liên tiếp tạo hiệu ứng Combo x2, x3 và thưởng thêm Xu.
- **Kỷ lục cá nhân:** Điểm số cao nhất được ghi nhận vào hồ sơ và hiển thị trên thẻ học sinh.

### 4.3. Bản đồ hải trình 10 ải (`AdventureMap.tsx`)
- **Giao diện:** Thiết kế hải trình vector biển đảo rực rỡ, mỗi hòn đảo đại diện cho một ải bài học SGK Toán 6.
- **Trạng thái ải:**
  - Ải đã hoàn thành: Cắm cờ chiến thắng, phát sáng hào quang và hiển thị số Sao đạt được (1-3 Sao).
  - Ải hiện tại: Hiệu ứng nhịp đập mời gọi học sinh vào thử thách.
  - Ải chưa mở khóa: Biểu tượng ổ khóa màu bạc, yêu cầu hoàn thành ải trước đó để vượt tiếp.

### 4.4. Studio của tôi (`AvatarStudio.tsx` & `AvatarRenderer.tsx`)
- **Tùy biến ngoại hình:**
  - Chọn giới tính: Học sinh Nam 👦, Học sinh Nữ 👧, Nhà Toán Học 🧙‍♂️.
  - Màu da: 5 tông màu tự nhiên.
  - Kiểu tóc & màu tóc: Tóc ngắn chỉn chu, tóc buộc hai bên, tóc xoăn bồng bềnh, tóc vuốt học sinh gương mẫu.
  - Biểu cảm khuôn mặt: Mắt kính lấp lánh thông minh, nụ cười rạng rỡ, kính tròn Nobita, mắt thần đồng.
- **Tủ đồ 35+ phụ kiện phân cấp độ:**
  - *Trang phục:* Đồng phục khăn quàng đỏ (miễn phí), Áo thể dục 3 sọc (80 Xu), Hoodie Số Học (200 Xu + 3 Sao), Vest Thám Tử (450 Xu + 8 Sao), Áo choàng Pháp sư Toán học (900 Xu + 20 Sao).
  - *Đồ cầm tay:* Bút chì thước kẻ compa (miễn phí), Thước đo độ vàng, Sách giải bài tập nâng cao, Bảng tính phép thuật, Cúp vàng danh dự.
  - *Phương tiện đi học:* Xe đạp thể thao địa hình, Ván trượt phản lực, Xe máy điện VinFast, Ô tô thể thao tương lai.
  - *Thiết bị công nghệ:* Điện thoại thông minh camera 3 mắt, Máy tính bảng vẽ hình học, Laptop Gaming chuyên lập trình.
  - *Thú cưng đồng hành:* Cú vọ thông thái, Chú mèo ham học, Rồng lửa số học tí hon.

### 4.5. Bảng vinh danh học sinh toàn cầu (`GlobalLeaderboard.tsx`)
- Hiển thị Top 10 học sinh xuất sắc nhất dựa trên tổng số Sao ⭐ và Xu 🪙 tích lũy.
- Hiển thị đầy đủ Avatar 3D thu nhỏ, tên học sinh, lớp, trường THCS và danh hiệu vinh danh.
- 100% tài khoản học sinh đăng ký thật, không dùng dữ liệu ảo.

### 4.6. Thẻ học sinh thông minh (`StudentIdCardModal.tsx`)
- Thẻ học sinh thiết kế theo chuẩn thẻ học đường hiện đại với dải màu gradient sang trọng.
- Hiển thị đầy đủ: Ảnh Avatar đã phối đồ, Họ tên, Lớp, Trường, Cấp độ, Số Xu, Số Sao, Kỷ lục Blitz 60s, Châm ngôn học tập cá nhân.
- Tích hợp **Mã QR định danh**: Có thể quét bằng điện thoại để xem hồ sơ và chia sẻ bạn bè.

### 4.7. Cổng quản trị viên bảo mật (`AdminPanelModal.tsx`)
- Dành riêng cho quản trị viên **dungvt.hbh VNPT** (`dungvt.hbh@gmail.com`).
- Xác thực bảo mật: Tài khoản `dungvt.hbh` / Mật khẩu `[REDACTED]`.
- **Chức năng quản trị viên:**
  1. Quản lý danh sách học sinh: Xem cấp độ, số Xu/Sao, trường lớp, ID tài khoản.
  2. Tinh chỉnh điểm thưởng: Nút tặng nhanh +100 Xu/+2 Sao cho từng em, hoặc tặng quà toàn trường +200 Xu.
  3. Khôi phục mật khẩu: Đặt lại mật khẩu về mặc định (`hocvui123`) khi học sinh quên.
  4. Xóa tài khoản vi phạm hoặc tài khoản thử nghiệm.
  5. Phát thông báo toàn trang: Đăng tải tin nhắn chạy trên đầu trang cho toàn bộ học sinh.
  6. **Sao lưu & Xuất dữ liệu (Export DB):** Tải về file JSON toàn bộ cơ sở dữ liệu học sinh, bài học và phụ kiện.

### 4.8. Cơ chế PWA & Chia sẻ Mạng Xã Hội (`InstallShareModal.tsx`)
- **Tạo Web App ra màn hình:**
  - Trên điện thoại Android: 1 chạm cài đặt qua sự kiện `beforeinstallprompt` hoặc hướng dẫn menu Chrome.
  - Trên iPhone/iPad (iOS): Hướng dẫn trực quan 2 bước (Bấm nút Share trên Safari ➔ Chọn "Thêm vào MH chính").
  - Trên máy tính (PC/Laptop): Cài đặt thành app độc lập qua Chrome/Edge/Cốc Cốc, chạy cửa sổ riêng không thanh địa chỉ.
- **Tối ưu link chia sẻ mạng xã hội:**
  - Tự động sinh link kèm tham số đo lường chiến dịch (`?utm_source=zalo`, `?utm_source=facebook`, `?utm_source=ads`).
  - Nút sao chép kèm lời mời hấp dẫn: *"🎉 Mời bạn cùng chơi Học Siêu Vui - Giải Toán 6 bám sát SGK, làm bài nhận Xu đổi Avatar cực ngầu!..."*
  - Tích hợp mã QR quét trực tiếp từ màn hình máy tính sang điện thoại.
  - Hiển thị xem trước (Social Card Preview) chuẩn OpenGraph với hình đại diện 3D Mascot.

---

## 5. CƠ CHẾ KINH TẾ TRONG GAME (GAME ECONOMY)
1. **Quà tặng khởi nghiệp:** Mỗi học sinh khi đăng ký tài khoản mới được tặng ngay **120 Xu 🪙** và **3 Sao ⭐** để làm quen với Studio.
2. **Thu nhập từ việc học:**
   - Hoàn thành 1 bài học SGK: Nhận từ **40 - 70 Xu 🪙** và **2 - 4 Sao ⭐** tùy theo độ khó của chương.
   - Chiến thắng Đấu trường 60 giây: Nhận từ **20 - 150 Xu 🪙** tùy số câu đúng và combo.
3. **Tiêu dùng và thăng tiến:**
   - Vật phẩm phổ thông: 50 - 150 Xu.
   - Vật phẩm cao cấp & VIP: 200 - 900 Xu kết hợp điều kiện cần đạt từ 3 - 20 Sao.
   - Đảm bảo học sinh phải thực sự chăm chỉ giải bài tập SGK thì mới mở khóa được các vật phẩm sang chảnh nhất (xe ô tô thể thao, laptop gaming, pet rồng lửa).

---

*Tài liệu được khởi tạo và lưu trữ chính thức trong mã nguồn Học Siêu Vui.*
