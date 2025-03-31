import {
  useEffect,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import { Toaster } from 'sonner';

import UserApi from './api/user.api';
import Loading from './components/Loading';
import { ENUM_ROLE } from './constant';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './layouts/components/ProtectedRoute';
//Layout Components
import DefaultLayout from './layouts/DefaultLayout';
import { login } from './lib/features/user/userSlice';
import NotFound from './pages/_notFound';
import Editor from './pages/admin/blog/Editor';
import ManageBlog from './pages/admin/blog/ManageBlog';
import ManageApartment from './pages/admin/ManageApartment';
import ManageBlackListWord from './pages/admin/ManageBlackListWord';
import ManageComment from './pages/admin/ManageComment';
import ManageUser from './pages/admin/ManageUser';
import ManageVerifyApartment from './pages/admin/ManageVerifyApartment';
import Revenue from './pages/admin/Revenue';
import DetailApartment from './pages/apartment/DetailApartment';
import Forgot from './pages/auth/Forgot';
// Auth Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import BlogPostDetailPage from './pages/blog/BlogDetail';
import BlogListPage from './pages/blog/BlogPage';
// Home Components
import Home from './pages/home';
import PaymentStatusPage from './pages/payment/PaymentReview';
import AddApartment from './pages/user/AddApartment';
import Apartment from './pages/user/Apartment';
import DetailUser from './pages/user/DetailUser';
import EditApartment from './pages/user/EditApartment';
import FavoriteItemsList from './pages/user/FavoriteApartment';
import Me from './pages/user/Me';
import Order from './pages/user/Order';
import ReportApartment from './pages/user/ReportApartment';
import Request from './pages/user/Request';
import VerifyApartment from './pages/user/VerifyApartment';
import { checkLogin } from './utils';

export default function App() {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("accessToken");
		const fetchUser = async () => {
			const response = await UserApi.me();
			if (response?.status === 200) {
				dispatch(login(response.metadata.data));
			}
		};

		if (!checkLogin(user) && token) {
			fetchUser().finally(() => setLoading(false));
		} else {
			setLoading(false);
		}
	}, [dispatch]);
	if (loading) return <Loading />;
	return (
		<>
			<Toaster richColors closeButton position="top-right" />
			<Routes>
				<Route path="/" element={<DefaultLayout />}>
					<Route index element={<Home />} errorElement={<Error />} />
					<Route
						path="/apartment/:apart_id"
						element={<DetailApartment />}
						errorElement={<Error />}
					/>
					<Route path="blog" element={<Outlet />}>
						<Route index element={<BlogListPage />} />
						<Route path=":blog_id" element={<BlogPostDetailPage />} />
					</Route>

					<Route path="profile/:userId" element={<DetailUser />} errorElement={<Error />} />
				</Route>

				<Route path="/auth" element={<Outlet />}>
					<Route path="login" element={<Login />} errorElement={<Error />} />
					<Route path="register" element={<Register />} errorElement={<Error />} />
					<Route path="forgot-password" element={<Forgot />} errorElement={<Error />} />
				</Route>

				<Route path="user" element={<ProtectedRoute />}>
					<Route path="me" element={<Me />} errorElement={<Error />} />

					{user.usr_role == ENUM_ROLE.USER && (
						<>
							<Route path="request" element={<Request />} errorElement={<Error />} />
							<Route path="apartment" element={<Apartment />} errorElement={<Error />} />
							<Route path="apartment/add" element={<AddApartment />} errorElement={<Error />} />
							<Route
								path="verify-apartment"
								element={<VerifyApartment />}
								errorElement={<Error />}
							/>
							<Route
								path="apartment/edit/:apart_id"
								element={<EditApartment />}
								errorElement={<Error />}
							/>
							<Route path="orders" element={<Order />} errorElement={<Error />} />
						</>
					)}
				</Route>
				{/* 
				{[ENUM_ROLE.STAFF, ENUM_ROLE.USER].includes(user.usr_role) && (
					<>
						<Route path="ticket" element={<ProtectedRoute />}>
							<Route index element={<Ticket />} errorElement={<Error />} />
							<Route path=":ticketId" element={<ReplyTicket />} errorElement={<Error />} />
						</Route>
					</>
				)} */}
				<Route path="/saved" element={<ProtectedRoute />}>
					<Route index element={<FavoriteItemsList />} errorElement={<Error />} />
				</Route>
				<Route path="/payment" element={<ProtectedRoute />}>
					<Route index element={<NotFound />} />
					<Route path=":orderCode" element={<PaymentStatusPage />} />
				</Route>
				<Route
					path="/admin/*"
					element={
						<AdminLayout isAdmin={[ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF].includes(user.usr_role)} />
					}
				>
					<Route path="apartment" element={<ManageApartment />} errorElement={<Error />} />
					<Route path="blog" element={<ManageBlog />} errorElement={<Error />} />
					<Route path="blog/editor" element={<Editor />} errorElement={<Error />} />
					<Route path="blog/editor/:blog_id" element={<Editor />} errorElement={<Error />} />
					<Route
						path="verify-apartment"
						element={<ManageVerifyApartment isAdmin={true} />}
						errorElement={<Error />}
					/>
					<Route path="comment" element={<ManageComment />} errorElement={<Error />} />
					<Route
						path="users"
						element={
							<>{[ENUM_ROLE.ADMIN].includes(user.usr_role) ? <ManageUser /> : <NotFound />}</>
						}
						errorElement={<Error />}
					/>
					<Route path="report" element={<ReportApartment />} errorElement={<Error />} />
					<Route path="orders" element={<Order />} errorElement={<Error />} />
					<Route index element={<Revenue />} errorElement={<Error />} />
					<Route path="blacklist-word" element={<ManageBlackListWord />} errorElement={<Error />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	);
}
