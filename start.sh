echo "🚀 Khởi động To-do App bằng Docker Compose..."
echo "--------------------------------------------"

# 1️⃣ Build lại tất cả image 
echo "🔧 Đang build các service..."
docker compose build --no-cache

# 2️⃣ Khởi chạy toàn bộ stack
echo "▶️ Đang khởi động MongoDB, Backend và Frontend..."
docker compose up -d

# 3️⃣ Kiểm tra trạng thái container
echo ""
echo "🧩 Trạng thái container:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 4️⃣ Kiểm tra backend API
echo ""
echo "🌐 Kiểm tra backend API tại: http://localhost:5001/api/tasks"
echo "🔗 Frontend đang chạy tại:  http://localhost:5173"
echo ""
echo "📜 Xem log realtime (Ctrl+C để dừng):"
docker compose logs -f
