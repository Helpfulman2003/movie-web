import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddMovieScreening = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [newScreening, setNewScreening] = useState({
    maPhim: '',
    maPhong: '',
    gioBatDau: '',
    gioKetThuc: '',
    trangThai: true,
  });
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchMovies();
    fetchRooms();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:8080/movies');
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách phim');
      }

      const data = await response.json();
      setMovies(data.data || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/rooms');
      if (!response.ok) {
        throw new Error('Không thể lấy danh sách phòng');
      }

      const data = await response.json();
      setRooms(data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    }
  };

  const validateScreening = () => {
    if (!newScreening.maPhim) {
      setMessage('Vui lòng chọn phim!');
      return false;
    }
    if (!newScreening.maPhong) {
      setMessage('Vui lòng chọn phòng!');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewScreening({
      ...newScreening,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateScreening()) return;

    try {
      const bodyToSend = {
        ...newScreening,
        gioBatDau: new Date(newScreening.gioBatDau).toISOString(),
        gioKetThuc: new Date(newScreening.gioKetThuc).toISOString(),
      };

      const response = await fetch('http://localhost:8080/movieScreenings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi thêm lịch chiếu');
      }

      const data = await response.json();
      if (data.message) {
        setMessage(data.message);
        return;
      }

      setMessage('Thêm lịch chiếu thành công!');
      setNewScreening({
        maPhim: '',
        maPhong: '',
        gioBatDau: '',
        gioKetThuc: '',
        trangThai: true,
      });
      navigate('/movieScreenings');
    } catch (error) {
      console.error('Error adding screening:', error);
      setMessage('Có lỗi xảy ra khi thêm lịch chiếu. Vui lòng thử lại!');
    }
  };

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     if (!validateScreening()) return;

  //     try {
  //         const response = await fetch('http://localhost:8080/movieScreenings', {
  //             method: 'POST',
  //             headers: {
  //                 'Content-Type': 'application/json',
  //             },
  //             body: JSON.stringify(newScreening)
  //         });

  //         if (!response.ok) {
  //             const errorData = await response.json();
  //             throw new Error(errorData.message || 'Lỗi khi thêm lịch chiếu');
  //         }

  //         const data = await response.json();
  //         if (data.message) {
  //             setMessage(data.message);
  //             return;
  //         }

  //         setMessage('Thêm lịch chiếu thành công!');
  //         setNewScreening({
  //             maPhim: '',
  //             maPhong: '',
  //             gioBatDau: '',
  //             gioKetThuc: '',
  //             trangThai: true
  //         });
  //         navigate('/movieScreenings');
  //     } catch (error) {
  //         console.error('Error adding screening:', error);
  //         setMessage('Có lỗi xảy ra khi thêm lịch chiếu. Vui lòng thử lại!');
  //     }
  // };

  return (
    <div className='container mx-auto px-4 py-8'>
      {message && (
        <div className='fixed top-4 right-4 p-4 rounded-lg bg-green-100 text-green-800'>
          {message}
        </div>
      )}

      <h1 className='text-4xl font-bold text-gray-800 mb-8'>
        Thêm Lịch Chiếu Phim
      </h1>

      <div className='bg-white rounded-xl shadow-lg p-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Phim
            </label>
            <select
              name='maPhim'
              value={newScreening.maPhim}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            >
              <option value=''>Chọn phim</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.tenPhim}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Phòng chiếu
            </label>
            <select
              name='maPhong'
              value={newScreening.maPhong}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            >
              <option value=''>Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.tenPhong}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Giờ bắt đầu
            </label>
            <input
              type='datetime-local'
              name='gioBatDau'
              value={newScreening.gioBatDau}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>

          <div>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Giờ kết thúc
            </label>
            <input
              type='datetime-local'
              name='gioKetThuc'
              value={newScreening.gioKetThuc}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            />
          </div>

          <div className='flex items-center space-x-4'>
            <label className='block text-lg font-medium text-gray-700'>
              Trạng thái
            </label>
            <input
              type='checkbox'
              name='tranThai'
              checked={newScreening.tranThai}
              onChange={handleChange}
              className='form-checkbox h-5 w-5 text-indigo-600'
            />
          </div>

          <button
            type='submit'
            className='bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            Thêm lịch chiếu
          </button>

          <button
            type='button'
            onClick={() => navigate('/movieScreenings')}
            className='bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
          >
            Quay lại
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMovieScreening;
