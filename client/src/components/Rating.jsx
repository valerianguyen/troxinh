import React from 'react';

import { Star } from 'lucide-react';

export default function Rating({ rate, setRate, className }) {
	return (
		<div className="flex" title={rate}>
			{[1, 2, 3, 4, 5].map((item, index) => (
				<Star
					key={index}
					className={`${className} h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary`}
					fill={rate >= item ? "yellow" : "white"}
					onClick={() => {
						if (setRate) setRate(item);
					}}
				/>
			))}
		</div>
	);
}
