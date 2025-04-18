import axios from 'axios';

const API_URL = 'http://localhost:8080/movies';
// Lấy danh sách phim
export const fetchMovies = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Tạo phim mới
export const createMovie = async (movieData) => {
  const response = await axios.post(API_URL, movieData);
  return response.data;
};

// Cập nhật phim
export const updateMovie = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

// Xóa phim
export const deleteMovie = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
