import { Outlet } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';

function DefaultLayout() {
	return (
		<>
			<Header />
			<main className="mt-14 bg-gradient-to-b from-gray-50 to-gray-100 pt-6 px-4">
				<Outlet />
			</main>
			<Footer />
		</>
	);
}

export default DefaultLayout;
