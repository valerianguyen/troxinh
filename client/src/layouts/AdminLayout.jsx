import {
  useEffect,
  useState,
} from 'react';

import {
  Outlet,
  useNavigate,
} from 'react-router-dom';

import Loading from '@/components/Loading';

import Header from './components/Header';

function AdminLayout({ isAdmin }) {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		if (!localStorage.getItem("accessToken")) {
			navigate("/auth/login");
		}
		if (!isAdmin) {
			navigate("/");
		}
		setIsLoading(false);
	}, []);
	if(isLoading) return <Loading />;
	return (
		<>
			<>
				<Header />
				<main className="mt-20 p-4">
					<Outlet />
				</main>
			</>
		</>
	);
}

export default AdminLayout;
