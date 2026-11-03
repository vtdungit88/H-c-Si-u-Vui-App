# HƯỚNG DẪN TRIỂN KHAI, VẬN HÀNH & MỞ RỘNG HỆ THỐNG
## HỌC SIÊU VUI (HOCSIEUVUI PLATFORM)
*Tài liệu kỹ thuật dành cho Nhà phát triển, Quản trị viên hệ thống & Đội ngũ triển khai*

---

## PHẦN 1: CHẠY HỆ THỐNG TRÊN MÁY TÍNH CÁ NHÂN (LOCAL PC / LAPTOP)

### 1.1. Yêu cầu môi trường tối thiểu
- **Hệ điều hành:** Windows 10/11, macOS, hoặc Linux (Ubuntu, Debian, Fedora...).
- **Node.js:** Phiên bản 18.0.0 trở lên (khuyên dùng Node.js 20 LTS hoặc 22 LTS).
- **Trình quản lý gói:** `npm` (đi kèm Node.js) hoặc `pnpm` / `yarn`.
- **Trình duyệt web:** Google Chrome, Microsoft Edge, Cốc Cốc, Safari hoặc Firefox.

### 1.2. Các bước cài đặt và khởi chạy Development Server
Mở terminal (PowerShell, Command Prompt hoặc Terminal trên macOS/Linux) tại thư mục dự án:

```bash
# 1. Cài đặt toàn bộ thư viện dependencies
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev
```

Sau khi chạy lệnh trên, terminal sẽ xuất thông báo:
```
  VITE v8.x.x  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.x:3000/
```
Mở trình duyệt truy cập: `http://localhost:3000` để bắt đầu trải nghiệm!

### 1.3. Mở mạng nội bộ LAN (Cho phép điện thoại, máy tính bảng cùng WiFi truy cập)
Khi chạy lệnh `npm run dev`, Vite đã được cấu hình cờ `--host=0.0.0.0`, cho phép bất kỳ thiết bị nào cùng mạng WiFi nội bộ truy cập được thông qua địa chỉ IP của máy tính:
1. Xem dòng `Network: http://192.168.x.x:3000/` trên terminal.
2. Dùng điện thoại (iPhone hoặc Android) kết nối cùng mạng WiFi, mở trình duyệt gõ địa chỉ IP đó (ví dụ: `http://192.168.1.50:3000`).
3. Ứng dụng sẽ hiển thị ngay trên điện thoại với giao diện mobile siêu mượt mà!

### 1.4. Đóng gói bản Production chạy độc lập (Production Build)
Để chạy bản tối ưu hóa cao nhất, nén code và assets cho môi trường thực tế:

```bash
# Đóng gói sản phẩm ra thư mục dist/
npm run build

# Chạy thử bản production bằng máy chủ tĩnh
npx serve -s dist -l 3000
```

---

## PHẦN 2: TRIỂN KHAI LÊN CLOUD (CLOUD HOSTING)

### 2.1. Triển khai 1-Click lên Vercel / Netlify / Cloudflare Pages (Khuyên Dùng – Miễn Phí)
Học Siêu Vui là ứng dụng React SPA + Vite PWA chuẩn, có thể deploy chỉ trong 1 phút lên các nền tảng Edge Hosting hàng đầu thế giới:

1. **Vercel (vercel.com):**
   - Đẩy mã nguồn lên GitHub/GitLab.
   - Đăng nhập Vercel ➔ Chọn **Add New Project** ➔ Chọn repository.
   - Framework Preset: Chọn **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Bấm **Deploy**. Vercel sẽ tự động cấp chứng chỉ bảo mật SSL HTTPS và tên miền miễn phí dạng `hocsieuvui.vercel.app`.

2. **Netlify (netlify.com):**
   - Tạo file `public/_redirects` với nội dung: `/*    /index.html   200` để hỗ trợ SPA Routing.
   - Liên kết GitHub và bấm deploy tương tự.

---

### 2.2. Triển khai lên máy chủ VPS Linux (Ubuntu / Nginx / PM2 / SSL HTTPS)
Dành cho trường học, trung tâm giáo dục hoặc doanh nghiệp muốn sở hữu máy chủ riêng đặt tại Việt Nam:

#### Bước 1: Cài đặt Node.js và Nginx trên Ubuntu
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx
```

#### Bước 2: Tải mã nguồn và Build
```bash
cd /var/www
git clone <URL_REPO_CUA_BAN> hocsieuvui
cd hocsieuvui
npm install
npm run build
```

#### Bước 3: Cấu hình Virtual Host Nginx
Tạo file cấu hình `/etc/nginx/sites-available/hocsieuvui.conf`:
```nginx
server {
    listen 80;
    server_name hocsieuvui.vn www.hocsieuvui.vn;

    root /var/www/hocsieuvui/dist;
    index index.html;

    # Gzip nén dữ liệu tăng tốc độ tải trang
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cấu hình PWA Service Worker không cache vĩnh viễn
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
        expires off;
        access_log off;
    }

    # SPA Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Kích hoạt cấu hình và khởi động lại Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/hocsieuvui.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Bước 4: Cài chứng chỉ bảo mật SSL HTTPS miễn phí (Let's Encrypt)
*Bắt buộc phải có HTTPS để tính năng PWA cài đặt ra màn hình hoạt động hợp lệ trên điện thoại:*
```bash
sudo certbot --nginx -d hocsieuvui.vn -d www.hocsieuvui.vn
```

---

### 2.3. Triển khai bằng Docker (`Dockerfile` & `docker-compose.yml`)
Nếu bạn sử dụng hạ tầng Container (Kubernetes, Docker Swarm, Google Cloud Run):

#### `Dockerfile`:
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve với Nginx siêu nhẹ
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### `docker-compose.yml`:
```yaml
version: '3.8'
services:
  hocsieuvui-web:
    build: .
    container_name: hocsieuvui_app
    restart: always
    ports:
      - "3000:80"
```

Chạy lệnh: `docker compose up -d` để khởi chạy container!

---

## PHẦN 3: HƯỚNG DẪN KẾT NỐI & CHUYỂN ĐỔI CƠ SỞ DỮ LIỆU (DATABASE MIGRATION)

Hiện tại, hệ thống sử dụng kiến trúc **Client-Side Storage (LocalStorage)** kết hợp cơ chế mã hóa và quản trị phiên, giúp ứng dụng hoạt động tức thì, không phát sinh chi phí duy trì server database cho giai đoạn thử nghiệm.

Khi số lượng học sinh vượt mốc **1.000 - 100.000 tài khoản**, bạn có thể dễ dàng chuyển đổi sang cơ sở dữ liệu tập trung dựa trên các file schema đã xuất sẵn trong thư mục `/data-export/`:

### 3.1. Chuyển sang PostgreSQL / MySQL
Sử dụng file `/data-export/database-schema.json`:
1. Tạo database: `CREATE DATABASE hocsieuvui;`
2. Tạo các bảng: `students`, `avatar_configurations`, `student_inventory`, `student_lesson_progress`, `shop_items`, `system_announcements`.
3. Viết API Backend bằng Express/NestJS (Node.js) hoặc FastAPI (Python):
   - `POST /api/auth/register`: Đăng ký tài khoản học sinh.
   - `POST /api/auth/login`: Xác thực mật khẩu.
   - `GET /api/lessons`: Lấy danh sách bài học và câu hỏi.
   - `POST /api/lessons/complete`: Ghi nhận điểm số, cộng Xu và Sao vào tài khoản trên DB.
   - `GET /api/leaderboard`: Truy vấn Top 10 học sinh có tổng Sao và Xu cao nhất:
     ```sql
     SELECT id, name, grade, school, level, coins, stars, high_score_blitz 
     FROM students 
     WHERE is_guest = false 
     ORDER BY stars DESC, coins DESC 
     LIMIT 10;
     ```

### 3.2. Chuyển sang Firebase / Supabase
- **Firebase Firestore:** Sử dụng cấu trúc Document & Collections:
  - Collection `students` -> Document `{studentId}`
  - Collection `lessons` -> Document `{lessonId}`
  - Collection `shop_items` -> Document `{itemId}`
- **Supabase (PostgreSQL Cloud miễn phí):** Chỉ cần nạp trực tiếp file `database-schema.json` vào SQL Editor của Supabase để có ngay hệ thống Auth + Database + Realtime REST API!

---

## PHẦN 4: CHIẾN LƯỢC QUẢNG BÁ SẢN PHẨM & CHẠY QUẢNG CÁO (MARKETING & GROWTH)

Để thu hút hàng chục nghìn học sinh, phụ huynh và giáo viên tham gia:

### 4.1. Tối ưu đường dẫn với mã UTM Tracking
Trong component `InstallShareModal.tsx`, hệ thống đã tích hợp sẵn cơ chế sinh link thông minh:
- **Kênh Zalo Phụ Huynh / Nhóm Lớp:**
  `https://hocsieuvui.vn?utm_source=zalo&utm_medium=group_chat&utm_campaign=toan6`
- **Kênh Facebook & Fanpage:**
  `https://hocsieuvui.vn?utm_source=facebook&utm_medium=fanpage_post&utm_campaign=toan6`
- **Chiến dịch chạy quảng cáo Facebook Ads / Google Ads:**
  `https://hocsieuvui.vn?utm_source=cpc_ads&utm_medium=paid_search&utm_campaign=toan6_hki`

### 4.2. Thẻ hiển thị OpenGraph thu hút (CTR cao)
Mỗi khi gửi link qua Zalo hoặc Facebook, tin nhắn sẽ tự động bung ra thẻ hình ảnh lớn (Large Social Card) với:
- Hình ảnh đại diện linh vật **3D Mascot** lấp lánh nụ cười tri thức.
- Tiêu đề giật tít thân thiện: *"Học Siêu Vui – Game Học Toán 6 Bám Sát SGK Vui Nhộn Nhất"*.
- Lời kêu gọi hành động (Call To Action): *"Nhận ngay quà khởi nghiệp 120 Xu khi đăng ký biệt danh!"*.

### 4.3. Kế hoạch mở rộng nội dung (Content Roadmap)
1. **Giai đoạn 1 (Hiện tại):** Hoàn thiện Toán 6 Tập 1, Đấu trường 60s, Studio phụ kiện, Bảng xếp hạng, PWA.
2. **Giai đoạn 2:** Bổ sung môn **Toán 6 - Tập 2** (Phân số, Số thập phân, Hình học phẳng, Dữ liệu và xác suất thực nghiệm).
3. **Giai đoạn 3:** Mở rộng các môn học lớp 6 khác: **Ngữ Văn**, **Khoa Học Tự Nhiên (Lý - Hóa - Sinh)**, **Tiếng Anh Global Success**.
4. **Giai đoạn 4:** Mở rộng sang các khối lớp **7, 8, 9** để phục vụ toàn bộ cấp THCS.

---

*Tài liệu hướng dẫn được biên soạn bởi dungvt.hbh VNPT.*
