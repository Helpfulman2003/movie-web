import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

      <h1 className='text-4xl font-bold text-gray-800 mb-8'>
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
        <h2 className='text-3xl font-bold text-gray-800 mb-6'>
          Danh sách phòng
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Tên phòng
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Sức chứa
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Loại phòng
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Trạng thái
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Hành động
                </th>
              </tr>
            </thead>
            {currentRooms && currentRooms.length > 0 ? (
              <tbody className='bg-white divide-y divide-gray-200'>
                {currentRooms.map((room, index) => (
                  <tr key={`${room._id}-${index}`} className='hover:bg-gray-50'>
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
                          onClick={() => navigate(`/rooms/update/${room._id}`)}
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

          <div className='flex items-center justify-between mt-8'>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Trước
              </button>
              <span className='px-4 py-2 text-gray-600'>
                Trang {currentPage} của {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
