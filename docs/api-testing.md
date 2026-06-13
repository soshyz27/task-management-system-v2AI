# 📝 BÁO CÁO MA TRẬN KIỂM THỬ API (API TEST MATRIX)

Hệ thống quản lý công việc (Task Management System) đã được kiểm thử toàn diện qua các kịch bản: Thành công (Happy Path), Thất bại (Sad Path) và Tấn công bảo mật (Security Path).

## 1. Phân hệ Xác thực (Authentication API)

| STT | API Endpoint | Phương thức | Kịch bản kiểm thử (Case) | Mã lỗi kỳ vọng (HTTP Code) | Trạng thái thực tế |
| :--- | :--- | :---: | :--- | :---: | :---: |
| 1 | `/api/auth/register` | `POST` | Đăng ký tài khoản mới hợp lệ | **201 Created** | ✅ Đạt (Pass) |
| 2 | `/api/auth/register` | `POST` | Gửi trùng Email đã tồn tại trong DB | **400 Bad Request** | ✅ Đạt (Pass) |
| 3 | `/api/auth/register` | `POST` | Thiếu trường thông tin bắt buộc (Email) | **400 Bad Request** | ✅ Đạt (Pass) |
| 4 | `/api/auth/login` | `POST` | Đăng nhập tài khoản đúng thông tin | **200 OK** | ✅ Đạt (Pass) |
| 5 | `/api/auth/login` | `POST` | Đăng nhập sai mật khẩu | **401 Unauthorized** | ✅ Đạt (Pass) |
| 6 | `/api/auth/login` | `POST` | Đăng nhập với Email chưa từng đăng ký | **401 Unauthorized** | ✅ Đạt (Pass) |

## 2. Phân hệ Quản lý công việc (Tasks API)

| STT | API Endpoint | Phương thức | Kịch bản kiểm thử (Case) | Mã lỗi kỳ vọng (HTTP Code) | Trạng thái thực tế |
| :--- | :--- | :---: | :--- | :---: | :---: |
| 1 | `/api/tasks` | `GET` | Truy cập danh sách khi chưa gửi kèm JWT | **401 Unauthorized** | ✅ Đạt (Pass) |
| 2 | `/api/tasks` | `POST` | Tạo mới Task với đầy đủ thông tin (Hợp lệ) | **201 Created** | ✅ Đạt (Pass) |
| 3 | `/api/tasks` | `POST` | Tạo mới Task nhưng cố tình để trống `title` | **400 Bad Request** | ✅ Đạt (Pass) |
| 4 | `/api/tasks` | `GET` | Lấy danh sách Task (Chỉ hiển thị đúng Task của mình) | **200 OK** | ✅ Đạt (Pass) |
| 5 | `/api/tasks/:id` | `PUT` | Chủ sở hữu cập nhật thông tin Task thành công | **200 OK** | ✅ Đạt (Pass) |
| 6 | `/api/tasks/:id` | `PUT` | Cập nhật Task với trạng thái (`status`) sai định dạng | **400 Bad Request** | ✅ Đạt (Pass) |
| 7 | `/api/tasks/:id` | `PUT` | **[BẢO MẬT]** User B cố tình sửa Task của User A | **403 Forbidden** | ✅ Đạt (Pass) |
| 8 | `/api/tasks/:id` | `DELETE` | **[BẢO MẬT]** User B cố tình xóa Task của User A | **403 Forbidden** | ✅ Đạt (Pass) |
| 9 | `/api/tasks/:id` | `DELETE` | Chủ sở hữu thực hiện xóa Task của chính mình | **200 OK** | ✅ Đạt (Pass) |