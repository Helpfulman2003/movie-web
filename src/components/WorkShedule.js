import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkSheduleModal from './WorkSheduleModal'; // Import modal
import Layout from './Layout';

export default function WorkScheduleList() {
  const [workSchedules, setWorkSchedules] = useState([]); // Danh sách hiển thị
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal

  // State để thêm lịch làm việc
  const [ngayLam, setNgayLam] = useState('');
  const [gioBatDau, setGioBatDau] = useState('');
  const [gioKetThuc, setGioKetThuc] = useState('');
  const [loaiCaTruc, setLoaiCaTruc] = useState('');

  const navigate = useNavigate();

  // Hàm lấy toàn bộ danh sách từ API
  const fetchAllSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/workSchedule`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWorkSchedules(data.data || []);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lần đầu khi component được mount
  useEffect(() => {
    fetchAllSchedules();
  }, []);

  // Hàm thêm lịch làm việc mới
  const handleAddSchedule = async () => {
    if (!ngayLam || !gioBatDau || !gioKetThuc || !loaiCaTruc) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newSchedule = {
      ngayLam,
      gioBatDau,
      gioKetThuc,
      loaiCaTruc,
    };

    try {
      const response = await fetch(`http://localhost:8080/workSchedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) {
        throw new Error(`Lỗi tạo lịch làm việc: ${response.statusText}`);
      }

      const data = await response.json();
      setWorkSchedules([...workSchedules, data.data]); // Cập nhật danh sách hiển thị

      // Reset form sau khi thêm
      setNgayLam('');
      setGioBatDau('');
      setGioKetThuc('');
      setLoaiCaTruc('');
      setIsModalOpen(false); // Đóng modal

      alert('Thêm lịch làm việc thành công!');
    } catch (error) {
      console.error('Lỗi khi thêm lịch làm việc:', error);
    }
  };

  // 🗑️ Hàm xóa lịch làm việc
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này không?')) {
      try {
        const response = await fetch(
          `http://localhost:8080/workSchedule/${id}`,
          {
            method: 'DELETE',
          }
        );

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          fetchAllSchedules(); // Load lại danh sách sau khi xóa
        } else {
          alert('Lỗi khi xóa: ' + result.message);
        }
      } catch (error) {
        console.error('Lỗi khi xóa:', error.message);
      }
    }
  };

  return (
    <Layout>
      <div className='max-w-6xl mx-auto p-8'>
        <h1 className='text-4xl font-bold text-center mb-8 text-blue-700'>
          📋 Quản lý lịch làm việc
        </h1>

        {/* Nút thêm mới */}
        <div className='flex justify-end mb-6'>
          <button
            className='bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2 rounded-lg transition'
            onClick={() => setIsModalOpen(true)}
          >
            ➕ Thêm lịch làm việc
          </button>
        </div>

        {/* Modal thêm lịch làm việc */}
        <WorkSheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ngayLam={ngayLam}
          setNgayLam={setNgayLam}
          gioBatDau={gioBatDau}
          setGioBatDau={setGioBatDau}
          gioKetThuc={gioKetThuc}
          setGioKetThuc={setGioKetThuc}
          loaiCaTruc={loaiCaTruc}
          setLoaiCaTruc={setLoaiCaTruc}
          handleAddSchedule={handleAddSchedule}
        />

        <div className='bg-white shadow-xl rounded-lg overflow-hidden mt-6'>
          <h2 className='text-2xl font-semibold p-5 border-b border-gray-300 bg-blue-100 text-blue-800'>
            📅 Danh sách lịch làm việc
          </h2>

          {loading ? (
            <p className='text-center py-8 text-lg text-gray-500'>
              Đang tải dữ liệu...
            </p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-base text-left'>
                <thead className='bg-blue-200 text-blue-900 font-semibold text-lg'>
                  <tr>
                    <th className='p-4'>📆 Ngày làm</th>
                    <th className='p-4'>🕒 Giờ bắt đầu</th>
                    <th className='p-4'>🕕 Giờ kết thúc</th>
                    <th className='p-4'>🏢 Bộ phận</th>
                    <th className='p-4 text-center'>⚙️ Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {workSchedules.length > 0 ? (
                    workSchedules.map((ws, index) => (
                      <tr
                        key={index}
                        className='hover:bg-blue-50 border-b text-lg'
                      >
                        <td className='p-4'>
                          {new Date(ws.ngayLam).toLocaleDateString('vi-VN')}
                        </td>
                        <td className='p-4'>
                          {new Date(ws.gioBatDau).toLocaleTimeString()}
                        </td>
                        <td className='p-4'>
                          {new Date(ws.gioKetThuc).toLocaleTimeString()}
                        </td>
                        <td className='p-4'>{ws.loaiCaTruc}</td>
                        <td className='p-4 flex justify-center gap-3'>
                          <button
                            className='bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded'
                            onClick={() => navigate(`/update/${ws._id}`)}
                          >
                            ✏️ Cập nhật
                          </button>
                          <button
                            className='bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded'
                            onClick={() => handleDelete(ws._id)}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan='5'
                        className='text-center p-6 text-gray-500 text-lg'
                      >
                        Không có lịch làm việc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
