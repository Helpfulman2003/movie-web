import React, { useState } from 'react';

function UpdateEmployeeModal({ isOpen, onClose, employee, onUpdate }) {
  const [formData, setFormData] = useState({
    tenDangNhap: employee?.tenDangNhap || '',
    email: employee?.email || '',
    soDienThoai: employee?.soDienThoai || '',
    role: employee?.role || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData); // Gọi hàm onUpdate để cập nhật thông tin
    onClose(); // Đóng modal sau khi cập nhật
  };

  if (!isOpen) return null; // Không hiển thị modal nếu isOpen là false

  return (
    <div className='fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
        <h2 className='text-2xl font-bold text-blue-700 mb-4'>
          Cập nhật thông tin
        </h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              Tên đăng nhập
            </label>
            <input
              type='text'
              name='tenDangNhap'
              value={formData.tenDangNhap}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg p-2'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg p-2'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              Số điện thoại
            </label>
            <input
              type='text'
              name='soDienThoai'
              value={formData.soDienThoai}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg p-2'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              Vai trò
            </label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg p-2'
            >
              <option value={0}>Nhân viên</option>
              <option value={1}>Quản trị viên</option>
            </select>
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEmployeeModal;
