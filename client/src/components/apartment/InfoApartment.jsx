import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Bath,
  Bed,
  Bookmark,
  Clock,
  Home,
  Mail,
  MapPin,
  Maximize,
  Phone,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';

import CommentApi from '@/api/comment.api';
import FavoriteApi from '@/api/favorite.api';
import ReportApartmentApi from '@/api/reportApartment.api';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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

import PaginationComponent from '../PaginationComponent';
import Rating from '../Rating';
import { Textarea } from '../ui/textarea';
import VerifiedMediaViewer from '../verify-apartment/verified-media-viewer';
import SliderApartment from './SliderApartment';

export const InfoApartment = ({ apartment }) => {
	const [isBookmarked, setIsBookmarked] = useState(false);
	const [rate, setRate] = useState(0);
	const [comments, setComments] = useState(null);
	const [filterComment, setFilterComment] = useState({
		page: 1,
		limit: 10,
	});
	const [totalComment, setTotalComment] = useState(null);
	const [report, setReport] = useState(null);
	const user = useSelector((state) => state.user);
	const textArea = useRef(null);
	async function handleBookmark() {
		if (!user) {
			toast.error("Vui lòng đăng nhập để thực hiện thao tác này", {
				duration: 1000,
			});
			return;
		}
		if (user.usr_id == apartment.usr_id) {
			toast.error("Không thể thực hiện thao tác này với tin đăng của bạn", {
				duration: 1000,
			});
			return;
		}

		if (isBookmarked) {
			const res = await FavoriteApi.removeFavoriteApartment(apartment.apart_id);
			if (res?.status === 200) {
				setIsBookmarked(false);
			}
		} else {
			const res = await FavoriteApi.storeFavoriteApartment(apartment.apart_id);
			if (res?.status === 201) {
				setIsBookmarked(true);
			}
		}
	}
	const handlePageChangeComment = async (filter) => {
		const response = await CommentApi.getCommentById(apartment.apart_id, filter);
		if (response?.status === 200) {
			setComments(response.metadata.data.comments);
		}
	};
	const handlePostComment = async () => {
		if (!textArea.current.value || !rate) {
			toast.error("Vui lòng nhập bình luận và đánh giá", {
				duration: 1000,
			});
			return;
		}
		const response = await CommentApi.createComment(apartment.apart_id, {
			cmt_content: textArea.current.value,
			cmt_rate: rate,
		});
		if (response?.status === 201) {
			textArea.current.value = "";
			setRate(0);
			toast.success("Bình luận thành công", {
				duration: 1000,
			});
			setComments((prev) => [
				{
					...response.metadata.data,
					user: {
						usr_id: user.usr_id,
						usr_name: user.usr_name,
						usr_avatar: user.usr_avatar,
					},
				},
				...prev,
			]);
		}
	};
	useEffect(() => {
		async function checkIsBookmarked() {
			const res = await FavoriteApi.getFavoriteApartment(apartment.apart_id);
			if (res?.status === 200) {
				setIsBookmarked(true);
			}
		}
		async function getReport() {
			if (report) return;
			const res = await ReportApartmentApi.getReportById({
				apart_id: apartment.apart_id,
			});
			if (res?.status === 200) {
				setReport(res.metadata.data);
			}
		}
		async function getComments() {
			if (comments) return;
			const res = await CommentApi.getCommentById(apartment.apart_id, filterComment);
			if (res?.status === 200) {
				setComments(res.metadata.data.comments);
				setTotalComment(res.metadata.data.totalCount);
			}
		}
		Promise.all([
			getComments(),
			...(user?.usr_id && user.usr_role !== ENUM_ROLE.ADMIN
				? [checkIsBookmarked(), getReport()]
				: []),
		]);
	}, [user?.id]);
	const handleReport = async () => {
		if (report?.report_id) {
			const res = await ReportApartmentApi.updateReport({
				report_id: report.report_id,
				report_content: report.report_content,
			});
			if (res?.status === 200) {
				toast.success("Cập nhật báo cáo thành công");
			}
		} else {
			const res = await ReportApartmentApi.createReport({
				report_apart_id: apartment.apart_id,
				report_content: report.report_content,
			});
			if (res?.status === 201) {
				toast.success("Báo cáo thành công");
				setReport(res.metadata.data);
			}
		}
	};
	return (
		<div className="w-full mx-auto">
			{/* Header */}
			<div className="flex flex-col gap-4 mb-8">
				<div className="flex flex-col gap-4">
					<h1 className="text-2xl text-rose-500 font-medium">{apartment.apart_title}</h1>
					<div className="flex flex-col md:flex-row md:items-center gap-3">
						<time className="flex text-xs text-gray-500 gap-2">
							<Clock className="h-4 w-4" />
							Cập nhật {formatTimeAgo(apartment.updatedAt)}
						</time>
						<div className="flex items-center gap-2 flex-wrap">
							<Badge variant="outline" className="bg-green-50 text-green-500 hover:bg-green-50">
								{ENUM_STRING_APARTMENT_TYPE[apartment.apart_type]}
							</Badge>
							<Badge variant="outline" className="bg-blue-50 text-blue-500 hover:bg-blue-50">
								{ENUM_STRING_APARTMENT_CATEGORIES[apartment.apart_category]}
							</Badge>
							{(ENUM_ROLE.ADMIN == user?.usr_role || apartment?.usr_id == user.usr_id) && (
								<Badge className="bg-red-500">
									{ENUM_STRING_STATUS_APARTMENT[apartment.apart_status]}
								</Badge>
							)}
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 text-muted-foreground">
					<MapPin className="h-4 w-4 flex-grow-0 flex-shrink-0" />
					<span>{`${apartment.apart_address}, ${getLocationString(
						apartment.apart_city,
						apartment.apart_district,
						apartment.apart_ward,
					)} `}</span>
				</div>
			</div>
			<div className="flex gap-3 my-3 md:flex-row flex-col">
				<SliderApartment apartImages={apartment.images} className={"flex-1"} />
				<Card className="border-none top-4 h-fit">
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-6">
							<div>
								<p className="text-sm text-muted-foreground">Giá thuê</p>
								<p className="text-3xl font-bold text-rose-500">
									{formatCurrency(apartment.apart_price)}
								</p>
								<p>{apartment.apart_price > 0 ? "/tháng" : "Miễn phí"}</p>
							</div>
							<div className="flex">
								{rate >= 0 && (
									<Rating
										rate={
											comments?.length > 0
												? comments.reduce((acc, cur) => acc + cur.cmt_rate, 0) / comments.length
												: 0
										}
									/>
								)}
							</div>
						</div>

						<div className="border-t border-b py-4 mb-6">
							<NavLink
								to={"/profile/" + apartment.user.usr_id}
								className="flex items-center gap-3 mb-4"
							>
								<Avatar className="mr-2 size-12 border-2 border-pink-100">
									<AvatarImage src={apartment.user.usr_avatar} className="object-cover" />
									<AvatarFallback className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
										US
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{apartment.user.usr_name}</p>
									<p className="text-sm text-muted-foreground">
										Tài khoản tạo từ {formatTimeAgo(apartment.user.createdAt)}
									</p>
								</div>
							</NavLink>

							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-rose-500" />
									<span>{apartment.user.usr_phone ?? "Chưa cập nhật"}</span>
								</div>
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-rose-500" />
									<span>{apartment.user.usr_email}</span>
								</div>
							</div>
						</div>

						<div className="space-y-4 flex flex-col">
							<a href={`tel:${apartment.user.usr_phone}`} className="block" title="Gọi điện">
								<Button className="w-full bg-rose-500">
									<Phone className="h-4 w-4 mr-2" />
									Gọi điện
								</Button>
							</a>
							<Button
								className={cn(isBookmarked ? "bg-yellow-400 text-white" : "hover:bg-yellow-400")}
								variant="outline"
								onClick={handleBookmark}
							>
								<Bookmark className="h-4 w-4" />
								{isBookmarked ? "Đã lưu" : "Lưu tin"}
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
			{apartment.verify_apartment_media?.length > 0 && (
				<VerifiedMediaViewer media={apartment.verify_apartment_media} />
			)}
			{/* Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2">
					<Tabs defaultValue="details" className="mb-8">
						<TabsList className="mb-4">
							<TabsTrigger value="details">Chi tiết</TabsTrigger>
							<TabsTrigger value="reviews">Đánh giá</TabsTrigger>
							<TabsTrigger value="report">Báo cáo</TabsTrigger>
						</TabsList>

						<TabsContent value="details" className="space-y-6">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<Card>
									<CardContent className="flex flex-col items-center justify-center p-4 text-center">
										<Maximize className="h-5 w-5 text-rose-500 mb-2" />
										<p className="text-sm text-muted-foreground">Diện tích</p>
										<p className="font-medium">
											{apartment.apart_area}m<sup>2</sup>
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="flex flex-col items-center justify-center p-4 text-center">
										<Bed className="h-5 w-5 text-rose-500 mb-2" />
										<p className="text-sm text-muted-foreground">Phòng ngủ</p>
										<p className="font-medium">{apartment.apart_total_room}</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="flex flex-col items-center justify-center p-4 text-center">
										<Bath className="h-5 w-5 text-rose-500 mb-2" />
										<p className="text-sm text-muted-foreground">Nhà vệ sinh</p>
										<p className="font-medium">{apartment.apart_total_toilet}</p>
									</CardContent>
								</Card>
								<Card>
									<CardContent className="flex flex-col items-center justify-center p-4 text-center">
										<Home className="h-5 w-5 text-rose-500 mb-2" />
										<p className="text-sm text-muted-foreground">Loại hình</p>
										<p className="font-medium">
											{ENUM_STRING_APARTMENT_CATEGORIES[apartment.apart_category]}
										</p>
									</CardContent>
								</Card>
							</div>

							<div>
								<h2 className="text-xl font-semibold mb-4">Mô tả chi tiết</h2>
								<div className="prose max-w-none">
									<p>{apartment.apart_description}</p>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="reviews">
							<div className="space-y-6">
								<div className="flex items-center gap-2">
									{rate >= 0 && (
										<Rating
											rate={
												comments?.length > 0
													? comments.reduce((acc, cur) => acc + cur.cmt_rate, 0) / comments.length
													: 0
											}
										/>
									)}
									<span className="text-muted-foreground">{`(${
										comments?.length > 0
											? (
													comments.reduce((acc, cur) => acc + cur.cmt_rate, 0) / comments.length
											  ).toFixed(1)
											: 0
									}/5)`}</span>
								</div>

								<div className="border rounded-lg p-6 space-y-3">
									<h3 className="text-lg font-medium mb-4">Đánh giá của bạn</h3>
									<div className="flex items-center gap-2 mb-4">
										<div className="flex">
											<Rating rate={rate} setRate={setRate} />
										</div>
									</div>
									<Textarea ref={textArea} />
									<Button className="bg-blue-400" onClick={handlePostComment}>
										Bình luận
									</Button>
								</div>
								<div className="space-y-3">
									{comments?.map((comment) => (
										<NavLink
											to={"/profile/" + comment.usr_id}
											key={comment.cmt_id}
											className="flex gap-4 hover:bg-gray-100 p-2 rounded-md border border-gray-200"
										>
											<Avatar className="h-12 w-12">
												<AvatarImage src={comment.user.usr_avatar} className="object-cover" />
												<AvatarFallback className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
													US
												</AvatarFallback>
											</Avatar>
											<div>
												<h4 className="text-base">{comment.user.usr_name}</h4>
												<Rating rate={comment.cmt_rate} className={"size-3"} />
												<p className="mt-3">{comment.cmt_content}</p>
											</div>
											<hr />
										</NavLink>
									))}
								</div>
								<PaginationComponent
									total={totalComment}
									filter={filterComment}
									setFilter={(arg) => {
										setFilterComment(arg);
										handlePageChangeComment(arg);
									}}
								/>
							</div>
						</TabsContent>
						<TabsContent value="report">
							<div className="space-y-6">
								<div className="border rounded-lg p-6">
									<h3 className="text-lg font-medium mb-4">Báo cáo tin đăng</h3>

									<textarea
										className="w-full p-2 border border-gray-300 rounded-lg"
										placeholder="Nội dung báo cáo..."
										value={report?.report_content}
										onChange={(e) => setReport({ ...report, report_content: e.target.value })}
									></textarea>
									<Button type="button" className="bg-rose-400" onClick={handleReport}>
										{!report?.report_id ? "Gửi" : "Cập nhật"}
									</Button>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>

				{/* Sidebar */}
			</div>
		</div>
	);
};
