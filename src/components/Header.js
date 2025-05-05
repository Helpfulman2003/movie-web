import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeById } from '../redux/slices/employeeSlice';
import { Link } from 'react-router-dom';

export default function Header() {
  const { employee, loading } = useSelector((state) => state.employees);

  return (
    <div className='flex justify-between items-center mb-6'>
      {/* Tiêu đề */}
      <h1 className='text-3xl font-bold text-gray-800'>
        Quản lý rạp chiếu phim
      </h1>

      {/* Hiển thị thông tin nhân viên hoặc nút Login/Register */}
      <div className='flex space-x-4'>
        {loading ? (
          <p>Loading...</p>
        ) : employee ? (
          <div className='flex items-center space-x-4'>
            <span className='text-gray-700 font-medium'>
              Xin chào, {employee.tenDangNhap}
            </span>
            <Link
              to='/profile'
              className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
            >
              Hồ sơ
            </Link>
          </div>
        ) : (
          <>
            <Link
              to='/login'
              className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition'
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
