# SỔ ĐĂNG KÝ HOẠT ĐỘNG XỬ LÝ DỮ LIỆU – HSV
**Tài liệu nội bộ – cần hoàn thiện qua kiểm kê source, Supabase, hosting và hợp đồng nhà cung cấp.**

## 1. Bản đồ dữ liệu sơ bộ

| Dữ liệu | Nguồn | Mục đích | Bên nhận/địa điểm | Trạng thái |
|---|---|---|---|---|
| Supabase Auth user ID, thông tin đăng nhập | Auth | Xác thực | Supabase; region cần xác minh (báo cáo cũ: Seoul) | Cần xác minh |
| Biệt danh, khối lớp, hồ sơ | Form/app | Hồ sơ và cá nhân hóa | Supabase | Có trong source/schema |
| Bài làm, câu trả lời, điểm, tiến độ | Hoạt động học | Chấm điểm và lưu tiến độ | Supabase | Có trong mô hình |
| XP, Xu, avatar, vật phẩm | Hoạt động game | Vận hành game giáo dục | Supabase/frontend | Có trong mô hình |
| Visit count/online presence | Website | Thống kê vận hành | Supabase hoặc dịch vụ liên quan | Có hook; cần xác minh trường dữ liệu |
| Feedback | Form | Hỗ trợ | Backend | Cần xác minh schema thực tế |
| Google Fonts | Trình duyệt | Hiển thị font | Google | Có external font import |
| Hosting/CDN/DNS | Website | Phân phối trang | GitHub Pages/nhà cung cấp liên quan | Cần xác minh hợp đồng/log |
| AI API | Source dependency/config | Tính năng AI nếu có | Google hoặc bên cung cấp | Chưa xác minh có gọi runtime |

## 2. Bắt buộc hoàn tất kiểm kê

- [ ] Xác định controller/operator và vai trò từng trường học.
- [ ] Xác nhận project Supabase, region, backup, subprocessors và hợp đồng.
- [ ] Kiểm tra schema, Edge Functions, logs, Storage, auth logs, realtime.
- [ ] Quét source để xác định tất cả điểm gọi mạng và SDK bên thứ ba.
- [ ] Kiểm tra browser cookies, localStorage, sessionStorage trước/sau login.
- [ ] Kiểm tra access logs của hosting/CDN/DNS và thời hạn lưu.
- [ ] Xác định dữ liệu nào của trẻ, dữ liệu nào nhạy cảm theo danh mục pháp luật.
- [ ] Lập lịch lưu trữ và xóa cho từng nhóm.
- [ ] Rà soát chuyển dữ liệu xuyên biên giới; nếu có, thực hiện hồ sơ đánh giá tác động/thủ tục theo Luật 91 và Nghị định 356.
- [ ] Rà soát hợp đồng xử lý dữ liệu với từng nhà cung cấp.
- [ ] Chỉ định đầu mối/bộ phận bảo vệ dữ liệu cá nhân theo nghĩa vụ áp dụng.
- [ ] Thiết lập quy trình sự cố, thông báo và diễn tập.

## 3. Rủi ro ưu tiên

### R1 – Hosting Supabase tại Seoul
Nếu dữ liệu học sinh được lưu/xử lý tại Seoul, có yếu tố chuyển dữ liệu cá nhân xuyên biên giới. Cần xác nhận region thực tế, bên nhận, luồng dữ liệu, mục đích, loại dữ liệu, biện pháp bảo vệ và nghĩa vụ hồ sơ theo Nghị định 356/2025/NĐ-CP. Không chỉ ghi chung chung trong chính sách.

### R2 – Tài khoản trẻ em
Cần cơ chế tài khoản trường học và B2C tách biệt; xác định ai là người tạo tài khoản, ai có quyền đại diện và cách xác minh. Không mặc định trẻ tự đăng ký công khai bằng biệt danh/mật khẩu là đã đủ cơ sở.

### R3 – Leaderboard
Chỉ alias; mặc định không công khai; cần opt-in riêng, consent của người đại diện và ý kiến của trẻ theo trường hợp pháp luật yêu cầu.

### R4 – Analytics/online counter
Xác minh IP, user-agent, cookie, timestamp và định danh; giảm dữ liệu, đặt retention, không hiển thị thống kê có thể nhận diện trẻ.

### R5 – Thông tin nhận diện nhà vận hành
Footer hiện có cụm “Học Siêu Vui by dungvt.hbh VNPT” và một địa chỉ email quản trị được hiển thị công khai. Cần xác định có phải thương hiệu/sản phẩm chính thức của VNPT không; nếu không có thẩm quyền, sửa cách ghi để tránh gây nhầm lẫn. Không nên công khai email cá nhân/quản trị trong giao diện; thay bằng email hỗ trợ chính thức.

## 4. Căn cứ pháp lý và mốc rà soát

- Luật 91/2025/QH15, hiệu lực 01/01/2026.
- Nghị định 356/2025/NĐ-CP, hiệu lực 01/01/2026; Nghị định 13/2023/NĐ-CP hết hiệu lực từ cùng ngày.
- Luật Trẻ em 2016; Nghị định 56/2017/NĐ-CP.
- Luật Bảo vệ quyền lợi người tiêu dùng 19/2023/QH15.
- Nghị định 147/2024/NĐ-CP; xác định mô hình dịch vụ và nghĩa vụ cụ thể trước khi kết luận.

## 5. Cổng phê duyệt phát hành

Không xuất bản chính sách cho tới khi:
1. Đơn vị vận hành, địa chỉ, email và người chịu trách nhiệm đã được xác nhận.
2. Bản đồ dữ liệu và nhà cung cấp được kiểm chứng.
3. Nghĩa vụ chuyển dữ liệu xuyên biên giới được đánh giá và xử lý.
4. Thời hạn lưu trữ, xóa và xử lý yêu cầu đã có khả năng thực thi.
5. Luồng đồng ý của phụ huynh/trẻ em được kiểm thử.
6. Nội dung được luật sư/đơn vị chuyên môn rà soát.
7. Chủ dự án phê duyệt version và ngày hiệu lực.


## 6. Chủ thể vận hành – thông tin đã xác nhận

- Hình thức vận hành: cá nhân.
- Tính độc lập: dự án độc lập, không phải sản phẩm chính thức của VNPT.
- Email liên hệ do chủ dự án cung cấp: dungvt.hbh@gmail.com.
- Họ tên đầy đủ, địa chỉ liên hệ: chưa được cung cấp.
- Mã số thuế/đăng ký: chưa xác định; cần đánh giá theo mô hình hoạt động thực tế, đặc biệt nếu có thu phí hoặc cung cấp dịch vụ mang tính kinh doanh.

## 7. Trạng thái công bố

Thông tin email có thể được điền vào bản dự thảo, nhưng chưa đủ điều kiện công bố bộ chính sách. Không dùng cụm “VNPT” như nhãn bảo trợ/đơn vị vận hành trên website nếu chưa có căn cứ cho phép. Source hiện có ticker đã được chỉnh trên nhánh pháp lý; các điểm hiển thị thương hiệu khác cần rà soát toàn bộ trước khi phát hành.
