import {
  useEffect,
  useState,
} from 'react';

import { formatDistance } from 'date-fns';
import { vi } from 'date-fns/locale';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';

import ApartmentApi from '@/api/apartment.api';
import { ActionDialog } from '@/components/ActionDialog';
import PaginationComponent from '@/components/PaginationComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ENUM_ACTION,
  ENUM_STRING_PRIORY,
  ENUM_STRING_STATUS_APARTMENT,
} from '@/constant';
import { toLocaleString } from '@/utils';

export default function ManageApartment() {
	const [apartments, setApartments] = useState(null);
	const [total, setTotal] = useState(null);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 10,
	});
	const submitDelete = async (userId, apart_id) => {
		const res = await ApartmentApi.deleteApartment(apart_id);
		if (res.status === 200) {
			setApartments((prev) => prev.filter((apart) => apart.apart_id !== apart_id));
			toast.success("Xóa tin đăng thành công", {
				duration: 1000,
			});
		}
	};
	const submitPublish = async (userId, apart_id) => {
		const res = await ApartmentApi.publishApartment(userId, apart_id);
		if (res.status === 200) {
			setApartments((prev) =>
				prev.map((apart) => (apart.apart_id === apart_id ? { ...apart, apart_status: 1 } : apart)),
			);
			toast.success("Công khai tin đăng thành công", {
				duration: 1000,
			});
		}
	};
	// const submitUnPublish = async (userId, apart_id) => {
	// 	const res = await ApartmentApi.unPublishApartment(userId, apart_id);
	// 	if (res.status === 200) {
	// 		setApartments((prev) =>
	// 			prev.map((apart) => (apart.apart_id === apart_id ? { ...apart, apart_status: 0 } : apart)),
	// 		);
	// 		toast.success("Gỡ công khai tin đăng thành công", {
	// 			duration: 1000,
	// 		});
	// 	}
	// };
	const submitBlock = async (userId, apart_id, reason) => {
		const res = await ApartmentApi.blockApartment(userId, apart_id, reason);
		if (res.status === 200) {
			setApartments((prev) =>
				prev.map((apart) =>
					apart.apart_id === apart_id ? { ...apart, apart_status: 2, apart_report_reason: reason } : apart,
				),
			);
			toast.success("Block tin đăng thành công", {
				duration: 1000,
			});
		}
	};

	useEffect(() => {
		const fetchApartment = async () => {
			if (filter?.apart_status === -1) delete filter.apart_status;
			const response = await ApartmentApi.searchApartment(filter);
			if (response.status === 200) {
				setApartments(response.metadata.data.apartments);
				setTotal(response.metadata.data.totalCount);
			}
		};
		fetchApartment();
	}, [filter.page]);
	const handleFilter = async () => {
		if (filter?.apart_status === -1) delete filter.apart_status;
		const response = await ApartmentApi.searchApartment(filter);
		if (response.status === 200) {
			setApartments(response.metadata.data.apartments);
			setTotal(response.metadata.data.totalCount);
			setFilter({ ...filter, page: 1 });
		}
	};

	return (
		<div className="p-4 container mx-auto">
			<div className="flex flex-wrap gap-3">
				<div className="flex-1 w-full sm:min-w-[300px]">
					<input
						type="text"
						onChange={(e) => setFilter({ ...filter, apart_title_like: e.target.value })}
						placeholder="Tìm kiếm"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
				<div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 w-full sm:w-[300px]">
					<label
						htmlFor="apart_status"
						className="block text-sm font-medium text-gray-700 mb-1 min-w-[100px]"
					>
						Trạng thái
					</label>
					<select
						onChange={(e) => setFilter({ ...filter, apart_status: parseInt(e.target.value) })}
						id="apart_status"
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					>
						<option value="-1">Tất cả</option>
						<option value="1">Đã được duyệt</option>
						<option value="0">Chưa thanh toán</option>
						<option value="2">Đã khóa</option>
					</select>
				</div>
				<div className="flex gap-3">
					<Button
						onClick={handleFilter}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
					>
						Tìm kiếm
					</Button>
				</div>
			</div>

			<div className="h-[calc(100vh-225px)] overflow-auto">
				<Table className={"mt-3"}>
					<TableHeader>
						<TableRow>
							<TableHead className="min-w-[100px]">Hình ảnh</TableHead>
							<TableHead className="min-w-[120px]">Tên tin đăng</TableHead>
							<TableHead>
								<span className="w-max inline-block">Độ ưu tiên</span>
							</TableHead>
							<TableHead>
								<span className="w-max inline-block">Thời hạn tin đăng</span>
							</TableHead>
							<TableHead>Ngày tạo</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead>Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{apartments?.map((apartment) => (
							<TableRow key={apartment.apart_id}>
								<TableCell className="min-w-[200px]">
									<img
										src={apartment.images[0].img_url}
										alt="apartment"
										className="w-20 h-20 object-cover"
									/>
								</TableCell>
								<TableCell className="truncate max-w-[200px]">
									<NavLink to={`/apartment/${apartment.apart_id}`}>{apartment.apart_title}</NavLink>
								</TableCell>
								<TableCell className="min-w-[150px]">
									{ENUM_STRING_PRIORY[apartment.apart_priority]}
								</TableCell>
								<TableCell className="min-w-[150px]">
									<span>
										{apartment.apart_expired_date ? formatDistance(new Date(apartment.apart_expired_date),new Date(), {
											addSuffix: true,
											locale: vi,
										}) : "Trọn đời"}
									</span>
								</TableCell>
								<TableCell>{toLocaleString(apartment.createdAt).slice(9)}</TableCell>
								<TableCell className="min-w-[150px]">
									{ENUM_STRING_STATUS_APARTMENT[apartment.apart_status]}
								</TableCell>
								{apartment.apart_status !== 2 ? (
									<TableCell className="min-w-[150px]">
										<div className="flex gap-2">
											<ActionDialog
												action={ENUM_ACTION.DELETE}
												title={`bài đăng ${apartment.apart_title}`}
												color={"bg-red-500"}
												submit={submitDelete}
												id={apartment.apart_id}
											/>
											<ActionDialog
												action={ENUM_ACTION.PUBLISH}
												title={`bài đăng ${apartment.apart_title}`}
												color={"bg-green-500"}
												submit={submitPublish}
												id={apartment.apart_id}
												userId={apartment.user.usr_id}
											/>

											<ActionDialog
												action={ENUM_ACTION.BLOCK}
												title={`bài đăng ${apartment.apart_title}`}
												color={"bg-yellow-400"}
												submit={submitBlock}
												id={apartment.apart_id}
												userId={apartment.user.usr_id}
											/>
										</div>
									</TableCell>
								) : (
									<TableCell>
										<div className='flex items-center gap-2'>
											<Badge className="bg-red-500">Lý do khóa</Badge>
											<p>{apartment.apart_report_reason}</p>
										</div>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<PaginationComponent
				total={total}
				filter={filter}
				setFilter={setFilter}
				handleFilter={handleFilter}
			/>
		</div>
	);
}
