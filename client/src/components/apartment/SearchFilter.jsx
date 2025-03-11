import React, {
  useEffect,
  useRef,
} from 'react';

import { useSearchParams } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ENUM_STRING_APARTMENT_CATEGORIES,
  ENUM_STRING_APARTMENT_TYPE,
} from '@/constant';
import province from '@/data/province.json';
import { toCapitalized } from '@/utils';
import { ChevronDown } from '@geist-ui/icons';

import { Button } from '../ui/button';

const rangeAttributes = [
	{
		label: "Giá",
		unit: "đ",
		attribute: "apart_price",
	},
	{
		label: "Diện tích",
		unit: "m²",
		attribute: "apart_area",
	},
	{
		label: "Phòng ngủ",
		unit: "PN",
		attribute: "apart_total_room",
	},
	{
		label: "Nhà vệ sinh",
		unit: "VS",
		attribute: "apart_total_toilet",
	},
];

const RangeComponent = ({ label, setFilter, unit, filter, attribute }) => {
	// use for price / total toilet/ total room / area
	return (
		<div className="border-t border-gray-200 bg-white">
			<div className="border-t border-gray-200 p-4">
				<div className="flex justify-between gap-4">
					<label htmlFor={`Filter${toCapitalized(label)}From`} className="flex items-center gap-2">
						<span className="text-xs text-gray-600">{unit}</span>
						<input
							type="number"
							id={`Filter${toCapitalized(label)}From`}
							onChange={(e) => {
								const value = e.target.value;

								if (value !== "") {
									setFilter({
										...filter,
										[attribute + "_gte"]: +value, // Add or update the key with the new value
									});
								} else {
									const { [attribute + "_gte"]: _, ...rest } = filter; // Destructure to remove the key
									setFilter(rest); // Set the filter without the removed key
								}
							}}
							placeholder="From"
							className="mt-1 w-full rounded-md shadow-sm sm:text-sm p-2 outline-none border border-gray-300"
						/>
					</label>

					<label htmlFor={`Filter${toCapitalized(label)}To`} className="flex items-center gap-2">
						<span className="text-xs text-gray-600">{unit}</span>
						<input
							type="number"
							id={`Filter${toCapitalized(label)}To`}
							onChange={(e) => {
								const value = e.target.value;

								if (value !== "") {
									setFilter({
										...filter,
										[attribute + "_lte"]: +value, // Add or update the key with the new value
									});
								} else {
									const { [attribute + "_lte"]: _, ...rest } = filter; // Destructure to remove the key
									setFilter(rest); // Set the filter without the removed key
								}
							}}
							placeholder="To"
							className="mt-1 w-full rounded-md shadow-sm sm:text-sm p-2 outline-none border border-gray-300"
						/>
					</label>
				</div>
			</div>
		</div>
	);
};
const SelectAddressComponent = ({ setFilter, filter }) => {
	const selectedCity = useRef(null);
	const selectedDistrict = useRef(null);
	useEffect(() => {
		selectedCity.current = province.find((city) => city.code === filter.apart_city);
		selectedDistrict.current = selectedCity.current?.districts.find(
			(district) => district.code === filter.apart_district,
		);
	}, [filter.apart_city, filter.apart_district]);
	return (
		<>
			<div>
				<label htmlFor="apart_city" className="block text-xs font-medium text-gray-700">
					Tỉnh/Thành phố
				</label>
				<select
					name="apart_city"
					id="apart_city"
					className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
					onChange={(e) => {
						selectedCity.current = province.find((city) => city.code === +e.target.value);
						if (+e.target.value !== -1) {
							setFilter({
								...filter,
								apart_city: +e.target.value,
							});
						}
					}}
				>
					<option defaultValue value={-1}>
						Vui lòng chọn tỉnh/thành phố
					</option>
					{province.map((city) => (
						<option key={city.code} value={+city.code}>
							{city.name}
						</option>
					))}
				</select>
			</div>

			{/* District */}
			{selectedCity.current && (
				<div>
					<label htmlFor="apart_district" className="text-xs block font-medium text-gray-700">
						Quận/Huyện
					</label>
					<select
						id="apart_district"
						name="apart_district"
						className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						onChange={(e) => {
							selectedDistrict.current = selectedCity.current.districts.find(
								(district) => district.code === +e.target.value,
							);

							if (+e.target.value !== -1) {
								setFilter({
									...filter,
									apart_district: +e.target.value,
								});
							}
						}}
					>
						<option defaultValue value={-1}>
							Vui lòng chọn quận/huyện
						</option>
						{selectedCity.current?.districts.map((district, index) => (
							<option key={district.code} value={district.code}>
								{district.name}
							</option>
						))}
					</select>
				</div>
			)}

			{/* Ward */}
			{selectedCity.current && selectedDistrict.current && (
				<div>
					<label htmlFor="apart_ward" className="block text-xs font-medium text-gray-700">
						Phường/Xã
					</label>
					<select
						id="apart_ward"
						name="apart_ward"
						className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
						onChange={(e) => {
							if (+e.target.value !== -1) {
								setFilter({
									...filter,
									apart_ward: +e.target.value,
								});
							}
						}}
					>
						<option defaultValue value={-1}>
							Vui lòng chọn phường/xã
						</option>
						{selectedDistrict.current.wards.map((ward, index) => (
							<option key={ward.code} value={ward.code}>
								{ward.name}
							</option>
						))}
					</select>
				</div>
			)}
		</>
	);
};
const SelectComponent = ({ label, setFilter, filter, options, displayName }) => {
	return (
		<Select
			onValueChange={(value) => {
				if (value !== -1) {
					setFilter({
						...filter,
						[label]: value,
					});
				}
			}}
		>
			<SelectTrigger className="w-full font-medium">
				<SelectValue placeholder={displayName} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value={-1}>{displayName}</SelectItem>
				{Array.from(Object.keys(options)).map((key) => (
					<SelectItem key={key} value={key}>
						{options[key]}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
export const SearchFilter = ({ filter, setFilter, onFilter }) => {
	const [searchParams] = useSearchParams();
	return (
		<div className="flex flex-col gap-3 bg-white mb-5">
			<details
				className="overflow-hidden border-none outline-none rounded-lg [&_summary::-webkit-details-marker]:hidden flex flex-col px-3 space-y-3"
				open={true}
			>
				<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
					<span className="text-sm font-medium"> Lọc </span>
					<span className="transition group-open:-rotate-180">
						<ChevronDown className="size-5" />
					</span>
				</summary>
				{rangeAttributes.map((item) => (
					<details
						key={item.label}
						className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden"
					>
						<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
							<span className="text-sm font-medium"> {toCapitalized(item.label)} </span>

							<span className="transition group-open:-rotate-180">
								<ChevronDown className="size-5" />
							</span>
						</summary>
						<RangeComponent
							label={item.label}
							setFilter={setFilter}
							attribute={item.attribute}
							unit={item.unit}
							filter={filter}
						/>
					</details>
				))}

				<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
					<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
						<span className="text-sm font-medium"> Địa chỉ </span>
						<span className="transition group-open:-rotate-180">
							<ChevronDown className="size-5" />
						</span>
					</summary>

					<div className="border-t border-gray-200 bg-white">
						<div className="flex flex-col p-4 gap-3">
							<SelectAddressComponent filter={filter} setFilter={setFilter} />
						</div>
					</div>
				</details>
				<SelectComponent
					label={"apart_type"}
					displayName={"Loại"}
					filter={filter}
					setFilter={setFilter}
					options={ENUM_STRING_APARTMENT_TYPE}
				></SelectComponent>
				<SelectComponent
					label={"apart_category"}
					displayName={"Tất cả bất động sản"}
					filter={filter}
					setFilter={setFilter}
					options={ENUM_STRING_APARTMENT_CATEGORIES}
				></SelectComponent>
				<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
					<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
						<span className="text-sm font-medium"> Sắp xếp theo </span>

						<span className="transition group-open:-rotate-180">
							<ChevronDown className="size-5" />
						</span>
					</summary>

					<div className="border-t border-gray-200 bg-white grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3">
						{rangeAttributes.map((item) => (
							<label key={item.label} className="flex items-center gap-2 p-4">
								<input
									type="radio"
									name="sort"
									value={item.attribute}
									onChange={(e) => setFilter({ ...filter, orderBy: e.target.value })}
								/>
								<span>{toCapitalized(item.label)}</span>
							</label>
						))}
					</div>
				</details>
				<details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
					<summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
						<span className="text-sm font-medium"> Sắp xếp theo </span>

						<span className="transition group-open:-rotate-180">
							<ChevronDown className="size-5" />
						</span>
					</summary>

					<div className="border-t border-gray-200 bg-white grid grid-cols-2 px-3">
						{["asc", "desc"].map((order) => (
							<div className="flex" key={order}>
								<input
									type="radio"
									name="orderType"
									checked={order == filter?.orderType}
									value={order}
									onChange={(e) => {
										setFilter({ ...filter, orderType: e.target.value });
									}}
									id={order}
								/>
								<label className="flex items-center gap-2 p-4" htmlFor={order}>
									<span>{order == "asc" ? "Tăng dần" : "Giảm dần"}</span>
								</label>
							</div>
						))}
					</div>
				</details>
				<Button
					className="bg-blue-500 w-full"
					onClick={async () => {
						await onFilter({
							...filter,
							...(searchParams.get("q") ? { apart_title_like: `${searchParams.get("q")}` } : {}),
						});
					}}
				>
					Tìm kiếm
				</Button>

				<a href="/" className="block">
					<Button className="w-full mb-3">Xóa bộ lọc</Button>
				</a>
			</details>
		</div>
	);
};
