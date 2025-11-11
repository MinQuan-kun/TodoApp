@echo off
echo 🚀 Khởi động To-do App bằng Docker Compose...
echo --------------------------------------------

:: 1️⃣ Build lại tất cả service
echo 🔧 Đang build các service...
docker compose build --no-cache

:: 2️⃣ Khởi chạy toàn bộ stack (chạy ngầm)
echo ▶️ Đang khởi động MongoDB, Backend và Frontend...
docker compose up -d

:: 3️⃣ Kiểm tra trạng thái container
echo.
echo 🧩 Trạng thái container:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

:: 4️⃣ Thông báo URL truy cập
echo.
echo 🌐 Backend API: http://localhost:5001/api/tasks
echo 🔗 Frontend:    http://localhost:5173

:: 5️⃣ Xem log realtime (nhấn Ctrl+C để dừng)
echo.
echo 📜 Xem log realtime:
docker compose logs -f
pause
