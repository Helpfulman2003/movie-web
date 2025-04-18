import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/slices/authSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, auth } = useSelector((state) => state.auth);
  
  console.log(auth);
  
  useEffect(() => {
    if (auth?._id) {
      navigate("/tickets"); 
    }
  }, [auth, navigate]);

  const formik = useFormik({
    initialValues: {
      tenDangNhap: "",
      matKhau: "",
    },
    validationSchema: Yup.object({
      tenDangNhap: Yup.string().required("Tên đăng nhập là bắt buộc"),
      matKhau: Yup.string().required("Mật khẩu là bắt buộc"),
    }),
    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(signIn(values));
        if (signIn.fulfilled.match(resultAction)) {
          toast.success("Đăng nhập thành công!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          navigate("/tickets");
        } else {
          toast.error("Đăng nhập thất bại, vui lòng thử lại.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        console.error("Lỗi khi đăng nhập:", error);
      }
    },
  });

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
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

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-blue-500 hover:bg-blue-600 text-white"
            >
            Đăng nhập
            </button>
        </form>
      </div>
    </section>
  );
}