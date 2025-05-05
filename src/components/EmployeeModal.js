import React from 'react';

export default function EmployeeModal({
  tenDangNhap,
  setTenDangNhap,
  matKhau,
  setMatKhau,
  email,
  setEmail,
  soDienThoai,
  setSoDienThoai,
  ngaySinh,
  setNgaySinh,
  diaChi,
  setDiaChi,
  role,
  setRole,
  handleSaveEmployee,
  resetForm,
  editingId,
}) {
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          {editingId ? '✏️ Cập nhật' : '➕ Thêm'} nhân viên
        </h2>

        <div className="grid grid-cols-1 gap-4 text-lg">
          <input
            type="text"
            placeholder="👤 Tên đăng nhập"
            value={tenDangNhap}
            onChange={(e) => setTenDangNhap(e.target.value)}
            className="border p-3 rounded-lg focus:outline-blue-400"
          />
          <input
            type="password"
            placeholder="🔒 Mật khẩu"
            value={matKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            className="border p-3 rounded-lg focus:outline-blue-400"
          />
          <input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg focus:outline-blue-400"
          />
          <input
            type="text"
            placeholder="📱 Số điện thoại"
            value={soDienThoai}
            onChange={(e) => setSoDienThoai(e.target.value)}
            className="border p-3 rounded-lg focus:outline-blue-400"
          />
          <input
            type="date"
            placeholder="📅 Ngày sinh"
            value={ngaySinh}
            onChange={(e) => setNgaySinh(e.target.value)}
            className="border p-3 rounded-lg focus:outline-blue-400"
          />
          <input
            type="text"
            placeholder="🏠 Địa chỉ"
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            className="border p-3 rounded-lg focus:outline-blue-400"
          />

          <select
            value={role}
            onChange={(e) => setRole(Number(e.target.value))}
            className="border p-3 rounded-lg bg-white focus:outline-blue-400"
          >
            <option value={0}>👥 Người dùng</option>
            <option value={1}>🛠️ Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleSaveEmployee}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2 rounded-lg transition"
          >
            {editingId ? '💾 Cập nhật' : '✅ Thêm'}
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-300 hover:bg-gray-400 text-lg px-6 py-2 rounded-lg"
          >
            ❌ Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
