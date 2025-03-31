import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Check,
  FileVideo,
  ImageIcon,
  MoreVertical,
  Plus,
  X,
  XIcon,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import VerifyApartmentApi from '@/api/verifyApartment.api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  ENUM_STATUS_STRING_VERIFY_APARTMENT,
  ENUM_STATUS_VERIFY_APARTMENT,
  ENUM_STYLE_VERIFY_APARTMENT,
} from '@/constant';
import { cn } from '@/lib/utils';
import {
  config,
  formatDate,
} from '@/utils';

import Loading from '../Loading';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../ui/avatar';

export default function VerifyApartmentTable({ isAdmin = false }) {
	const [requests, setRequests] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedRequest, setSelectedRequest] = useState(null);
	const [approveDialogOpen, setApproveDialogOpen] = useState(false);
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
	const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
	const [selectedMedia, setSelectedMedia] = useState(null);
	const [media, setMedia] = useState([]);
	const [rejectionReason, setRejectionReason] = useState("");

	const fileInputRef = useRef(null);

	const handleApprove = (request) => {
		setSelectedRequest(request);
		setMedia([]);
		setApproveDialogOpen(true);
	};

	const handleReject = (request) => {
		setSelectedRequest(request);
		setRejectionReason("");
		setRejectDialogOpen(true);
	};

	const handleFileChange = (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		if (media.length + files.length > 5) {
			alert("Bạn chỉ có thể thêm tối đa 5 tệp phương tiện!");
			return;
		}

		const newMedia = [];

		Array.from(files).forEach((file) => {
			// Create object URL for preview
			const url = URL.createObjectURL(file);
			const type = file.type.startsWith("image/") ? "image" : "video";

			newMedia.push({
				id: Date.now() + Math.random(),
				name: file.name,
				url: url,
				type: type,
				file: file,
			});
		});

		setMedia([...media, ...newMedia]);

		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleAddMedia = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleRemoveMedia = (id) => {
		setMedia(media.filter((item) => item.id !== id));
	};

	const confirmApprove = async () => {
		if (selectedRequest) {
			const formData = new FormData();
			media.forEach((item) => {
				formData.append("files", item.file);
			});
			const res = await VerifyApartmentApi.approveApartment(selectedRequest.ver_id, formData);
			if (res.status == 201) {
				setRequests(
					requests.map((req) =>
						req.ver_id === selectedRequest.ver_id
							? {
									...req,
									ver_status: ENUM_STATUS_VERIFY_APARTMENT.DONE,
									apartment: {
										...req.apartment,
										verify_apartment_media: [...media],
									},
							  }
							: req,
					),
				);
				setApproveDialogOpen(false);
			}
		}
	};

	const confirmReject = async () => {
		if (selectedRequest && rejectionReason.trim()) {
			const result = await VerifyApartmentApi.rejectApartment(
				selectedRequest.ver_id,
				rejectionReason,
			);
			if (result.status === 201) {
				setRequests(
					requests.map((req) =>
						req.ver_id === selectedRequest.ver_id
							? {
									...req,
									ver_status: ENUM_STATUS_VERIFY_APARTMENT.REJECTED,
									ver_reason: rejectionReason,
							  }
							: req,
					),
				);
				setRejectDialogOpen(false);
			}
		} else {
			alert("Vui lòng nhập lý do từ chối!");
		}
	};

	const openMediaViewer = (media) => {
		setSelectedMedia(media);
		setMediaViewerOpen(true);
	};
	useEffect(() => {
		const fetchData = async () => {
			const res = await VerifyApartmentApi.getVerifyApartments();
			if (res.status == 200) {
				setRequests(res.metadata.data);
			}
		};
		!requests && fetchData().then(() => setIsLoading(false));
	}, []);
	if (isLoading) {
		return <Loading></Loading>;
	}
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-2xl font-bold mb-6">Danh Sách Yêu Cầu</h1>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Tin đăng</TableHead>
						{isAdmin && <TableHead>Người đăng</TableHead>}
						<TableHead>Ngày</TableHead>
						<TableHead>Trạng Thái</TableHead>
						<TableHead>Hành Động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{requests
						? requests?.map((request) => (
								<TableRow key={request.ver_id}>
									<TableCell>{request.ver_id}</TableCell>
									<TableCell>
										<NavLink
											to={`/apartment/${request.apartment.apart_id}`}
											className={"text-blue-500 line-clamp-1 inline-block"}
										>
											{request.apartment.apart_title}
										</NavLink>
									</TableCell>
									{isAdmin && (
										<TableCell>
											<NavLink
												to={`/user/${request.user.usr_id}`}
												className="hover:text-blue-500 flex items-center"
											>
												<Avatar className="mr-2 h-8 w-8 border-2 border-pink-100">
													<AvatarImage src={request.user.usr_avatar} />
													<AvatarFallback className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
														US
													</AvatarFallback>
												</Avatar>
												{request.user.usr_name}
											</NavLink>
										</TableCell>
									)}
									<TableCell>{formatDate(request.createdAt)}</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className={cn(ENUM_STYLE_VERIFY_APARTMENT[request.ver_status])}
										>
											{ENUM_STATUS_STRING_VERIFY_APARTMENT[request.ver_status]}
										</Badge>
									</TableCell>
									<TableCell>
										{isAdmin && request.ver_status === ENUM_STATUS_VERIFY_APARTMENT.PENDING && (
											<div className="flex space-x-2">
												<Button
													size="sm"
													variant="outline"
													className="border-green-500 text-green-500 hover:bg-green-50"
													onClick={() => handleApprove(request)}
												>
													<Check className="h-4 w-4 mr-1" />
													Duyệt
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="border-red-500 text-red-500 hover:bg-red-50"
													onClick={() => handleReject(request)}
												>
													<XIcon className="h-4 w-4 mr-1" />
													Từ chối
												</Button>
											</div>
										)}
										{request.ver_status === ENUM_STATUS_VERIFY_APARTMENT.REJECTED &&
											request.ver_reason && (
												<div className="max-w-xs">
													<p className="text-sm font-medium text-red-600">Lý do từ chối:</p>
													<p className="text-sm text-gray-600">{request.ver_reason}</p>
												</div>
											)}
										{request.ver_status === ENUM_STATUS_VERIFY_APARTMENT.DONE &&
											request.apartment.verify_apartment_media.length > 0 && (
												<div>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="icon">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																className="font-medium text-xs text-muted-foreground"
																disabled
															>
																Xem phương tiện ({request.apartment.verify_apartment_media.length})
															</DropdownMenuItem>
															{request.apartment.verify_apartment_media.map((item) => (
																<DropdownMenuItem
																	key={item?.vam_id ?? item.id}
																	onClick={() => openMediaViewer(item)}
																>
																	<div className="flex items-center">
																		{item.type === "image" ? (
																			<ImageIcon className="h-4 w-4 mr-2" />
																		) : (
																			<FileVideo className="h-4 w-4 mr-2" />
																		)}
																		<span className="truncate max-w-[150px]">{item.vam_url}</span>
																	</div>
																</DropdownMenuItem>
															))}
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											)}
									</TableCell>
								</TableRow>
						  ))
						: null}
				</TableBody>
			</Table>

			{/* Approve Dialog */}
			<Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Duyệt Yêu Cầu</DialogTitle>
						<DialogDescription>
							Thêm tệp phương tiện cho yêu cầu này (tối đa 5 tệp)
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="flex justify-between items-center">
							<Label>Tệp phương tiện ({media.length}/5)</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleAddMedia}
								disabled={media.length >= 5}
							>
								<Plus className="h-4 w-4 mr-1" />
								Thêm tệp
							</Button>
							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileChange}
								className="hidden"
								accept="image/*,video/*"
								multiple
							/>
						</div>

						{media.length > 0 ? (
							<div className="grid grid-cols-2 gap-4">
								{media.map((item) => (
									<div key={item.id} className="relative border rounded-md p-2">
										{item.type === "image" ? (
											<img
												src={item.url || "/placeholder.svg"}
												alt={item.name}
												className="w-full h-24 object-cover rounded"
											/>
										) : (
											<div className="relative w-full h-24 rounded overflow-hidden">
												<video
													src={item.url}
													className="w-full h-24 object-cover"
													muted
													preload="metadata"
												/>
												<FileVideo className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-white opacity-70" />
												<div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-60 text-white text-xs p-1 truncate">
													{item.name}
												</div>
											</div>
										)}
										<p className="text-sm mt-1 truncate">{item.name}</p>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute top-1 right-1 h-6 w-6 bg-white rounded-full"
											onClick={() => handleRemoveMedia(item.id)}
										>
											<X className="h-3 w-3" />
										</Button>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-8 text-muted-foreground">
								Chưa có tệp phương tiện nào được thêm
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
							Hủy
						</Button>
						<Button onClick={confirmApprove}>Xác nhận duyệt</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Reject Dialog */}
			<Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Từ Chối Yêu Cầu</DialogTitle>
						<DialogDescription>Vui lòng nhập lý do từ chối yêu cầu này</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="reason">Lý do từ chối</Label>
							<Textarea
								id="reason"
								placeholder="Nhập lý do từ chối..."
								value={rejectionReason}
								onChange={(e) => setRejectionReason(e.target.value)}
								rows={4}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
							Hủy
						</Button>
						<Button
							variant="destructive"
							onClick={confirmReject}
							disabled={!rejectionReason.trim()}
						>
							Xác nhận từ chối
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Media Viewer Dialog */}
			<Dialog open={mediaViewerOpen} onOpenChange={setMediaViewerOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Xem Phương Tiện</DialogTitle>
						<DialogDescription>{selectedMedia?.vam_url}</DialogDescription>
					</DialogHeader>

					<div className="flex justify-center items-center py-4">
						{selectedMedia?.type === "image" ? (
							<img
								src={
									`${config.VITE_SERVER_URL}upload/files/${selectedMedia.vam_url}` ||
									"/placeholder.svg"
								}
								crossOrigin="anonymous"
								alt={selectedMedia.vam_url}
								className="max-h-[60vh] max-w-full object-contain"
							/>
						) : (
							<video
								src={`${config.VITE_SERVER_URL}upload/files/${selectedMedia?.vam_url}`}
								controls
								crossOrigin="anonymous"
								className="max-h-[60vh] max-w-full"
							>
								Trình duyệt của bạn không hỗ trợ thẻ video.
							</video>
						)}
					</div>

					<DialogFooter>
						<Button onClick={() => setMediaViewerOpen(false)}>Đóng</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
