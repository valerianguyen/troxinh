import React, {
  useEffect,
  useState,
} from 'react';

import {
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Star,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import ApartmentApi from '@/api/apartment.api';
import UserApi from '@/api/user.api';
import ApartmentItem from '@/components/apartment/ApartmentItem';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ENUM_APARTMENT_CATEGORIES,
  ENUM_STRING_APARTMENT_CATEGORIES,
} from '@/constant';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/utils';

import NotFound from '../_notFound';

export default function DetailUser() {
	const { userId } = useParams();
	const currentUser = useSelector((state) => state.user);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [apartments, setApartments] = useState(null);
	const [type, setType] = useState("all");
	const navigate = useNavigate();
	async function handleTypeChange(value) {
		setType(value);
		const resApartments = await ApartmentApi.searchGuestApartment({
			usr_id: userId,
			...(value !== "all" && { apart_category: value }),
		});
		if (resApartments.status === 200) {
			setApartments(resApartments.metadata.data.apartments);
		}
	}
	useEffect(() => {
		if (currentUser?.usr_id == userId) {
			navigate("/user/me");
		}
		async function fetchUser() {
			const res = await UserApi.getUserById(userId);
			if (res?.status === 200 && res.metadata.data) {
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
	}, [currentUser]);
	return loading ? (
		<div className="flex justify-center items-center h-screen">
			<Loader2 className="animate-spin size-10" />
		</div>
	) : (
		<div className="container mx-auto">
			{user ? (
				<div className="grid gap-8 md:grid-cols-[300px_1fr]">
					<div className="rounded-lg p-6 space-y-4">
						<div className="flex flex-col items-center text-center">
							<Avatar className="h-32 w-32 border-4 border-white shadow-md">
								<AvatarImage className="object-cover" src={user.usr_avatar} alt={user.usr_name} />
								<AvatarFallback>US</AvatarFallback>
							</Avatar>
							<h1 className="mt-4 text-2xl font-bold">{user.usr_name}</h1>
							<Badge variant="outline" className="mt-2 px-3 py-1">
								<Star className="mr-1 h-3 w-3" /> {user.usr_totals_apartment} tin đăng đã đăng
							</Badge>
						</div>

						<div className="pt-4 border-t space-y-3">
							<div className="flex items-start gap-3 text-sm">
								<MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
								<div>
									<p className="font-medium text-muted-foreground">Địa chỉ</p>
									<p>{user.usr_address ?? "Chưa cập nhật"}</p>
								</div>
							</div>

							<div className="flex items-start gap-3 text-sm">
								<Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
								<div>
									<p className="font-medium text-muted-foreground">Số điện thoại</p>
									<p>{user.usr_phone ?? "Chưa cập nhật"}</p>
								</div>
							</div>

							<div className="flex items-start gap-3 text-sm">
								<Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
								<div>
									<p className="font-medium text-muted-foreground">Địa chỉ email</p>
									<p className="text-primary">{user.usr_email}</p>
								</div>
							</div>

							<div className="flex items-start gap-3 text-sm">
								<Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
								<div>
									<p className="font-medium text-muted-foreground">Tài khoản tạo từ</p>
									<p>{formatTimeAgo(user.createdAt)}</p>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-4 p-5">
						<h2 className="text-2xl my-4">Tin đăng hiện có</h2>
						<div className="bg-gray-200 w-fit rounded-lg my-3 p-1 gap-2">
							<Button className={cn(type === "all" && "bg-white")} variant={"ghost"} value="all" onClick={() => handleTypeChange("all")}>
								Tất cả
							</Button>
							{Object.values(ENUM_APARTMENT_CATEGORIES).map((key) => (
								<Button
									variant={"ghost"}
									value={key}
									key={key}
									className={cn(type === key && "bg-white")}
									onClick={() => handleTypeChange(key)}
								>
									{ENUM_STRING_APARTMENT_CATEGORIES[key]}
								</Button>
							))}
						</div>
						{apartments && (
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
								{apartments.map((apartment) => (
									<ApartmentItem key={apartment.apart_id} apartment={apartment} full={false} />
								))}
							</div>
						)}
					</div>
				</div>
			) : (
				<NotFound />
			)}
		</div>
	);
}
