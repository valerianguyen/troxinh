import {
  useEffect,
  useState,
} from 'react';

import {
  MoreVertical,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { toast } from 'sonner';

import BlogApi from '@/api/blog.api';
import PaginationComponent from '@/components/PaginationComponent';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/utils';

export default function ManageBlog() {
	const [blogs, setBlogs] = useState(null);
	const [total, setTotal] = useState(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [currentBlog, setCurrentBlog] = useState(null);
	const [filter, setFilter] = useState({
		page: 1,
		limit: 10,
	});

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await BlogApi.getMyBlogs(filter);
			if (response?.status === 200) {
				setBlogs(response.metadata.data.blogs);
				setTotal(response.metadata.data.total);
			}
		};
		fetchUsers();
	}, [filter.page]);
	const handleFilter = async () => {
		const response = await BlogApi.getMyBlogs(filter);
		if (response?.status === 200) {
			setBlogs(response.metadata.data.blogs);
			setTotal(response.metadata.data.total);
			setFilter({ ...filter, page: 1 });
		}
	};
	const truncateText = (text, maxLength = 50) => {
		// Remove HTML tags
		const plainText = text.replace(/<[^>]*>/g, "");
		return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
	};
	const handleDeleteClick = (blog) => {
		setCurrentBlog(blog);
		setShowDeleteDialog(true);
	};
	const handleDeleteConfirm = async () => {
		// Simulate API call - replace with your actual API endpoint
		const response = await BlogApi.deleteBlog(currentBlog.blog_id);
		if (response?.status === 200) {
			toast.success("Xóa bài viết thành công");
			const updatedBlogs = blogs.filter((blog) => blog.blog_id !== currentBlog.blog_id);
			setBlogs(updatedBlogs);
			return;
		}
		setShowDeleteDialog(false);
	};

	return (
		<div className="h-full flex flex-col px-4 py-3">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold">Quản lý bài viết</h1>
				</div>

				<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
					<NavLink to={"/admin/blog/editor"} className="w-full">
						<Button className="whitespace-nowrap">
							<Plus className="mr-2 h-4 w-4" /> Thêm bài viết mới
						</Button>
					</NavLink>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Thumbnail</TableHead>
						<TableHead>Tiêu đề</TableHead>
						<TableHead className="hidden md:table-cell">Nội dung</TableHead>
						<TableHead className="hidden md:table-cell">Tác giả</TableHead>
						<TableHead className="hidden md:table-cell">Ngày viết</TableHead>
						<TableHead className="w-[100px] text-right">Hành động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{blogs?.length > 0 ? (
						blogs?.map((blog) => (
							<TableRow key={blog.blog_id}>
								<TableCell>
									<div className="h-12 w-12 rounded overflow-hidden">
										<img
											src={blog.blog_image || "/placeholder.svg"}
											alt={blog.blog_title}
											className="h-full w-full object-cover"
										/>
									</div>
								</TableCell>
								<TableCell className="font-medium">{blog.blog_title}</TableCell>
								<TableCell className="hidden md:table-cell text-muted-foreground">
									{truncateText(blog.blog_content)}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									<div className="flex-center gap-2">
										<Avatar className="mr-2 h-8 w-8 border-2 border-pink-100">
											<AvatarImage src={blog.user.usr_avatar} />
											<AvatarFallback className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
												TX
											</AvatarFallback>
										</Avatar>
										<span>{blog.user.usr_name}</span>
									</div>
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{blog.createdAt ? formatDate(blog.createdAt) : "N/A"}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Open menu</span>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<NavLink
													to={`/admin/blog/editor/${blog.blog_id}`}
													className="flex items-center w-full"
												>
													<Pencil className="mr-2 h-4 w-4" />
													Sửa
												</NavLink>
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleDeleteClick(blog)}
												className="text-red-600 focus:text-red-600"
											>
												<Trash className="mr-2 h-4 w-4" />
												Xóa
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={6} className="h-24 text-center">
								Không có bài viết nào
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<PaginationComponent
				total={total}
				filter={filter}
				setFilter={setFilter}
				handleFilter={handleFilter}
			/>
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Bạn chắc chứ?</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa bài viết này không? Bài viết sẽ không thể khôi phục lại sau
							khi xóa.
							<strong> "{currentBlog?.blog_title}"</strong>.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className="bg-red-600 hover:bg-red-700"
						>
							Xóa
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
