# CHÍNH SÁCH COOKIE VÀ CÔNG NGHỆ LƯU TRỮ TƯƠNG TỰ
**HỌC SIÊU VUI – BẢN NHÁP NỘI BỘ, CHƯA CÔNG BỐ**

## 1. Mục đích

Học Siêu Vui có thể sử dụng cookie, localStorage, sessionStorage hoặc công nghệ tương tự để duy trì phiên đăng nhập, ghi nhớ tùy chọn, hỗ trợ bảo mật, thống kê truy cập và cải thiện trải nghiệm.

## 2. Nhóm công nghệ

| Nhóm | Ví dụ dự kiến | Có cần thiết không |
|---|---|---|
| Thiết yếu | Session/Auth token, chống giả mạo, trạng thái bảo mật | Có thể cần để cung cấp dịch vụ |
| Tùy chọn | Âm thanh, giao diện, tùy chọn người dùng | Có thể tắt |
| Phân tích | Lượt truy cập, người dùng online, lỗi và hiệu năng | Chỉ bật sau khi xác minh công cụ, dữ liệu và cơ chế đồng ý áp dụng |
| Quảng cáo/tiếp thị | Pixel hoặc định danh quảng cáo | Không triển khai nếu chưa có đánh giá, thông báo và cơ chế đồng ý riêng |

Danh sách trên là phân loại dự kiến. Cần quét cookie và storage thực tế trên trình duyệt, cả trước và sau đăng nhập, trước khi công bố.

## 3. Cách quản lý

Người dùng cần được giải thích công nghệ nào là thiết yếu và công nghệ nào là tùy chọn. Không đặt sẵn lựa chọn đồng ý cho phân tích/tiếp thị nếu cần consent. Từ chối công nghệ không thiết yếu không được làm mất chức năng cốt lõi nếu không cần thiết.

## 4. Local storage và dữ liệu học tập

Một số tùy chọn giao diện hoặc dữ liệu tạm có thể được lưu trong trình duyệt. Không nên lưu mật khẩu dạng văn bản thuần hoặc dữ liệu nhạy cảm. Khi đăng xuất, cần xóa thông tin phiên và dữ liệu cục bộ không còn cần thiết theo thiết kế bảo mật.

## 5. Bên thứ ba

Website hiện có dấu hiệu tải Google Fonts và tích hợp Supabase. Các nhà cung cấp thực tế, dữ liệu gửi tới họ và quốc gia xử lý phải được liệt kê sau khi kiểm kê kỹ thuật. Không khẳng định “không dùng bên thứ ba” trước khi hoàn tất kiểm tra.

## 6. Liên hệ

Đơn vị vận hành: [TÊN PHÁP LÝ]  
Email: [EMAIL]

Ngày cập nhật: [BỔ SUNG]

---
**Không công bố bản này trước khi kiểm kê cookie/localStorage/sessionStorage, analytics và bên thứ ba trên website thực tế.**
