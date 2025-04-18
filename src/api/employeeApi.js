import axios from "axios";

const API_URL = "http://localhost:8080/employees"; // Địa chỉ API của bạn

// Lấy danh sách nhân viên
export const getEmployees = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Lấy thông tin chi tiết của một nhân viên
export const getEmployeeById = async (employeeId) => {
  const response = await axios.get(`${API_URL}/${employeeId}`);
  return response.data;
};

// Cập nhật thông tin nhân viên
export const updateEmployeeApi = async (employeeId, updatedData) => {
  const response = await axios.put(`${API_URL}/${employeeId}`, updatedData);
  return response.data;
};

// Xóa nhân viên
export const deleteEmployee = async (employeeId) => {
  const response = await axios.delete(`${API_URL}/${employeeId}`);
  return response.data;
};

// Thêm nhân viên mới
export const addEmployee = async (newEmployeeData) => {
  const response = await axios.post(`${API_URL}`, newEmployeeData);
  return response.data;
};