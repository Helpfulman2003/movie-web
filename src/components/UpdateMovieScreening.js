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
    trangThai: true,
  });
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Kiểm tra xem có dữ liệu được truyền qua từ MovieScreeningManagement không
    if (location.state && location.state.screening) {
      setScreening(location.state.screening);
      setLoading(false); // Tắt loading khi có dữ liệu từ state
    } else if (id) {
      fetchScreening();
    }
    fetchMovies();
    fetchRooms();
  }, [id, location.state]);

  const fetchScreening = async () => {
    try {
      setLoading(true);
      console.log('Fetching screening with ID:', id);

      const response = await fetch(
        `http://localhost:8080/movieScreenings/${id}`
      );
      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(
          `Lỗi từ server: ${
            errorData.message || 'Không thể lấy thông tin lịch chiếu'
          }`
        );
      }

      const data = await response.json();
      console.log('Raw screening data:', data);

      if (data.data) {
        // Chuyển đổi datetime từ ISO thành định dạng datetime-local
        const gioBatDau = new Date(data.data.gioBatDau)
          .toISOString()
          .slice(0, 16);
        const gioKetThuc = new Date(data.data.gioKetThuc)
          .toISOString()
          .slice(0, 16);

        console.log('Converted times:', { gioBatDau, gioKetThuc });

        setScreening({
          maPhim: {
            _id: data.data.maPhim._id || '',
            tenPhim: data.data.maPhim.tenPhim || '',
          },
          maPhong: {
            _id: data.data.maPhong._id || '',
            tenPhong: data.data.maPhong.tenPhong || '',
          },
          gioBatDau: gioBatDau,
          gioKetThuc: gioKetThuc,
          trangThai: data.data.trangThai ?? true,
        });
      } else {
        throw new Error('Dữ liệu lịch chiếu không hợp lệ');
      }
    } catch (error) {
      console.error('Error fetching screening:', error);
      toast.error(error.message);
      setScreening({
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
        trangThai: true,
      });
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
      // Chuyển đổi giá trị datetime-local thành định dạng ISO
      setScreening({
        ...screening,
        [name]: value ? new Date(value).toISOString() : '',
      });
    } else if (name === 'trangThai') {
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
  // const handleChange = (e) => {
  //     const { name, value, type, checked } = e.target;
  //     if (name === 'maPhim' || name === 'maPhong') {
  //         setScreening({
  //             ...screening,
  //             [name]: {
  //                 _id: value,
  //                 tenPhim: type === 'select' ? e.target.selectedOptions[0].text : ''
  //             }
  //         });
  //     }else if (name === 'gioBatDau' || name === 'gioKetThuc') {
  //         // KHÔNG convert sang ISO
  //         setScreening({
  //             ...screening,
  //             [name]: value
  //         });

  //     // } else if (name === 'gioBatDau' || name === 'gioKetThuc') {
  //     //     // Chuyển đổi giá trị datetime-local thành định dạng ISO
  //     //     setScreening({
  //     //         ...screening,
  //     //         [name]: value ? new Date(value).toISOString() : ''
  //     //     });
  //     } else if (name === 'trangThai') {
  //         setScreening({
  //             ...screening,
  //             [name]: checked
  //         });
  //     } else {
  //         setScreening({
  //             ...screening,
  //             [name]: value
  //         });
  //     }
  //     setErrors(prevErrors => ({
  //         ...prevErrors,
  //         [name]: ''
  //     }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateScreening()) return;

    if (!id) {
      toast.error('Không tìm thấy ID lịch chiếu để cập nhật.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        maPhim: screening?.maPhim?._id,
        maPhong: screening?.maPhong?._id,
        gioBatDau: screening?.gioBatDau,
        gioKetThuc: screening?.gioKetThuc,
        trangThai: screening?.trangThai,
      };

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
        throw new Error(data.message || 'Không thể cập nhật lịch chiếu');
      }

      toast.success('Cập nhật lịch chiếu thành công!');
      navigate('/movieScreenings');
    } catch (error) {
      console.error('Lỗi cập nhật lịch chiếu:', error);
      toast.error('Có lỗi xảy ra: ' + error.message);
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
              type='datetime-local'
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
              type='datetime-local'
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
              name='trangThai'
              checked={screening.trangThai}
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
