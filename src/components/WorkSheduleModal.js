import React from "react";

export default function WorkScheduleModal({
  isOpen,
  onClose,
  ngayLam,
  setNgayLam,
  gioBatDau,
  setGioBatDau,
  gioKetThuc,
  setGioKetThuc,
  loaiCaTruc,
  setLoaiCaTruc,
  handleAddSchedule,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          🗓️ Thêm lịch làm việc
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày làm</label>
            <input
              type="date"
              value={ngayLam}
              onChange={(e) => setNgayLam(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Giờ bắt đầu</label>
              <input
                type="time"
                value={gioBatDau}
                onChange={(e) => setGioBatDau(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
              <input
                type="time"
                value={gioKetThuc}
                onChange={(e) => setGioKetThuc(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bộ phận</label>
            <input
              type="text"
              value={loaiCaTruc}
              onChange={(e) => setLoaiCaTruc(e.target.value)}
              placeholder="Ví dụ: Quầy vé, Bảo vệ, ..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            onClick={handleAddSchedule}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
