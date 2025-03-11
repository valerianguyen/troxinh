import {
  useEffect,
  useState,
} from 'react';

import { NavLink } from 'react-router-dom';

import OrderApi from '@/api/order.api';
import PaginationComponent from '@/components/PaginationComponent';
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
  ENUM_COLOR_ORDER,
  ENUM_STRING_ORDER,
} from '@/constant';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils';
import { formatCurrency } from '@/utils/formatCurrency';

import { Badge } from '../ui/badge';

export default function OrderTableView() {
	const [orders, setOrders] = useState(null);
	const [total, setTotal] = useState(null);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 10,
	});

	useEffect(() => {
		const fetchOrder = async () => {
			if (filter?.order_status === -2) delete filter.order_status;
			const response = await OrderApi.getOrders(filter);
			if (response.status === 200) {
				setOrders(response.metadata.data.orders);
				setTotal(response.metadata.data.totalCount);
			}
		};
		fetchOrder();
	}, [filter.page]);
	const handleFilter = async () => {
		if (filter?.order_status === -2) delete filter.order_status;
		const response = await OrderApi.getOrders(filter);
		if (response.status === 200) {
			setOrders(response.metadata.data.orders);
			setTotal(response.metadata.data.totalCount);
			setFilter({ ...filter, page: 1 });
		}
	};

	return (
		<div className="p-4 container mx-auto">
			<div className="flex flex-wrap gap-3 md:flex-row flex-col">
				<div className="flex-1 w-full">
					<input
						type="text"
						onChange={(e) => setFilter({ ...filter, order_info_like: e.target.value })}
						placeholder="Tìm kiếm"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
				<div className="flex-1 w-full">
					<input
						type="text"
						onChange={(e) => setFilter({ ...filter, order_transaction_no_like: e.target.value })}
						placeholder="Tìm kiếm theo mã giao dịch"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
				<div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 w-full sm:w-[300px]">
					<label
						htmlFor="order_status"
						className="block text-sm font-medium text-gray-700 mb-1 min-w-[100px]"
					>
						Trạng thái
					</label>
					<select
						onChange={(e) => setFilter({ ...filter, order_status: parseInt(e.target.value) })}
						id="order_status"
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					>
						<option value="-2" defaultValue={-2}>
							Tất cả
						</option>
						<option value="1">Thành công</option>
						<option value="0">Đã hủy</option>
						<option value="-1">Thất bại</option>
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

			<div className="overflow-auto">
				<Table className={"mt-3"}>
					<TableHeader>
						<TableRow>
							<TableHead>Mã đơn hàng</TableHead>
							<TableHead>Tin đăng</TableHead>
							<TableHead>Nội dung thanh toán</TableHead>
							<TableHead>Số tiền</TableHead>
							<TableHead>
								<span className="w-max inline-block">Ghi chú</span>
							</TableHead>
							<TableHead>
								<span className="w-max inline-block">Ngày thanh toán</span>
							</TableHead>
							<TableHead>Ngày tạo</TableHead>
							<TableHead>
								<span className="w-max inline-block">Mã giao dịch</span>
							</TableHead>
							<TableHead>Trạng thái</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders?.length > 0 ? (
							orders?.map((order) => (
								<TableRow key={order.order_code}>
									<TableCell>
										<span className="w-max inline-block">{order.order_code}</span>
									</TableCell>
									<TableCell>
										<NavLink
											className="w-max inline-block hover:text-blue-400 hover:underline"
											to={`/apartment/${order.apartment.apart_id}`}
										>
											{order.apartment.apart_title}
										</NavLink>
									</TableCell>
									<TableCell>
										<span className="line-clamp-1 w-[200px]">{order.order_info}</span>
									</TableCell>
									<TableCell>
										<span className="w-max inline-block">{formatCurrency(order.order_amount)}</span>
									</TableCell>
									<TableCell>
										<span className="w-max inline-block">{order.order_note ?? "Trống"}</span>
									</TableCell>
									<TableCell>
										<span className="w-max inline-block">
											{order.order_pay_date ? formatDate(order.order_pay_date) : "Chưa thanh toán"}
										</span>
									</TableCell>
									<TableCell>
										<span className="w-max inline-block">{formatDate(order.createdAt)}</span>
									</TableCell>
									<TableCell>
										<span className="w-max inline-block">
											{order.order_transaction_no ?? "Trống"}
										</span>
									</TableCell>
									<TableCell>
										<Badge className={cn(ENUM_COLOR_ORDER[order.order_status], "w-max")}>
											{ENUM_STRING_ORDER[order.order_status]}
										</Badge>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={9} className="text-center">
									Không có dữ liệu
								</TableCell>
							</TableRow>
						)}
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
