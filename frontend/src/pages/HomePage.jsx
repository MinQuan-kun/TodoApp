import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
import axios from "axios";


const HomePage = () => {
  const [taskBuffer, setTasksBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/tasks");
      setTasksBuffer(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi xảy ra khi lấy tasks", error);
      toast.error("Lỗi xảy ra khi lấy tasks");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Pastel Wave */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(120deg, #d5c5ff 0%, #a7f3d0 50%, #f0f0f0 100%)"
        }}
      />
      {/* Your Content/Components */}
      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Đầu Trang */}
          <Header />
          {/* Thêm Nhiệm Vụ Mới */}
          <AddTask />
          {/* Thống Kê và Bộ Lọc */}
          <StatsAndFilters />
          {/* Danh Sách Nhiệm Vụ */}
          <TaskList filteredTasks={taskBuffer}/>
          {/* Bộ Lọc Ngày Giờ */}
          <DateTimeFilter />
          {/* Chân Trang với Thống Kê Nhiệm Vụ */}
          <Footer/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
