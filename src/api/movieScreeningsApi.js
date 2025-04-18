import axios from 'axios';

const API_URL ='http://localhost:8080/movieScreenings';

export const fetchScreenings = async (movieId) => {
  const response = movieId
    ? await axios.get(`${API_URL}?movieId=${movieId}`) // Lấy danh sách suất chiếu theo movieId
    : await axios.get(API_URL); // Lấy tất cả suất chiếu
  return response.data; // Trả về danh sách suất chiếu
};

// Tạo suất chiếu mới
export const createScreening = async (screeningData) => {
  const response = await axios.post(API_URL, screeningData);
  return response.data; // Trả về suất chiếu vừa tạo
};

// Cập nhật suất chiếu
export const updateScreening = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data; // Trả về suất chiếu đã cập nhật
};

// Xóa suất chiếu
export const deleteScreening = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data; // Trả về ID của suất chiếu đã xóa
};
