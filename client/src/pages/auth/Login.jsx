import {
  useEffect,
  useState,
} from 'react';

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

import { signInFields } from '../../lib/data';

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			navigate({ pathname: "/user/me" });
		}
		setIsHydrated(true);
	}, [navigate]);

	const initialValues = {
		email: "",
		password: "",
	};

	// Validation schema
	const validationSchema = Yup.object({
		email: Yup.string().email("Email không đúng định dạng").required("Email là bắt buộc"),
		password: Yup.string()
			.min(6, "Mật khẩu phải có ít nhất 6 ký tự")
			.required("Mật khẩu là bắt buộc"),
	});

	const handleSubmit = async (values, { setSubmitting }) => {
		setSubmitting(true);
		try {
			const result = await AuthApi.login(values);
			if (result?.status === 200) {
				localStorage.setItem("accessToken", result.metadata.data.accessToken);
				dispatch(login(result.metadata.data.user));
				navigate({ pathname: "/user/me" });
				toast.success("Đăng nhập thành công", {
					duration: 1000,
				});
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<section>
				<div className="flex-col flex-center px-6 py-8 mx-auto h-screen lg:py-0">
					<div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
						<div className="p-6">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-[#674188] md:text-2xl mb-6">
								Đăng nhập
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
								{({ handleChange, handleBlur, values, errors, isSubmitting }) => (
									<Form noValidate autoComplete="off">
										{signInFields.map((field) => (
											<div key={field.name} className="mt-3">
												<label
													className="block mb-2 text-sm font-medium text-[#674188]"
													htmlFor={field.name}
												>
													{field.label}
												</label>
												<input
													className="bg-gray-50 border border-gray-300 text-[#674188] rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
													name={field.name}
													placeholder={field.placeholder}
													aria-label={field.name}
													onChange={handleChange}
													value={values[`${field.name}`]}
													onBlur={handleBlur}
													type={field.type}
													id={field.name}
													disabled={!isHydrated} // Disable input until hydration is complete
												/>
												<span className="text-xs h-3 block text-red-500 mt-2">
													{errors[field.name] ?? ""}
												</span>
											</div>
										))}

										<button
											type="submit"
											className="w-full bg-[#C8A1E0] mt-5 text-white font-medium rounded-lg text-base px-5 py-2.5 text-center"
											disabled={isSubmitting || !isHydrated} // Disable submit button until fully hydrated
										>
											{isSubmitting ? "Đăng nhập..." : "Đăng nhập"}
										</button>
										<div className="mt-2">
											<p className="text-sm text-[#674188] text-center">
												Bạn chưa có tài khoản{" "}
												<a href="/auth/register" className="text-[#C8A1E0]">
													Đăng ký ngay
												</a>
											</p>
										</div>
										<div className="text-center mt-2">
											<a href="/auth/forgot-password" className="text-[#C8A1E0] text-sm">
												Quên mật khẩu?
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
