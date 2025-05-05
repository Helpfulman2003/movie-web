import React from "react";

export default function WorkSheduleEmployeeModal({
  employees,
  workSchedules,
  selectedEmployee,
  setSelectedEmployee,
  selectedWorkSchedule,
  setSelectedWorkSchedule,
  selectedDate,
  handleDateChange,
  getUniqueDates,
  handleAddWorkScheduleEmployee,
  closeModal,
}) {
  return (
    <div className="fixed inset-0 bg-blue-100 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-4xl border-4 border-blue-500 scale-110">
        <h2 className="text-5xl font-extrabold text-center text-blue-700 mb-10">
          Thêm ca làm việc
        </h2>

        {/* Chọn nhân viên */}
        <label className="text-3xl font-semibold text-blue-800 block mb-2">Nhân viên:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full mb-8 px-6 py-4 text-2xl border-2 border-blue-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          <option value="">Chọn nhân viên</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.tenDangNhap}
            </option>
          ))}
        </select>

        {/* Chọn ngày làm việc */}
        <label className="text-3xl font-semibold text-blue-800 block mb-2">Ngày làm việc:</label>
        <select
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full mb-8 px-6 py-4 text-2xl border-2 border-blue-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          <option value="">Chọn ngày làm việc</option>
          {getUniqueDates().map((date, index) => (
            <option key={index} value={date}>
              {new Date(date).toLocaleDateString("vi-VN")}
            </option>
          ))}
        </select>

        {/* Chọn ca làm việc */}
        <label className="text-3xl font-semibold text-blue-800 block mb-2">Bộ phận:</label>
        <select
          value={selectedWorkSchedule}
          onChange={(e) => setSelectedWorkSchedule(e.target.value)}
          className="w-full mb-10 px-6 py-4 text-2xl border-2 border-blue-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          <option value="">Chọn bộ phận</option>
          {workSchedules.map((ws) => (
            <option key={ws._id} value={ws._id}>
              {ws.loaiCaTruc} - {new Date(ws.gioBatDau).toLocaleTimeString()} đến {new Date(ws.gioKetThuc).toLocaleTimeString()}
            </option>
          ))}
        </select>

        {/* Nút thao tác */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleAddWorkScheduleEmployee}
            className="bg-blue-600 text-white text-2xl px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Thêm
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-400 text-white text-2xl px-10 py-4 rounded-xl font-bold hover:bg-gray-500 transition-all"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
