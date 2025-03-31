import React, {
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ApartmentApi from '@/api/apartment.api';
import ApartmentItem from '@/components/apartment/ApartmentItem';
import { InfoApartment } from '@/components/apartment/InfoApartment';

import NotFound from '../_notFound';

export default function DetailApartment() {
	const { apart_id } = useParams();
	const [loading, setLoading] = useState(true);
	const [apartment, setApartment] = useState(null);
	const [relatedApartment, setRelatedApartment] = useState(null);
	const [comments, setComments] = useState(null);
	const user = useSelector((state) => state.user);
	useEffect(() => {
		setLoading(true);
		const fetchApartment = async () => {
			const response = await ApartmentApi.getApartmentById(apart_id);
			if (response?.status === 200) {
				setApartment(response.metadata.data);
				const relatedResponse = await ApartmentApi.searchGuestApartment({
					apart_district: response.metadata.data.apart_district,
					apart_id_ne: response.metadata.data.apart_id,
					page: 1,
					limit: 4,
				});
				if (relatedResponse?.status === 200) {
					setRelatedApartment(relatedResponse.metadata.data);
				}
			}
			return response;
		};
		fetchApartment().finally(() => setLoading(false));
		window.scrollTo(0, 0);
	}, [apart_id, user]);
	return loading ? (
		<div className="flex justify-center items-center h-screen">
			<Loader2 className="animate-spin size-10" />
		</div>
	) : apartment ? (
		<div className="container max-w-7xl mx-auto px-4">
			<div className="flex gap-10 md:flex-row flex-col">
				<InfoApartment apartment={apartment} />
			</div>

			<div className="mt-4">
				<hr />
				<h2 className="text-2xl my-4">Tin đăng liên quan</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:md:grid-cols-4 gap-4">
					{relatedApartment?.apartments.map((apartment) => (
						<ApartmentItem key={apartment.apart_id} apartment={apartment} full />
					))}
				</div>
			</div>
		</div>
	) : (
		<NotFound />
	);
}
