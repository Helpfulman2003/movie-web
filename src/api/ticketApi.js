import axios from 'axios';

// Định nghĩa URL cơ sở của API từ biến môi trường
const API_URL = 'http://localhost:8080/tickets';

// Lấy danh sách vé
export const getTickets = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Trả về danh sách vé
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách vé');
  }
};

// Thêm vé mới
export const addTicket = async (ticket) => {
  try {
    const response = await axios.post(API_URL, ticket);
    return response.data; // Trả về vé vừa thêm
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi thêm vé');
  }
};

// Xóa vé
export const deleteTicket = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id; // Trả về ID để xử lý trong Redux
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi xóa vé');
  }
};

// Thu vé
export const collectTicketApi = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/collect`);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi thu vé');
  }
};