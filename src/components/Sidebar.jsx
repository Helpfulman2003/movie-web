import React from 'react';
import {
  FaFilm,
  FaTicketAlt,
  FaUsers,
  FaTheaterMasks,
  FaCalendarAlt,
  FaList,
  FaChartBar,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className='w-64 bg-gray-800 text-white'>
      <Link to='/' className='block'>
        <div className='p-4 text-lg font-bold text-center border-b border-gray-700'>
          Dashboard
        </div>
      </Link>
      <nav className='mt-4'>
        <ul className='space-y-2'>
          <li>
            <Link
              to='/movies'
              className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition'
            >
              <FaFilm className='mr-3' />
              Quản lý phim
            </Link>
          </li>
          <li>
            <Link
              to='/rooms'
              className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition'
            >
              <FaTheaterMasks className='mr-3' />
              Quản lý phòng chiếu
            </Link>
          </li>
          <li>
            <Link
              to='/movieScreenings'
              className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition'
            >
              <FaTicketAlt className='mr-3' />
              Quản lý suất chiếu
            </Link>
          </li>
          <li>
            <Link
              to='/employee'
              className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition'
            >
              <FaUsers className='mr-3' />
              Quản lý nhân viên
            </Link>
          </li>
          <li>
            <Link
              to='/workShedule'
              className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition'
            >
              <FaCalendarAlt className='mr-3' />
              Quản lý lịch làm việc
            </Link>
          </li>
          <li>
            <Link
              to='/workSheduleEmployee'
              className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition'
            >
              <FaList className='mr-3' />
              Quản lý ca làm việc
            </Link>
          </li>
          <li>
            <Link
              to='/workScheduleStats'
              className='flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition'
            >
              <FaChartBar className='mr-3' />
              Thống kê lịch làm việc
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
