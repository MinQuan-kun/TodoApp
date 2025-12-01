import Task from "../models/Task.js";
import redisClient from "../config/redis.js";

const CACHE_TTL = 60;

// Hàm xóa cache
const invalidateTasksCache = async (userId) => {
  try {
    const setKey = `user_cache_keys:${userId}`;
    
    // 1. Lấy tất cả các key cache task của user này từ Set
    const keysToDelete = await redisClient.sMembers(setKey);
    
    if (keysToDelete.length > 0) {
      // 2. Xóa dữ liệu cache
      await redisClient.del(keysToDelete);
      console.log(`Đã xóa ${keysToDelete.length} khóa cache tasks.`);
    }
    
    // 3. Xóa luôn cái Set quản lý (hoặc để nó tự hết hạn)
    await redisClient.del(setKey);
    
  } catch (error) {
    console.error("Lỗi khi xóa cache Redis:", error);
  }
};

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const userId = req.user._id; // Lấy User ID từ middleware
  const cacheKey = `tasks:${userId}:${filter}`;

  try {
    // 1. Kiểm tra cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit:", cacheKey);
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
      userId, // Chỉ lấy Task của người dùng này
      ...(startDate && { createdAt: { $gte: startDate } }),
    };

    // 2. Truy vấn Database nếu Cache Miss
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

    // 3. Ghi kết quả vào Cache với TTL
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(responseData));
    console.log("Cache set:", cacheKey);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id; // Lấy User ID từ req.user

    const task = new Task({
      title,
      userId, // Gán Task cho User
    });

    const newTask = await task.save();

    await invalidateTasksCache(userId); // Truyền userId vào hàm xóa cache

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const userId = req.user._id;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        title,
        status,
        completedAt,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Nhiệm vụ không tồn tại hoặc bạn không có quyền." });
    }

    await invalidateTasksCache(userId);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;

    // Kiểm tra task theo ID VÀ userId
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId, // Thêm userId vào điều kiện tìm kiếm
    });

    if (!deletedTask) {
      return res
        .status(404)
        .json({ message: "Nhiệm vụ không tồn tại hoặc bạn không có quyền." });
    }

    await invalidateTasksCache(userId);

    res.status(200).json(deletedTask);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
