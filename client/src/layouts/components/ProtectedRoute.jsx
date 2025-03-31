import {
  Navigate,
  Outlet,
} from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

function ProtectedRoute() {
	if (!localStorage.getItem("accessToken")) {
		return <Navigate to="/auth/login" replace />;
	}
	return (
		<>
			<Header />
			<main className="mt-14 pt-6 px-4">
				<Outlet />
			</main>
			<Footer />
		</>
	);
}

export default ProtectedRoute;
