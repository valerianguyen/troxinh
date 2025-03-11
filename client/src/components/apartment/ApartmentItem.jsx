import React from 'react';

import {
  Bath,
  BedDouble,
  MapPin,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import {
  ENUM_STRING_APARTMENT_CATEGORIES,
  ENUM_STRING_APARTMENT_TYPE,
  ENUM_STRING_PRIORY,
} from '@/constant';
import { cn } from '@/lib/utils';
import {
  formatTimeAgo,
  getLocationString,
} from '@/utils';
import { formatCurrency } from '@/utils/formatCurrency';

function ImageIcon({ src, alt, size }) {
	return <img alt={alt} src={src} className={cn("object-cover", size)} />;
}
export default function ApartmentItem({ apartment, full = true }) {
	return (
		<article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg relative flex flex-col">
			<div className="flex gap-2 my-2 absolute top-0 left-0 w-full px-2 justify-between">
				<div>
					<Badge className={"bg-pink-500 hover:bg-pink-500"}>
						{ENUM_STRING_PRIORY[apartment.apart_priority]}
					</Badge>
				</div>
				<div className="flex flex-col gap-2 items-end">
					<Badge className={"bg-green-400 hover:bg-green-400"}>
						{ENUM_STRING_APARTMENT_TYPE[apartment.apart_type]}
					</Badge>
					<Badge className={"bg-blue-400 hover:bg-blue-400 w-max"}>
						{ENUM_STRING_APARTMENT_CATEGORIES[apartment.apart_category]}
					</Badge>
				</div>
			</div>
			<img
				alt={apartment.images[0].img_alt}
				src={apartment.images[0].img_url}
				className="h-56 w-full object-cover"
			/>

			<div className="bg-white p-4 sm:p-6 flex flex-col flex-1 space-y-2">
				<time className="block text-xs text-gray-500">{`Cập nhật ${formatTimeAgo(
					apartment.updatedAt,
				)}`}</time>
				<h3 className="flex-1">
					<NavLink
						to={"/apartment/" + apartment.apart_id}
						className="mt-0.5 text-2xl text-pink-400 line-clamp-2"
					>
						{apartment.apart_title}
					</NavLink>
				</h3>
				<p className="font-medium text-sm flex items-center gap-2">
					<ImageIcon src={"/icons/price_m2.png"} alt={"price/m2"} size={"size-5"} />
					<span>{formatCurrency(apartment.apart_price)}{apartment.apart_price > 0 ? "/tháng" : "Miễn phí"}</span>
				</p>
				<p className="font-medium text-sm flex items-center gap-2">
					<ImageIcon src={"/icons/size.png"} alt={"area"} size={"size-5"} />
					<span>
						{apartment.apart_area}m<sup>2</sup>
					</span>
				</p>
				<p className="text-sm font-medium text-gray-500 flex items-center gap-2">
					<MapPin size={20} />
					{getLocationString(apartment.apart_city, apartment.apart_district, apartment.apart_ward)}
				</p>
				<p className="flex items-center gap-2 text-gray-500 text-sm font-medium">
					<BedDouble size={20} />
					{apartment.apart_total_room} phòng ngủ
				</p>
				<p className="flex items-center gap-2 text-gray-500 text-sm font-medium">
					<Bath size={20} />
					{apartment.apart_total_toilet} nhà vệ sinh
				</p>
				{full && (
					<NavLink
						to={"/user/profile/" + apartment.user.usr_id}
						className={"flex gap-3 text-sm text-gray-500 mt-4"}
					>
						{/* avatar */}
						<div className="flex-shrink-0 border border-gray-500 rounded-full size-10 overflow-hidden">
							<img className="size-full object-cover" src={apartment.user.usr_avatar} />
						</div>
						<div className="flex justify-center flex-col">
							<p className="text-black font-medium">{apartment.user.usr_name}</p>
							<p>{apartment.user.usr_totals_apartment} tin đã đăng</p>
						</div>
					</NavLink>
				)}
			</div>
		</article>
	);
}
