import {
  useEffect,
  useState,
} from 'react';

import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';

import CommentApi from '@/api/comment.api';
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
import { ENUM_ACTION } from '@/constant';
import { toLocaleString } from '@/utils';

export default function ManageComment() {
	const [comments, setComments] = useState(null);
	const [total, setTotal] = useState(null);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 10,
	});
	const submitDelete = async (userId, cmt_id) => {
		const res = await CommentApi.deleteComment(cmt_id);
		if (res?.status === 200) {
			setComments((prev) => prev.filter((comment) => comment.cmt_id !== cmt_id));
			toast.success("Xóa tin đăng thành công", {
				duration: 1000,
			});
		}
	};

	useEffect(() => {
		const fetchComment = async () => {
			const response = await CommentApi.searchComment(filter);
			if (response?.status === 200) {
				setComments(response.metadata.data.comments);
				setTotal(response.metadata.data.totalCount);
			}
		};
		fetchComment();
	}, [filter.page]);
	const handleFilter = async () => {
		const response = await CommentApi.searchComment(filter);
		if (response?.status === 200) {
			setComments(response.metadata.data.comments);
			setTotal(response.metadata.data.totalCount);
			setFilter({ ...filter, page: 1 });
		}
	};

	return (
		<div className="h-full flex flex-col px-4 py-3">
			<div className="flex flex-wrap gap-3 py-3">
				<div className="flex-1 w-full sm:min-w-[300px]">
					<input
						type="text"
						onChange={(e) => setFilter({ ...filter, usr_name_like: e.target.value })}
						placeholder="Tìm kiếm theo tên"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
					/>
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
							<TableHead className="min-w-[100px]">Người dùng</TableHead>
							<TableHead className="min-w-[50px]">Rating</TableHead>
							<TableHead className="min-w-[120px]">Nội dung đánh giá</TableHead>
							<TableHead className="min-w-[100px]">tin đăng</TableHead>
							<TableHead>Ngày tạo</TableHead>
							<TableHead>Hành động</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{comments?.map((comment) => (
							<TableRow key={comment.cmt_id}>
								<TableCell className="min-w-[100px]">
									<NavLink
										to={"/profile/" + comment.usr_id}
										className="flex items-center gap-3"
									>
										<div className="size-14 rounded-full border border-gray-300 overflow-hidden">
											<img
												className="size-full object-cover"
												src={comment.user.usr_avatar}
												alt={comment.user.usr_name}
											/>
										</div>
										<p>{comment.user.usr_name}</p>
									</NavLink>
								</TableCell>
								<TableCell>{comment.cmt_rate}</TableCell>
								<TableCell className={"truncate max-w-[200px]"}>{comment.cmt_content}</TableCell>
								<TableCell>
									<NavLink
										className={"hover:underline hover:text-blue-400 text-blue-300"}
										to={`/apartment/${comment.apart_id}`}
									>
										Xem chi tiết
									</NavLink>
								</TableCell>
								<TableCell>{toLocaleString(comment.createdAt).slice(9)}</TableCell>
								<TableCell className="min-w-[150px]">
									<div className="flex gap-2">
										<ActionDialog
											action={ENUM_ACTION.DELETE}
											title={"bình luận của " + comment.user.usr_name}
											color={"bg-red-500"}
											submit={submitDelete}
											id={comment.cmt_id}
										/>
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
