import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeById } from '../redux/slices/employeeSlice';
import Layout from '../components/Layout';
import Card from '../components/Card';
import {
  FaFilm,
  FaTicketAlt,
  FaUsers,
  FaTheaterMasks,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { employee, loading } = useSelector((state) => state.employees);
  const navigate = useNavigate();
  
  // useEffect(() => {
  //   if (!loading && (!auth || !auth._id || (employee && employee.role !== 1))) {
  //     navigate('/login');
  //   }
  // }, [auth, employee, loading, navigate]);

  useEffect(() => {
    const employeeId = auth?._id;
    if (employeeId) {
      dispatch(fetchEmployeeById(employeeId));
    }
  }, [dispatch]);


  return (
    <Layout>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Tổng số phim"
          value="120"
          percentage="+10% Tháng trước"
          icon={FaFilm}
          bgColor="bg-blue-500"
        />
        <Card
          title="Tổng số vé bán"
          value="5,432"
          percentage="+20% Tháng trước"
          icon={FaTicketAlt}
          bgColor="bg-green-500"
        />
        <Card
          title="Tổng số nhân viên"
          value="45"
          percentage="+5% Tháng trước"
          icon={FaUsers}
          bgColor="bg-yellow-500"
        />
        <Card
          title="Tổng số phòng chiếu"
          value="10"
          percentage="Không thay đổi"
          icon={FaTheaterMasks}
          bgColor="bg-purple-500"
        />
        <Card
          title="Lịch chiếu hôm nay"
          value="25"
          percentage="+15% So với hôm qua"
          icon={FaCalendarAlt}
          bgColor="bg-red-500"
        />
      </div>
    </Layout>
  );
}