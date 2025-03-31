import { NavLink } from 'react-router-dom';

import Navigate from './Navigate';
import SearchInput from './SearchInput';

export default function Header() {
	return (
		<header className="shadow-md fixed top-0 left-0 right-0 z-50 bg-[#F2E2B1]">
			<div className="mx-auto px-4 flex items-center justify-between max-w-screen-xl xl:m-auto h-14">
				<div className="flex items-center">
					<NavLink to="/" className={`h-10 flex items-center text-xl font-logo text-pink-600 font-semibold`}>
						Trọ xinh
					</NavLink>
				</div>
				<SearchInput />
				<Navigate />
			</div>
		</header>
	);
}
