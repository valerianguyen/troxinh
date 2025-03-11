import React from 'react';

import { toast } from 'sonner';

import ApartmentApi from '@/api/apartment.api';
import ApartmentForm from '@/components/apartment/ApartmentForm';
import { uploadImage } from '@/utils/uploadImage';

export default function AddApartment() {
	const handleSubmit = async (values, { setSubmitting, setErrors }) => {
		const { apart_file_images, ...data } = values;
		setSubmitting(true);
		const formData = new FormData();
		try {
			const images = await Promise.all([
				...apart_file_images.map(async (file) => {
					formData.append("file", file);
					const res = await uploadImage(formData);
					return res.data.secure_url;
				}),
			]);
			const res = await ApartmentApi.createApartment({
				...data,
				apart_images: (() => {
					if (data.apart_images.length > apart_file_images.length) {
						return [...data.apart_images.slice(0, data.apart_images.length), ...images].map(
							(image) => ({
								img_url: image.img_url,
								img_alt: data.apart_title,
							}),
						);
					} else {
						return images.map((img) => ({ img_url: img, img_alt: data.apart_title }));
					}
				})(),
			});
			if (res.status === 201) {
				window.open(res.metadata.data.payment_url, "_self");
			} else {
				console.log(res);
				setErrors({
					apart_images: res.data.message,
				});
			}
		} catch (err) {
			toast.error("Thêm mới tin đăng thất bại", {
				duration: 1000,
			});
		}
		setSubmitting(false);
	};
	return (
		<div className="flex-center p-2">
			<ApartmentForm method="add" submit={handleSubmit} />
		</div>
	);
}
