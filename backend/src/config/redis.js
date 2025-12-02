import { createClient } from "redis";

const REDIS_URI = process.env.REDIS_URI || "redis://localhost:6379";

const redisClient = createClient({
  url: REDIS_URI,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      console.log("Kết nối Redis thành công");
    } catch (error) {
      console.error("Redis connection failed:", error.message);
    }
  }
};

export default redisClient;