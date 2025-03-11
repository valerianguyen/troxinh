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
import Stats from '@/components/user/Stats';
import {
  ENUM_ACTION,
  ENUM_STRING_PRIORY,
  ENUM_STRING_STATUS_APARTMENT,
} from '@/constant';
import {
  getLocationString,
  toLocaleString,
} from '@/utils';

import DialogBoosted from './components/DialogBoosted';

export default function Apartment() {
	const [apartments, setApartments] = useState(null);
	const [stat, setStat] = useState(null);
	const [total, setTotal] = useState(null);
	const [config, setConfig] = useState(null);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 10,
	});

	useEffect(() => {
		const fetchApartment = async () => {
			if (filter?.apart_status === -1) delete filter.apart_status;
			const response = await ApartmentApi.getMyApartment(filter);
			if (response.status === 200) {
				setApartments(response.metadata.data.apartments);
				setTotal(response.metadata.data.totalCount);
				setStat(response.metadata.data.statData);
			}
		};
		const fetchConfig = async () => {
			const response = await ApartmentApi.getConfigAmountPriority();
			if (response.status === 200) {
				setConfig(response.metadata.data);
			}
		};
		Promise.all([fetchApartment(), ...(!config ? [fetchConfig()] : [])]);
	}, [filter.page]);
	const handleFilter = async () => {
		if (filter?.apart_status === -1) delete filter.apart_status;
		const response = await ApartmentApi.getMyApartment(filter);

		if (response.status === 200) {
			setApartments(response.metadata.data.apartments);
			setTotal(response.metadata.data.totalCount);
			setFilter({ ...filter, page: 1 });
		}
	};
	const submitDelete = async (userId, apart_id) => {
		const res = await ApartmentApi.deleteApartment(apart_id);
		if (res.status === 200) {
			setApartments((prev) => prev.filter((apart) => apart.apart_id !== apart_id));
			toast.success("Xóa căn hộ thành công", {
				duration: 1000,
			});
		}
	};

	return (
		<div className="p-4">
			{stat && <Stats stat={stat} />}
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
					<NavLink to="/user/apartment/add">
						<Button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
							Thêm căn hộ
						</Button>
					</NavLink>
				</div>
			</div>

			<div className="overflow-auto">
				<Table className={"mt-3"}>
					<TableHeader>
						<TableRow>
							<TableHead className="min-w-[100px]">Hình ảnh</TableHead>
							<TableHead className="min-w-[120px]">Tên căn hộ</TableHead>
							<TableHead className="min-w-24">Diện tích</TableHead>
							<TableHead className="min-w-24">Số phòng</TableHead>
							<TableHead className="min-w-24">Số toilet</TableHead>
							<TableHead className="min-w-[100px]">Địa chỉ</TableHead>
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
								<TableCell className="truncate max-w-[200px]">{apartment.apart_title}</TableCell>
								<TableCell className="min-w-24">{apartment.apart_area}</TableCell>
								<TableCell className="min-w-24">{apartment.apart_total_room}</TableCell>
								<TableCell className="min-w-24">{apartment.apart_total_toilet}</TableCell>
								<TableCell className="min-w-[200px]">
									{getLocationString(
										apartment.apart_city,
										apartment.apart_district,
										apartment.apart_ward,
									)}
								</TableCell>
								<TableCell className="min-w-[150px]">
									{ENUM_STRING_PRIORY[apartment.apart_priority]}
								</TableCell>
								<TableCell className="min-w-[150px]">
									<span>
										{apartment.apart_expired_date
											? formatDistance(new Date(apartment.apart_expired_date), new Date(), {
													addSuffix: true,
													locale: vi,
											  })
											: "Trọn đời"}
									</span>
								</TableCell>
								<TableCell>{toLocaleString(apartment.createdAt).slice(9)}</TableCell>
								<TableCell className="min-w-[150px]">
									{ENUM_STRING_STATUS_APARTMENT[apartment.apart_status]}
								</TableCell>
								<TableCell className="min-w-[150px]">
									{apartment.apart_report_reason ? (
										<div className="flex items-center gap-2">
											<Badge className="bg-red-500">Lý do khóa</Badge>
											<p>{apartment.apart_report_reason}</p>
										</div>
									) : (
										<div className="flex gap-2">
											<NavLink to={`/apartment/${apartment.apart_id}`}>
												<Button className="bg-blue-500 min-w-20">Chi tiết</Button>
											</NavLink>
											<NavLink to={`/user/apartment/edit/${apartment.apart_id}`}>
												<Button className="bg-yellow-400 min-w-20">Sửa</Button>
											</NavLink>
											<ActionDialog
												action={ENUM_ACTION.DELETE}
												title={"căn hộ " + apartment.apart_title}
												color="bg-red-500"
												submit={submitDelete}
												id={apartment.apart_id}
											/>
											<DialogBoosted
												config={config}
												endDate={apartment.apart_expired_date}
												currentPriority={apartment.apart_priority}
												apart_id={apartment.apart_id}
											/>
										</div>
									)}
								</TableCell>
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
