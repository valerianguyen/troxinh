import React, {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'sonner';

import ApartmentApi from '@/api/apartment.api';
import ApartmentForm from '@/components/apartment/ApartmentForm';
import { uploadImage } from '@/utils/uploadImage';

import NotFound from '../_notFound';

export default function EditApartment() {
	const { apart_id } = useParams();
	const navigate = useNavigate();
	const [apartment, setApartment] = useState(null);
	useEffect(() => {
		const fetchApartment = async () => {
			const response = await ApartmentApi.getApartmentById(apart_id);
			if (response?.status === 200) {
				setApartment(response.metadata.data);
			}
		};
		fetchApartment();
	}, []);
	const handleSubmit = async (values, { setSubmitting }) => {
		const { apart_file_images, ...data } = values;
		setSubmitting(true);
		const formData = new FormData();
		const images = await Promise.all([
			...apart_file_images.map(async (file) => {
				formData.append("file", file);
				const res = await uploadImage(formData);
				return {
					img_url: res.data.secure_url,
					img_alt: data.apart_title,
				};
			}),
		]);

		const res = await ApartmentApi.updateApartment(apart_id, {
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
					return images.map((img) => ({ img_url: img.img_url, img_alt: data.apart_title }));
				}
			})(),
		});
		if (res?.status === 200) {
			toast.success("Cập nhật tin đăng thành công", {
				duration: 1000,
			});
			navigate("/user/apartment");
		}
		setSubmitting(false);
	};
	return (
		<div className="flex-center p-2">
			{apartment ? (
				<ApartmentForm method="edit" submit={handleSubmit} initValues={apartment} />
			) : (
				<NotFound />
			)}
		</div>
	);
}
