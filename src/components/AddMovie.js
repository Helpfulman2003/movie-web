import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddMovie = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [newMovie, setNewMovie] = useState({
    tenPhim: '',
    theLoai: '',
    thoiLuong: '',
    daoDien: '',
    namSanXuat: '',
    moTa: '',
    ngayCongChieu: '',
    // anhBia: '',
    trangThai: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Nếu có ID trong URL, load thông tin phim để chỉnh sửa
    console.log('ID:', id); // Thêm log để kiểm tra
    if (id) {
      setLoading(true);
      fetchMovie(id);
    }
  }, [id]); // Đảm bảo thêm id vào dependencies array

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
  const fetchMovie = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:8080/movies/${movieId}`);
      const data = await response.json();

      setNewMovie({
        tenPhim: data.tenPhim || '',
        theLoai: data.theLoai || '',
        thoiLuong: data.thoiLuong || '',
        daoDien: data.daoDien || '',
        namSanXuat: data.namSanXuat || '',
        moTa: data.moTa || '',
        ngayCongChieu: data.ngayCongChieu || '',
        // anhBia: data.anhBia || '',
        trangThai: data.trangThai !== undefined ? data.trangThai : true,
      });
    } catch (error) {
      setMessage('Không thể lấy thông tin phim');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateMovie()) return;

    setLoading(true);
    setError(null);

    try {
      // Log dữ liệu trước khi gửi
      console.log('Dữ liệu gửi đi:', newMovie);

      const url = id
        ? `http://localhost:8080/movies/${id}`
        : 'http://localhost:8080/movies';

      // Chuẩn bị dữ liệu gửi đi
      const movieData = {
        ...newMovie,
        thoiLuong: parseInt(newMovie.thoiLuong),
        namSanXuat: parseInt(newMovie.namSanXuat),
      };

      console.log('URL:', url);
      console.log('Dữ liệu đã xử lý:', movieData);

      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(movieData),
      });

      console.log('Status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi lưu phim');
      }

      setMessage('Lưu phim thành công!');
      // Đợi một chút để người dùng thấy thông báo thành công
      setTimeout(() => {
        navigate('/movies');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setError(`Lỗi: ${error.message}`);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setNewMovie((prev) => ({
      ...prev,
      trangThai: e.target.checked,
    }));
  };

  // const handleFileUpload = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //         if (file.size > 5 * 1024 * 1024) { // 5MB limit
  //             setError('Kích thước ảnh không được vượt quá 5MB');
  //             return;
  //         }

  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //             const base64String = reader.result;
  //             // Kiểm tra kích thước base64
  //             if (base64String.length > 2 * 1024 * 1024) { // Giới hạn ~2MB sau khi encode
  //                 setError('Ảnh quá lớn sau khi chuyển đổi');
  //                 return;
  //             }
  //             setNewMovie((prev) => ({ ...prev, anhBia: base64String }));
  //             setError(null); // Xóa lỗi nếu thành công
  //         };
  //         reader.onerror = () => {
  //             setError('Lỗi khi đọc file ảnh');
  //         };
  //         reader.readAsDataURL(file);
  //     }
  // };

  return (
    <div className='container mx-auto px-4 py-8'>
      {loading && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-white'></div>
        </div>
      )}
      {error && (
        <div className='fixed top-4 right-4 p-4 rounded-lg bg-red-100 text-red-800'>
          {error}
        </div>
      )}
      {message && (
        <div className='fixed top-4 right-4 p-4 rounded-lg bg-green-100 text-green-800'>
          {message}
        </div>
      )}
      <div className='bg-white rounded-xl shadow-lg p-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>
          {id ? 'Cập nhật Phim' : 'Thêm mới Phim'}
        </h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-lg font-medium text-gray-500 mb-2'>
                Tên phim
              </label>
              <input
                type='text'
                name='tenPhim'
                value={newMovie.tenPhim}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
                required
              />
            </div>
            <div>
              <label className='block text-lg font-medium text-gray-500 mb-2'>
                Thể loại
              </label>
              <input
                type='text'
                name='theLoai'
                value={newMovie.theLoai}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
                required
              />
            </div>
            <div>
              <label className='block text-lg font-medium text-gray-500 mb-2'>
                Thời lượng (phút)
              </label>
              <input
                type='number'
                name='thoiLuong'
                value={newMovie.thoiLuong}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
                required
              />
            </div>
            <div>
              <label className='block text-lg font-medium text-gray-500 mb-2'>
                Đạo diễn
              </label>
              <input
                type='text'
                name='daoDien'
                value={newMovie.daoDien}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
                required
              />
            </div>
            <div>
              <label className='block text-lg font-medium text-gray-500 mb-2'>
                Năm sản xuất
              </label>
              <input
                type='number'
                name='namSanXuat'
                value={newMovie.namSanXuat}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
                required
              />
            </div>
            <div>
              <label className='block text-lg font-medium text-gray-500 mb-2'>
                Ngày công chiếu
              </label>
              <input
                type='date'
                name='ngayCongChieu'
                value={newMovie.ngayCongChieu}
                onChange={handleInputChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
                required
              />
            </div>
            <div>
              <label className='block text-lg font-medium text-gray-500 mb-2'>
                Trạng thái
              </label>
              <div className='mt-2'>
                <input
                  type='checkbox'
                  name='trangThai'
                  checked={newMovie.trangThai}
                  onChange={handleCheckboxChange}
                  className='mr-2'
                />
                <span>Đang chiếu</span>
              </div>
            </div>
            {/* <div>
                        <label className="block text-lg font-medium text-gray-500 mb-2">Ảnh bìa</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                        />
                        {newMovie.anhBia && (
                            <img src={newMovie.anhBia} alt="Ảnh bìa" className="mt-2 w-32 h-48 object-cover rounded-lg" />
                        )}
                    </div> */}
          </div>

          <div>
            <label className='block text-lg font-medium text-gray-500 mb-2'>
              Mô tả
            </label>
            <textarea
              name='moTa'
              value={newMovie.moTa}
              onChange={handleInputChange}
              rows='4'
              className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
              required
            ></textarea>
          </div>

          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              onClick={() => navigate('/movies')}
              className='px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2'
            >
              Hủy
            </button>
            <button
              type='submit'
              className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
