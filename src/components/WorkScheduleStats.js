import React, { useState, useEffect } from 'react';
import { Calendar, Building2 } from 'lucide-react';
import Layout from './Layout';

export default function WorkScheduleStats() {
  // State (Model)
  const [workSchedules, setWorkSchedules] = useState([]); // Danh sách ca làm việc đã được phân công
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên
  const [selectedEmployee, setSelectedEmployee] = useState(''); // Nhân viên đã chọn
  const [selectedDate, setSelectedDate] = useState(''); // Ngày đã chọn để lọc
  const [selectedMonth, setSelectedMonth] = useState(''); // Tháng đã chọn để lọc
  const [selectedYear, setSelectedYear] = useState(''); // Năm đã chọn để lọc
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredSchedules, setFilteredSchedules] = useState([]); // Lịch làm việc sau khi lọc
  const [workStatistics, setWorkStatistics] = useState({});
  // Hàm kiểm tra năm nhuận
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // Hàm lấy số ngày trong tháng
  const getDaysInMonth = (month, year) => {
    const daysInMonth = {
      1: 31,
      2: isLeapYear(parseInt(year)) ? 29 : 28, // Tháng 2
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };
    return month && year ? daysInMonth[parseInt(month)] : 31; // nếu không có tháng, năm thì trả về mặc định 31
  };

  // Kiểm tra ngày hợp lệ khi cả tháng và năm được chọn
  const isValidDate = (day, month, year) => {
    if (!month || !year) return true; // Nếu chưa chọn tháng hoặc năm thì cho phép chọn ngày tự do
    const daysInMonth = getDaysInMonth(month, year); // gọi hàm tính số ngày tối đa trong 1 tháng
    return day >= 1 && day <= daysInMonth;
  };

  // Reset ngày nếu không hợp lệ khi thay đổi tháng hoặc năm
  useEffect(() => {
    if (selectedMonth && selectedYear && selectedDate) {
      if (!isValidDate(parseInt(selectedDate), selectedMonth, selectedYear)) {
        //  ngày chọn không hợp lệ => setSelectedDate trả về rỗng
        setSelectedDate('');
      }
    }
  }, [selectedMonth, selectedYear, selectedDate]); // useEffect sẽ chạy lại khi 1 trong 3 dependency này thay đổi

  // Xử lý khi thay đổi ngày
  const handleDateChange = (e) => {
    const newDate = e.target.value; // gtri ngay mới vừa chọn or nhập từ sự kiện ee
    if (
      !newDate ||
      isValidDate(parseInt(newDate), selectedMonth, selectedYear) //  ngày mới Rỗng or là 1 ngày hợp lệ => cập nhật lại selectedDate bằng newDate
    ) {
      setSelectedDate(newDate);
    }
  };

  // Controller (Logic)
  // Fetch danh sách nhân viên
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/employees'); // gửi yêu cầu GET tới địa chỉ API, await đợi phản hồi dc tra về từ server, KQ là response object
      const data = await response.json(); // Lấy DL JSON từ response
      setEmployees(data.data || []); // Update danh sách nhân viên vào state ( neu kh có mảng chứa DS NV (data.data) thì dùng mảng rỗng tránh lỗi khi render DSDS)
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
      const assignedSchedules = data.data?.filter((ws) => ws.maNhanVien) || []; //  ? chỉ gọi .filter(...) khi data.data khác null/undefinedundefined
      // filter((ws) => ws.maNhanVien) : lọc ra những ptu maNhanVien có gtri(Dã phan công)

      //    || []: đảm bảo luôn trả về mảng, tránh undefined khi data.data null/undefined
      setWorkSchedules(assignedSchedules);
      setFilteredSchedules(assignedSchedules); // Hiển thị tất cả ca đã được phân công ban đầu
    } catch (error) {
      console.error('Lỗi khi lấy danh sách ca làm việc:', error);
    }
  };

  // khi mở trang thì sẽ gọi đến 2 pthuc dưới để lấy DS NV và DS Ca làm việc
  useEffect(() => {
    fetchEmployees();
    fetchWorkSchedules();
  }, []); // đảm bảo rằng API chỉ dc gọi1 lần khi mở trang

  // Calculate work statistics
  const calculateWorkStatistics = (schedules) => {
    const stats = {};

    schedules.forEach((schedule) => {
      const employeeId = schedule.maNhanVien?._id;
      if (!employeeId) return;

      if (!stats[employeeId]) {
        stats[employeeId] = {
          name: schedule.maNhanVien?.tenDangNhap,
          department: schedule.maLichLamViec?.loaiCaTruc,
          totalShifts: 0,
          totalHours: 0,
        };
      }

      stats[employeeId].totalShifts += 1;

      // Calculate work hours
      const startTime = new Date(schedule.maLichLamViec?.gioBatDau);
      const endTime = new Date(schedule.maLichLamViec?.gioKetThuc);
      const hours = (endTime - startTime) / (1000 * 60 * 60);
      stats[employeeId].totalHours += hours;
    });

    return stats;
  };

  // Update statistics when filtered schedules change
  useEffect(() => {
    const stats = calculateWorkStatistics(filteredSchedules);
    setWorkStatistics(stats);
  }, [filteredSchedules]);

  // Xử lý logic
  // Lọc danh sách ca làm việc theo nhân viên, ngày, tháng, năm
  const filterWorkSchedules = () => {
    let filtered = workSchedules; // gán tất cả lịch làm việc hiện có vào biến filtered để sau đó lọc dần theo điều kiệnkiện

    // Lọc theo nhân viên
    if (selectedEmployee) {
      filtered = filtered.filter(
        (ws) => ws.maNhanVien._id === selectedEmployee // ws: là lịch làm việc, so sánh id của NV trong lịch làm việc với ID của NV được chọnchọn
      ); // sau khi so sánh thì filtered sex hiển thị KQ lịch của NV có id trung với NV được chọn
    }

    // Lọc theo bộ phận
    if (selectedDepartment) {
      filtered = filtered.filter(
        (ws) => ws.maLichLamViec?.loaiCaTruc === selectedDepartment
      );
    }

    // Lọc theo ngày
    if (selectedDate) {
      filtered = filtered.filter((ws) => {
        const wsDate = new Date(ws.maLichLamViec?.ngayLam); // lấy ngày làm việc của từng lịch và chuyển sang kiểu Date
        return wsDate.getDate() === parseInt(selectedDate); // so sánh ngày trong lịch với ngày được chọn, giữ lại những lịch mà ngày(ngayLam) trùng với ngày được chọn
      });
    }

    // Lọc theo tháng nếu được chọn
    if (selectedMonth) {
      filtered = filtered.filter((ws) => {
        const wsDate = new Date(ws.maLichLamViec?.ngayLam);
        return wsDate.getMonth() + 1 === parseInt(selectedMonth); // getMonth() trả về gtri từ 0 đến 11
      });
    }

    // Lọc theo năm nếu được chọn
    if (selectedYear) {
      filtered = filtered.filter((ws) => {
        const wsDate = new Date(ws.maLichLamViec?.ngayLam);
        return wsDate.getFullYear() === parseInt(selectedYear);
      });
    }

    setFilteredSchedules(filtered); // update DS filtered sau khi đã được lọc
  };

  // Xử lý sự kiện khi nhấn nút Tìm kiếm
  const handleSearch = () => {
    filterWorkSchedules(); // khi nút TK được gọi thì bắt đầu lọc Ds theo các Đk ở trên
  };

  // View (UI)
  return (
    <Layout>
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
                {employees.map(
                  (
                    employee // duyệt qua mảng employees và hiển thi mỗi nhân viên dưới dạng option
                  ) => (
                    // key laf TT bắt buộc khi dùng .map() , key giúp nhận biết phần tử nào crud
                    <option key={employee._id} value={employee._id}>
                      {/* // tên hiển thị trong dropdown */}
                      {employee.tenDangNhap}
                    </option>
                  )
                )}
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
                    // Tạo mảng với số lượng phần tử là số ngày trong tháng
                    selectedMonth && selectedYear
                      ? getDaysInMonth(selectedMonth, selectedYear)
                      : 31
                  ),
                ].map((_, index) => (
                  <option
                    key={index + 1} // mỗi option phải có key khác nhau
                    value={index + 1} // gtri la sô ngày thực tế(1->31)
                    disabled={
                      // vô hiệu hóa các ngày kh hợp lệ
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
                {[...Array(12)].map(
                  (
                    _,
                    index // tạo mảng 12 phânf tử từ (0->11) , .map(..)... duyệt qua từ tháng và tạo option tương ứngứng
                  ) => (
                    <option key={index} value={index + 1}>
                      Tháng {index + 1}
                    </option>
                  )
                )}
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
                {[...Array(11)].map(
                  (
                    _,
                    index // tạo mảng 11 phânf tử tương ứng 2020->2030) , .map(..)... duyệt qua từ năm và tạo option tương ứng
                  ) => (
                    <option key={index} value={2020 + index}>
                      {2020 + index}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Add department filter */}
          <div>
            <label className='block text-2xl font-medium text-gray-500 mb-2'>
              Bộ phận
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none'
            >
              <option value=''>Tất cả bộ phận</option>
              {[
                ...new Set(
                  workSchedules.map((ws) => ws.maLichLamViec?.loaiCaTruc)
                ),
              ]
                .filter(Boolean)
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
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

        {/* Add statistics section */}
        <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
          <h2 className='text-3xl font-bold text-blue-900 mb-8'>
            Thống kê làm việc
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Object.values(workStatistics).map((stat) => (
              <div key={stat.name} className='bg-gray-50 rounded-lg p-6'>
                <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
                  {stat.name}
                </h3>
                <div className='space-y-3'>
                  <p className='text-gray-600'>
                    <span className='font-medium'>Số ca làm việc:</span>{' '}
                    {stat.totalShifts}
                  </p>
                  <p className='text-gray-600'>
                    <span className='font-medium'>Tổng giờ làm việc:</span>{' '}
                    {stat.totalHours.toFixed(1)} giờ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danh sách thống kê */}
        <div className='bg-white rounded-lg shadow-md p-8'>
          <h2 className='text-4xl font-bold text-blue-900 mb-8'>
            Danh sách ca làm việc
          </h2>

          {filteredSchedules.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-blue-100'>
                  <tr className='text-left text-xl font-semibold text-blue-900 uppercase tracking-wide'>
                    <th className='px-6 py-4'>Tên nhân viên</th>
                    <th className='px-6 py-4'>Bộ phận</th>
                    <th className='px-6 py-4'>Ngày làm việc</th>
                    <th className='px-6 py-4'>Giờ bắt đầu</th>
                    <th className='px-6 py-4'>Giờ kết thúc</th>
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
                        {new Date(
                          wse.maLichLamViec?.ngayLam
                        ).toLocaleDateString('vi-VN')}
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
    </Layout>
  );
}
