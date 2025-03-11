import React from 'react';

import {
  Field,
  Form,
  Formik,
} from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import AuthApi from '@/api/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logout } from '@/lib/features/user/userSlice';

const validationSchema = Yup.object({
	currentPassword: Yup.string()
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự")
		.required("Mật khẩu hiện tại là bắt buộc"),
	newPassword: Yup.string()
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự")
		.notOneOf([Yup.ref("currentPassword")], "Mật khẩu mới không được trùng với mật khẩu hiện tại")
		.required("Mật khẩu mới là bắt buộc"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("newPassword")], "Mật khẩu không khớp")
		.required("Xác nhận mật khẩu là bắt buộc"),
});

export function FormPassword() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const handleSubmit = async (values, { setSubmitting }) => {
		setSubmitting(true);
		try {
			delete values.usr_email;
			const result = await AuthApi.changePassword(values);
			if (result.status === 200) {
				await AuthApi.logout();
				localStorage.removeItem("accessToken");
				dispatch(logout());
				toast.success("Đổi mật khẩu thành công", {
					duration: 1000,
				});
				navigate({ pathname: "/auth/login" });
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Formik
			initialValues={{
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			}}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
		>
			{({ errors, touched }) => (
				<Form className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
						<Field
							as={Input}
							id="currentPassword"
							name="currentPassword"
							type="password"
							className={
								errors.currentPassword && touched.currentPassword ? "border-destructive" : ""
							}
						/>
						{errors.currentPassword && touched.currentPassword && (
							<p className="text-sm text-destructive">{errors.currentPassword}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="newPassword">Mật khẩu mới</Label>
						<Field
							as={Input}
							id="newPassword"
							name="newPassword"
							type="password"
							className={errors.newPassword && touched.newPassword ? "border-destructive" : ""}
						/>
						{errors.newPassword && touched.newPassword && (
							<p className="text-sm text-destructive">{errors.newPassword}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
						<Field
							as={Input}
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							className={
								errors.confirmPassword && touched.confirmPassword ? "border-destructive" : ""
							}
						/>
						{errors.confirmPassword && touched.confirmPassword && (
							<p className="text-sm text-destructive">{errors.confirmPassword}</p>
						)}
					</div>

					<Button type="submit">Đổi mật khẩu</Button>
				</Form>
			)}
		</Formik>
	);
}
