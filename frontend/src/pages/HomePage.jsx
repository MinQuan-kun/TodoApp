import React from "react";
import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";

import Footer from "@/components/Footer";





const HomePage = () => {
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
          <TaskList />
          {/* Bộ Lọc Ngày Giờ */}
          <DateTimeFilter />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
