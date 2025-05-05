import { useEffect, useState } from 'react';
import EmployeeModal from './EmployeeModal';
import Layout from './Layout';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [tenDangNhap, setTenDangNhap] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [email, setEmail] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [diaChi, setDiaChi] = useState('');
  const [role, setRole] = useState(0);
  const [editingId, setEditingId] = useState(null);

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
      await fetchEmployees();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleEditEmployee = (employee) => {
    setEditingId(employee._id);
    setTenDangNhap(employee.tenDangNhap);
    setMatKhau('');
    setEmail(employee.email);
    setSoDienThoai(employee.soDienThoai);
    setNgaySinh(employee.ngaySinh?.split('T')[0]);
    setDiaChi(employee.diaChi);
    setRole(employee.role);
    setShowModal(true);
  };

  return (
    <Layout>
      <div className='p-8 max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold text-blue-700 mb-6 text-center'>
          Quản lý nhân viên
        </h1>

        <div className='flex justify-end mb-4'>
          <button
            onClick={() => setShowModal(true)}
            className='bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-2 rounded-lg shadow transition'
          >
            ➕ Thêm mới
          </button>
        </div>

        {showModal && (
          <EmployeeModal
            tenDangNhap={tenDangNhap}
            setTenDangNhap={setTenDangNhap}
            matKhau={matKhau}
            setMatKhau={setMatKhau}
            email={email}
            setEmail={setEmail}
            soDienThoai={soDienThoai}
            setSoDienThoai={setSoDienThoai}
            ngaySinh={ngaySinh}
            setNgaySinh={setNgaySinh}
            diaChi={diaChi}
            setDiaChi={setDiaChi}
            role={role}
            setRole={setRole}
            handleSaveEmployee={handleSaveEmployee}
            resetForm={() => {
              resetForm();
              setShowModal(false);
            }}
            editingId={editingId}
          />
        )}

        <div className='bg-white rounded-xl shadow-lg p-6'>
          <h2 className='text-2xl font-semibold text-blue-600 mb-4'>
            Danh sách nhân viên
          </h2>
          {loading ? (
            <p className='text-lg text-gray-500'>Đang tải...</p>
          ) : (
            <div className='overflow-auto max-h-[500px]'>
              <table className='min-w-full border border-gray-200 text-lg'>
                <thead className='bg-blue-100 text-blue-800'>
                  <tr>
                    <th className='p-3 text-left'>Tên đăng nhập</th>
                    <th className='p-3 text-left'>Email</th>
                    <th className='p-3 text-left'>SĐT</th>
                    <th className='p-3 text-left'>Ngày sinh</th>
                    <th className='p-3 text-left'>Địa chỉ</th>
                    <th className='p-3 text-left'>Vai trò</th>
                    <th className='p-3 text-left'>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <tr
                        key={employee._id}
                        className='border-b hover:bg-blue-50 transition'
                      >
                        <td className='p-3'>{employee.tenDangNhap}</td>
                        <td className='p-3'>{employee.email}</td>
                        <td className='p-3'>{employee.soDienThoai}</td>
                        <td className='p-3'>
                          {employee.ngaySinh?.split('T')[0]}
                        </td>
                        <td className='p-3'>{employee.diaChi}</td>
                        <td className='p-3'>
                          {employee.role === 1 ? 'Admin' : 'Người dùng'}
                        </td>
                        <td className='p-3 space-x-2 flex'>
                          <button
                            onClick={() => handleEditEmployee(employee)}
                            className='px-4 py-1 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white transition'
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee._id)}
                            className='px-4 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white transition'
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='7' className='p-4 text-center text-gray-500'>
                        Không có nhân viên.
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
