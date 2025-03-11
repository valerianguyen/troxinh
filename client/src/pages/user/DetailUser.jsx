import React, {
  useEffect,
  useState,
} from 'react';

import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import ApartmentApi from '@/api/apartment.api';
import UserApi from '@/api/user.api';
import ApartmentItem from '@/components/apartment/ApartmentItem';
import { formatTimeAgo } from '@/utils';

import NotFound from '../_notFound';

export default function DetailUser() {
	const { userId } = useParams();
	const currentUser = useSelector((state) => state.user);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [apartments, setApartments] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (currentUser?.usr_id == userId) {
			navigate("/user/me");
		}
		async function fetchUser() {
			const res = await UserApi.getUserById(userId);
			if (res.status === 200 && res.metadata.data) {
				const resApartments = await ApartmentApi.searchGuestApartment({
					usr_id: userId,
				});
				setUser(res.metadata.data);
				if (resApartments.status === 200) {
					setApartments(resApartments.metadata.data.apartments);
				}
			}
		}
		fetchUser().finally(() => setLoading(false));
		;
	}, [currentUser]);
	return loading ? (
		<div className="flex justify-center items-center h-screen">
			<Loader2 className="animate-spin size-10" />
		</div>
	) : (
		<div className='container mx-auto'>
			{user ? (
				<>
					<div
						className={
							"flex gap-3 text-sm text-gray-500  md:flex-row md:justify-start justify-center flex-col p-4 rounded-lg"
						}
					>
						<div className="flex-shrink-0 border border-gray-500 rounded-full size-40 overflow-hidden">
							<img className="size-full object-cover" src={user.usr_avatar} />
						</div>
						<div className="flex justify-center flex-col gap-1">
							<p className="text-black font-medium text-xl">{user.usr_name}</p>
							<p>{user.usr_totals_apartment} tin đăng đã đăng</p>
							<p>Đỉa chỉ: {user.usr_address ?? "Chưa cập nhật"}</p>
							<p>Số điện thoại: {user.usr_phone ?? "Chưa cập nhật"}</p>
							<p>Địa chỉ email: {user.usr_email}</p>
							<p>Tài khoản tạo từ {formatTimeAgo(user.createdAt)}</p>
						</div>
					</div>
					<div className="mt-4 p-5">
						<hr />
						<h2 className="text-2xl my-4">Tin đăng hiện có</h2>
						{apartments && (
							<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{apartments.map((apartment) => (
									<ApartmentItem key={apartment.apart_id} apartment={apartment} full={false} />
								))}
							</div>
						)}
					</div>
				</>
			) : (
				<NotFound />
			)}
		</div>
	);
}
