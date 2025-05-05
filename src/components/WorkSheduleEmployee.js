import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkSheduleEmployeeModal from './WorkSheduleEmployeeModal';
import Layout from './Layout';

export default function WorkScheduleEmployee() {
  const [workSchedules, setWorkSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [workScheduleEmployees, setWorkScheduleEmployees] = useState([]);
  const [allWorkSchedules, setAllWorkSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedWorkSchedule, setSelectedWorkSchedule] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/employees');
      const data = await response.json();
      setEmployees(data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
    }
  };

  const fetchWorkSchedules = async () => {
    try {
      const response = await fetch('http://localhost:8080/workSchedule');
      const data = await response.json();
      setAllWorkSchedules(data.data || []);
      setWorkSchedules(data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ca làm việc:', error);
    }
  };

  const fetchWorkScheduleEmployees = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/workScheduleEmployees'
      );
      const data = await response.json();
      setWorkScheduleEmployees(data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên theo ca:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchWorkSchedules();
    fetchWorkScheduleEmployees();
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const filteredWorkSchedules = allWorkSchedules.filter(
      (ws) => new Date(ws.ngayLam).toISOString().split('T')[0] === formattedDate
    );

    setWorkSchedules(filteredWorkSchedules);
  };

  const handleAddWorkScheduleEmployee = async () => {
    if (!selectedEmployee || !selectedWorkSchedule) {
      alert('Vui lòng chọn nhân viên và ca làm việc!');
      return;
    }

    const newWorkScheduleEmployee = {
      maNhanVien: selectedEmployee,
      maLichLamViec: selectedWorkSchedule,
    };

    try {
      const response = await fetch(
        'http://localhost:8080/workScheduleEmployees',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWorkScheduleEmployee),
        }
      );

      if (!response.ok) throw new Error('Lỗi khi thêm ca làm việc');
      await fetchWorkScheduleEmployees();
      setSelectedEmployee('');
      setSelectedWorkSchedule('');
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteWorkScheduleEmployee = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ca làm việc này không?')) {
      try {
        await fetch(`http://localhost:8080/workScheduleEmployees/${id}`, {
          method: 'DELETE',
        });
        await fetchWorkScheduleEmployees();
      } catch (error) {
        console.error('Lỗi khi xóa ca làm việc:', error);
      }
    }
  };

  const getUniqueDates = () => {
    const uniqueDates = new Set();
    allWorkSchedules.forEach((ws) => {
      if (ws.ngayLam) {
        uniqueDates.add(new Date(ws.ngayLam).toISOString().split('T')[0]);
      }
    });
    return Array.from(uniqueDates);
  };

  return (
    <Layout>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-5xl font-bold text-blue-700 mb-10 text-center'>
          Quản lý ca làm việc
        </h1>

        <div className='flex justify-end mb-6'>
          <button
            className='bg-blue-600 hover:bg-blue-700 text-white text-2xl font-semibold px-8 py-4 rounded-xl shadow-lg transition-all'
            onClick={() => setShowModal(true)}
          >
            + Thêm ca làm việc
          </button>
        </div>

        {showModal && (
          <WorkSheduleEmployeeModal
            employees={employees}
            workSchedules={workSchedules}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            selectedWorkSchedule={selectedWorkSchedule}
            setSelectedWorkSchedule={setSelectedWorkSchedule}
            selectedDate={selectedDate}
            handleDateChange={handleDateChange}
            getUniqueDates={getUniqueDates}
            handleAddWorkScheduleEmployee={handleAddWorkScheduleEmployee}
            closeModal={() => setShowModal(false)}
          />
        )}

        <div className='overflow-x-auto bg-white rounded-xl shadow-md border border-blue-200'>
          <h2 className='text-3xl text-blue-600 font-bold p-6'>
            Danh sách ca làm việc
          </h2>
          {workScheduleEmployees.length > 0 ? (
            <table className='min-w-full text-2xl text-left text-blue-900'>
              <thead className='bg-blue-100 border-b-2 border-blue-300'>
                <tr>
                  <th className='px-6 py-4'>Tên nhân viên</th>
                  <th className='px-6 py-4'>Bộ phận</th>
                  <th className='px-6 py-4'>Ngày làm việc</th>
                  <th className='px-6 py-4'>Giờ bắt đầu</th>
                  <th className='px-6 py-4'>Giờ kết thúc</th>
                  <th className='px-6 py-4'>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {workScheduleEmployees.map((wse) => (
                  <tr key={wse._id} className='hover:bg-blue-50'>
                    <td className='px-6 py-4'>{wse.maNhanVien?.tenDangNhap}</td>
                    <td className='px-6 py-4'>
                      {wse.maLichLamViec?.loaiCaTruc}
                    </td>
                    <td className='px-6 py-4'>
                      {new Date(wse.maLichLamViec?.ngayLam).toLocaleDateString(
                        'vi-VN'
                      )}
                    </td>
                    <td className='px-6 py-4'>
                      {new Date(
                        wse.maLichLamViec?.gioBatDau
                      ).toLocaleTimeString()}
                    </td>
                    <td className='px-6 py-4'>
                      {new Date(
                        wse.maLichLamViec?.gioKetThuc
                      ).toLocaleTimeString()}
                    </td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() =>
                          handleDeleteWorkScheduleEmployee(wse._id)
                        }
                        className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg'
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className='text-center text-2xl py-10 text-gray-500'>
              Không có dữ liệu.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
