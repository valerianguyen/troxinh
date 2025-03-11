import React from 'react';

import { useSearchParams } from 'react-router-dom';

import { Search } from '@geist-ui/icons';

export default function SearchInput() {
	const [searchParams, setSearchParams] = useSearchParams();
	return (
		<div className={`flex-1 mx-4 justify-center flex`}>
			<div className={`relative transition-all max-w-[500px] w-full`}>
				<input
					className="rounded-md text-black focus:outline-none bg-gray-100 w-full py-2 pl-11 pr-4"
					placeholder="Search"
					defaultValue={searchParams.get("q") || ""}
					onKeyDown={(e) => {
						if (e.keyCode === 13) {
							setSearchParams({ q: e.target.value });
						}
					}}
					type="text"
				/>
				<span className={`absolute left-3 top-2 text-gray-400 z-auto`}>
					<Search />
				</span>
			</div>
		</div>
	);
}
