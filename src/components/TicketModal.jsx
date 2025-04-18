import React, { useState, useEffect } from 'react';
import { fetchScreenings } from '../api/movieScreeningsApi'; // Import API lấy suất chiếu
import { fetchMovies } from '../api/movieApi'; // Import API lấy danh sách phim

function TicketModal({ addTicket, closeModal }) {
  const [movies, setMovies] = useState([]); // Lưu danh sách phim
  const [movieId, setMovieId] = useState(''); // Lưu ID của phim được chọn
  const [screenings, setScreenings] = useState([]); // Lưu danh sách suất chiếu
  const [showTime, setShowTime] = useState(''); // Lưu ID của suất chiếu
  const [seat, setSeat] = useState('');
  const [gia, setGia] = useState('');
  const [trangThai, setTrangThai] = useState('Chưa sử dụng');

  // Lấy danh sách phim từ cơ sở dữ liệu khi component được render
  useEffect(() => {
    const fetchMovieList = async () => {
      try {
        const moviesFromDB = await fetchMovies(); // Hàm lấy danh sách phim từ API
        setMovies(moviesFromDB.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phim:', error);
      }
    };
    fetchMovieList();
  }, [fetchMovies]);

  // Lấy danh sách suất chiếu khi chọn phim
  useEffect(() => {
    const fetchScreening = async () => {
      if (movieId) {
        try {
          const screeningsFromDB = await fetchScreenings(movieId); // Gọi API lấy suất chiếu
          setScreenings(screeningsFromDB.data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách suất chiếu:', error);
          setScreenings([]); 
        }
      } else {
        setScreenings([]); // Xóa danh sách suất chiếu nếu chưa chọn phim
      }
    };

    fetchScreening();
  }, [movieId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movieId && showTime && seat && gia) {
      addTicket({
        maSuatChieu: showTime, // Lưu ID của suất chiếu vào maSuatChieu
        ghe: seat,
        gia: parseFloat(gia),
        trangThai,
      });
      setMovieId('');
      setShowTime('');
      setSeat('');
      setGia('');
      setTrangThai('Chưa sử dụng');
      closeModal(); // Đóng modal sau khi thêm
    }
  };

  return (
    <div className='fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative'>
        <button
          onClick={closeModal}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>
        <h3 className='text-2xl font-bold mb-6 text-center text-blue-700'>
          Thêm Vé Mới
        </h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Tên phim:
            </label>
            <select
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='' disabled>
                Chọn phim
              </option>
              {movies?.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.tenPhim} {/* Hiển thị tên phim */}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Suất chiếu:
            </label>
            <select
              value={showTime}
              onChange={(e) => setShowTime(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
              disabled={!movieId} // Vô hiệu hóa nếu chưa chọn phim
            >
              <option value='' disabled>
                {movieId ? 'Chọn suất chiếu' : 'Chọn phim trước'}
              </option>
              {screenings?.map((screening) => (
                <option key={screening._id} value={screening._id}>
                  {new Date(screening.gioBatDau).toLocaleString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  {/* Hiển thị thời gian bắt đầu theo định dạng tiếng Việt */}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Ghế:
            </label>
            <input
              type='text'
              value={seat}
              onChange={(e) => setSeat(e.target.value)}
              placeholder='Nhập số ghế'
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Giá vé:
            </label>
            <input
              type='number'
              value={gia}
              onChange={(e) => setGia(e.target.value)}
              placeholder='Nhập giá vé'
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Trạng thái:
            </label>
            <select
              value={trangThai}
              onChange={(e) => setTrangThai(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='Chưa sử dụng'>Chưa sử dụng</option>
              <option value='Đã sử dụng'>Đã sử dụng</option>
              <option value='Hủy'>Hủy</option>
            </select>
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='submit'
              className='bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition-all duration-300'
            >
              Thêm
            </button>
            <button
              type='button'
              onClick={closeModal}
              className='bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-all duration-300'
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TicketModal;
