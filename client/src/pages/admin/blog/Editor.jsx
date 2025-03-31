import React, { useEffect } from 'react';

import {
  Form,
  Formik,
} from 'formik';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import BlogApi from '@/api/blog.api';
import { RichTextEditor } from '@/components/tiptap/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadImage } from '@/utils/uploadImage';

export default function Editor() {
	const navigate = useNavigate();
	const params = useParams();
	const [previewImage, setPreviewImage] = React.useState(null);
	const [initialValues, setInitialValues] = React.useState({
		title: "",
		cover: null,
		content: "",
	});
	const validationSchema = Yup.object({
		title: Yup.string().required("Tiêu đề là bắt buộc"),
		...(!params.blog_id && {
			cover: Yup.mixed()
				.required("Ảnh bìa là bắt buộc") // Bắt buộc phải có ảnh
				.test("fileType", "Chỉ hỗ trợ JPEG, PNG, GIF", (value) => {
					if (!value) return false; // Không có file
					return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
				})
				.test("fileSize", "Kích thước tối đa 5MB", (value) => {
					if (!value) return false;
					return value.size <= 5 * 1024 * 1024; // Giới hạn 5MB
				}),
		}),
		content: Yup.string().required("Nội dung là bắt buộc"),
	});
	const handleSubmit = async (values, { setSubmitting }) => {
		setSubmitting(true);
		console.log("values", values);
		try {
			const data = {
				blog_title: values.title,
				blog_content: values.content,
			};
			// method add and method update
			const method = params.blog_id ? "update" : "create";
			console.log("method", method);
			const blog_id = params.blog_id || null;
			// Upload image to cloudinary
			if (method === "update" && !values.cover) {
				data.blog_image = previewImage;
			}
			if (method === "create" && !values.cover) {
				toast.error("Vui lòng chọn ảnh bìa", {
					duration: 1000,
				});
				return;
			}
			// Upload image to cloudinary
			if (values.cover) {
				const formData = new FormData();
				formData.append("file", values.cover);
				const result = await uploadImage(formData);
				if (result.status === 200) {
					data.blog_image = result.data.secure_url;
				} else {
					toast.error("Upload ảnh thất bại", {
						duration: 1000,
					});
				}
			}
			// Call API to create or update blog
			if (method === "create") {
				const response = await BlogApi.createBlog(data);
				if (response.status === 201) {
					toast.success("Đăng bài thành công", {
						duration: 1000,
					});
					console.log(response.metadata);
					navigate("/blog/" + response.metadata.data.blog_id);
				}
			} else {
				const response = await BlogApi.updateBlog(blog_id, data);
				if (response.status === 200) {
					toast.success("Cập nhật bài viết thành công", {
						duration: 1000,
					});
					console.log(response.metadata);
					navigate("/blog/" + response.metadata.data.blog_id);
				}
			}
		} finally {
			setSubmitting(false);
		}
	};
	useEffect(() => {
		const fetchBlog = async () => {
			if (params.blog_id) {
				const response = await BlogApi.getBlogById(params.blog_id);
				if (response.status === 200) {
					setInitialValues({
						title: response.metadata.data.blog_title,
						cover: null,
						content: response.metadata.data.blog_content,
					});
					setPreviewImage(response.metadata.data.blog_image);
				}
			}
		};
		fetchBlog();
	}, [params.blog_id]);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={handleSubmit}
			enableReinitialize
		>
			{({ handleChange, handleBlur, values, errors, isSubmitting, setFieldValue }) => (
				<Form noValidate autoComplete="off" className="p-3 space-y-3">
					<div className="mt-3">
						<Label className="block mb-2 text-sm font-medium text-[#674188]" htmlFor={"title"}>
							Tiêu đề
						</Label>
						<Input
							name={"title"}
							placeholder={"Nhập tiêu đề"}
							onChange={handleChange}
							value={values.title}
							onBlur={handleBlur}
							type={"text"}
							id={"title"}
						/>
						<span className="text-xs h-3 block text-red-500 mt-2">{errors["title"] ?? ""}</span>
					</div>

					<div className="mt-3">
						<Label className="block mb-2 text-sm font-medium text-[#674188]" htmlFor={"cover"}>
							Ảnh bìa
						</Label>
						<Input
							name={"cover"}
							placeholder={"Thêm ảnh bìa"}
							onChange={(e) => {
								setFieldValue("cover", e.target.files[0]);
								setPreviewImage(URL.createObjectURL(e.target.files[0]));
							}}
							onBlur={handleBlur}
							type={"file"}
							id={"cover"}
							accept="image/*"
						/>
						<div>
							{previewImage && (
								<img
									src={previewImage}
									alt="cover"
									className="w-20 h-20 object-cover rounded-md mt-2"
								/>
							)}
						</div>
						<span className="text-xs h-3 block text-red-500 mt-2">{errors["cover"] ?? ""}</span>
					</div>
					<div className="mt-3">
						<Label className="block mb-2 text-sm font-medium text-[#674188]" htmlFor={"content"}>
							Tiêu đề
						</Label>
						<RichTextEditor
							onChange={(value) => {
								setFieldValue("content", value);
							}}
							content={values["content"]}
						/>
						<span className="text-xs h-3 block text-red-500 mt-2">{errors["content"] ?? ""}</span>
					</div>
					{!params.blog_id ? (
						<Button type="submit">{isSubmitting ? "Đang đăng bài..." : "Đăng bài"}</Button>
					) : (
						<Button type="submit">{isSubmitting ? "Đang cập nhật..." : "Cập nhật"}</Button>
					)}
				</Form>
			)}
		</Formik>
	);
}
