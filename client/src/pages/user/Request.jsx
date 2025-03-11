import {
  useEffect,
  useState,
} from 'react';

import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import RentRequestApi from '@/api/rentRequest.api';
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
  COLOR_RENT_REQUEST,
  ENUM_RENT_REQUEST,
  ENUM_STRING_RENT_REQUEST,
} from '@/constant';
import { toLocaleString } from '@/utils';

export default function Request() {
	const [requests, setRequests] = useState(null);
	const user = useSelector((state) => state.user);

	useEffect(() => {
		const fetchRequest = async () => {
			const response = await RentRequestApi.searchRentRequest();
			if (response.status === 200) {
				setRequests(response.metadata.data);
			}
		};
		if (!requests) {
			fetchRequest();
		}
	}, [user]);
	const handleCancelRequest = async (requestId) => {
		const response = await RentRequestApi.updateStatusRentRequest(requestId, {
			status: ENUM_RENT_REQUEST.CANCEL,
		});
		if (response.status === 200) {
			setRequests([
				...requests.map((request) => {
					if (request.request_id == requestId) {
						return {
							...request,
							status: response.metadata.data.status,
						};
					}
					return request;
				}),
			]);
		}
	};
	const handleAcceptRequest = async (requestId) => {
		const response = await RentRequestApi.updateStatusRentRequest(requestId, {
			status: ENUM_RENT_REQUEST.ACCEPTED,
		});

		if (response.status === 200) {
			setRequests([
				...requests.map((request) => {
					if (request.request_id === requestId) {
						return {
							...request,
							status: response.metadata.data.status,
						};
					}
					return request;
				}),
			]);
		}
	};
	const handleRejectRequest = async (requestId) => {
		const response = await RentRequestApi.updateStatusRentRequest(requestId, {
			status: ENUM_RENT_REQUEST.REJECTED,
		});
		if (response.status === 200) {
			setRequests([
				...requests.map((request) => {
					if (request.request_id === requestId) {
						return {
							...request,
							status: response.metadata.data.status,
						};
					}
					return request;
				}),
			]);
		}
	};
	return (
		<div className="p-4 h-[calc(100vh-225px)] overflow-auto">
			<Table className={"mt-3"}>
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[200px]">Tên tin đăng</TableHead>
						<TableHead className="min-w-[150px]">Thời gian hẹn</TableHead>
						<TableHead className="min-w-[200px]">Ngày tạo</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead>Hành động</TableHead>
					</TableRow>
				</TableHeader>
				{!requests ? (
					<TableBody className="text-center">
						<TableRow>
							<TableCell colSpan={5}>Loading...</TableCell>
						</TableRow>
					</TableBody>
				) : (
					<TableBody>
						{requests.map((request) => (
							<TableRow key={request.request_id}>
								<TableCell className="font-medium">
									<NavLink className={"hover:underline"} to={`/apartment/${request.apart_id}`}>
										{request?.apartment?.apart_title ?? "Faild"}
									</NavLink>
								</TableCell>
								<TableCell>{toLocaleString(+request.appointmentTime)}</TableCell>
								<TableCell>{toLocaleString(request.createdAt)}</TableCell>
								<TableCell>
									<Button
										variant="secondary"
										className={`${
											COLOR_RENT_REQUEST[request.status]
										} text-xs py-2 px-3 h-max text-white`}
									>
										{ENUM_STRING_RENT_REQUEST[request.status]}
									</Button>
								</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Button
											onClick={() => handleCancelRequest(request.request_id)}
											className="text-xs py-2 px-3 h-max bg-red-500 hover:bg-red-400 hover:scale-95 transition-all"
										>
											Hủy
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				)}
			</Table>
		</div>
	);
}
