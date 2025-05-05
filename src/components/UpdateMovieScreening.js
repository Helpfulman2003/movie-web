import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateMovieScreening = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [screening, setScreening] = useState({
    maPhim: {
      _id: '',
      tenPhim: '',
    },
    maPhong: {
      _id: '',
      tenPhong: '',
    },
    gioBatDau: '',
    gioKetThuc: '',
    tranThai: true,
  });
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState({});

  const parseDateTime = (value) => {
    if (!value) return null;

    try {
      // Chuyển đổi từ định dạng "HH:mm SA/CH dd/mm/yyyy" sang ISO
      const parts = value.split(' ');
      if (parts.length !== 3) return null;

      const [timePart, period, datePart] = parts;
      const [hours, minutes] = timePart.split(':');
      const [day, month, year] = datePart.split('/');

      // Chuyển đổi sang 24h format
      let hour24 = parseInt(hours);
      if (period === 'CH' && hour24 < 12) {
        hour24 += 12;
      } else if (period === 'SA' && hour24 === 12) {
        hour24 = 0;
      }

      // Tạo đối tượng Date với timezone +07:00
      const date = new Date(
        Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          hour24,
          parseInt(minutes)
        )
      );

      if (isNaN(date.getTime())) return null;

      // Chuyển đổi sang ISO string và thêm timezone +07:00
      const isoString = date.toISOString();
      return isoString.replace('T', ' ').replace('Z', '+07:00');
    } catch (error) {
      console.error('Error parsing datetime:', error);
      return null;
    }
  };

  const formatDateTime = (date) => {
    if (!date) return '';

    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';

      // Chuyển đổi sang múi giờ Việt Nam (+07:00)
      const vietnamDate = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);

      // Format thời gian với AM/PM
      const formattedTime = vietnamDate.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: true,
        timeZone: 'UTC',
      });

      // Thay thế AM/PM bằng SA/CH
      return formattedTime
        .replace('AM', 'SA')
        .replace('PM', 'CH')
        .replace('am', 'SA')
        .replace('pm', 'CH');
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '';
    }
  };

  useEffect(() => {
    if (location.state && location.state.screening) {
      const screeningData = location.state.screening;
      setScreening({
        ...screeningData,
        gioBatDau: formatDateTime(screeningData.gioBatDau),
        gioKetThuc: formatDateTime(screeningData.gioKetThuc),
      });
      setLoading(false);
    } else if (id) {
      fetchScreening();
    }
    fetchMovies();
    fetchRooms();
  }, [id, location.state]);

  const fetchScreening = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/movieScreenings/${id}`
      );

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin lịch chiếu');
      }

      const data = await response.json();
      if (data.data) {
        setScreening({
          ...data.data,
          gioBatDau: formatDateTime(data.data.gioBatDau),
          gioKetThuc: formatDateTime(data.data.gioKetThuc),
        });
      }
    } catch (error) {
      console.error('Error fetching screening:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    const newErrors = {};
    let isValid = true;

    if (!screening.maPhim._id) {
      newErrors.maPhim = 'Vui lòng chọn phim!';
      isValid = false;
    }

    if (!screening.maPhong._id) {
      newErrors.maPhong = 'Vui lòng chọn phòng!';
      isValid = false;
    }

    if (!screening.gioBatDau) {
      newErrors.gioBatDau = 'Vui lòng chọn giờ bắt đầu!';
      isValid = false;
    }

    if (!screening.gioKetThuc) {
      newErrors.gioKetThuc = 'Vui lòng chọn giờ kết thúc!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'maPhim' || name === 'maPhong') {
      setScreening({
        ...screening,
        [name]: {
          _id: value,
          tenPhim: type === 'select' ? e.target.selectedOptions[0].text : '',
        },
      });
    } else if (name === 'gioBatDau' || name === 'gioKetThuc') {
      // Chỉ cập nhật giá trị, không cần xử lý datetime ở đây
      setScreening({
        ...screening,
        [name]: value,
      });
    } else if (name === 'tranThai') {
      setScreening({
        ...screening,
        [name]: checked,
      });
    } else {
      setScreening({
        ...screening,
        [name]: value,
      });
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateScreening()) return;

    try {
      setLoading(true);

      const gioBatDau = parseDateTime(screening.gioBatDau);
      const gioKetThuc = parseDateTime(screening.gioKetThuc);

      if (!gioBatDau || !gioKetThuc) {
        throw new Error('Định dạng thời gian không hợp lệ');
      }

      const payload = {
        maPhim: screening?.maPhim?._id,
        maPhong: screening?.maPhong?._id,
        gioBatDau,
        gioKetThuc,
        tranThai: screening?.tranThai,
      };

      console.log('Sending payload:', payload);

      const response = await fetch(
        `http://localhost:8080/movieScreenings/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error(data.message || 'Không thể cập nhật lịch chiếu');
      }

      toast.success('Cập nhật lịch chiếu thành công!');
      navigate('/movieScreenings');
    } catch (error) {
      console.error('Lỗi cập nhật lịch chiếu:', error);
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {message && (
        <div className='fixed top-4 right-4 p-4 rounded-lg bg-green-100 text-green-800'>
          {message}
        </div>
      )}

      <h1 className='text-4xl font-bold text-gray-800 mb-8'>
        Cập nhật Lịch Chiếu Phim
      </h1>

      <div className='bg-white rounded-xl shadow-lg p-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Phim
            </label>
            <select
              name='maPhim'
              value={screening.maPhim._id}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.maPhim && 'border-red-500'
              }`}
              required
            >
              <option value=''>Chọn phim</option>
              {movies.map((movie) => (
                <option key={movie._id} value={movie._id}>
                  {movie.tenPhim}
                </option>
              ))}
            </select>
            {errors.maPhim && (
              <p className='text-red-500 text-sm mt-1'>{errors.maPhim}</p>
            )}
          </div>

          <div>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Phòng chiếu
            </label>
            <select
              name='maPhong'
              value={screening.maPhong._id}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.maPhong && 'border-red-500'
              }`}
              required
            >
              <option value=''>Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.tenPhong}
                </option>
              ))}
            </select>
            {errors.maPhong && (
              <p className='text-red-500 text-sm mt-1'>{errors.maPhong}</p>
            )}
          </div>

          <div>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Giờ bắt đầu
            </label>
            <input
              type='text'
              name='gioBatDau'
              value={screening.gioBatDau}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.gioBatDau && 'border-red-500'
              }`}
              required
            />
            {errors.gioBatDau && (
              <p className='text-red-500 text-sm mt-1'>{errors.gioBatDau}</p>
            )}
          </div>

          <div>
            <label className='block text-lg font-medium text-gray-700 mb-2'>
              Giờ kết thúc
            </label>
            <input
              type='text'
              name='gioKetThuc'
              value={screening.gioKetThuc}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.gioKetThuc && 'border-red-500'
              }`}
              required
            />
            {errors.gioKetThuc && (
              <p className='text-red-500 text-sm mt-1'>{errors.gioKetThuc}</p>
            )}
          </div>

          <div className='flex items-center space-x-4'>
            <label className='block text-lg font-medium text-gray-700'>
              Trạng thái
            </label>
            <input
              type='checkbox'
              name='tranThai'
              checked={screening.tranThai}
              onChange={handleChange}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateMovieScreening;
