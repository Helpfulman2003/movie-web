import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice'; // Import updateEmployee từ Redux slice
import { toast } from 'react-toastify';
import UpdateEmployeeModal from '../components/UpdateEmployeeModal'; // Import modal
import { updateEmployeeThunk } from '../redux/slices/employeeSlice';

function EmployeeProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employee, loading } = useSelector((state) => state.employees);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Bạn đã đăng xuất thành công!');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      toast.error('Đăng xuất thất bại. Vui lòng thử lại!');
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
     
      await dispatch(
        updateEmployeeThunk({ employeeId: employee._id, updatedData })
      ).unwrap();
      toast.success('Cập nhật thông tin thành công!');
      setIsModalOpen(false); // Đóng modal sau khi cập nhật
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error('Cập nhật thông tin thất bại. Vui lòng thử lại!');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex justify-center items-center p-6'>
      <div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
        <h2 className='text-3xl font-extrabold text-blue-700 text-center mb-6'>
          Thông Tin Nhân Viên
        </h2>
        <div className='space-y-4'>
          <p className='text-lg text-gray-700'>
            <strong className='text-blue-600'>Họ tên:</strong>{' '}
            {employee?.tenDangNhap || 'Không xác định'}
          </p>
          <p className='text-lg text-gray-700'>
            <strong className='text-blue-600'>Email:</strong>{' '}
            {employee?.email || 'Không xác định'}
          </p>
          <p className='text-lg text-gray-700'>
            <strong className='text-blue-600'>Số điện thoại:</strong>{' '}
            {employee?.soDienThoai || 'Không xác định'}
          </p>
          <p className='text-lg text-gray-700'>
            <strong className='text-blue-600'>Vai trò:</strong>{' '}
            {employee?.role === 1 ? 'Quản trị viên' : 'Nhân viên'}
          </p>
        </div>
        <div className='mt-6 flex flex-col gap-4'>
          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-all duration-300'
          >
            Chỉnh sửa thông tin
          </button>
          <button
            onClick={handleLogout}
            className='bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-all duration-300'
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Hiển thị modal cập nhật thông tin */}
      <UpdateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={employee}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default EmployeeProfile;
