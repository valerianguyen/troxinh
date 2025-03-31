import {
  useEffect,
  useState,
} from 'react';

import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';

import UserApi from '@/api/user.api';
import { ActionDialog } from '@/components/ActionDialog';
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
  ENUM_ACTION,
  ENUM_ROLE,
  ENUM_STRING_ROLE,
} from '@/constant';
import { toLocaleString } from '@/utils';

// phone, name,email,role,
export default function ManageUser() {
	const [users, setUsers] = useState(null);
	const [total, setTotal] = useState(null);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 10,
	});
	const submitBan = async (userId, _) => {
		const res = await UserApi.banUser(userId);
		if (res?.status === 200) {
			setUsers((prev) =>
				prev.map((user) => (userId === user.usr_id ? { ...user, usr_role: ENUM_ROLE.BAN } : user)),
			);
			toast.success("Ban người dùng thành công", {
				duration: 1000,
			});
		}
	};
	const submitStaff = async (userId, _) => {
		const res = await UserApi.changeRoleStaff(userId);
		if (res?.status === 200) {
			setUsers((prev) =>
				prev.map((user) =>
					userId === user.usr_id ? { ...user, usr_role: ENUM_ROLE.STAFF } : user,
				),
			);
			toast.success("Làm nhân viên thành công", {
				duration: 1000,
			});
		}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await UserApi.getAllUsers(filter);
			if (response?.status === 200) {
				setUsers(response.metadata.data.users);
				setTotal(response.metadata.data.totalCount);
			}
		};
		fetchUsers();
	}, [filter.page]);
	const handleFilter = async () => {
		const response = await UserApi.getAllUsers(filter);
		if (response?.status === 200) {
			setUsers(response.metadata.data.users);
			setTotal(response.metadata.data.totalCount);
			setFilter({ ...filter, page: 1 });
		}
	};

	return (
		<div className="h-full flex flex-col px-4 py-3">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
				<div className="flex-1 w-full">
					<input
						type="text"
						onChange={(e) => {
							if (e.target.value != "") {
								setFilter({ ...filter, usr_name_like: e.target.value });
							} else {
								setFilter(({ usr_name_like, ...prev }) => ({ ...prev }));
							}
						}}
						placeholder="Tìm kiếm theo tên"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
				<div className="flex-1 w-full">
					<input
						type="text"
						onChange={(e) => {
							if (e.target.value != "") {
								setFilter({ ...filter, usr_email_like: e.target.value });
							} else {
								setFilter(({ usr_email_like, ...prev }) => ({ ...prev }));
							}
						}}
						placeholder="Tìm kiếm email"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
				<div className="flex-1 w-full">
					<input
						type="text"
						onChange={(e) => {
							if (e.target.value != "") {
								setFilter({ ...filter, usr_phone_like: e.target.value });
							} else {
								setFilter(({ usr_phone_like, ...prev }) => ({ ...prev }));
							}
						}}
						placeholder="Tìm kiếm số điện thoại"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
				</div>
				<div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 w-full">
					<select
						onChange={(e) => {
							if (e.target.value > ENUM_ROLE.BAN - 1)
								setFilter({ ...filter, usr_role: e.target.value });
							else setFilter(({ usr_role, ...prev }) => ({ ...prev }));
						}}
						id="user_isPublished"
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					>
						<option defaultValue="all" value={ENUM_ROLE.BAN - 1}>
							Chọn vai trò
						</option>
						{Object.keys(ENUM_STRING_ROLE).map((key) => (
							<option key={key} value={key}>
								{ENUM_STRING_ROLE[key]}
							</option>
						))}
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

			<Table className={"mt-3"}>
				<TableHeader>
					<TableRow>
						<TableHead>
							<span className="w-max inline-block">Người dùng</span>
						</TableHead>
						<TableHead>
							<span className="w-max inline-block">Phone</span>
						</TableHead>
						<TableHead>
							<span className="w-max inline-block">Email</span>
						</TableHead>
						<TableHead>
							<span className="w-max inline-block">Vai trò</span>
						</TableHead>
						<TableHead>
							<span className="w-max inline-block">Số tin đăng hoạt động</span>
						</TableHead>
						<TableHead>
							<span className="w-max inline-block">Đánh giá</span>
						</TableHead>
						<TableHead>
							<span className="w-max inline-block">Báo cáo từ người dùng</span>
						</TableHead>
						<TableHead>Ngày tạo</TableHead>
						<TableHead>Hành động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users?.map((user) => (
						<TableRow key={user.usr_id}>
							<TableCell className="min-w-[200px]">
								<NavLink to={"/profile/" + user.usr_id} className="flex items-center gap-3">
									<div className="size-14 rounded-full border border-gray-300 overflow-hidden">
										<img
											className="size-full object-contain"
											src={user.usr_avatar}
											alt={user.usr_name}
										/>
									</div>
									<p>{user.usr_name}</p>
								</NavLink>
							</TableCell>
							<TableCell>{user.usr_phone ?? "null"}</TableCell>
							<TableCell>
								<span className="line-clamp-1">{user.usr_email}</span>
							</TableCell>
							<TableCell>{ENUM_STRING_ROLE[user.usr_role]}</TableCell>
							<TableCell className="min-w-[150px]">{user.usr_totals_apartment}</TableCell>
							<TableCell className="min-w-[150px]">
								{user.overall_avg_rating ? parseFloat(user.overall_avg_rating) : 0}
							</TableCell>
							<TableCell className="min-w-[150px]">
								{user.overall_avg_rating ? parseInt(user.total_reports) : 0}
							</TableCell>
							<TableCell>{toLocaleString(user.createdAt).slice(9)}</TableCell>
							<TableCell className="min-w-[150px]">
								<div className="flex gap-2">
									<ActionDialog
										action={ENUM_ACTION.BLOCK}
										title={"tài khoản " + user.usr_name}
										color={"bg-red-500"}
										submit={submitBan}
										userId={user.usr_id}
									/>
									<ActionDialog
										action={ENUM_ACTION.MAKE_STAFF}
										title={"tài khoản " + user.usr_name}
										color={"bg-green-500"}
										submit={submitStaff}
										userId={user.usr_id}
									/>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<PaginationComponent
				total={total}
				filter={filter}
				setFilter={setFilter}
				handleFilter={handleFilter}
			/>
		</div>
	);
}
