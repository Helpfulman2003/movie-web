import { useEffect, useState } from 'react';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // State để thêm/cập nhật nhân viên
  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [role, setRole] = useState(0); // 0: Người dùng thông thường, 1: Admin
  const [editingId, setEditingId] = useState(null); // Lưu ID khi cập nhật

  // Fetch danh sách nhân viên
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/employees');
      const data = await response.json();
      setEmployees(data.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Thêm hoặc cập nhật nhân viên
  const handleSaveEmployee = async () => {
    if (
      !tenDangNhap ||
      !matKhau ||
      !email ||
      !soDienThoai ||
      !ngaySinh ||
      !diaChi
    ) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newEmployee = {
      tenDangNhap,
      matKhau,
      email,
      soDienThoai,
      ngaySinh,
      diaChi,
      role,
    };
    try {
      let response;
      if (editingId) {
        response = await fetch(`http://localhost:8080/employees/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee),
        });
      } else {
        response = await fetch('http://localhost:8080/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee),
        });
      }

      if (!response.ok) throw new Error('Lỗi khi lưu nhân viên');
      await fetchEmployees(); // Cập nhật danh sách
      resetForm(); // Reset form sau khi lưu
    } catch (error) {
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setTenDangNhap('');
    setMatKhau('');
    setEmail('');
    setSoDienThoai('');
    setNgaySinh('');
    setDiaChi('');
    setRole(0);
    setEditingId(null);
  };

  // Xóa nhân viên
  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
      try {
        await fetch(`http://localhost:8080/employees/${id}`, {
          method: 'DELETE',
        });
        await fetchEmployees();
      } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
      }
    }
  };

  // Chỉnh sửa nhân viên
  const handleEditEmployee = (employee) => {
    setEditingId(employee._id);
    setTenDangNhap(employee.tenDangNhap);
    setMatKhau(''); // Không hiển thị mật khẩu cũ
    setEmail(employee.email);
    setSoDienThoai(employee.soDienThoai);
    setNgaySinh(employee.ngaySinh?.split('T')[0]); // Chuyển ngày về định dạng YYYY-MM-DD
    setDiaChi(employee.diaChi);
    setRole(employee.role);
  };

  return (
    <div className='container'>
      <h1>Quản lý nhân viên</h1>

      {/* Form thêm/cập nhật nhân viên */}
      <div className='add-form'>
        <h2>{editingId ? 'Cập nhật' : 'Thêm'} nhân viên</h2>
        <input
          type='text'
          placeholder='Tên đăng nhập'
          value={tenDangNhap}
          onChange={(e) => setTenDangNhap(e.target.value)}
        />
        <input
          type='password'
          placeholder='Mật khẩu'
          value={matKhau}
          onChange={(e) => setMatKhau(e.target.value)}
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='text'
          placeholder='Số điện thoại'
          value={soDienThoai}
          onChange={(e) => setSoDienThoai(e.target.value)}
        />
        <input
          type='date'
          placeholder='Ngày sinh'
          value={ngaySinh}
          onChange={(e) => setNgaySinh(e.target.value)}
        />
        <input
          type='text'
          placeholder='Địa chỉ'
          value={diaChi}
          onChange={(e) => setDiaChi(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(Number(e.target.value))}>
          <option value={0}>Người dùng</option>
          <option value={1}>Admin</option>
        </select>
        <button onClick={handleSaveEmployee}>
          {editingId ? 'Cập nhật' : 'Thêm'}
        </button>
        {editingId && <button onClick={resetForm}>Hủy</button>}
      </div>

      {/* Danh sách nhân viên */}
      <div className='work-schedule-container'>
        <h2>Danh sách nhân viên</h2>
        {loading ? (
          <p className='loading-text'>Đang tải...</p>
        ) : (
          <table className='work-schedule-table'>
            <thead>
              <tr>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ngày sinh</th>
                <th>Địa chỉ</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.tenDangNhap}</td>
                    <td>{employee.email}</td>
                    <td>{employee.soDienThoai}</td>
                    <td>{employee.ngaySinh?.split('T')[0]}</td>
                    <td>{employee.diaChi}</td>
                    <td>{employee.role === 1 ? 'Admin' : 'Người dùng'}</td>
                    <td>
                      <button
                        className='update-btn'
                        onClick={() => handleEditEmployee(employee)}
                      >
                        Cập nhật
                      </button>
                      <button
                        className='delete-btn'
                        onClick={() => handleDeleteEmployee(employee._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='7' className='no-data'>
                    Không có nhân viên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
