import {
  useEffect,
  useState,
} from 'react';

import { SquarePen } from 'lucide-react';
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
import { ENUM_ROLE } from '@/constant';
import { logout } from '@/lib/features/user/userSlice';
import { checkLogin } from '@/utils';

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function UserMenu({ user }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
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
		<div className="shadow-xl divide-y rounded-lg overflow-hidden w-44 absolute right-0 pt-2 z-40 top-full container">
			<ul className="text-sm bg-white">
				{[ENUM_ROLE.USER].includes(user.usr_role) && (
					<>
						<li>
							<NavLink to="/user/me" className="block px-4 py-2 hover:bg-gray-100">
								Quản lý tài khoản
							</NavLink>
						</li>
						<li>
							<NavLink to={`/user/apartment`} className="block px-4 py-2 hover:bg-gray-100">
								Quản lý tin đăng
							</NavLink>
						</li>
						<li>
							<NavLink to={`/user/verify-apartment`} className="block px-4 py-2 hover:bg-gray-100">
								Quản lý yêu cầu xác thực tin đăng
							</NavLink>
						</li>

						<li>
							<NavLink to={`/user/orders`} className="block px-4 py-2 hover:bg-gray-100">
								Quản lý đơn hàng
							</NavLink>
						</li>
					</>
				)}

				<li>
					<NavLink to="/saved" className="block px-4 py-2 hover:bg-gray-100">
						Tin đã lưu
					</NavLink>
				</li>
				<li>
					<button
						onClick={handleLogout}
						className="w-full text-left block px-4 py-2 hover:bg-gray-100"
					>
						Đăng xuất
					</button>
				</li>
			</ul>
		</div>
	);
}
function UserMenuUnAuth() {
	return (
		<div className="shadow-xl divide-y rounded-lg overflow-hidden w-44 absolute right-0 pt-2 z-40">
			<ul className="text-sm bg-white">
				<li>
					<NavLink to="/auth/login" className="block px-4 py-2 hover:bg-gray-100">
						Đăng nhập
					</NavLink>
				</li>
				<li>
					<NavLink to="/auth/register" className="block px-4 py-2 hover:bg-gray-100">
						Đăng ký
					</NavLink>
				</li>
			</ul>
		</div>
	);
}

function NavigateAuth({ user }) {
	const [isOpenMenu, setIsOpenMenu] = useState(false);

	const handlePointerEnter = () => {
		if (!isMobile()) setIsOpenMenu(true);
	};

	const handlePointerLeave = () => {
		if (!isMobile()) setIsOpenMenu(false);
	};

	// Event handlers for mobile
	const handleTouchStart = () => {
		if (isMobile()) setIsOpenMenu((prev) => !prev); // Toggle menu on touch
	};

	return (
		<div className="flex-center gap-2">
			<NavLink
					to="/blog/"
					className="flex-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-500 p-2 rounded-lg"
				>
					Tin tức
				</NavLink>
			{ENUM_ROLE.USER === user.usr_role ? (
				<NavLink
					to="/user/apartment/add"
					className={
						"flex-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-500 p-2 rounded-lg"
					}
				>
					<SquarePen size={20} />
					<span className="hidden md:block">Đăng tin</span>
				</NavLink>
			) : (
				<NavLink
					to="/admin/"
					className="flex-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-500 p-2 rounded-lg"
				>
					Dashboard
				</NavLink>
			)}
			<div
				className="flex-center relative cursor-pointer"
				onPointerLeave={handlePointerLeave} // Close menu when pointer leaves
			>
				<div
					className="relative flex-center gap-2"
					onPointerEnter={handlePointerEnter}
					onTouchStart={handleTouchStart} // Open menu when pointer enters
				>
					<button
						className="flex items-center focus:outline-none"
						aria-expanded={isOpenMenu} // Accessibility
						aria-label="User menu"
					>
						<img
							src={user?.usr_avatar}
							alt="User avatar"
							className="w-8 h-8 rounded-full object-cover"
						/>
					</button>
				</div>
				{isOpenMenu && <UserMenu user={user} />}
			</div>
		</div>
	);
}
function NavigateUnAuth() {
	const [isOpenMenu, setIsOpenMenu] = useState(false);
	return (
		<div className="flex-center">
			<div className="hidden md:flex-center">
				<NavLink
					to="/auth/login"
					className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none hover:bg-gray-100 hover:rounded-lg"
				>
					Đăng nhập
				</NavLink>
				<a
					href="/auth/register"
					className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none hover:bg-gray-100 hover:rounded-lg"
				>
					Đăng ký
				</a>
			</div>
			<div className="relative block md:hidden">
				<button
					className="flex items-center focus:outline-none"
					onTouchEnd={() => isMobile() && setIsOpenMenu(!isOpenMenu)}
					onClick={() => !isMobile() && !isOpenMenu && setIsOpenMenu(true)}
					onPointerLeave={() => isOpenMenu && setIsOpenMenu(false)}
				>
					<img
						src={"https://picsum.photos/200/300"}
						alt="avatar"
						className="w-8 h-8 rounded-full"
					/>
				</button>
				{isOpenMenu && <UserMenuUnAuth />}
			</div>
		</div>
	);
}

export default function Navigate() {
	const [isLogin, setIsLogin] = useState(false);
	const user = useSelector((state) => state.user);

	useEffect(() => {
		setIsLogin(checkLogin(user));
	}, [user]);

	if (isLogin) {
		return <NavigateAuth user={user} />;
	}
	return <NavigateUnAuth />;
}
