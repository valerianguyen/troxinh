import React from 'react';

import ApartmentItem from './ApartmentItem';

export default function ListApartments({ apartments }) {
	return (
		<div className="mx-auto w-full">
			<div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8 mt-6">
				{apartments.map((apartment) => (
					<ApartmentItem key={apartment.apart_id} apartment={apartment} full={true}/>
				))}
			</div>
		</div>
	);
}
