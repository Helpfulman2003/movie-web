import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [newRoom, setNewRoom] = useState({
        tenPhong: '',
        sucChua: '',
        loaiPhong: '',
        trangThaiHoatDong: true
    });

    const validateRoom = () => {
        if (!newRoom.tenPhong) {
            setMessage('Vui lòng nhập tên phòng!');
            return false;
        }
        if (!newRoom.sucChua) {
            setMessage('Vui lòng nhập sức chứa!');
            return false;
        }
        if (!newRoom.loaiPhong) {
            setMessage('Vui lòng chọn loại phòng!');
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRoom(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateRoom()) return;

        try {
            const response = await fetch('http://localhost:8080/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRoom)
            });

            if (!response.ok) {
                throw new Error('Không thể thêm phòng');
            }

            setMessage('Thêm phòng thành công!');
            setNewRoom({
                tenPhong: '',
                sucChua: '',
                loaiPhong: '',
                trangThaiHoatDong: true
            });
            navigate('/rooms');
        } catch (error) {
            console.error('Error adding room:', error);
            setMessage('Có lỗi xảy ra khi thêm phòng');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {message && (
                <div className="fixed top-4 right-4 p-4 rounded-lg bg-green-100 text-green-800">
                    {message}
                </div>
            )}

            <h1 className="text-4xl font-bold text-gray-800 mb-8">Thêm Phòng Chiếu</h1>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Tên phòng
                        </label>
                        <input
                            type="text"
                            name="tenPhong"
                            value={newRoom.tenPhong}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Sức chứa
                        </label>
                        <input
                            type="number"
                            name="sucChua"
                            value={newRoom.sucChua}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Loại phòng
                        </label>
                        <select
                            name="loaiPhong"
                            value={newRoom.loaiPhong}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Chọn loại phòng</option>
                            <option value="Phòng thường">Phòng thường</option>
                            <option value="Phòng VIP">Phòng VIP</option>
                            <option value="Phòng 3D">Phòng 3D</option>
                            <option value="Phòng 4D">Phòng 4D</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-4">
                        <label className="block text-lg font-medium text-gray-700">
                            Trạng thái hoạt động
                        </label>
                        <input
                            type="checkbox"
                            name="trangThaiHoatDong"
                            checked={newRoom.trangThaiHoatDong}
                            onChange={handleChange}
                            className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Thêm phòng
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/rooms')}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Quay lại
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRoom;