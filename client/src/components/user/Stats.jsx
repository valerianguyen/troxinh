import React from 'react';

export default function Stats({ stat }) {

	return (
		<section className="py-10">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col flex-1 gap-10 lg:gap-0 lg:flex-row lg:justify-between">
					<div className="w-full lg:w-1/4 pb-10 border-gray-100">
						<div className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center ">
							{stat.publishedCount || 0}
						</div>
						<span className="text-xl text-gray-500 text-center block ">Đang hoạt động</span>
					</div>
					<div className="w-full lg:w-1/4">
						<div className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center ">
							{stat.totalCount || 0}
						</div>
						<span className="text-xl text-gray-500 text-center block ">Tổng số</span>
					</div>
				</div>
			</div>
		</section>
	);
}
