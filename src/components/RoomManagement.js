import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const RoomManagement = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(10);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/rooms');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const roomsData = data.data || data;
      if (!roomsData || !Array.isArray(roomsData)) {
        console.error('Invalid data from API:', data);
        setRooms([]);
        setMessage('Không thể lấy danh sách phòng');
        return;
      }

      setRooms(roomsData);
      setMessage(null);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
      setMessage('Lỗi khi lấy danh sách phòng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  const handleDelete = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa phòng');
      }

      setMessage('Xóa phòng thành công!');
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      setMessage(`Lỗi: ${error.message}`);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Layout>
      <div className='container mx-auto px-4 py-8'>
        {loading && (
          <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
            <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white'></div>
          </div>
        )}
        {message && (
          <div className='fixed top-4 right-4 p-4 rounded-lg bg-green-100 text-green-800'>
            {message}
          </div>
        )}

        <h1 className='text-4xl font-bold text-blue-500 mb-8'>
          Quản lý Phòng Chiếu
        </h1>

        <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
          <button
            onClick={() => navigate('/rooms/addroom')}
            className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-6'
          >
            Thêm phòng mới
          </button>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-8'>
          <h2 className='text-3xl font-bold text-blue-500 mb-6'>
            Danh sách phòng
          </h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-blue-100'>
                <tr className='text-left text-2xl font-bold text-blue-900 tracking-wide'>
                  <th className='px-6 py-4 '> Tên phòng</th>
                  <th className='px-6 py-4 '>Sức chứa </th>
                  <th className='px-6 py-4 '>Loại phòng </th>
                  <th className='px-6 py-4 '>Trạng thái</th>
                  <th className='px-6 py-4 '>Hành động</th>
                </tr>
              </thead>
              {currentRooms && currentRooms.length > 0 ? (
                <tbody className='bg-white divide-y divide-gray-200'>
                  {currentRooms.map((room, index) => (
                    <tr
                      key={`${room._id}-${index}`}
                      className='hover:bg-gray-50'
                    >
                      <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                        {room.tenPhong}
                      </td>
                      <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                        {room.sucChua}
                      </td>
                      <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                        {room.loaiPhong}
                      </td>
                      <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            room.trangThaiHoatDong
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {room.trangThaiHoatDong
                            ? 'Đang hoạt động'
                            : 'Ngừng hoạt động'}
                        </span>
                      </td>
                      <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() =>
                              navigate(`/rooms/update/${room._id}`)
                            }
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(room._id)}
                            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td
                      colSpan='5'
                      className='px-6 py-6 text-center text-gray-500'
                    >
                      Không có phòng nào
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RoomManagement;
