import React, {
  useEffect,
  useState,
} from 'react';

import {
  Bath,
  BedDouble,
  Bookmark,
  TriangleAlert,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';

import FavoriteApi from '@/api/favorite.api';
import ReportApartmentApi from '@/api/reportApartment.api';
import { Badge } from '@/components/ui/badge';
import {
  ENUM_ROLE,
  ENUM_STRING_APARTMENT_CATEGORIES,
  ENUM_STRING_APARTMENT_TYPE,
  ENUM_STRING_STATUS_APARTMENT,
} from '@/constant';
import { cn } from '@/lib/utils';
import {
  formatTimeAgo,
  getLocationString,
} from '@/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import { MapPin } from '@geist-ui/icons';

import Rating from '../Rating';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

function ImageIcon({ src, alt, size }) {
	return <img alt={alt} src={src} className={cn("object-cover", size)} />;
}
export const InfoApartment = ({ apartment, rate }) => {
	// const [appointment, setAppointment] = useState();
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [open, setOpen] = useState(false);
	const [report, setReport] = useState(null);
	const user = useSelector((state) => state.user);
	async function handleBookmark() {
		if (!user) {
			toast.error("Vui lòng đăng nhập để thực hiện thao tác này", {
				duration: 1000,
			});
			return;
		}
		if (user.usr_id == apartment.usr_id || user.usr_role === ENUM_ROLE.ADMIN) {
			toast.error("Không thể thực hiện thao tác này", {
				duration: 1000,
			});
			return;
		}

		if (isBookmarked) {
			const res = await FavoriteApi.removeFavoriteApartment(apartment.apart_id);
			if (res.status === 200) {
				setIsBookmarked(false);
			}
		} else {
			const res = await FavoriteApi.storeFavoriteApartment(apartment.apart_id);
			if (res.status === 201) {
				setIsBookmarked(true);
			}
		}
	}
	useEffect(() => {
		async function checkIsBookmarked() {
			const res = await FavoriteApi.getFavoriteApartment(apartment.apart_id);
			if (res.status === 200) {
				setIsBookmarked(true);
			}
		}
		async function getReport() {
			if (report) return;
			const res = await ReportApartmentApi.getReportById({
				apart_id: apartment.apart_id,
			});
			if (res.status === 200) {
				setReport(res.metadata.data);
			}
		}
		user.usr_role !== ENUM_ROLE.ADMIN && Promise.all([checkIsBookmarked(), getReport()]);
	}, [user]);
	const handleReport = async () => {
		if (report?.report_id) {
			const res = await ReportApartmentApi.updateReport({
				report_id: report.report_id,
				report_content: report.report_content,
			});
			if (res.status === 200) {
				toast.success("Cập nhật báo cáo thành công");
				setOpen(false);
			}
		} else {
			const res = await ReportApartmentApi.createReport({
				report_apart_id: apartment.apart_id,
				report_content: report.report_content,
			});
			if (res.status === 201) {
				toast.success("Báo cáo thành công");
				setReport(res.metadata.data);
				setOpen(false);
			}
		}
	};
	return (
		<div className="md:w-1/2 space-y-3">
			<div className="flex items-center">
				<h1 className="text-2xl line-clamp-2 text-ellipsis overflow-hidden">
					{apartment.apart_title}
				</h1>
				<div className="ml-auto cursor-pointer flex gap-2">
					<Bookmark
						className={cn(
							isBookmarked
								? "fill-yellow-300 text-yellow-300 hover:text-gray-300 hover:fill-gray-300"
								: "hover:fill-yellow-300 hover:text-yellow-300 fill-gray-300 text-gray-300",
						)}
						onClick={handleBookmark}
					/>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<TriangleAlert className="text-red-500 size-6" />
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Báo cáo</DialogTitle>
								<DialogDescription>Vui lòng nhập nội dung khiếu nại</DialogDescription>
							</DialogHeader>
							<textarea
								className="w-full p-2 border border-gray-300 rounded-lg"
								placeholder="Nội dung khiếu nại"
								value={report?.report_content}
								onChange={(e) => setReport({ ...report, report_content: e.target.value })}
							></textarea>
							<DialogFooter>
								<Button type="button" className="bg-blue-400" onClick={handleReport}>
									{!report?.report_id ? "Gửi" : "Cập nhật"}
								</Button>
								{/* {report && (
									<Button type="button" className="bg-red-500" onClick={() => setReport(null)}>
										Xóa báo cáo
									</Button>
								)} */}
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<div className="flex gap-2 my-2">
				<Badge className={"bg-green-400 hover:bg-green-400"}>
					{ENUM_STRING_APARTMENT_TYPE[apartment.apart_type]}
				</Badge>
				<Badge className={"bg-blue-400 hover:bg-blue-400"}>
					{ENUM_STRING_APARTMENT_CATEGORIES[apartment.apart_category]}
				</Badge>
			</div>
			<time className="block text-xs text-gray-500">
				Cập nhật {formatTimeAgo(apartment.updatedAt)}
			</time>
			{rate >= 0 && <Rating rate={rate} className={"size-4"} />}
			{(ENUM_ROLE.ADMIN == user?.usr_role || apartment?.usr_id == user.usr_id) && (
				<Badge className="bg-red-500">{ENUM_STRING_STATUS_APARTMENT[apartment.apart_status]}</Badge>
			)}
			<p className="font-medium text-sm flex items-center gap-2">
				<ImageIcon src={"/icons/price_m2.png"} alt={"price/m2"} size={"size-5"} />
				<span>
					{formatCurrency(apartment.apart_price)}
					{apartment.apart_price > 0 ? "/tháng" : "Miễn phí"}
				</span>
			</p>
			<p className="font-medium text-sm flex items-center gap-2">
				<ImageIcon src={"/icons/size.png"} alt={"area"} size={"size-5"} />
				<span>
					{apartment.apart_area}m<sup>2</sup>
				</span>
			</p>
			<p className="flex items-center gap-2 text-gray-500 text-sm font-medium">
				<BedDouble size={20} />
				{apartment.apart_total_room} phòng ngủ
			</p>
			<p className="flex items-center gap-2 text-gray-500 text-sm font-medium">
				<Bath size={20} />
				{apartment.apart_total_toilet} nhà vệ sinh
			</p>
			<p className="text-sm text-gray-600 my-2 flex items-center gap-1">
				<MapPin />
				{`${apartment.apart_address}, ${getLocationString(
					apartment.apart_city,
					apartment.apart_district,
					apartment.apart_ward,
				)} `}
			</p>
			<p className="text-gray-600 text-sm">
				Gồm: {apartment.apart_total_room} PN - {apartment.apart_total_toilet} VS
			</p>
			<NavLink
				to={"/user/profile/" + apartment.user.usr_id}
				className={"flex gap-3 text-sm text-gray-500 mt-2 border border-gray-300 p-4 rounded-lg"}
			>
				<div className="flex-shrink-0 border border-gray-500 rounded-full size-10 overflow-hidden">
					<img className="size-full object-cover" src={apartment.user.usr_avatar} />
				</div>
				<div className="flex justify-center flex-col">
					<p className="text-black font-medium">{apartment.user.usr_name}</p>
					<p>{apartment.user.usr_totals_apartment} tin đăng đã đăng</p>
					<p>Đỉa chỉ: {apartment.user.usr_address ?? "Chưa cập nhật"}</p>
					<p>Số điện thoại: {apartment.user.usr_phone ?? "Chưa cập nhật"}</p>
					<p>Địa chỉ email: {apartment.user.usr_email}</p>
					<p>Tài khoản tạo từ {formatTimeAgo(apartment.user.createdAt)}</p>
				</div>
			</NavLink>
		</div>
	);
};
