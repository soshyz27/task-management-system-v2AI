# TÀI LIỆU THIẾT KẾ DATABASE (DATABASE DESIGN)
## Hệ thống quản lý công việc cá nhân (Task Management System)

---

## 1. BẢNG `users` (Quản lý thông tin người dùng)

### 1.1. Cấu trúc bảng (Schema)
| Tên trường (Field) | Kiểu dữ liệu (Type) | Thuộc tính (Attributes) | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Khóa chính, tự động tăng |
| `username` | `VARCHAR(100)` | `NOT NULL`, `UNIQUE` | Tên hiển thị, không trùng lặp |
| `email` | `VARCHAR(255)` | `NOT NULL`, `UNIQUE` | Email đăng nhập, không trùng lặp |
| `password` | `VARCHAR(255)` | `NOT NULL` | Mật khẩu (đã mã hóa hash) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Thời gian tạo tài khoản |

### 1.2. Câu lệnh SQL khởi tạo
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

--- 

## 2. BẢNG `tasks` (Quản lý thông tin công việc)

### 2.1. Cấu trúc bảng (Schema)
| Tên trường (Field) | Kiểu dữ liệu (Type) | Thuộc tính (Attributes) | Ý nghĩa |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Khóa chính, tự động tăng |
| `title` | `VARCHAR(255)` | `NOT NULL` | tiêu đề công việc |
| `description` | `TEXT` | `NULL` | mô tả chi tiết công việc |
| `status` | `VARCHAR(20)` | `DEFAULT 'pending'` | trạng thái pending, completed |
| `user_id` | `INTEGER` | `FOREIGN KEY, NOT NULL` | ngoại khóa liên kết tới user(id) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Thời gian tạo công việc|

### 2.2. Câu lệnh SQL khởi tạo
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);