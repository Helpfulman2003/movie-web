import React, { useState, useEffect } from 'react';
import { Calendar, Building2 } from 'lucide-react';

export default function WorkScheduleStats() {
  const [workSchedules, setWorkSchedules] = useState([]); // Danh sách ca làm việc đã được phân công
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên
  const [selectedEmployee, setSelectedEmployee] = useState(''); // Nhân viên đã chọn
  const [selectedDate, setSelectedDate] = useState(''); // Ngày đã chọn để lọc
  const [selectedMonth, setSelectedMonth] = useState(''); // Tháng đã chọn để lọc
  const [selectedYear, setSelectedYear] = useState(''); // Năm đã chọn để lọc
  const [filteredSchedules, setFilteredSchedules] = useState([]); // Lịch làm việc sau khi lọc

  // Hàm kiểm tra năm nhuận
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // Hàm lấy số ngày trong tháng
  const getDaysInMonth = (month, year) => {
    const daysInMonth = {
      1: 31, // Tháng 1
      2: isLeapYear(parseInt(year)) ? 29 : 28, // Tháng 2
      3: 31, // Tháng 3
      4: 30, // Tháng 4
      5: 31, // Tháng 5
      6: 30, // Tháng 6
      7: 31, // Tháng 7
      8: 31, // Tháng 8
      9: 30, // Tháng 9
      10: 31, // Tháng 10
      11: 30, // Tháng 11
      12: 31, // Tháng 12
    };
    return month && year ? daysInMonth[parseInt(month)] : 31;
  };

  // Kiểm tra ngày hợp lệ khi cả tháng và năm được chọn
  const isValidDate = (day, month, year) => {
    if (!month || !year) return true; // Nếu chưa chọn tháng hoặc năm thì cho phép chọn ngày tự do
    const daysInMonth = getDaysInMonth(month, year); // gọi hàm tính số ngày tối đa trong 1 tháng
    return day <= daysInMonth;
  };

  // Reset ngày nếu không hợp lệ khi thay đổi tháng hoặc năm
  useEffect(() => {
    if (selectedMonth && selectedYear && selectedDate) {
      if (!isValidDate(parseInt(selectedDate), selectedMonth, selectedYear)) {
        setSelectedDate('');
      }
    }
  }, [selectedMonth, selectedYear]);

  // Xử lý khi thay đổi ngày
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    if (
      !newDate ||
      isValidDate(parseInt(newDate), selectedMonth, selectedYear)
    ) {
      setSelectedDate(newDate);
    }
  };

  // Fetch danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/employees');
      const data = await response.json();
      setEmployees(data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
    }
  };

  // Fetch danh sách ca làm việc đã được phân công
  const fetchWorkSchedules = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/workScheduleEmployees'
      );
      const data = await response.json();

      // Lọc ra các ca làm việc đã được phân công (có nhân viên)
      const assignedSchedules = data.data?.filter((ws) => ws.maNhanVien) || [];

      setWorkSchedules(assignedSchedules);
      setFilteredSchedules(assignedSchedules); // Hiển thị tất cả ca đã được phân công ban đầu
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ca làm việc:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchWorkSchedules();
  }, []);

  // Lọc danh sách ca làm việc theo nhân viên, ngày, tháng, năm
  const filterWorkSchedules = () => {
    let filtered = workSchedules;

    // Lọc theo nhân viên
    if (selectedEmployee) {
      filtered = filtered.filter(
        (ws) => ws.maNhanVien._id === selectedEmployee
      );
    }

    // Lọc theo ngày
    if (selectedDate) {
      filtered = filtered.filter((ws) => {
        const wsDate = new Date(ws.maLichLamViec?.ngayLam);
        return wsDate.getDate() === parseInt(selectedDate);
      });
    }

    // Lọc theo tháng nếu được chọn
    if (selectedMonth) {
      filtered = filtered.filter((ws) => {
        const wsDate = new Date(ws.maLichLamViec?.ngayLam);
        return wsDate.getMonth() + 1 === parseInt(selectedMonth);
      });
    }

    // Lọc theo năm nếu được chọn
    if (selectedYear) {
      filtered = filtered.filter((ws) => {
        const wsDate = new Date(ws.maLichLamViec?.ngayLam);
        return wsDate.getFullYear() === parseInt(selectedYear);
      });
    }

    setFilteredSchedules(filtered);
  };

  // Xử lý sự kiện khi nhấn nút Tìm kiếm
  const handleSearch = () => {
    filterWorkSchedules();
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-5xl font-extrabold mb-6 text-center bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-4 hover:scale-105 transition-transform duration-300'>
        <Calendar className='w-10 h-10 text-sky-400' />
        Thống kê lịch làm việc của nhân viên
        <Building2 className='w-10 h-10 text-sky-400' />
      </h1>

      <div className='bg-white rounded-xl shadow-lg p-8 mb-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
          {/* Chọn nhân viên */}
          <div>
            <label className='block text-2xl font-medium text-gray-500 mb-2'>
              Nhân viên
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
            >
              <option value='' className='text-gray-500'>
                Chọn nhân viên
              </option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.tenDangNhap}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn ngày */}
          <div>
            <label className='block text-2xl font-medium text-gray-500 mb-2'>
              Ngày
            </label>
            <select
              value={selectedDate}
              onChange={handleDateChange}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
            >
              <option value=''>Chọn ngày</option>
              {[
                ...Array(
                  selectedMonth && selectedYear
                    ? getDaysInMonth(selectedMonth, selectedYear)
                    : 31
                ),
              ].map((_, index) => (
                <option
                  key={index + 1}
                  value={index + 1}
                  disabled={
                    selectedMonth &&
                    selectedYear &&
                    !isValidDate(index + 1, selectedMonth, selectedYear)
                  }
                >
                  Ngày {index + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn tháng */}
          <div>
            <label className='block text-2xl font-medium text-gray-500 mb-2'>
              Tháng
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
            >
              <option value='' className='text-gray-500'>
                Chọn tháng
              </option>
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  Tháng {index + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn năm */}
          <div>
            <label className='block text-2xl font-medium text-gray-500 mb-2'>
              Năm
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
            >
              <option value='' className='text-gray-500'>
                Chọn năm
              </option>
              {[...Array(11)].map((_, index) => (
                <option key={index} value={2020 + index}>
                  {2020 + index}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nút Tìm kiếm */}
        <button
          onClick={handleSearch}
          className='w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200'
        >
          <span className='font-medium'>Tìm kiếm</span>
        </button>
      </div>
      {/* Danh sách thống kê */}

      <div className='bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8'>
          Danh sách ca làm việc
        </h2>
        {filteredSchedules.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-8 py-6 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                    Tên nhân viên
                  </th>
                  <th className='px-8 py-6 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                    Ca làm việc
                  </th>
                  <th className='px-8 py-6 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                    Ngày làm việc
                  </th>
                  <th className='px-8 py-6 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                    Giờ bắt đầu
                  </th>
                  <th className='px-8 py-6 text-left text-xl font-medium text-gray-800 uppercase tracking-wider'>
                    Giờ kết thúc
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredSchedules.map((wse) => (
                  <tr key={wse._id} className='hover:bg-gray-50'>
                    <td className='px-8 py-6 whitespace-nowrap text-xl text-gray-900'>
                      {wse.maNhanVien?.tenDangNhap}
                    </td>
                    <td className='px-8 py-6 whitespace-nowrap text-xl text-gray-900'>
                      {wse.maLichLamViec?.loaiCaTruc}
                    </td>
                    <td className='px-8 py-6 whitespace-nowrap text-xl text-gray-900'>
                      {new Date(wse.maLichLamViec?.ngayLam).toLocaleDateString(
                        'vi-VN'
                      )}
                    </td>
                    <td className='px-8 py-6 whitespace-nowrap text-xl text-gray-900'>
                      {new Date(
                        wse.maLichLamViec?.gioBatDau
                      ).toLocaleTimeString()}
                    </td>
                    <td className='px-8 py-6 whitespace-nowrap text-xl text-gray-900'>
                      {new Date(
                        wse.maLichLamViec?.gioKetThuc
                      ).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='text-center text-gray-800 text-2xl py-6'>
            Không có dữ liệu phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
