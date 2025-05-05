// src/components/MovieManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';

const MovieManagement = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10);

  // Thêm state cho form
  //  const [editingMovie, setEditingMovie] = useState(null);
  const [newMovie, setNewMovie] = useState({
    tenPhim: '',
    theLoai: '',
    thoiLuong: '',
    daoDien: '',
    namSanXuat: '',
    moTa: '',
    ngayCongChieu: '',
    anhBia: '',
    trangThai: true,
  });
  const validateMovie = () => {
    if (!newMovie.tenPhim) {
      setMessage('Vui lòng nhập tên phim!');
      return false;
    }
    if (!newMovie.theLoai) {
      setMessage('Vui lòng nhập thể loại!');
      return false;
    }
    if (!newMovie.thoiLuong) {
      setMessage('Vui lòng nhập thời lượng!');
      return false;
    }
    if (!newMovie.namSanXuat) {
      setMessage('Vui lòng nhập năm sản xuất!');
      return false;
    }
    if (!newMovie.ngayCongChieu) {
      setMessage('Vui lòng chọn ngày công chiếu!');
      return false;
    }
    return true;
  };
  // Fetch movies
  useEffect(() => {
    fetchMovies();
  }, []);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  // 2. Cập nhật hàm fetchMovies
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/movies');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log để xem cấu trúc data

      // Kiểm tra xem data có thuộc tính data hay không
      const moviesData = data.data || data;
      if (!moviesData || !Array.isArray(moviesData)) {
        console.error('Invalid data from API:', data);
        setMovies([]);
        setMessage('Không thể lấy danh sách phim');
        return;
      }

      setMovies(moviesData);
      setMessage(null);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
      setMessage('Lỗi khi lấy danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movieId) => {
    navigate(`/movies/update/${movieId}`);
  };

  const handleDelete = async (movieId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa phim');
      }

      setMessage('Xóa phim thành công!');
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      setMessage(`Lỗi: ${error.message}`);
    }
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

      <h1 className='text-4xl font-bold text-blue-500 mb-8'>Quản lý Phim</h1>

      <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
        <button
          onClick={() => navigate('/movies/addmovie')}
          className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-6'
        >
          Thêm phim mới
        </button>
      </div>
      <div className='overflow-x-auto p-4 bg-white shadow-md rounded-lg'>
        <h2 className='text-3xl font-bold text-blue-500 mb-6'>
          Danh sách phim
        </h2>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden'>
            <thead className='bg-blue-100'>
              <tr className='text-left text-2xl font-bold text-blue-900 tracking-wide'>
                <th className='px-6 py-5'>Tên phim</th>
                <th className='px-6 py-5'>Thể loại</th>
                <th className='px-6 py-5'>Thời lượng</th>
                <th className='px-6 py-5'>Đạo diễn</th>
                <th className='px-6 py-5'>Năm sản xuất</th>
                <th className='px-6 py-5'>Ngày công chiếu</th>
                <th className='px-6 py-5'>Trạng thái</th>
                <th className='px-6 py-5'>Hành động</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200 text-black text-xl'>
              {currentMovies && currentMovies.length > 0 ? (
                currentMovies.map((movie, index) => (
                  <tr
                    key={`${movie._id}-${index}`}
                    className='hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='px-6 py-5 break-words whitespace-normal font-normal'>
                      {movie.tenPhim}
                    </td>
                    <td className='px-6 py-5 break-words whitespace-normal'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-lg font-normal text-black'>
                        {movie.theLoai}
                      </span>
                    </td>
                    <td className='px-6 py-5 break-words whitespace-normal'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-lg font-normal text-black'>
                        {movie.thoiLuong} phút
                      </span>
                    </td>
                    <td className='px-6 py-5 break-words whitespace-normal font-normal'>
                      {movie.daoDien}
                    </td>
                    <td className='px-6 py-5 break-words whitespace-normal'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-lg font-normal text-black'>
                        {movie.namSanXuat}
                      </span>
                    </td>
                    <td className='px-6 py-5 break-words whitespace-normal'>
                      <span className='inline-flex items-center px-3 py-1 rounded-full text-lg font-normal text-black'>
                        {new Date(movie.ngayCongChieu).toLocaleDateString(
                          'vi-VN'
                        )}
                      </span>
                    </td>
                    <td className='px-6 py-5 break-words whitespace-normal'>
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-normal text-black`}
                      >
                        {movie.trangThai ? 'Đang chiếu' : 'Ngừng chiếu'}
                      </span>
                    </td>
                    <td className='px-6 py-5 break-words whitespace-normal'>
                      <div className='flex space-x-3'>
                        <button
                          onClick={() => handleEdit(movie._id)}
                          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200'
                        >
                          <svg
                            className='w-6 h-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(movie._id)}
                          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200'
                        >
                          <svg
                            className='w-6 h-6'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan='8'
                    className='px-6 py-8 text-center text-gray-500 text-xl'
                  >
                    <div className='flex flex-col items-center space-y-4'>
                      <svg
                        className='w-20 h-20 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                        />
                      </svg>
                      <p className='text-2xl font-semibold'>
                        Không có phim nào
                      </p>
                      <p className='text-base text-gray-400'>
                        Hãy thêm phim mới bằng cách nhấn nút "Thêm phim mới" ở
                        trên
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
       
      </div>
    </div>
    </Layout>
  );
};

export default MovieManagement;
