import React from "react";

export default function WorkSheduleModal({
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
  if (!isOpen) return null; // Không hiển thị modal nếu isOpen là false

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Thêm lịch làm việc</h2>
        <div className="form-group">
          <input
            type="date"
            value={ngayLam}
            onChange={(e) => setNgayLam(e.target.value)}
            placeholder="Ngày làm"
          />
          <input
            type="time"
            value={gioBatDau}
            onChange={(e) => setGioBatDau(e.target.value)}
            placeholder="Giờ bắt đầu"
          />
          <input
            type="time"
            value={gioKetThuc}
            onChange={(e) => setGioKetThuc(e.target.value)}
            placeholder="Giờ kết thúc"
          />
          <input
            type="text"
            value={loaiCaTruc}
            onChange={(e) => setLoaiCaTruc(e.target.value)}
            placeholder="Ca trực"
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleAddSchedule}>Lưu</button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
}