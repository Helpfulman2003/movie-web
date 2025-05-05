import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TicketList from '../components/TicketList';
import TicketModal from '../components/TicketModal';
import {
  fetchTickets,
  addNewTicket,
  removeTicket,
  collectTicket,
} from '../redux/slices/ticketSlice';
import Header from '../components/Header';
import { fetchEmployeeById } from '../redux/slices/employeeSlice';
import { useNavigate } from 'react-router-dom';

function TicketPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, status, error } = useSelector((state) => state.tickets);
  const { auth } = useSelector((state) => state.auth);
  const { employee, loading } = useSelector((state) => state.employees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Lấy danh sách vé khi component được render
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTickets());
    }
  }, [dispatch, status]);

  useEffect(() => {
    const employeeId = auth?._id;
    if (employeeId) {
      dispatch(fetchEmployeeById(employeeId));
    }
  }, [dispatch, auth]);

  // useEffect(() => {
  //   if (!loading && (!auth || !auth._id || (employee && employee.role !== 0))) {
  //     navigate('/login');
  //   }
  // }, [auth, employee, loading, navigate]);

  // Hàm thêm vé mới
  const addTicket = (ticket) => {
    dispatch(addNewTicket({ ...ticket, maNhanVien: employee._id }));
    setIsModalOpen(false); // Đóng modal sau khi thêm
    window.location.reload();
  };

  // Hàm xóa vé
  const deleteTicket = (id) => {
    dispatch(removeTicket(id));
    window.location.reload();
  };

  const handleCollectTicket = (id) => {
    dispatch(collectTicket(id));
    window.location.reload(); // Gọi action thu vé
  };

  // Hàm tìm kiếm vé
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm lọc vé theo ngày
  const handleFilterDate = (e) => {
    console.log(e.target.value);

    setFilterDate(e.target.value);
  };

  // Lọc vé dựa trên tìm kiếm và ngày
  const filteredTickets = tickets?.filter((ticket) => {
    const matchesSearch = searchTerm
      ? ticket.maSuatChieu?.maPhim?.tenPhim
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true; // Nếu không có từ khóa tìm kiếm, trả về true
    const matchesDate = filterDate
      ? ticket.maSuatChieu?.gioBatDau &&
        new Date(ticket.maSuatChieu?.gioBatDau).toISOString().split('T')[0] ===
          filterDate // Chuyển showTime sang định dạng YYYY-MM-DD
      : true; // Nếu không có ngày lọc, trả về true

    return matchesSearch && matchesDate; // Chỉ trả về vé khớp cả tìm kiếm và ngày
  });

  return (
    <>
      <div className='min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-6'>
      <Header />
        {/* Thanh tìm kiếm và lọc */}
        <div className='flex flex-col md:flex-row items-center justify-between mb-6 gap-4'>
          <input
            type='text'
            placeholder='🔍 Tìm kiếm theo tên phim...'
            value={searchTerm}
            onChange={handleSearch}
            className='w-full md:w-1/3 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-500 focus:border-blue-500'
          />
          <input
            type='date'
            value={filterDate}
            onChange={handleFilterDate}
            className='w-full md:w-1/3 border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        {/* Danh sách vé */}
        <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
          {status === 'loading' && <p>Đang tải danh sách vé...</p>}
          {status === 'failed' && <p>Lỗi: {error}</p>}
          {status === 'succeeded' && (
            <TicketList
              tickets={filteredTickets}
              deleteTicket={deleteTicket}
              collectTicket={handleCollectTicket}
            />
          )}
        </div>
        {/* Nút thêm vé */}
        <div className='flex justify-center'>
          <button
            className='bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-all duration-300'
            onClick={() => setIsModalOpen(true)}
          >
            Thêm Vé
          </button>
        </div>

        {/* Modal thêm vé */}
        {isModalOpen && (
          <TicketModal
            addTicket={addTicket}
            closeModal={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
}

export default TicketPage;
