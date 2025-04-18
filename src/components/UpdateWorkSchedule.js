import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateWorkSchedule() {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate(); // Điều hướng sau khi cập nhật
    const [formData, setFormData] = useState({
        ngayLam: "",
        gioBatDau: "",
        gioKetThuc: "",
        loaiCaTruc: ""
    });

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await fetch(`http://localhost:8080/workSchedule/${id}`);
                const data = await response.json();
    
                setFormData({
                    ngayLam: data.data.ngayLam.split("T")[0], // YYYY-MM-DD
    
                    // Chuyển đổi giờ từ UTC về local và format HH:mm
                    gioBatDau: formatTimeToLocal(data.data.gioBatDau),
                    gioKetThuc: formatTimeToLocal(data.data.gioKetThuc),
    
                    loaiCaTruc: data.data.loaiCaTruc
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
    
        fetchSchedule();
    }, [id]);
    
    // Hàm chuyển đổi giờ UTC thành giờ local đúng định dạng HH:mm
    const formatTimeToLocal = (isoString) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, "0"); // Lấy giờ và thêm '0' nếu cần
        const minutes = date.getMinutes().toString().padStart(2, "0"); // Lấy phút và thêm '0' nếu cần
        return `${hours}:${minutes}`;
    };
    

    // Cập nhật dữ liệu form khi nhập
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gửi API cập nhật
    const handleUpdate = async () => {
        const { ngayLam, gioBatDau, gioKetThuc, loaiCaTruc } = formData;
    
        try {
            const response = await fetch(`http://localhost:8080/workSchedule/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ngayLam,   // Gửi nguyên ngày "YYYY-MM-DD"
                    gioBatDau, // Gửi giờ dưới dạng "HH:mm"
                    gioKetThuc,
                    loaiCaTruc
                }),
            });
    
            if (!response.ok) {
                throw new Error("Cập nhật thất bại!");
            }
    
            alert("Cập nhật thành công!");
            navigate("/workShedule");
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error.message);
        }
    };
    
    return (
        <div className="update-container">
            <h2>Cập nhật lịch làm việc</h2>

            <div className="form-group">
                <label>Ngày làm:</label>
                <input type="date" name="ngayLam" value={formData.ngayLam} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Giờ bắt đầu:</label>
                <input type="time" name="gioBatDau" value={formData.gioBatDau} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Giờ kết thúc:</label>
                <input type="time" name="gioKetThuc" value={formData.gioKetThuc} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Ca trực:</label>
                <input type="text" name="loaiCaTruc" value={formData.loaiCaTruc} onChange={handleChange} />
            </div>

            <div className="button-group">
                <button className="save-btn" onClick={handleUpdate}>Lưu</button>
                <button className="cancel-btn" onClick={() => navigate("/workShedule")}>Hủy</button>
            </div>
        </div>
    );
}
