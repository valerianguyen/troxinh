import {
  useEffect,
  useState,
} from 'react';

import {
  ErrorMessage,
  Field,
  Form,
  Formik,
} from 'formik';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import TicketApi from '@/api/ticket.api';
import { ActionDialog } from '@/components/ActionDialog';
import LoadingButton from '@/components/Button/LoadingButton';
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
  ENUM_STATUS_TICKET,
  ENUM_STRING_STATUS_TICKET,
} from '@/constant';
import { toLocaleString } from '@/utils';

export default function Ticket() {
	const user = useSelector((state) => state.user);
	const [tickets, setTickets] = useState(null);
	const [total, setTotal] = useState(null);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 10,
	});
	const submitCancel = async (userId, ticket_id) => {
		const res = await TicketApi.cancelTicket(ticket_id);
		if (res.status === 200) {
			setTickets((prev) =>
				prev.map((ticket) =>
					ticket_id === ticket.ticket_id
						? { ...user, ticket_status: ENUM_STATUS_TICKET.CANCEL }
						: ticket,
				),
			);
			toast.success("Hủy phiếu hỗ trợ thành công", {
				duration: 1000,
			});
		}
	};
	const submitDone = async (_, ticket_id) => {
		const res = await TicketApi.updateTicketStatus(ticket_id, {
			status: ENUM_STATUS_TICKET.DONE,
		});
		if (res.status === 200) {
			setTickets((prev) =>
				prev.map((ticket) =>
					ticket_id === ticket.ticket_id
						? { ...ticket, ticket_status: ENUM_STATUS_TICKET.DONE }
						: ticket,
				),
			);
			toast.success("Đánh dấu đã xử lý thành công", {
				duration: 1000,
			});
		}
	};
	const submitReject = async (_, ticket_id) => {
		const res = await TicketApi.updateTicketStatus(ticket_id, {
			status: ENUM_STATUS_TICKET.REJECTED,
		});
		if (res.status === 200) {
			setTickets((prev) =>
				prev.map((ticket) =>
					ticket_id === ticket.ticket_id
						? { ...ticket, ticket_status: ENUM_STATUS_TICKET.REJECTED }
						: ticket,
				),
			);
			toast.success("Từ chối hỗ trợ thành công", {
				duration: 1000,
			});
		}
	};

	useEffect(() => {
		const fetchTickets = async () => {
			const response = await TicketApi.searchTicket(filter);
			if (response.status === 200) {
				setTickets(response.metadata.data.tickets);
				setTotal(response.metadata.data.totalCount);
			}
		};
		fetchTickets();
	}, [filter.page]);
	const handleFilter = async () => {
		const response = await TicketApi.searchTicket(filter);
		if (response.status === 200) {
			setTickets(response.metadata.data.tickets);
			setTotal(response.metadata.data.totalCount);
			setFilter({ ...filter, page: 1 });
		}
	};
	const initialValues = {
		ticket_title: "",
		ticket_content: "",
	};
	const validationSchema = Yup.object({
		ticket_title: Yup.string().required("Vui lòng nhập tiêu đề"),
		ticket_content: Yup.string().required("Vui lòng nhập nội dung"),
	});
	const submit = async (values, { setSubmitting }) => {
		setSubmitting(true);
		const res = await TicketApi.createTicket(values);
		if (res.status === 201) {
			toast.success("Tạo phiếu hỗ trợ thành công", {
				duration: 1000,
			});
			setTickets((prev) => [res.metadata.data, ...prev]);
			setSubmitting(false);
		}
	};

	return (
		<div className="p-4 container mx-auto">
			{/* create phieu ho tro */}
			{user.usr_role == ENUM_ROLE.USER && (
				<div>
					<Formik
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={submit}
						enableReinitialize
					>
						{({ isSubmitting }) => (
							<Form className="space-y-6 mb-4">
								{/* Title */}
								<div>
									<label htmlFor="message" className="block font-medium text-gray-700">
										Tiêu đề
									</label>
									<Field
										name="ticket_title"
										id="ticket_title"
										className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
									/>
									<ErrorMessage
										name="ticket_title"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
								<div>
									<label htmlFor="ticket_content" className="block font-medium text-gray-700">
										Nội dung
									</label>
									<Field
										component="textarea"
										name="ticket_content"
										id="ticket_content"
										className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
									/>
									<ErrorMessage
										name="ticket_content"
										component="div"
										className="text-red-500 text-sm mt-1"
									/>
								</div>
								{isSubmitting ? (
									<LoadingButton />
								) : (
									<Button type="submit" className="bg-blue-500">
										Tạo hỗ trợ
									</Button>
								)}
							</Form>
						)}
					</Formik>
				</div>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
				<div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 w-full">
					<select
						onChange={(e) => {
							if (e.target.value > ENUM_STATUS_TICKET.CANCEL - 1)
								setFilter({ ...filter, ticket_status: e.target.value });
							else setFilter(({ ticket_status, ...prev }) => ({ ...prev }));
						}}
						id="user_isPublished"
						className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					>
						<option defaultValue="all" value={ENUM_STATUS_TICKET.CANCEL - 1}>
							Chọn trạng thái
						</option>
						{Object.keys(ENUM_STRING_STATUS_TICKET).map((key) => (
							<option key={key} value={key}>
								{ENUM_STRING_STATUS_TICKET[key]}
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

			<div className="h-[calc(100vh-225px)] overflow-auto">
				<Table className={"mt-3"}>
					<TableHeader>
						<TableRow>
							{user.usr_role === ENUM_ROLE.STAFF && (
								<TableHead className="min-w-[100px]">Người dùng</TableHead>
							)}
							<TableHead className="min-w-[50px]">Tiêu đề</TableHead>
							<TableHead className="min-w-[120px]">Nội dung</TableHead>
							<TableHead className="min-w-[100px]">Trạng thái</TableHead>
							<TableHead>Ngày tạo</TableHead>
							<TableHead>Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tickets?.map((ticket) => (
							<TableRow key={ticket.ticket_id}>
								{user.usr_role === ENUM_ROLE.STAFF && (
									<TableCell className="min-w-[200px]">
										<NavLink
											to={"/user/profile/" + ticket.user.usr_id}
											className="flex items-center gap-3"
										>
											<div className="size-14 rounded-full border border-gray-300 overflow-hidden">
												<img
													className="size-full object-contain"
													src={ticket.user.usr_avatar}
													alt={ticket.user.usr_name}
												/>
											</div>
											<p>{ticket.user.usr_name}</p>
										</NavLink>
									</TableCell>
								)}
								<TableCell className={"truncate max-w-[200px]"}>{ticket.ticket_title}</TableCell>
								<TableCell className={"truncate max-w-[300px]"}>{ticket.ticket_content}</TableCell>
								<TableCell>{ENUM_STRING_STATUS_TICKET[ticket.ticket_status]}</TableCell>
								<TableCell>{toLocaleString(ticket.createdAt).slice(9)}</TableCell>
								<TableCell className="min-w-[150px]">
									<div className="flex gap-2">
										<NavLink to={"/ticket/" + ticket.ticket_id}>
											<Button className="bg-blue-500">Xem chi tiết</Button>
										</NavLink>
										{user.usr_role == ENUM_ROLE.STAFF ? (
											<>
												<ActionDialog
													action={ENUM_ACTION.REJECTED}
													title={"phiếu yêu cầu " + ticket.ticket_title + " này"}
													color={"bg-red-500"}
													submit={submitReject}
													userId={user.usr_id}
													id={ticket.ticket_id}
												/>
												<ActionDialog
													action={ENUM_ACTION.DONE}
													title={"phiếu yêu cầu " + ticket.ticket_title + " này"}
													color={"bg-green-500"}
													submit={submitDone}
													userId={user.usr_id}
													id={ticket.ticket_id}
												/>
											</>
										) : (
											<ActionDialog
												action={ENUM_ACTION.CANCEL}
												title={ticket.ticket_title + " này"}
												color={"bg-red-500"}
												submit={submitCancel}
												userId={user.usr_id}
												id={ticket.ticket_id}
											/>
										)}
									</div>
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
