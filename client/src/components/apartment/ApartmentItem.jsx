import React from 'react';

import {
  Award,
  Bath,
  Clock,
  Crown,
  Diamond,
  Home,
  MapPin,
  Medal,
  Star,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ENUM_PRIORY,
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

import { Button } from '../ui/button';

const ENUM_ICON_PRIORY = {
	[ENUM_PRIORY.DEFAULT]: <Star size={15} />,
	[ENUM_PRIORY.LOW]: <Medal size={15} />,
	[ENUM_PRIORY.MEDIUM]: <Award size={15} />,
	[ENUM_PRIORY.HIGH]: <Crown size={15} />,
	[ENUM_PRIORY.EXTRA]: <Diamond size={15} />,
};
const ENUM_COLOR_PRIORY = {
	[ENUM_PRIORY.DEFAULT]: "bg-gray-600",
	[ENUM_PRIORY.LOW]: "bg-amber-700",
	[ENUM_PRIORY.MEDIUM]: "bg-gray-400",
	[ENUM_PRIORY.HIGH]: "bg-yellow-400",
	[ENUM_PRIORY.EXTRA]: "bg-pink-400",
};

export default function ApartmentItem({ apartment, full }) {
	return (
		<Card className="group hover:shadow-lg transition-shadow flex flex-col">
			<div className="relative overflow-hidden">
				<img
					src={apartment.images[0].img_url}
					alt={apartment.images[0].img_alt}
					className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				<div className="flex gap-2 my-2 absolute top-0 left-0 w-full px-2 justify-between">
					<Badge
						className={cn(
							"text-white flex items-center gap-1 h-fit",
							ENUM_COLOR_PRIORY[apartment.apart_priority],
						)}
					>
						{ENUM_ICON_PRIORY[apartment.apart_priority]}
						{ENUM_STRING_PRIORY[apartment.apart_priority]}
					</Badge>
					<div className="flex flex-col gap-2 items-end">
						<Badge className={"bg-green-400 hover:bg-green-400"}>
							{ENUM_STRING_APARTMENT_TYPE[apartment.apart_type]}
						</Badge>
						<Badge className={"bg-blue-400 hover:bg-blue-400 w-max"}>
							{ENUM_STRING_APARTMENT_CATEGORIES[apartment.apart_category]}
						</Badge>
					</div>
				</div>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
				<div className="absolute bottom-0 left-0 w-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
					<NavLink to={"/apartment/" + apartment.apart_id}>
						<Button size="sm" className="w-full bg-white text-pink-600 hover:bg-white/90">
							Xem chi tiết
						</Button>
					</NavLink>
				</div>
			</div>
			<CardContent className="p-4 flex flex-col gap-2 flex-1">
				<div className="mb-2 flex items-center text-xs text-muted-foreground">
					<Clock className="mr-1 h-3 w-3" />
					<span>Cập nhật {formatTimeAgo(apartment.updatedAt)}</span>
				</div>
				<h3 className="mb-2 line-clamp-2 text-lg font-semibold text-pink-600 group-hover:text-pink-700 transition-colors break-words flex-1">
					{apartment.apart_title}
				</h3>
				<div className="mb-4 space-y-2 text-sm">
					<div className="flex items-center">
						<Badge variant="outline" className="mr-2 border-pink-200 text-pink-700 font-medium">
							{formatCurrency(apartment.apart_price)}
							{apartment.apart_price > 0 ? "/tháng" : "Miễn phí"}
						</Badge>
						<Badge variant="outline" className="border-blue-200 text-blue-700 font-medium">
							{apartment.apart_area}m<sup>2</sup>
						</Badge>
					</div>
					<div className="flex items-center">
						<MapPin className="mr-1 h-4 w-4 text-pink-500" />
						<span className="line-clamp-1">
							{getLocationString(
								apartment.apart_city,
								apartment.apart_district,
								apartment.apart_ward,
							)}
						</span>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center">
							<Home className="mr-1 h-4 w-4 text-pink-500" />
							<span>{apartment.apart_total_room} phòng ngủ</span>
						</div>
						<div className="flex items-center">
							<Bath className="mr-1 h-4 w-4 text-pink-500" />
							<span>{apartment.apart_total_toilet} nhà vệ sinh</span>
						</div>
					</div>
				</div>
			</CardContent>
			<Separator />
			{full && (
				<CardFooter className="flex items-center justify-between p-4">
					<div className="flex items-center">
						<Avatar className="mr-2 h-8 w-8 border-2 border-pink-100">
							<AvatarImage src={apartment.user.usr_avatar} />
							<AvatarFallback className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
								TX
							</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium">{apartment.user.usr_name}</p>
							<p className="text-xs text-muted-foreground">
								{apartment.user.usr_totals_apartment} tin đã đăng
							</p>
						</div>
					</div>

					<NavLink to={"/profile/" + apartment.user.usr_id}>
						<Button
							size="sm"
							variant="outline"
							className="border-pink-200 text-pink-600 hover:bg-pink-50"
						>
							Xem trang
						</Button>
					</NavLink>
				</CardFooter>
			)}
		</Card>
	);
}
