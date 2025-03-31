import React, { useState } from 'react';

import {
  Form,
  Formik,
} from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import AuthApi from '@/api/auth.api';
import { login } from '@/lib/features/user/userSlice';

import { registerFields } from '../../lib/data';

export default function Register() {
	// const router = useRouter();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const initialValues = {
		email: "",
		password: "",
		confirmPassword: "",
		fullName: "",
		phone: "",
	};

	// Validation schema
	const validationSchema = Yup.object({
		email: Yup.string().email("Email không đúng định dạng").required("Email là bắt buộc"),
		password: Yup.string()
			.min(6, "Mật khẩu phải có ít nhất 6 ký tự")
			.required("Mật khẩu là bắt buộc"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password")], "Mật khẩu không trùng khớp")
			.required("Xác nhận mật khẩu là bắt buộc"),
		fullName: Yup.string()
			.min(6, "Họ và tên phải có ít nhất 6 ký tự")
			.required("Họ và tên là bắt buộc"),
		phone: Yup.string()
			.matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, "Số điện thoại không đúng định dạng")
			.required("Số điện thoại là bắt buộc"),
	});

	const handleSubmit = async (values) => {
		setLoading(true);
		const result = await AuthApi.register(values);
		if (result?.status === 201) {
			toast.success("Đăng ký thành công", {
				duration: 1000,
			});
			dispatch(login(result.metadata.data.user));
			localStorage.setItem("accessToken", result.metadata.data.accessToken);
			navigate({ pathname: "/user/me" });
		}
		setLoading(false);
	};

	return (
		<>
			<section>
				<div className="flex-col flex-center px-6 py-8 mx-auto h-screen lg:py-0">
					<div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-dark md:text-2xl">
								Đăng ký tài khoản
							</h1>
							<p className="text-sm text-[#674188]">
								<a href="/" className="text-[#C8A1E0]">
									Quay lại trang chủ
								</a>
							</p>
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={handleSubmit}
							>
								{({ handleChange, handleBlur, values, errors }) => (
									<Form noValidate autoComplete="off">
										{registerFields.map((field) => {
											return (
												<div key={field.name} className="mt-3">
													<label
														className="block mb-2 text-sm font-medium text-[#674188] "
														htmlFor={field.name}
													>
														{field.label}
													</label>
													<input
														className={`bg-gray-50 text-[#674188] rounded-lg focus:ring-primary-600 focus:border-primary-600 outline outline-1 block w-full p-2.5 ${
															errors[field.name] && "text-red-400 outline-red-400"
														}`}
														name={field.name}
														placeholder={field.placeholder}
														aria-label={field.name}
														onChange={handleChange}
														value={values[`${field.name}`]}
														onBlur={handleBlur}
														type={field.type}
														id={field.name}
													/>
													<span className="text-xs h-3 block text-red-500 mt-2">
														{errors[field.name] ?? ""}
													</span>
												</div>
											);
										})}
										<button
											type="submit"
											className="w-full bg-[#C8A1E0] text-white font-medium mt-3 rounded-lg text-base px-5 py-2.5 text-center"
										>
											{loading ? "Đang xử lý..." : "Đăng ký"}
										</button>
										<div className="mt-2">
											<p className="text-sm text-[#674188] text-center">
												Bạn đã có tài khoản?{" "}
												<a href="/auth/login" className="text-[#C8A1E0]">
													Đăng nhập ngay
												</a>
											</p>
										</div>
										<div className="text-center mt-2">
											<a href="/auth/register" className="text-[#C8A1E0] text-sm">
												Quên mật khẩu
											</a>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
