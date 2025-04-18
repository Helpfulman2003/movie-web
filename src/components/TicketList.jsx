import React from 'react';

function TicketList({ tickets, deleteTicket, collectTicket }) {
  return (
    <div className='mb-6'>
      <h2 className='text-2xl font-bold mb-4'>Danh sách vé</h2>
      {tickets.length === 0 ? (
        <p className='text-gray-500'>Chưa có vé nào.</p>
      ) : (
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-200'>
              <th className='border p-2'>Tên phim</th>
              <th className='border p-2'>Phòng</th>
              <th className='border p-2'>Suất chiếu</th>
              <th className='border p-2'>Ghế</th>
              <th className='border p-2'>Giá vé</th>
              <th className='border p-2'>Trạng thái</th>
              <th className='border p-2'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id} className='hover:bg-gray-50'>
                {/* Tên phim */}
                <td className='border p-2'>
                  {ticket.maSuatChieu?.maPhim?.tenPhim || 'Không xác định'}
                </td>

                {/* Phòng */}
                <td className='border p-2'>
                  {ticket.maSuatChieu?.maPhong?.tenPhong || 'Không xác định'}
                </td>

                {/* Suất chiếu */}
                <td className='border p-2'>
                  {ticket.maSuatChieu?.gioBatDau
                    ? new Date(ticket.maSuatChieu.gioBatDau).toLocaleString(
                        'vi-VN',
                        {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )
                    : 'Không xác định'}
                </td>

                {/* Ghế */}
                <td className='border p-2'>{ticket.ghe || 'Không xác định'}</td>

                {/* Giá vé */}
                <td className='border p-2'>
                  {ticket.gia ? `${ticket.gia} VND` : 'Chưa cập nhật'}
                </td>

                {/* Trạng thái */}
                <td className='border p-2'>
                  {ticket.trangThai === 'Đã sử dụng' ? (
                    <span className='text-green-500'>Đã sử dụng</span>
                  ) : ticket.trangThai === 'Hủy' ? (
                    <span className='text-red-500'>Hủy</span>
                  ) : (
                    <span className='text-yellow-500'>Chưa sử dụng</span>
                  )}
                </td>

                {/* Hành động */}
                <td className='border p-2 flex space-x-2'>
                  {ticket.trangThai !== 'Đã sử dụng' &&
                    ticket.trangThai !== 'Hủy' && (
                      <button
                        onClick={() => collectTicket(ticket._id)}
                        className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'
                      >
                        Thu vé
                      </button>
                    )}
                  <button
                    onClick={() => deleteTicket(ticket._id)}
                    className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TicketList;
