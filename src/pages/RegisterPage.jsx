import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signUp } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      tenDangNhap: "",
      matKhau: "",
      email: "",
      soDienThoai: "",
    },
    validationSchema: Yup.object({
      tenDangNhap: Yup.string()
        .required("Tên đăng nhập là bắt buộc")
        .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
      matKhau: Yup.string()
        .required("Mật khẩu là bắt buộc")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/,
          "Mật khẩu phải từ 7-19 ký tự, chứa ít nhất một chữ cái, một số và một ký tự đặc biệt"
        ),
      email: Yup.string()
        .required("Email là bắt buộc")
        .email("Email không hợp lệ"),
      soDienThoai: Yup.string()
        .required("Số điện thoại là bắt buộc")
        .matches(
          /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          "Số điện thoại không hợp lệ"
        ),
    }),
    onSubmit: (values) => {
      dispatch(signUp(values)).then(() => {
        toast.success('Đăng kí thành công!')
        navigate('/tickets')
      });
    },
  });

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký</h2>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="tenDangNhap" className="block text-sm font-medium text-gray-700">
              Tên Đăng Nhập
            </label>
            <input
              type="text"
              name="tenDangNhap"
              id="tenDangNhap"
              value={formik.values.tenDangNhap}
              onChange={formik.handleChange}
              placeholder="Nhập tên đăng nhập"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formik.errors.tenDangNhap && formik.touched.tenDangNhap && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.tenDangNhap}</p>
            )}
          </div>

          <div>
            <label htmlFor="matKhau" className="block text-sm font-medium text-gray-700">
              Mật Khẩu
            </label>
            <input
              type="password"
              name="matKhau"
              id="matKhau"
              value={formik.values.matKhau}
              onChange={formik.handleChange}
              placeholder="Nhập mật khẩu"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formik.errors.matKhau && formik.touched.matKhau && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.matKhau}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Nhập email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="soDienThoai" className="block text-sm font-medium text-gray-700">
              Số Điện Thoại
            </label>
            <input
              type="text"
              name="soDienThoai"
              id="soDienThoai"
              value={formik.values.soDienThoai}
              onChange={formik.handleChange}
              placeholder="Nhập số điện thoại"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {formik.errors.soDienThoai && formik.touched.soDienThoai && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.soDienThoai}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Đăng Ký
          </button>
        </form>
      </div>
    </section>
  );
}
