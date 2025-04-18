import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MovieScreeningManagement = () => {
  const navigate = useNavigate();
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [screeningsPerPage] = useState(10);

  // Lấy danh sách lịch chiếu
  const fetchScreenings = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/movieScreenings');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data) {
        throw new Error('Invalid response format from API');
      }

      setScreenings(data.data);
      setMessage(null);
    } catch (error) {
      console.error('Error fetching screenings:', error);
      setScreenings([]);
      setMessage(
        'Không thể lấy danh sách lịch chiếu. Vui lòng kiểm tra lại kết nối API.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, []);

  // Xóa lịch chiếu
  const handleDelete = async (screeningId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch chiếu này?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/movieScreenings/${screeningId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Lỗi khi xóa lịch chiếu');
      }

      setMessage('Xóa lịch chiếu thành công!');
      fetchScreenings();
    } catch (error) {
      console.error('Error deleting screening:', error);
      setMessage(`Lỗi: ${error.message}`);
    }
  };

  // Cập nhật trạng thái lịch chiếu
  const handleStatusChange = async (screeningId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:8080/movieScreenings/${screeningId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trangThai: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái lịch chiếu');
      }

      setMessage('Cập nhật trạng thái thành công!');
      fetchScreenings();
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage(`Lỗi: ${error.message}`);
    }
  };

  // Phân trang
  const indexOfLastScreening = currentPage * screeningsPerPage;
  const indexOfFirstScreening = indexOfLastScreening - screeningsPerPage;
  const currentScreenings = screenings.slice(
    indexOfFirstScreening,
    indexOfLastScreening
  );
  const totalPages = Math.ceil(screenings.length / screeningsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (screening) => {
    navigate(`/movieScreenings/update/${screening._id}`, {
      state: { screening: { ...screening } },
    });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {loading && (
        <div className='flex justify-center items-center min-h-screen'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
        </div>
      )}

      {message && (
        <div className='fixed top-4 right-4 p-4 rounded-lg bg-green-100 text-green-800'>
          {message}
        </div>
      )}

      <div className='bg-white rounded-xl shadow-lg p-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800'>
            Quản lý Lịch Chiếu Phim
          </h1>
          <button
            onClick={() => navigate('/movieScreenings/add')}
            className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            Thêm Lịch Chiếu
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Tên phim
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Tên phòng
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Giờ bắt đầu
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Giờ kết thúc
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Trạng thái
                </th>
                <th className='px-6 py-4 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {currentScreenings.map((screening, index) => (
                <tr
                  key={`${screening._id}-${index}`}
                  className='hover:bg-gray-50'
                >
                  <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                    {screening.maPhim?.tenPhim || screening.maPhim}
                  </td>
                  <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                    {screening.maPhong?.tenPhong || screening.maPhong}
                  </td>
                  <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                    {new Date(screening.gioBatDau).toLocaleString()}
                  </td>
                  <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                    {new Date(screening.gioKetThuc).toLocaleString()}
                  </td>
                  <td className='px-6 py-6 whitespace-nowrap'>
                    <select
                      value={screening.trangThai ? 'Đang chiếu' : 'Đã kết thúc'}
                      onChange={(e) =>
                        handleStatusChange(
                          screening._id,
                          e.target.value === 'Đang chiếu'
                        )
                      }
                      className='border border-gray-300 rounded p-1'
                    >
                      <option value='Đang chiếu'>Đang chiếu</option>
                      <option value='Đã kết thúc'>Đã kết thúc</option>
                    </select>
                  </td>
                  <td className='px-6 py-6 whitespace-nowrap text-lg text-gray-900'>
                    <div className='flex space-x-2'>
                      <button
                        onClick={() => handleEdit(screening)}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(screening._id)}
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex justify-between items-center mt-8'>
          <div className='flex items-center'>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              Trang trước
            </button>
            <span className='mx-4 text-gray-700'>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage >= totalPages
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieScreeningManagement;
