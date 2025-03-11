import React, {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AuthApi from '@/api/auth.api';

export default function Forgot() {
	const navigate = useNavigate();
	const [stateError, setStateError] = useState(() => ({
		message: "",
		status: "",
	}));
	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		if (token) {
			navigate({ pathname: "/user/me" });
		}
	}, [navigate]);
	const handleSubmit = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email");
		if (!email) {
			setStateError({
				message: "Vui lòng nhập email",
				status: "error",
			});
			return;
		}
		const response = await AuthApi.forgotPassword({ email });
		if (response.status === 200) {
			toast.success(`Một email đã được gửi đến ${email} của bạn. Vui lòng kiểm tra email của bạn`);
			navigate("/auth/login");
		} else {
			toast.error(response.message);
		}
	};
	return (
		<section className="flex-col flex-center px-6 py-8 mx-auto h-screen lg:py-0">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
				<div className="flex justify-center mb-4">
					<div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-full">HoangDo</div>
				</div>
				<h2 className="text-2xl font-semibold text-center mb-6">Forgot password</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-2">
						<input
							name="email"
							type="email"
							placeholder="Email"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
						/>
					</div>
					{stateError.message && (
						<span
							className={`text-xs mb-1 h-3 block ${
								stateError.status == "error" && "text-red-500"
							} ${stateError.status === "success" && "text-green-500"}`}
						>
							{stateError?.message}
						</span>
					)}
					<button
						type="submit"
						className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 mt-5"
					>
						Khôi phục
					</button>
				</form>
			</div>
		</section>
	);
}
