import Task from "../models/Task.js";
import redisClient from "../config/redis.js"; // <-- THÊM DÒNG NÀY

// Thiết lập TTL (Time To Live) cho cache, ví dụ: 60 giây
const CACHE_TTL = 60; // 60 giây

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const cacheKey = `tasks:${filter}`; // Khóa cache duy nhất cho mỗi bộ lọc

  try {
    // 1. Kiểm tra cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit:", cacheKey);
      return res.status(200).json(JSON.parse(cachedData));
    }

    // ... (logic tính toán startDate giữ nguyên)
    const now = new Date();
    let startDate;

    switch (filter) {
      // ... (logic switch case giữ nguyên)
      case "today": {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      }
      case "week": {
        const mondayDate =
          now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
        startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
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

    const query = startDate ? { createdAt: { $gte: startDate } } : {};

    // 2. Truy vấn Database nếu Cache Miss
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
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

// Hàm xóa cache cho danh sách tasks
const invalidateTasksCache = async () => {
  // Xóa tất cả các khóa cache liên quan đến tasks
  // Trong môi trường thực tế, bạn sẽ chỉ xóa các khóa cần thiết (tasks:today, tasks:week, tasks:month, tasks:all)
  const keys = await redisClient.keys("tasks:*");
  if (keys.length > 0) {
    await redisClient.del(keys);
    console.log(`Đã xóa ${keys.length} khóa cache tasks.`);
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save();

    // Invalidate cache sau khi ghi dữ liệu
    await invalidateTasksCache(); // <-- THÊM DÒNG NÀY

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completedAt,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    // Invalidate cache sau khi ghi dữ liệu
    await invalidateTasksCache(); // <-- THÊM DÒNG NÀY

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    // Invalidate cache sau khi ghi dữ liệu
    await invalidateTasksCache(); // <-- THÊM DÒNG NÀY

    res.status(200).json(deletedTask);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
