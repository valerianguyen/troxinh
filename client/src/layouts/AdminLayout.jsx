import {
  useEffect,
  useState,
} from 'react';

import {
  Outlet,
  useNavigate,
} from 'react-router-dom';

import Loading from '@/components/Loading';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { HEADER_HEIGHT } from '@/constant';
import { cn } from '@/lib/utils';

import AppSidebar from './components/Sidebar/AdminSidebar';

function AdminLayout({ isAdmin }) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = useState(true);
	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			navigate("/auth/login");
		}
		if (!isAdmin) {
			navigate("/");
		}
		setIsLoading(false);
	}, []);
	if (isLoading) return <Loading />;
	return (
		<>
			<main>
				<SidebarProvider open={open} onOpenChange={setOpen}>
					<AppSidebar />
					<SidebarInset
						className={cn(
							open
								? "w-[calc(100%-var(--sidebar-width)-var(--sidebar-width-icon))]"
								: "w-[calc(100%-var(--sidebar-width-icon))]",
							"justify-center",
						)}
					>
						<div
							className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background px-6 h-[calc(var(--header-height))]"
							style={{
								"--header-height": HEADER_HEIGHT,
							}}
						>
							<SidebarTrigger />
							<div className="flex flex-1 items-center gap-4 justify-between">
								<h1 className="text-xl font-semibold">Dashboard</h1>
								<Button variant="ghost" className="relative h-8 w-8 rounded-full">
									<Avatar className="h-8 w-8">
										<AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
										<AvatarFallback>AD</AvatarFallback>
									</Avatar>
								</Button>
							</div>
						</div>
						<div
							className="h-[calc(100vh-var(--header-height))]"
							style={{
								"--header-height": HEADER_HEIGHT,
							}}
						>
							<Outlet />
						</div>
					</SidebarInset>
				</SidebarProvider>
			</main>
		</>
	);
}

export default AdminLayout;
