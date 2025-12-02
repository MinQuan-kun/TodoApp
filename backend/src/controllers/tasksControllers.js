import Task from "../models/Task.js";
import redisClient from "../config/redis.js";

const CACHE_TTL = 3600;

// === HÀM XÓA CACHE TỐI ƯU (Dùng Set thay vì Keys) ===
const invalidateTasksCache = async (userId) => {
  try {
    const userKeysSet = `user_keys:${userId}`;
    
    // 1. Lấy danh sách các key cache đã lưu của user này từ Set
    const keysToDelete = await redisClient.sMembers(userKeysSet);
    
    if (keysToDelete.length > 0) {
      // 2. Xóa sạch các key đó ngay lập tức (không cần quét DB)
      await redisClient.del(keysToDelete);
      console.log(`[Redis] Đã xóa ${keysToDelete.length} khóa cache của User ${userId}`);
    }
    
    // 3. Xóa luôn danh sách quản lý key
    await redisClient.del(userKeysSet);
    
  } catch (error) {
    console.error("[Redis] Lỗi khi xóa cache:", error);
  }
};

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const userId = req.user._id;
  const cacheKey = `tasks:${userId}:${filter}`;

  try {
    // 1. Kiểm tra cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const now = new Date();
    let startDate;

    switch (filter) {
      case "today": {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      }
      case "week": {
        const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
        const mondayDate = now.getDate() - dayOfWeek + 1;
        startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case "month": {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      }
      case "all":
      default: {
        startDate = null;
      }
    }

    const query = {
      userId,
      ...(startDate && { createdAt: { $gte: startDate } }),
    };

    // 2. Truy vấn Database
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [
            { $match: { status: "active", ...query } },
            { $count: "count" },
          ],
          completeCount: [
            { $match: { status: "complete", ...query } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    const responseData = { tasks, activeCount, completeCount };

    // 3. Lưu Cache & Lưu Key vào Set quản lý (QUAN TRỌNG)
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responseData));
    await redisClient.sAdd(`user_keys:${userId}`, cacheKey); // Lưu vết key này thuộc về user nào
    await redisClient.expire(`user_keys:${userId}`, CACHE_TTL + 600); // Set cũng cần hết hạn

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Lỗi getAllTasks:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id;

    const task = new Task({ title, userId });
    const newTask = await task.save();

    // Xóa cache cũ để User thấy dữ liệu mới ngay
    await invalidateTasksCache(userId);

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi createTask:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const userId = req.user._id;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      { title, status, completedAt },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Không tìm thấy task" });
    }

    await invalidateTasksCache(userId);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi updateTask:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;

    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Không tìm thấy task" });
    }

    await invalidateTasksCache(userId);

    res.status(200).json(deletedTask);
  } catch (error) {
    console.error("Lỗi deleteTask:", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};