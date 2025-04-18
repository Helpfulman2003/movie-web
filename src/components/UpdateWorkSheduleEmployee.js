import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateWorkSchedule() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedShift, setSelectedShift] = useState("");
    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("http://localhost:8080/employees");
                const data = await res.json();
                setEmployees(data.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
            }
        };

        const fetchShifts = async () => {
            try {
                const res = await fetch("http://localhost:8080/shifts");
                const data = await res.json();
                setShifts(data.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách ca trực:", error);
            }
        };

        fetchEmployees();
        fetchShifts();
    }, []);

    const handleUpdate = async () => {
        if (!selectedEmployee || !selectedDate || !selectedShift) {
            alert("Vui lòng chọn đầy đủ thông tin!");
            return;
        }

        const updatedData = {
            maNhanVien: selectedEmployee,
            ngayLam: selectedDate,
            maCaTruc: selectedShift,
        };

        try {
            const response = await fetch(`http://localhost:8080/workSchedule/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error("Cập nhật thất bại!");

            alert("Cập nhật thành công!");
            navigate("/workScheduleEmployee");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Cập nhật lịch làm việc</h2>

            <div className="mb-4">
                <label className="block font-medium mb-1">Chọn nhân viên:</label>
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Chọn nhân viên</option>
                    {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.tenDangNhap}</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-1">Chọn ngày làm:</label>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div className="mb-4">
                <label className="block font-medium mb-1">Chọn ca trực:</label>
                <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                    <option value="">Chọn ca trực</option>
                    {shifts.map(shift => (
                        <option key={shift._id} value={shift._id}>{shift.loaiCaTruc}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-between">
                <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Lưu</button>
                <button onClick={() => navigate("/workSchedule")} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Hủy</button>
            </div>
        </div>
    );
}