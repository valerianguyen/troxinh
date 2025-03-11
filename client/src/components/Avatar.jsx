import React from 'react';

import { cn } from '@/lib/utils';

export default function Avatar({ usr_name = null, usr_avatar, size = 10, className }) {
	return (
		<div className={cn(className, "flex-center gap-2 w-max")}>
			<div className="flex-shrink-0 flex-grow-0 flex-center">
				<img
					src={usr_avatar}
					alt={usr_name ?? "Avatar"}
					style={{
						width: `${size * 4}px`,
						height: `${size * 4}px`,
					}}
					loading="lazy"
					className="rounded-full object-cover flex-shrink-0 flex-grow-0"
				/>
			</div>
			{usr_name && (
				<p className="text-sm font-medium text-gray-900 focus:outline-none">
					{usr_name}
				</p>
			)}
		</div>
	);
}
