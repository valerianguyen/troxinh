import * as React from 'react';

import {
  ENUM_APARTMENT_CATEGORIES,
  ENUM_STRING_APARTMENT_CATEGORIES,
} from '@/constant';
import { cn } from '@/lib/utils';

function RegionCard({ name, image, size = "small", onClick }) {
	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-lg cursor-pointer",
				size === "large" ? "col-span-2 row-span-2" : "",
			)}
			onClick={onClick}
		>
			<img
				src={image || "/placeholder.svg"}
				alt={name}
				className={cn(
					"object-cover w-full transition-transform duration-300 group-hover:scale-105",
					size === "large" ? "h-[416px]" : "h-[200px]",
				)}
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
			<div className="absolute bottom-0 left-0 p-4 text-white">
				<h3 className={cn("font-medium", size === "large" ? "text-2xl" : "text-xl")}>{name}</h3>
			</div>
		</div>
	);
}

function PropertyType({ children, active = false, onClick }) {
	return (
		<button
			className={cn(
				"px-4 py-2 text-sm rounded-full transition-colors",
				active ? "bg-pink-400 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100",
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export function RealEstateRegions({ filter, handleFilter }) {
	const [activePropertyType, setActivePropertyType] = React.useState(-1);

	const regions = [
		{
			id: "79",
			name: "Tp Hồ Chí Minh",
			image: "/city/hcm-1.jpg",
			size: "large",
		},
		{
			id: "1",
			name: "Hà Nội",
			image: "/city/ha-noi-1.jpg",
		},
		{
			id: "48",
			name: "Đà Nẵng",
			image: "/city/da-nang-1.jpg",
		},
		{
			id: "92",
			name: "Cần Thơ",
			image: "/city/can-tho-1.jpg",
		},
		{
			id: "74",
			name: "Bình Dương",
			image: "/city/binh-duong-1.jpg",
		},
	];

	return (
		<div className="w-full mt-10">
			<h2 className="text-xl font-medium text-gray-900 mb-4">Bất động sản theo khu vực</h2>
			<div className="mt-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{regions.map((region) => (
						<RegionCard
							key={region.id}
							name={region.name}
							image={region.image}
							size={region.size}
							onClick={() => {
								handleFilter({ ...filter, apart_city: parseInt(region.id) });
							}}
						/>
					))}
				</div>
				<h2 className="text-xl font-medium text-gray-900 my-6">Khám phá bất động sản</h2>
				<div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-lg">
					<PropertyType
						active={activePropertyType === -1}
						onClick={() => {
							setActivePropertyType(-1);
							delete filter.apart_category;
							handleFilter({ ...filter });
						}}
					>
						Tất cả
					</PropertyType>
					{Object.values(ENUM_APARTMENT_CATEGORIES).map((key) => (
						<PropertyType
							key={key}
							active={activePropertyType === key}
							onClick={() => {
								setActivePropertyType(key);
								handleFilter({ ...filter, apart_category: key });
							}}
						>
							{ENUM_STRING_APARTMENT_CATEGORIES[key]}
						</PropertyType>
					))}
				</div>
			</div>
		</div>
	);
}
