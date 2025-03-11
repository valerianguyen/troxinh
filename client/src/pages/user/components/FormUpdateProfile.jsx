import React from 'react';

import {
  Form,
  Formik,
} from 'formik';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import * as Yup from 'yup';

import UserApi from '@/api/user.api';
import { updateProfileFields } from '@/lib/data';
import { login } from '@/lib/features/user/userSlice';

export default function FormUpdateProfile({ user, isHydrated }) {
	const dispatch = useDispatch();
	const validationSchema = Yup.object({
		usr_email: Yup.string().email("Email không đúng định dạng").required("Email là bắt buộc"),
		usr_name: Yup.string().required("Họ và tên là bắt buộc"),
		usr_phone: Yup.string()
			.required("Số điện thoại là bắt buộc")
			.matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, "Số điện thoại không đúng định dạng")
			.max(10),
		usr_address: Yup.string().required("Địa chỉ là bắt buộc"),
	});
	const handleSubmit = async (values, { setSubmitting }) => {
		setSubmitting(true);
		try {
			delete values.usr_email;
			const result = await UserApi.updateUser(values);
			if (result.status === 200) {
				dispatch(login(result.metadata.data));
				toast.success("Cập nhật thông tin thành công", {
					duration: 1000,
				});
			}
		} finally {
			setSubmitting(false);
		}
	};
	return (
		<Formik
			initialValues={user}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
			enableReinitialize
		>
			{({ handleChange, handleBlur, values, errors, isSubmitting }) => (
				<Form noValidate autoComplete="off">
					{updateProfileFields.map((field) => {
						return (
							<div key={field.name} className="mt-3">
								<label
									className="block mb-2 text-sm font-medium text-[#674188]"
									htmlFor={field.name}
								>
									{field.label}
								</label>
								<input
									className="bg-gray-50 border border-gray-300 text-[#674188] rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:text-gray-400"
									name={field.name}
									placeholder={field.placeholder}
									aria-label={field.name}
									onChange={handleChange}
									value={values[`${field.name}`] ?? ""}
									onBlur={handleBlur}
									type={field.type}
									id={field.name}
									disabled={!isHydrated || field.name == "usr_email"} // Disable input until hydration is complete
								/>
								<span className="text-xs h-3 block text-red-500 mt-2">
									{errors[field.name] ?? ""}
								</span>
							</div>
						);
					})}

					<button
						type="submit"
						className="w-full bg-[#C8A1E0] mt-5 text-white font-medium rounded-lg text-base px-5 py-2.5 text-center"
						disabled={isSubmitting || !isHydrated} // Disable submit button until fully hydrated
					>
						{isSubmitting ? (
							<div className="flex gap-4">
								<Loader2 className="animate-spin" />
								Vui lòng chờ...
							</div>
						) : (
							"Cập nhật"
						)}
					</button>
				</Form>
			)}
		</Formik>
	);
}
