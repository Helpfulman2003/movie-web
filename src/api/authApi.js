import axios from "axios";

const API_URL = process.env.AUTH_API_URL || "http://localhost:8080/auth"; // Địa chỉ API của bạn

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const logoutApi = async (employeeId) => {
  const response = await axios.post(`${API_URL}/logout`, employeeId); 
  return response.data;
};
