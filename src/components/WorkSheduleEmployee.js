import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function WorkScheduleEmployee() {
    const [workSchedules, setWorkSchedules] = useState([]); // Danh sách ca làm việc
    const [employees, setEmployees] = useState([]); // Danh sách nhân viên
    const [workScheduleEmployees, setWorkScheduleEmployees] = useState([]); // Danh sách nhân viên theo ca
    const [allWorkSchedules, setAllWorkSchedules] = useState([]); // Danh sách ca làm việc gốc
    const navigate = useNavigate(); // Thêm dòng này
    // State để thêm ca làm việc
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedWorkSchedule, setSelectedWorkSchedule] = useState("");
    const [selectedDate, setSelectedDate] = useState(""); // Ngày đã chọn để lọc ca làm việc

    // Fetch danh sách nhân viên
    const fetchEmployees = async () => {
        try {
            const response = await fetch("http://localhost:8080/employees");
            const data = await response.json();
            setEmployees(data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên:", error);
        }
    };

    // Fetch danh sách ca làm việc
    const fetchWorkSchedules = async () => {
        try {
            const response = await fetch("http://localhost:8080/workSchedule");
            const data = await response.json();
            setAllWorkSchedules(data.data || []); // Lưu dữ liệu gốc
            setWorkSchedules(data.data || []); // Dữ liệu hiển thị
        } catch (error) {
            console.error("Lỗi khi lấy danh sách ca làm việc:", error);
        }
    };
    
    

    // Fetch danh sách nhân viên theo ca làm việc
    const fetchWorkScheduleEmployees = async () => {
        try {
            const response = await fetch("http://localhost:8080/workScheduleEmployees");
            const data = await response.json();
            setWorkScheduleEmployees(data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhân viên theo ca:", error);
        }
    };

    
    useEffect(() => {
        fetchEmployees();
        fetchWorkSchedules();
        fetchWorkScheduleEmployees();
    }, []);

    // Lọc ca làm việc theo ngày đã chọn
    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
    
        // Chuyển ngày về dạng "YYYY-MM-DD"
        const formattedDate = new Date(date).toISOString().split('T')[0];
    
        // Lọc từ danh sách gốc
        const filteredWorkSchedules = allWorkSchedules.filter(
            (ws) => new Date(ws.ngayLam).toISOString().split('T')[0] === formattedDate
        );
    
        setWorkSchedules(filteredWorkSchedules);
    };
    
    
    

    // Thêm ca làm việc
    const handleAddWorkScheduleEmployee = async () => {
        if (!selectedEmployee || !selectedWorkSchedule) {
            alert("Vui lòng chọn nhân viên và ca làm việc!");
            return;
        }

        const newWorkScheduleEmployee = {
            maNhanVien: selectedEmployee,
            maLichLamViec: selectedWorkSchedule
        };

        try {
            const response = await fetch("http://localhost:8080/workScheduleEmployees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newWorkScheduleEmployee)
            });

            if (!response.ok) throw new Error("Lỗi khi thêm ca làm việc");
            await fetchWorkScheduleEmployees(); // Cập nhật danh sách
            setSelectedEmployee("");
            setSelectedWorkSchedule("");
        } catch (error) {
            console.error(error);
        }
    };

    // Xóa ca làm việc
    const handleDeleteWorkScheduleEmployee = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa ca làm việc này không?")) {
            try {
                await fetch(`http://localhost:8080/workScheduleEmployees/${id}`, { method: "DELETE" });
                await fetchWorkScheduleEmployees();
            } catch (error) {
                console.error("Lỗi khi xóa ca làm việc:", error);
            }
        }
    };

    // Lọc ra các ngày duy nhất
    const getUniqueDates = () => {
        const uniqueDates = new Set();
        allWorkSchedules.forEach(ws => { // Lấy từ allWorkSchedules thay vì workSchedules
            if (ws.ngayLam) {
                uniqueDates.add(new Date(ws.ngayLam).toISOString().split('T')[0]); 
            }
        });
        return Array.from(uniqueDates);
    };
    
    

    return (
        <div className="container">
            <h1>Quản lý ca làm việc</h1>

            {/* Form thêm ca làm việc */}
            <div className="add-form">
                <h2>Thêm ca làm việc</h2>
                <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                    <option value="">Chọn nhân viên</option>
                    {employees.map(emp => (
                        <option key={emp._id} value={emp._id}>{emp.tenDangNhap}</option>
                    ))}
                </select>

                <select value={selectedDate} onChange={handleDateChange}>
                    <option value="">Chọn ngày làm việc</option>
                    {getUniqueDates().map((date, index) => (
                        <option key={index} value={date}>
                            {new Date(date).toLocaleDateString("vi-VN")}
                        </option>
                    ))}
                </select>


                <select value={selectedWorkSchedule} onChange={(e) => setSelectedWorkSchedule(e.target.value)}>
                    <option value="">Chọn ca làm việc</option>
                    {workSchedules.map(ws => (
                        <option key={ws._id} value={ws._id}>{ws.loaiCaTruc}</option>
                    ))}
                </select>


                <button onClick={handleAddWorkScheduleEmployee}>Thêm ca làm việc</button>
            </div>

            {/* Danh sách ca làm việc */}
            <div className="work-schedule-container">
                <h2>Danh sách ca làm việc</h2>
                {workScheduleEmployees.length > 0 ? (
                    <table className="work-schedule-table">
                        <thead>
                            <tr>
                                <th>Tên nhân viên</th>
                                <th>Ca làm việc</th>
                                <th>Ngày làm việc</th>
                                <th>Giờ bắt đầu</th>
                                <th>Giờ kết thúc</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workScheduleEmployees.map((wse) => (
                                <tr key={wse._id}>
                                    <td>{wse.maNhanVien?.tenDangNhap}</td>
                                    <td>{wse.maLichLamViec?.loaiCaTruc}</td>
                                    <td>{new Date(wse.maLichLamViec?.ngayLam).toLocaleDateString("vi-VN")}</td>
                                    <td>{new Date(wse.maLichLamViec?.gioBatDau).toLocaleTimeString()}</td>
                                    <td>{new Date(wse.maLichLamViec?.gioKetThuc).toLocaleTimeString()}</td>
                                    <td>
                                        {/* <button className="update-btn" onClick={() => navigate(`/update-work-schedule/${wse._id}`)}>Cập nhật</button> */}
                                        <button className="delete-btn" onClick={() => handleDeleteWorkScheduleEmployee(wse._id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-data">Không có dữ liệu.</p>
                )}
            </div>
        </div>
    );
}
// export default WorkScheduleEmployee;
