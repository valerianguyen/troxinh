import { Outlet } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';

function DefaultLayout() {
	return (
		<>
			<Header />
			<main className="mt-14 bg-[#FBF8EF] pt-6 px-4">
				<Outlet />
			</main>
			<Footer />
		</>
	);
}

export default DefaultLayout;
