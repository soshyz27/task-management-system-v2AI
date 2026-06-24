# 🚀 Hệ Thống Quản Lý Công Việc (Task Management System)

Ứng dụng quản lý công việc toàn diện (Fullstack) được thiết kế theo kiến trúc phân lớp sạch (Clean Layered Architecture), tích hợp cơ chế bảo mật xác thực tài khoản nghiêm ngặt chuẩn doanh nghiệp.

## 🌐 Live Demo
* **Frontend (Giao diện live):** (https://task-management-system-eight-rouge.vercel.app/)
* **Backend API (Trạng thái hệ thống):** (https://task-management-system-sg0q.onrender.com/health)

---

## 🌟 Tính Năng Cốt Lõi (Core Features)
* **Xác thực người dùng (Authentication):** Đăng ký tài khoản (mã hóa mật khẩu `bcrypt`) và Đăng nhập cấp mã định danh bảo mật **JWT (Json Web Token)**.
* **Người gác cổng hệ thống (Route Guard):** Bảo vệ API Backend và các tuyến đường Frontend bằng Middleware xác thực quyền.
* **🛡️ Phân quyền nâng cao (Ownership Check):** Đảm bảo an toàn dữ liệu tuyệt đối, người dùng A không thể Xem/Sửa/Xóa dữ liệu công việc của người dùng B.
* **Quản lý Task (CRUD):** Tạo mới, đọc danh sách, cập nhật trạng thái (`pending`/`completed`) và xóa công việc.

## 🏗️ Kiến Trúc Hệ Thống (Architecture)
Hệ thống Backend vận hành theo mô hình 5 lớp độc lập:
`Client ➔ Routes ➔ Controllers ➔ Services (Nghiệp vụ) ➔ Repositories (SQL thuần) ➔ PostgreSQL`

---

## 💻 Công Nghệ Sử Dụng (Tech Stack)

### Backend
* **Nền tảng:** NodeJS & ExpressJS
* **Cơ sở dữ liệu:** PostgreSQL (Kết nối qua Database Pool hiệu năng cao)
* **Bảo mật:** JSON Web Token (JWT) & Bcrypt

### Frontend
* **Công cụ build:** ReactJS + Vite
* **Điều phối:** React Router DOM & Axios Instance

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy (Installation)

### 1. Cấu hình biến môi trường
Tạo file `.env` nằm trong thư mục `/backend` với các tham số sau:
```env
PORT=5000
JWT_SECRET=SieuBaoMat2026_Key
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_NAME=task_management
```

### 2. Khởi động Backend 

* cd backend
* npm install
* npm run dev
* Hệ thống sẽ kích hoạt tại cổng: http://localhost:5000

### 3. Khởi động Frontend

* cd frontend
* npm install
* npm run dev
* Giao diện người dùng sẽ hiển thị tại: http://localhost:5173

