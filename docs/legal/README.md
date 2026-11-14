# Học Siêu Vui – Khung tuân thủ pháp lý Việt Nam

**Trạng thái: BẢN NHÁP NỘI BỘ – CHƯA ĐƯỢC CÔNG BỐ / CHƯA CÓ HIỆU LỰC**

Ngày nghiên cứu: 14/11/2026  
Website: https://vnptluongson.cloud/  
Nhánh: feature/legal-compliance-vietnam

## Mục tiêu

Xây dựng bộ chính sách dễ hiểu, phù hợp nền tảng học tập có người dùng là học sinh; công khai minh bạch cách vận hành, dữ liệu được thu thập, quyền của trẻ em và cha mẹ/người đại diện, điều kiện sử dụng và cơ chế tiếp nhận yêu cầu.

Đây là bản thiết kế sản phẩm và dự thảo vận hành, không phải ý kiến tư vấn pháp lý chính thức. Trước khi công bố, đơn vị vận hành cần cung cấp thông tin thật, xác nhận luồng dữ liệu thực tế và nhờ luật sư/đơn vị chuyên môn tại Việt Nam rà soát.

## Bộ tài liệu

1. privacy-policy-draft.md – Chính sách quyền riêng tư và bảo vệ dữ liệu cá nhân.
2. terms-of-use-draft.md – Điều khoản sử dụng.
3. child-protection-policy-draft.md – Chính sách bảo vệ trẻ em trên môi trường mạng.
4. cookie-policy-draft.md – Chính sách cookie và công nghệ tương tự.
5. parental-consent-flow.md – Thiết kế thông báo, đồng ý và quyền của cha mẹ/người đại diện.
6. data-processing-register.md – Danh mục xử lý dữ liệu nội bộ và checklist triển khai.

## Cơ sở pháp lý chính đã tra cứu

- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, hiệu lực 01/01/2026.
- Nghị định 356/2025/NĐ-CP, hiệu lực 01/01/2026; thay thế Nghị định 13/2023/NĐ-CP kể từ 01/01/2026.
- Luật Trẻ em số 102/2016/QH13, đặc biệt quyền bí mật đời sống riêng tư.
- Nghị định 56/2017/NĐ-CP, đặc biệt Điều 33–37 về bảo vệ trẻ em trên môi trường mạng.
- Luật Bảo vệ quyền lợi người tiêu dùng số 19/2023/QH15, hiệu lực 01/07/2024, trong đó Điều 16 về quy tắc bảo vệ thông tin người tiêu dùng và Điều 23 về hợp đồng theo mẫu/điều kiện giao dịch chung.
- Nghị định 147/2024/NĐ-CP về quản lý, cung cấp, sử dụng dịch vụ Internet và thông tin trên mạng. Phải phân loại đúng mô hình dịch vụ để xác định nghĩa vụ áp dụng; không mặc định HSV là mạng xã hội hoặc trò chơi điện tử phải cấp phép.

## Những sự thật kỹ thuật đã biết từ source được rà soát

- Ứng dụng React/Vite; website đang được chủ dự án xác nhận chạy tại vnptluongson.cloud.
- Source có tích hợp Supabase Auth/Database.
- Báo cáo kỹ thuật gần nhất xác định Supabase đặt tại Seoul, Hàn Quốc. Cần xác minh lại trên dashboard và hợp đồng/điều khoản nhà cung cấp.
- Source có thống kê lượt truy cập và số người online; phải xác định dữ liệu nào được ghi (IP, user-agent, cookie, thời điểm, định danh) và thời hạn lưu.
- Source tải Google Fonts từ máy chủ Google; cần đưa vào danh sách bên thứ ba/luồng truyền dữ liệu và cân nhắc self-host.
- Có dữ liệu học tập, bài làm, kết quả, tiến độ, biệt danh, avatar, XP/Xu, lịch sử sử dụng và góp ý.
- Cần rà soát chính xác việc gọi dịch vụ AI, analytics, crash logging, hosting/CDN và các bên nhận dữ liệu khác trước khi công bố.

## Các điểm chặn trước khi xuất bản

Không được điền giả định vào chính sách. Cần chủ dự án xác nhận:
1. Chủ thể vận hành/kiểm soát dữ liệu là cá nhân hay pháp nhân nào; tên pháp lý, mã số thuế (nếu có), địa chỉ liên hệ.
2. HSV có phải sản phẩm/chương trình chính thức của VNPT hay chỉ là dự án cá nhân/độc lập. Không dùng logo, tên hoặc hàm ý VNPT bảo trợ nếu chưa được phép.
3. Email hỗ trợ và đầu mối tiếp nhận yêu cầu dữ liệu/đơn khiếu nại.
4. Đối tượng tuổi, cách xác minh tuổi, cách xác minh cha mẹ/người đại diện.
5. Có thu phí, bán hàng, thanh toán, quảng cáo hoặc mua vật phẩm bằng tiền thật không.
6. Hosting/CDN, Supabase region, Google/AI/analytics và các bên xử lý dữ liệu thực tế.
7. Thời hạn lưu cụ thể cho từng loại dữ liệu và quy trình xóa/ẩn danh.
8. Phạm vi leaderboard, dữ liệu hiển thị công khai, consent riêng cho ảnh/tên/trường/lớp/kết quả.
9. Đầu mối bảo vệ dữ liệu cá nhân và quy trình xử lý sự cố.

## Kế hoạch triển khai website

- Trang công khai: /chinh-sach/quyen-rieng-tu, /chinh-sach/dieu-khoan-su-dung, /chinh-sach/bao-ve-tre-em, /chinh-sach/cookie.
- Trang liên kết ở footer và màn hình đăng ký/đăng nhập.
- Checkbox đồng ý không được chọn sẵn; tách riêng đồng ý xử lý dữ liệu cần thiết, đồng ý tùy chọn (nếu có), và xác nhận của cha mẹ/người đại diện.
- Lưu version chính sách, thời điểm, tài khoản, phương thức và bằng chứng consent; không ghi nội dung nhạy cảm không cần thiết.
- Cơ chế xem/rút lại consent, yêu cầu truy cập/chỉnh sửa/xóa/hạn chế xử lý và khiếu nại.
- Nội dung website phải đồng bộ với cách hệ thống thực sự vận hành. Không công bố “không chia sẻ”, “không chuyển ra nước ngoài”, “xóa ngay”, hoặc “không thu thập cookie” nếu chưa xác minh.
- Chỉ merge vào nhánh triển khai sau khi hoàn tất thông tin pháp nhân, bản đồ dữ liệu, rà soát pháp lý và kiểm thử.

## Nguyên tắc an toàn

- Không công khai dữ liệu nhận dạng trẻ em trên bảng xếp hạng.
- Mặc định dùng biệt danh; không hiển thị họ tên, email, trường/lớp, ảnh cá nhân hoặc vị trí.
- Không quảng cáo hành vi, không bán dữ liệu, không sử dụng dữ liệu trẻ em cho mục đích ngoài học tập/an toàn nếu không có cơ sở và sự đồng ý phù hợp.
- Không thu thập ngày sinh đầy đủ/CCCD/địa chỉ nhà nếu không thực sự cần.
- Không coi “đã tick điều khoản” là bằng chứng đầy đủ cho mọi mục đích xử lý dữ liệu.
