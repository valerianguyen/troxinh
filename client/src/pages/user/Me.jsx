import React, {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { UpdateAvatar } from '@/components/user/UpdateAvatar';
import { logout } from '@/lib/features/user/userSlice';
import { FormPassword } from '@/pages/user/components/FormPassword';

import FormUpdateProfile from './components/FormUpdateProfile';

export default function Me() {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isHydrated, setIsHydrated] = useState(false);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setIsHydrated(true);
	}, [user]);
	// Validation schema

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
		<section className="container mx-auto">
			<div className="px-4 py-16 sm:px-6 lg:px-8">
				<div className="flex gap-5 flex-col md:flex-row ">
					<div className="flex flex-col w-full md:max-w-[300px] bg-white rounded-lg flex-center overflow-hidden h-max">
						<div className="relative h-[150px] w-full flex-center before:h-1/2 before:w-full before:bg-gray-400 before:absolute before:top-0">
							<div className="overflow-hidden size-[100px] rounded-full	z-10 border-2 border-white">
								<img alt="avatar" src={user.usr_avatar} className="size-full object-cover" />
							</div>
						</div>
						<div className="flex-1 w-full flex justify-start items-center flex-col gap-2 mb-5">
							<UpdateAvatar />
							<Button
								onClick={handleLogout}
								className="w-9/12 bg-gray-400 hover:bg-gray-300 hover:text-black"
							>
								Đăng xuất
							</Button>
						</div>
					</div>

					<div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12 flex-1">
						<Tabs defaultValue="account">
							<TabsList className="flex gap-2">
								<TabsTrigger value="account" className="w-full">
									Tài khoản
								</TabsTrigger>
								<TabsTrigger value="password" className="w-full">
									Mật khẩu
								</TabsTrigger>
							</TabsList>
							<TabsContent value="account">
								<FormUpdateProfile user={user} isHydrated={isHydrated} />
							</TabsContent>
							<TabsContent value="password">
								<FormPassword />
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</section>
	);
}
