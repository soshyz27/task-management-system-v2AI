# TÀI LIỆU THIẾT KẾ RESTful API (API SPECIFICATION)
## Dự án: Hệ thống quản lý công việc cá nhân (Task Management System)

---

## 1. QUY CHUẨN CHUNG (GLOBAL STANDARDS)
* **Base URL:** `/api`
* **Định dạng dữ liệu:** JSON cho cả Request và Response.
* **Xác thực:** Bearer Token (JWT) đính kèm trong Header: `Authorization: Bearer <token>`.
* **Cấu trúc Error Response chung:**
    ```json
    {
      "success": false,
      "message": "Chuỗi thông báo lỗi chi tiết"
    }
    ```

---

## 2. NHÓM API XÁC THỰC (AUTHENTICATION)

### 2.1. Đăng ký tài khoản (Register)
* **Method:** `POST`
* **Endpoint:** `/auth/register`
* **Validation:** `username` không rỗng, `email` đúng định dạng, `password` >= 6 ký tự.
* **Request Body:**
    ```json
    {
      "username": "hieu",
      "email": "hotronghieu9gtb@gmail.com",
      "password": "123456"
    }
    ```
* **Responses:**
    * `201 Created` (Thành công):
        ```json
        {
          "success": true,
          "message": "User registered successfully"
        }
        ```
    * `400 Bad Request` (Trùng email/Sai định dạng):
        ```json
        {
          "success": false,
          "message": "Email already exists"
        }
        ```

### 2.2. Đăng nhập (Login)
* **Method:** `POST`
* **Endpoint:** `/auth/login`
* **Request Body:**
    ```json
    {
      "email": "hotronghieu9gtb@gmail.com",
      "password": "123456"
    }
    ```
* **Responses:**
    * `200 OK` (Thành công - Trả về thông tin user và mã JWT):
        ```json
        {
          "success": true,
          "token": "jwt_token_here",
          "user": {
            "id": 1,
            "username": "hieu",
            "email": "hotronghieu9gtb@gmail.com"
          }
        }
        ```
    * `401 Unauthorized` (Sai tài khoản/mật khẩu):
        ```json
        {
          "success": false,
          "message": "Invalid email or password"
        }
        ```

---

## 3. NHÓM API QUẢN LÝ CÔNG VIỆC (TASKS)
*(Tất cả API trong nhóm này bắt buộc phải gửi kèm JWT Token trong Header)*

### 3.1. Lấy danh sách task (Get Task List)
* **Method:** `GET`
* **Endpoint:** `/tasks`
* **An ninh (Security):** Chỉ trả về các task có `user_id` trùng với ID giải mã từ token (`SELECT * FROM tasks WHERE user_id = $1`).
* **Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "title": "Learn React",
          "status": "pending"
        }
      ]
    }
    ```

### 3.2. Lấy chi tiết một task (Get Task Detail)
* **Method:** `GET`
* **Endpoint:** `/tasks/:id`
* **An ninh (Security):** Trả về `403 Forbidden` nếu truy cập vào task của người khác.
* **Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "id": 5,
        "title": "Learn React",
        "description": "Study Hooks",
        "status": "pending"
      }
    }
    ```

### 3.3. Tạo task mới (Create Task)
* **Method:** `POST`
* **Endpoint:** `/tasks`
* **Logic:** `user_id` được trích xuất tự động từ JWT Token. Trạng thái mặc định là `pending`.
* **Request Body:**
    ```json
    {
      "title": "Learn React",
      "description": "Study Hooks"
    }
    ```
* **Response (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "title": "Learn React",
        "description": "Study Hooks",
        "status": "pending"
      }
    }
    ```

### 3.4. Cập nhật toàn bộ task (Update Task)
* **Method:** `PUT`
* **Endpoint:** `/tasks/:id`
* **An ninh (Security):** Kiểm tra quyền sở hữu trước khi cập nhật (`WHERE id = $1 AND user_id = $2`).
* **Request Body:**
    ```json
    {
      "title": "Learn ReactJS",
      "description": "Hooks and Context",
      "status": "completed"
    }
    ```
* **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Task updated successfully"
    }
    ```

### 3.5. Đánh dấu hoàn thành nhanh (Complete Task)
* **Method:** `PATCH`
* **Endpoint:** `/tasks/:id/complete`
* **Request Body:** Không có (No Body).
* **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Task completed"
    }
    ```

### 3.6. Xóa task (Delete Task)
* **Method:** `DELETE`
* **Endpoint:** `/tasks/:id`
* **An ninh (Security):** Chỉ cho phép xóa nếu là chủ sở hữu task.
* **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Task deleted successfully"
    }
    ```

---

## 4. BẢNG MÃ LỖI HỆ THỐNG (HTTP STATUS CODES)

| Mã lỗi (Status) | Ý nghĩa | Kịch bản xảy ra |
| :--- | :--- | :--- |
| `400 Bad Request` | Dữ liệu đầu vào không hợp lệ | Thiếu title khi tạo task, email sai định dạng |
| `401 Unauthorized` | Không có quyền truy cập | Chưa đăng nhập hoặc Token JWT hết hạn |
| `403 Forbidden` | Bị từ chối truy cập | User A cố tình xem/sửa/xóa task của User B |
| `404 Not Found` | Không tìm thấy tài nguyên | Truy cập vào ID task không tồn tại |
| `500 Internal Error` | Lỗi hệ thống Backend | Lỗi kết nối Database, sập server |