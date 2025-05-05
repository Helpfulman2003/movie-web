import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UpdateMovies() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tenPhim: '',
    theLoai: '',
    thoiLuong: '',
    daoDien: '',
    namSanXuat: '',
    moTa: '',
    ngayCongChieu: '',
    // anhBia: '',
    trangThai: '',
  });

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:8080/movies/${id}`);
        if (!response.ok) {
          throw new Error('Không thể tải thông tin phim');
        }
        const data = await response.json();

        setFormData({
          tenPhim: data.data.tenPhim,
          theLoai: data.data.theLoai,
          thoiLuong: data.data.thoiLuong,
          daoDien: data.data.daoDien,
          namSanXuat: data.data.namSanXuat,
          moTa: data.data.moTa,
          ngayCongChieu: data.data.ngayCongChieu.split('T')[0], // Format YYYY-MM-DD
          // anhBia: data.data.anhBia,
          trangThai: data.data.trangThai,
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin phim:', error);
      }
    };

    fetchMovie();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuẩn bị dữ liệu trước khi gửi
      const movieData = {
        ...formData,
        thoiLuong: parseInt(formData.thoiLuong),
        namSanXuat: parseInt(formData.namSanXuat),
        ngayCongChieu: new Date(formData.ngayCongChieu).toISOString(),
        trangThai: formData.trangThai === 'Đang chiếu',
      };

      const response = await fetch(`http://localhost:8080/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật phim');
      }

      alert('Cập nhật phim thành công!');
      navigate('/movies'); // Quay lại trang danh sách phim
    } catch (error) {
      console.error('Lỗi khi cập nhật phim:', error);
      alert('Có lỗi xảy ra khi cập nhật phim: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h2 className='text-3xl font-bold mb-6'>Cập nhật thông tin phim</h2>

      <form
        onSubmit={handleSubmit}
        className='max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Tên phim</label>
            <input
              type='text'
              name='tenPhim'
              value={formData.tenPhim}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Thể loại
            </label>
            <input
              type='text'
              name='theLoai'
              value={formData.theLoai}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Thời lượng (phút)
            </label>
            <input
              type='number'
              name='thoiLuong'
              value={formData.thoiLuong}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Đạo diễn
            </label>
            <input
              type='text'
              name='daoDien'
              value={formData.daoDien}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Năm sản xuất
            </label>
            <input
              type='number'
              name='namSanXuat'
              value={formData.namSanXuat}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Ngày công chiếu
            </label>
            <input
              type='date'
              name='ngayCongChieu'
              value={formData.ngayCongChieu}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div><div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Trạng thái
            </label>
            <select
              name='trangThai'
              value={formData.trangThai}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            >
              <option value=''>Chọn trạng thái</option>
              <option value='Đang chiếu'>Đang chiếu</option>
              <option value='Sắp chiếu'>Sắp chiếu</option>
              <option value='Ngừng chiếu'>Ngừng chiếu</option>
            </select>
          </div>
        </div>

        <div className='mb-4 col-span-2'>
          <label className='block text-gray-700 text-sm font-bold mb-2'>
            Mô tả
          </label>
          <textarea
            name='moTa'
            value={formData.moTa}
            onChange={handleChange}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            rows='4'
            required
          ></textarea>
        </div>

        <div className='flex items-center justify-end gap-4'>
          <button
            type='button'
            onClick={() => navigate('/movies')}
            className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Hủy
          </button>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}