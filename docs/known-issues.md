# 📌 GIỚI HẠN HỆ THỐNG & ĐIỂM CẦN CẢI TIẾN (KNOWN ISSUES)

Dưới đây là các tính năng hiện tại hệ thống chưa hỗ trợ (Sẽ được nâng cấp trong các giai đoạn tiếp theo):

1. **Cơ chế Refresh Token:** Hiện tại hệ thống chỉ cấp 1 chuỗi JWT có thời hạn 7 ngày. Khi hết hạn, người dùng bắt buộc phải đăng nhập lại thay vì được tự động làm mới mã bảo mật.
2. **Chưa Phân trang (Pagination):** API `/api/tasks` đang trả về toàn bộ danh sách công việc. Nếu một tài khoản có hàng ngàn task, hệ thống sẽ bị chậm. Cần bổ sung toán tử `LIMIT` và `OFFSET` trong SQL tương lai.
3. **Cơ chế Xóa mềm (Soft Delete):** Khi gọi API `DELETE`, dữ liệu bị xóa vĩnh viễn khỏi Database. Chuẩn doanh nghiệp cần bổ sung cột `deleted_at` để có thể khôi phục lại khi cần.
4. **Chưa có tính năng đính kèm tệp:** Hệ thống mới chỉ lưu trữ văn bản thô, chưa có bộ lọc upload file ảnh/báo cáo đính kèm cho Task.