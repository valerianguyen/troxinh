import {
  BookX,
  ChartArea,
  ChevronUp,
  Home,
  Inbox,
  MessageCircleWarning,
  MessageSquare,
  Package,
  User,
  User2,
} from 'lucide-react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  NavLink,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'sonner';

import AuthApi from '@/api/auth.api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ENUM_ROLE } from '@/constant';
import { logout } from '@/lib/features/user/userSlice';

const items = [
	{
		title: "Lợi nhuận",
		url: "/admin/",
		icon: ChartArea,
		isOnlyAdmin: false,
	},
	{
		title: "Quản lý tin đăng",
		url: "/admin/apartment",
		icon: Inbox,
		isOnlyAdmin: false,
	},
	{
		title: "Quản lý đơn hàng",
		url: "/admin/orders",
		icon: Package,
		isOnlyAdmin: false,
	},
	{
		title: "Quản lý bình luận",
		url: "/admin/comment",
		icon: MessageSquare,
		isOnlyAdmin: false,
	},
	{
		title: "Quản lý báo cáo",
		url: "/admin/report",
		icon: MessageCircleWarning,
		isOnlyAdmin: false,
	},
	{
		title: "Quản lý từ cấm",
		url: "/admin/blacklist-word",
		icon: BookX,
		isOnlyAdmin: false,
	},
	{
		title: "Quản lý người dùng",
		url: "/admin/users",
		icon: User,
		isOnlyAdmin: true,
	},
	{
		title: "Quản lý yêu cầu xác thực tin đăng",
		url: "/admin/verify-apartment",
		icon: Package,
		isOnlyAdmin: false,
	},
	{
		title: "Quản lý blog",
		url: "/admin/blog",
		icon: BookX,
		isOnlyAdmin: false,
	},
	{
		title: "Về trang chủ",
		url: "/",
		icon: Home,
		isOnlyAdmin: false,
	},
];
export default function AdminSidebar() {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleLogout = async () => {
		toast.success("Đăng xuất thành công", {
			duration: 1000,
		});
		await AuthApi.logout();
		dispatch(logout());
		localStorage.removeItem("accessToken");
		navigate({ pathname: "/auth/login" });
	};
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Dashboard</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								if (item.isOnlyAdmin && user?.usr_role !== ENUM_ROLE.ADMIN) return null;
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<NavLink to={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</NavLink>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 /> {user?.usr_name ?? "Admin"}
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
								<DropdownMenuItem className={"cursor-pointer hover:bg-gray-100"}>
									<NavLink to="/user/me" className={"w-full inline-block h-full"}>
										Thông tin cá nhân
									</NavLink>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={handleLogout}
									className={"cursor-pointer hover:bg-gray-100"}
								>
									<span>Đăng xuất</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
