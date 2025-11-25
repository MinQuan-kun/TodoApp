import { createClient } from "redis";

// Sử dụng biến môi trường được định nghĩa trong docker-compose.yml hoặc .env
const REDIS_URI = process.env.REDIS_URI || "redis://localhost:6379";

const redisClient = createClient({
  url: REDIS_URI,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Hàm kết nối
export const connectRedis = async () => {
  if (!redisClient.isReady) {
    try {
      await redisClient.connect();
      console.log("Kết nối Redis thành công");
    } catch (error) {
      console.error("Redis connection failed:", error.message);
    }
  }
};

// Đảm bảo client kết nối trước khi export
connectRedis();

export default redisClient;
