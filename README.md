# 📝 TodoApp - AI Powered Task Manager

![React](https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Lightning_Fast-ffeb3b?logo=vite&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-4ea94b?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache-dc382d?logo=redis&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI-8e75b2?logo=google&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker&logoColor=white)

Một ứng dụng quản lý công việc cá nhân hiện đại, tích hợp **Trí tuệ nhân tạo (AI)** và **Redis Caching** để tối ưu hiệu suất.

---

## 🚀 Tính năng nổi bật

- **🤖 Trợ lý ảo Miku (Powered by Gemini AI):** Chatbot thông minh giúp bạn kiểm tra danh sách công việc, trò chuyện vui vẻ ngay trong ứng dụng.
- **⚡ Hiệu suất cao:** Sử dụng **Redis** để cache danh sách công việc, giảm tải cho Database.
- **🔐 Bảo mật:** Hệ thống xác thực người dùng (Authentication) an toàn với **JWT**.
- **📅 Bộ lọc thông minh:** Lọc công việc theo ngày (Hôm nay, Tuần này, Tháng này) và trạng thái (Đang làm, Hoàn thành).
- **🎨 Giao diện hiện đại:** Thiết kế đẹp mắt với **ShadCN UI** và **TailwindCSS**, hiệu ứng mượt mà, Responsive 100%.
- **🐳 Dễ dàng triển khai:** Đóng gói toàn bộ (Frontend, Backend, Database, Cache) với **Docker Compose**.

---

## ⚙️ Công nghệ sử dụng

| Thành phần | Công nghệ | Vai trò |
|------------|----------|---------|
| **Frontend** | React 19 + Vite | Xây dựng giao diện người dùng tốc độ cao |
| | TailwindCSS 4 | Styling và Responsive design |
| | ShadCN UI | Bộ thư viện component đẹp mắt |
| | Axios | Kết nối API |
| **Backend** | Node.js + Express | Xử lý Logic và API |
| | Google Generative AI | Tích hợp mô hình Gemini cho Chatbot |
| | JWT (JsonWebToken) | Xác thực và bảo mật phiên đăng nhập |
| **Database & Cache** | MongoDB | Lưu trữ dữ liệu NoSQL bền vững |
| | Redis | Caching dữ liệu tạm thời, tăng tốc độ tải |
| **DevOps** | Docker & Compose | Containerization toàn bộ ứng dụng |

---

## 🛠️ Hướng dẫn cài đặt & Chạy dự án

### 1️⃣ Clone dự án
```bash
git clone [https://github.com/MinQuan-kun/TodoApp.git](https://github.com/MinQuan-kun/TodoApp.git)
cd TodoApp
````

### 2️⃣ Cấu hình biến môi trường (.env)

Bạn cần tạo file `.env` trong thư mục `backend/` dựa trên file `.env.example`:

**File: `backend/.env`**

```env
MONGODB_CONNECT_STRING=mongodb://mongodb:27017/todoapp
PORT=5001
NODE_ENV=production
REDIS_URI=redis://redis:6379
JWT_SECRET=MAT_KHAU_BI_MAT_CUA_BAN
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY  <-- Điền API Key của bạn vào đây
```

### 3️⃣ Chạy ứng dụng với Cloudflare Tunnel (Public ra Internet)

Để chạy ứng dụng và public ra internet thông qua Cloudflare Tunnel, hãy thực hiện theo các bước sau:

#### Bước 1: Khởi chạy Container

Chạy lệnh sau để build và khởi động các service (Backend, MongoDB, Redis):

```bash
docker compose up --build -d
```

#### Bước 2: Public Backend & Cập nhật Frontend

Mở một **Terminal mới** (Terminal 1) để chạy tunnel cho Backend:

```bash
cloudflared tunnel --url http://localhost:5001
```

> 📋 **Copy đường link** do Cloudflare cung cấp (ví dụ: `https://random-name.trycloudflare.com`).

Sau đó, vào file `frontend/src/lib/axios.js` và cập nhật biến `BASE_URL` bằng link vừa copy (thêm `/api` vào cuối):

```javascript
// frontend/src/lib/axios.js
const BASE_URL = "[https://your-backend-url.trycloudflare.com/api](https://your-backend-url.trycloudflare.com/api)"; 
```

#### Bước 3: Re-build Frontend

Do đã thay đổi code frontend, bạn cần build lại container frontend để cập nhật API URL mới:

```bash
docker compose up --build -d frontend
```

#### Bước 4: Public Frontend

Mở một **Terminal khác** (Terminal 2) để chạy tunnel cho Frontend:

```bash
cloudflared tunnel --url http://localhost:5173
```

🎉 **Hoàn tất\!** Bây giờ bạn có thể share đường link Frontend mà Cloudflare cung cấp cho mọi người truy cập.

-----

## 📂 Cấu trúc dự án

```
TodoApp/
├── backend/              # Server Node.js
│   ├── src/
│   │   ├── config/       # Cấu hình DB, Redis
│   │   ├── controllers/  # Logic xử lý (Auth, Chat, Task)
│   │   ├── models/       # Schema MongoDB (User, Task)
│   │   └── routes/       # Định nghĩa API endpoint
│   ├── Dockerfile
│   └── .env              # (Bạn cần tạo file này)
├── frontend/             # Client ReactJS
│   ├── src/
│   │   ├── components/   # Các component (CuteBot, TaskCard...)
│   │   ├── pages/        # Các trang (Home, Login, Register)
│   │   ├── lib/          # Cấu hình Axios, Utils
│   │   └── context/      # AuthContext
│   ├── Dockerfile
│   └── vite.config.js
├── docker-compose.yml    # Cấu hình Docker stack
└── README.md             # Tài liệu dự án
```

-----

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh\! Hãy tạo **Pull Request** hoặc mở **Issue** nếu bạn tìm thấy lỗi nhé.

-----

**Made with 💜 by MinQuan-kun**
### Các thay đổi chính so với bản cũ:
```
1.  **Thêm Redis & Gemini:** Đã bổ sung thông tin về Redis (cache) và Google Gemini (AI Chatbot) vì trong code `backend/src/controllers` và `config` có sử dụng chúng.
2.  **Cập nhật Tech Stack:** React 19, TailwindCSS v4 (dựa trên `frontend/package.json`).
3.  **Hướng dẫn `.env`:** Bổ sung hướng dẫn cấu hình `GEMINI_API_KEY` và `REDIS_URI` quan trọng để app chạy đúng.
4.  **Start script:** Nhắc người dùng sử dụng `start.sh` hoặc `start.bat` có sẵn trong source.
```
