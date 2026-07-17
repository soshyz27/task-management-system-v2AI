# 🚀 Task Management System v2

Ứng dụng quản lý công việc fullstack doanh nghiệp với AI Integration, Real-time Notification và nhiều tính năng nâng cao.

## 🌐 Live Demo
- **Frontend:** https://task-management-system-eight-rouge.vercel.app
- **Backend API:** https://task-management-system-sg0q.onrender.com/health

---

## ✨ Tính Năng Nổi Bật

### 🔐 Bảo mật & Phân quyền
- Xác thực JWT (7 ngày)
- RBAC: Admin/User roles
- Ownership check — User A không xem được data của User B

### 📋 Quản lý Task
- CRUD đầy đủ với Edit Inline
- Giao task cho người khác (assigned_to)
- Deadline picker + Badge cảnh báo màu sắc
- Pagination (5 task/trang)
- Search theo tiêu đề + mô tả (debounce 500ms)
- Filter theo priority (Cao/Trung bình/Thấp)
- Sort theo 5 tiêu chí (priority, ngày tạo, deadline, tên, trạng thái)

### 🤖 AI Integration (Gemini)
- Tự động gợi ý mô tả task
- Tự động phân tích priority + category khi tạo task
- Fallback keyword detection khi AI thất bại

### 🔔 Real-time (Socket.IO)
- Đồng bộ task đa tab/thiết bị
- Notification Center với badge đỏ
- Reminder tự động khi gần deadline

### 📎 File Management
- Upload đa định dạng (JPG, PNG, PDF, DOC, TXT)
- Preview ảnh trực tiếp
- Download file
- Giới hạn 5MB/file

### 👤 Profile
- Avatar chữ cái
- Thống kê task (tỷ lệ hoàn thành, quá hạn...)
- Đổi username + mật khẩu

### 🎨 UI/UX
- Dark Mode / Light Mode (lưu localStorage)
- Responsive design
- CSS Variables theming

---

## 🏗️ Kiến Trúc Hệ Thống
Client
↓
React + Vite (Vercel)
↓
Express.js + Socket.IO (Render)
↓
PostgreSQL (Neon)

### Cấu trúc Backend (Module-based)
backend/src/
├── modules/
│   ├── auth/          # Đăng ký, đăng nhập
│   ├── task/          # CRUD task + attachment
│   ├── user/          # User management + profile
│   ├── notification/  # Notification center
│   └── ai/            # Gemini AI integration
├── middlewares/
│   ├── authMiddleware.js   # JWT verify
│   └── authorize.js        # RBAC
├── services/
│   └── reminderService.js  # Deadline reminder
└── config/
└── database.js         # PostgreSQL pool

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router DOM |
| Backend | Node.js, Express 5, Socket.IO |
| Database | PostgreSQL (Neon) |
| AI | Google Gemini API |
| Auth | JWT + bcrypt |
| File Upload | Multer |
| Deploy FE | Vercel |
| Deploy BE | Render |

---

## 🚀 Cài Đặt Local

### 1. Clone repository
```bash
git clone <your-repo-url>
cd task-management-system
```

### 2. Cấu hình Backend
```bash
cd backend
npm install
```

Tạo file `backend/.env`:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=your_neon_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
# Server chạy tại http://localhost:5000
```

### 3. Cấu hình Frontend
```bash
cd frontend
npm install
```

Tạo file `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# Web chạy tại http://localhost:5173
```

### 4. Khởi tạo Database
Chạy các lệnh SQL trên Neon Console:
```sql
-- Xem file: backend/sql/init.sql
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |

### Tasks
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | /api/tasks | Lấy tất cả task |
| GET | /api/tasks/paginated | Lấy task có phân trang |
| POST | /api/tasks | Tạo task mới |
| PUT | /api/tasks/:id | Cập nhật task |
| DELETE | /api/tasks/:id | Xóa task |
| POST | /api/tasks/:id/upload | Upload file |
| GET | /api/tasks/:id/attachments | Lấy file đính kèm |
| GET | /api/tasks/:id/attachments/:aid/download | Download file |
| DELETE | /api/tasks/:id/attachments/:aid | Xóa file |

### AI
| Method | Endpoint | Mô tả |
|---|---|---|
| POST | /api/ai/suggest | Gợi ý mô tả task |

### Profile
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | /api/profile | Lấy profile + stats |
| PATCH | /api/profile/username | Đổi username |
| PATCH | /api/profile/password | Đổi mật khẩu |

### Notifications
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | /api/notifications | Lấy thông báo |
| GET | /api/notifications/unread-count | Đếm chưa đọc |
| PATCH | /api/notifications/mark-all-read | Đánh dấu đã đọc tất cả |
| PATCH | /api/notifications/:id/read | Đánh dấu 1 thông báo |

---

## 🗄️ Database Schema

```sql
users (id, username, email, password, role, created_at)

tasks (id, title, description, status, priority, category,
       ai_notes, deadline, user_id, assigned_to, created_at)

attachments (id, filename, originalname, filepath, mimetype,
             filesize, task_id, uploaded_by, created_at)

notifications (id, user_id, title, message, type,
               related_task_id, is_read, created_at)
```

