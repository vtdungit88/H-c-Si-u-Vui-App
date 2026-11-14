# THIẾT KẾ LUỒNG ĐỒNG Ý CỦA CHA MẸ/NGƯỜI ĐẠI DIỆN VÀ QUYỀN DỮ LIỆU

**Tài liệu nội bộ – yêu cầu sản phẩm/kỹ thuật, chưa phải biểu mẫu pháp lý cuối cùng.**

## 1. Nguyên tắc

- Không yêu cầu trẻ tự khai nhiều thông tin cá nhân.
- Tách xác nhận điều khoản sử dụng, thông báo quyền riêng tư, đồng ý xử lý dữ liệu cần thiết và các đồng ý tùy chọn.
- Không chọn sẵn checkbox.
- Không ép đồng ý mục đích tùy chọn để truy cập chức năng học tập cơ bản.
- Lưu bằng chứng đồng ý có version, mục đích, thời điểm, phương thức, người thực hiện và tài khoản trẻ liên quan.
- Cung cấp đường rút lại đồng ý và gửi yêu cầu dữ liệu.
- Chỉ xác minh người đại diện ở mức cần thiết; không thu thập bản chụp giấy tờ tùy thân nếu chưa có cơ sở và quy trình bảo mật.

## 2. Luồng tài khoản học sinh qua trường

1. Giáo viên/quản trị trường tạo tài khoản hoặc mã tham gia.
2. Trường xác nhận có thẩm quyền cung cấp dữ liệu học sinh và thông báo cho cha mẹ/người đại diện theo quy trình trường.
3. Học sinh nhận tài khoản, dùng biệt danh/mã học sinh, không cần email cá nhân nếu mô hình không yêu cầu.
4. Trước khi xử lý dữ liệu ngoài phạm vi cần thiết, hiển thị thông báo và xin đồng ý phù hợp.
5. Trường chỉ xem dữ liệu lớp được phân quyền; không công khai dữ liệu học sinh.
6. Cha mẹ/người đại diện có kênh yêu cầu truy cập, sửa, hạn chế hoặc xóa.

## 3. Luồng tài khoản cá nhân (B2C)

1. Người lớn/cha mẹ bắt đầu đăng ký hoặc tạo hồ sơ cho trẻ.
2. Hiển thị thông báo quyền riêng tư ngắn gọn và liên kết tới bản đầy đủ.
3. Xác nhận người tạo tài khoản là cha mẹ/người đại diện hợp pháp theo phương thức đã được đánh giá.
4. Lưu consent theo từng mục đích.
5. Nếu trẻ từ đủ 07 tuổi, cung cấp giải thích phù hợp độ tuổi và xin ý kiến/đồng ý của trẻ đối với hoạt động công bố/tiết lộ thông tin riêng tư khi pháp luật yêu cầu.
6. Cho phép người đại diện quản lý, rút lại consent và gửi yêu cầu dữ liệu.

**Không sử dụng tự khai một checkbox đơn giản làm phương thức xác minh duy nhất nếu rủi ro và pháp luật đòi hỏi xác minh đáng tin cậy hơn.**

## 4. Các mục đích consent đề xuất

| Mã | Mục đích | Mặc định |
|---|---|---|
| CORE_ACCOUNT | Tạo và duy trì tài khoản | Bắt buộc nếu muốn sử dụng tài khoản |
| LEARNING | Lưu bài làm, điểm, tiến độ | Bắt buộc cho chức năng học tập đã chọn |
| SCHOOL_REPORT | Chia sẻ kết quả với trường/giáo viên được phân quyền | Chỉ bật khi tham gia mô hình trường |
| PUBLIC_LEADERBOARD | Hiển thị biệt danh và điểm trên bảng xếp hạng | Tắt; tự nguyện |
| ANALYTICS | Phân tích sử dụng không thiết yếu | Tắt; tự nguyện nếu cần consent |
| MARKETING | Tin quảng cáo/tiếp thị | Không triển khai cho trẻ em trong MVP |

## 5. Bằng chứng cần lưu

- user_id của người đại diện (nếu có) và profile_id của trẻ.
- consent_purpose, consent_status.
- policy_version, notice_version.
- timestamp UTC, locale, channel.
- Phương thức xác minh và mức độ xác minh (không lưu bản giấy tờ nếu không cần).
- Bằng chứng rút lại và thời điểm ngừng xử lý.
- Nguồn tạo tài khoản: trường/B2C/admin.
- Không lưu IP đầy đủ lâu dài chỉ để chứng minh consent nếu không cần.

## 6. Yêu cầu quyền dữ liệu

Tạo trang/biểu mẫu riêng:
- Xem dữ liệu của tôi/con tôi.
- Sửa dữ liệu.
- Tải bản sao dữ liệu.
- Yêu cầu xóa tài khoản/dữ liệu.
- Rút lại consent.
- Hạn chế hoặc phản đối xử lý.
- Tắt hiển thị leaderboard.
- Khiếu nại về quyền riêng tư/bảo vệ trẻ em.

Quy trình backend cần xác minh người yêu cầu, phân loại, xác định ngoại lệ lưu giữ hợp pháp, thực hiện trên hệ thống chính và các bên xử lý, phản hồi và lưu nhật ký. Không hứa “xóa ngay lập tức” nếu backup/log/luật bắt buộc lưu khiến việc xóa có thời gian.

## 7. Gợi ý giao diện

- Trang đăng ký: một thông báo ngắn dễ hiểu, không phải một trang chữ dài.
- Nút “Xem chính sách quyền riêng tư” và “Điều khoản sử dụng”.
- Checkbox độc lập, không tick sẵn.
- Màn hình riêng cho bảng xếp hạng công khai.
- Trang quản lý quyền riêng tư trong hồ sơ phụ huynh.
- Trạng thái consent có thể xem và rút lại.
- Tài khoản học sinh không có quyền tự bật chia sẻ thông tin công khai.

## 8. Tiêu chí nghiệm thu

- Không thể tạo tài khoản trẻ em qua luồng chưa có cơ chế đồng ý cần thiết.
- Không ghi nhận consent nếu người dùng chưa chủ động chọn.
- Có log phiên bản policy và thời điểm.
- Rút lại consent có hiệu lực với các mục đích dựa trên consent.
- Leaderboard không hiển thị thông tin nhận dạng.
- Teacher/school_admin chỉ xem dữ liệu trong phạm vi được giao.
- Yêu cầu xóa có quy trình và bằng chứng xử lý.
