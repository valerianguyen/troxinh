import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
} from 'formik';
import * as Yup from 'yup';

import BlacklistWordApi from '@/api/blacklistWord.api';
import LoadingButton from '@/components/Button/LoadingButton';
import { Button } from '@/components/ui/button';
import {
  ENUM_APARTMENT_CATEGORIES,
  ENUM_APARTMENT_TYPE,
  ENUM_STRING_APARTMENT_CATEGORIES,
  ENUM_STRING_APARTMENT_TYPE,
} from '@/constant';
import province from '@/data/province.json';
import { checkSentence } from '@/utils';
import {
  UploadCloud,
  X,
} from '@geist-ui/icons';

const ApartmentForm = ({ method = "add", submit, initValues = {} }) => {
	// Yup validation schema
	const [blacklistData, setBlacklistData] = useState([]);
	const selectedCity = useRef(null);
	const selectedDistrict = useRef(null);
	const validationSchema = Yup.object({
		apart_title: Yup.string()
			.required("Tiêu đề là bắt buộc")
			.min(20, "Tiêu đề quá ngắn")
			.max(100, "Tiêu đề không quá 100 ký tự")
			.matches(
				/^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/,
				"Tiêu đề chỉ được chứa chữ cái, số và khoảng trắng",
			),
		apart_total_toilet: Yup.number()
			.required("Số toilet là bắt buộc")
			.min(1, "Phải có ít nhất 1 toilet"),
		apart_total_room: Yup.number()
			.required("Số phòng là bắt buộc")
			.min(1, "Phải có ít nhất 1 phòng"),
		apart_area: Yup.number().required("Diện tích là bắt buộc").positive("Diện tích phải lớn hơn 0"),
		apart_description: Yup.string().required("Mô tả là bắt buộc"),
		apart_images: Yup.array()
			.min(1, "Ít nhất 1 hình ảnh")
			.required("Hình ảnh là bắt buộc")
			.max(5, "Nhiều nhất 5 hình ảnh"),
		apart_city: Yup.number().required("Tỉnh/Thành phố là bắt buộc"),
		apart_district: Yup.number().required("Quận/Huyện là bắt buộc"),
		apart_ward: Yup.number().required("Phường/Xã là bắt buộc"),
		apart_price: Yup.number().required("Giá là bắt buộc").positive("Giá phải lớn hơn 0"),
		apart_category: Yup.number().required("Danh mục là bắt buộc"),
		apart_type: Yup.number().required("Loại bài đăng là bắt buộc"),
	});
	useEffect(() => {
		selectedCity.current = province.find((city) => city.code === initValues.apart_city);
		selectedDistrict.current = selectedCity.current?.districts.find(
			(district) => district.code === initValues.apart_district,
		);
		const fetchData = async () => {
			const response = await BlacklistWordApi.getBlacklistWord();
			if (response?.status === 200) {
				setBlacklistData(response.metadata.data);
			}
		};
		if (blacklistData.length === 0) {
			fetchData();
		}
	}, [initValues.apart_type, initValues.apart_district, initValues.apart_city]);
	const validate = (values) => {
		let errors = {};
		const resultTitle = checkSentence({
			sentence: values.apart_title,
			blacklistData: blacklistData,
		});
		const resultDescription = checkSentence({
			sentence: values.apart_description,
			blacklistData: blacklistData,
		});
		if (!resultDescription.isSafe) {
			errors.apart_description = `Tiêu đề không được chứa các từ: ${resultDescription.bannedWords.join(
				", ",
			)}`;
		}
		if (values.apart_images.length > 5) {
			errors.apart_images = "Nhiều nhất 5 hình ảnh";
		}
		values.apart_images.forEach((image, index) => {
			if (!image) {
				errors.apart_images = "Hình ảnh không được để trống";
			}
		})

		if (!resultTitle.isSafe) {
			errors.apart_title = `Tiêu đề không được chứa các từ: ${resultTitle.bannedWords.join(", ")}`;
		}
		return errors;
	};
	const initialValues = {
		apart_title: initValues.apart_title || "",
		apart_total_toilet: initValues.apart_total_toilet || "",
		apart_total_room: initValues.apart_total_room || "",
		apart_area: initValues.apart_area || "",
		apart_description: initValues.apart_description || "",
		apart_images: initValues.images || [""],
		apart_city: initValues.apart_city,
		apart_district: initValues.apart_district,
		apart_ward: initValues.apart_ward,
		apart_price: initValues.apart_price || 0,
		apart_file_images: [],
		apart_address: initValues.apart_address || "",
		apart_category: initValues.apart_category || ENUM_APARTMENT_CATEGORIES.BOARDING_HOUSE,
		apart_type: initValues.apart_type || ENUM_APARTMENT_TYPE.FOR_RENT,
	};

	return (
		<div className="max-w-4xl w-full p-4 mb-5">
			<h1 className="text-2xl font-medium mb-6">
				{method === "add" ? "Đăng tin đăng mới" : "Cập nhật bài đăng"}
			</h1>
			<hr className="mb-4" />
			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={submit}
				validate={validate}
				// enableReinitialize
			>
				{({ values, setFieldValue, isSubmitting, setFieldError }) => (
					<Form className="space-y-6">
						{/* Title */}
						<div>
							<label htmlFor="apart_title" className="block font-medium text-gray-700">
								Tiêu đề
							</label>
							<Field
								type="text"
								name="apart_title"
								id="apart_title"
								className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							/>
							<ErrorMessage
								name="apart_title"
								component="div"
								className="text-red-500 text-sm mt-1"
							/>
						</div>

						{/* Total Toilets */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label htmlFor="apart_total_toilet" className="block font-medium text-gray-700">
									Tổng số toilet
								</label>
								<Field
									type="number"
									id="apart_total_toilet"
									name="apart_total_toilet"
									className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
								/>
								<ErrorMessage
									name="apart_total_toilet"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>

							{/* Total Rooms */}
							<div>
								<label htmlFor="apart_total_room" className="block font-medium text-gray-700">
									Tổng số phòng
								</label>
								<Field
									type="number"
									id="apart_total_room"
									name="apart_total_room"
									className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
								/>
								<ErrorMessage
									name="apart_total_room"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{/* Area */}
							<div className="flex flex-col">
								<label htmlFor="apart_area" className="block font-medium text-gray-700">
									Tổng diện tích (m2)
								</label>
								<Field
									id="apart_area"
									type="number"
									name="apart_area"
									className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
								/>
								<ErrorMessage
									name="apart_area"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>
							<div className="flex flex-col">
								<label htmlFor="apart_price" className="block font-medium text-gray-700">
									Giá thuê / tháng
								</label>
								<Field
									id="apart_price"
									type="number"
									name="apart_price"
									className="w-full mt-auto p-2 border rounded-md"
								/>
								<ErrorMessage
									name="apart_price"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div>
								<label htmlFor="apart_type" className="block font-medium text-gray-700">
									Loại bài đăng
								</label>
								<Field
									as="select"
									name="apart_type"
									id="apart_type"
									className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
									onChange={(e) => {
										setFieldValue("apart_type", +e.target.value);
									}}
								>
									{Object.values(ENUM_APARTMENT_TYPE).map((type, index) => (
										<option
											key={index}
											value={type}
											defaultValue={type === ENUM_APARTMENT_TYPE.FOR_RENT}
										>
											{ENUM_STRING_APARTMENT_TYPE[type]}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="apart_category"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>
							<div>
								<label htmlFor="apart_category" className="block font-medium text-gray-700">
									Danh mục
								</label>
								<Field
									as="select"
									name="apart_category"
									id="apart_category"
									className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
									onChange={(e) => {
										setFieldValue("apart_category", +e.target.value);
									}}
								>
									{Object.values(ENUM_APARTMENT_CATEGORIES).map((category, index) => (
										<option
											key={index}
											value={category}
											defaultValue={category === ENUM_APARTMENT_CATEGORIES.BOARDING_HOUSE}
										>
											{ENUM_STRING_APARTMENT_CATEGORIES[category]}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="apart_category"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>
						</div>
						{/* Description */}
						<div>
							<label htmlFor="apart_description" className="block font-medium text-gray-700">
								Mô tả chi tiết
							</label>
							<Field
								as="textarea"
								id="apart_description"
								name="apart_description"
								className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
							/>
							<ErrorMessage
								name="apart_description"
								component="div"
								className="text-red-500 text-sm mt-1"
							/>
						</div>

						{/* Images */}
						<div>
							<label className="block font-medium text-gray-700 mb-4">Hình ảnh minh họa</label>
							<div className="grid grid-cols-[repeat(auto-fill,200px)] auto-rows-[200px] gap-4">
								{values.apart_images.map((image, index) => {
									return (
										<div key={index} className="relative border border-gray-400 rounded-md">
											{image ? (
												<img
													src={image.img_url}
													alt={image.img_alt}
													className="size-full object-cover rounded-md"
												/>
											) : (
												<>
													<label
														htmlFor={`apart_images[${index}]`}
														className="absolute bg-white p-2 rounded-md cursor-pointer text-gray-400 flex-center flex-col size-full select-none"
													>
														<UploadCloud size={30} />
														<span>Click to upload</span>
													</label>
													<Field
														type="file"
														id={`apart_images[${index}]`}
														name={`apart_images[${index}]`}
														placeholder="Image URL"
														className="hidden"
														accept="image/*"
														onChange={(event) => {
															const file = event.target.files[0];
															const blobUrl = URL.createObjectURL(file);
															if (values.apart_images.length > 5) {
																setFieldError("apart_images", "Nhiều nhất 5 hình ảnh");
																return;
															}
															setFieldValue(`apart_file_images`, [
																...values.apart_file_images,
																file,
															]);
															setFieldValue(`apart_images`, [
																...values.apart_images.map((image, i) => {
																	if (index === i)
																		return {
																			img_url: blobUrl,
																			img_alt: file.name,
																		};
																	return image;
																}),
															]);
														}}
													/>
												</>
											)}
											<button
												type="button"
												onClick={() => {
													setFieldValue("apart_images", [
														...values.apart_images.filter((_, i) => i !== index),
													]);
													setFieldValue(
														`apart_file_images`,
														(() => {
															if (values.apart_images.length == values.apart_file_images.length) {
																return values.apart_file_images.filter((_, i) => i !== index);
															}
															return values.apart_file_images.filter(
																(_, i) => i !== index - values.apart_images.length,
															);
														})(),
													);
												}}
												className="rounded-full bg-red-500 text-white hover:bg-red-600 absolute size-6 flex-center -top-2 -right-2"
											>
												<X />
											</button>
										</div>
									);
								})}
							</div>
							<button
								type="button"
								onClick={() => {
									if (values.apart_images.length >= 5) {
										setFieldError("apart_images", "Nhiều nhất 5 hình ảnh");
										return;
									}
									setFieldValue("apart_images", [...values.apart_images, undefined]);
								}}
								className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
							>
								Thêm hình ảnh
							</button>
							<ErrorMessage
								name="apart_images"
								component="div"
								className="text-red-500 text-sm mt-1"
							/>
						</div>

						{/* City */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							<div>
								<label htmlFor="apart_city" className="block font-medium text-gray-700">
									Tỉnh/Thành phố
								</label>
								<Field
									as="select"
									name="apart_city"
									id="apart_city"
									className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
									onChange={(e) => {
										setFieldValue("apart_city", +e.target.value);
										selectedCity.current = province.find((city) => city.code === +e.target.value);
										selectedDistrict.current = null;
									}}
								>
									<option defaultValue={-1}>Chọn tỉnh/thành phố</option>
									{province.map((city) => (
										<option key={city.code} value={+city.code}>
											{city.name}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="apart_city"
									component="div"
									className="text-red-500 text-sm mt-1"
								/>
							</div>

							{/* District */}
							{selectedCity.current && (
								<div>
									<label htmlFor="apart_district" className="block font-medium text-gray-700">
										Quận/Huyện
									</label>
									<Field
										as="select"
										id="apart_district"
										name="apart_district"
										className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
										onChange={(e) => {
											setFieldValue("apart_district", +e.target.value);
											selectedDistrict.current = selectedCity.current.districts.find(
												(district) => district.code === +e.target.value,
											);
										}}
									>
										<option defaultValue={-1}>Chọn quận/huyện</option>
										{selectedCity.current?.districts.map((district, index) => (
											<option key={district.code} value={+district.code}>
												{district.name}
											</option>
										))}
									</Field>
									<ErrorMessage
										name="apart_district"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
							)}

							{/* Ward */}
							{selectedDistrict.current && (
								<div>
									<label htmlFor="apart_ward" className="block font-medium text-gray-700">
										Phường/Xã
									</label>
									<Field
										as="select"
										id="apart_ward"
										name="apart_ward"
										className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
										onChange={(e) => {
											setFieldValue("apart_ward", +e.target.value !== -1 ? +e.target.value : null);
										}}
									>
										<option defaultValue={-1}>Chọn phường/xã</option>
										{selectedDistrict.current.wards.map((ward, index) => (
											<option key={ward.code} value={+ward.code}>
												{ward.name}
											</option>
										))}
									</Field>
									<ErrorMessage
										name="apart_ward"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
							)}
							{selectedDistrict.current && (
								<div className="md:col-span-3">
									<label htmlFor="apart_address" className="block font-medium text-gray-700">
										Địa chỉ chi tiết
									</label>
									<Field
										type="text"
										id="apart_address"
										name="apart_address"
										className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
									/>
									<ErrorMessage
										name="apart_address"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
							)}
						</div>
						{/* Submit Button */}
						{isSubmitting ? (
							<LoadingButton />
						) : (
							<Button type="submit" className="w-full bg-blue-500">
								{method === "add" ? "Đăng bài" : "Cập nhật bài đăng"}
							</Button>
						)}
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default ApartmentForm;
