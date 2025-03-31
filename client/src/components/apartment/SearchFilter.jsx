import React from 'react';

import { X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ENUM_STATUS_APARTMENT,
  ENUM_STRING_APARTMENT_TYPE,
} from '@/constant';
import province from '@/data/province.json';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';

function handleClearFilter(filter) {
	const { apart_city, apart_district, apart_ward, apart_price, apart_area, ...rest } = filter;

	const createRangeFilters = (range, prefix) =>
		range
			? {
					[`${prefix}_gte`]: range[0] * 1000000,
					...(range[1] != null && { [`${prefix}_lte`]: range[1] * 1000000 }),
			  }
			: {};

	const isValidLocation = (value) => typeof value === "number" && value > -1;

	return {
		...rest,
		...createRangeFilters(apart_price, "apart_price"),
		...createRangeFilters(apart_area, "apart_area"),
		...(isValidLocation(apart_city) && { apart_city }),
		...(isValidLocation(apart_district) && { apart_district }),
		...(isValidLocation(apart_ward) && { apart_ward }),
	};
}
const rangeAttributes = [
	{
		label: "Giá",
		unit: "triệu đ",
		attribute: "apart_price",
		range: [0, 100],
		step: 0.5,
		format: (value) => new Intl.NumberFormat("vi-VN").format(value * 1000000),
		toNumber: (value) => Number.parseFloat(value.replace(/[^0-9]/g, "")) / 1000000,
	},
	{
		label: "Diện tích",
		unit: "m²",
		attribute: "apart_area",
		range: [0, 200],
		step: 1,
		format: (value) => value,
		toNumber: (value) => Number.parseFloat(value.replace(/[^0-9]/g, "")),
	},
];
const selectAttributes = [
	{
		label: "Phòng ngủ",
		attribute: "apart_total_room",
		options: ["1", "2", "3", "4", "5+"],
		displayName: "Tất cả phòng ngủ",
		unit: "phòng",
	},
	{
		label: "Phòng tắm",
		attribute: "apart_total_toilet",
		options: ["1", "2", "3", "4", "5+"],
		displayName: "Tất cả phòng tắm",
		unit: "phòng",
	},
	{
		label: "Loại",
		attribute: "apart_type",
		options: Array.from(Object.keys(ENUM_STRING_APARTMENT_TYPE)),
		displayName: "Tất cả loại",
		unit: "",
	},
];

const RangeComponent = ({
	label,
	setFilters,
	unit,
	filters,
	attribute,
	range,
	step,
	format,
	toNumber,
}) => {
	// use for price / total toilet/ total room / area
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<label className="text-sm font-medium">{`${label} (${unit})`}</label>
				<span className="text-sm font-medium text-rose-500">
					{filters[attribute]
						? filters[attribute][1] === null
							? `≥ ${filters[attribute][0]}`
							: `${filters[attribute][0]} - ${filters[attribute][1]}`
						: "Tất cả"}
				</span>
			</div>
			<Slider
				defaultValue={range}
				max={range[1]}
				step={step}
				value={[
					filters[attribute] ? filters[attribute][0] : 0,
					filters[attribute] && filters[attribute][1] !== null ? filters[attribute][1] : range[1],
				]}
				onValueChange={(value) =>
					setFilters({
						...filters,
						[attribute]: [value[0], value[1] === range[1] ? null : value[1]],
					})
				}
				className="py-4"
				thumbClassName="h-5 w-5 bg-white border-2 border-rose-500 shadow-md hover:border-rose-600"
				trackClassName="h-2 bg-gray-100"
				rangeClassName="h-2 bg-rose-500"
			/>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<label className="text-xs text-gray-500">{label} tối thiểu</label>
					<input
						type="text"
						value={filters[attribute] ? format(filters[attribute][0]) : ""}
						onChange={(e) => {
							const value = toNumber(e.target.value);
							if (!isNaN(value)) {
								setFilters({
									...filters,
									[attribute]: [value, filters[attribute] ? filters[attribute][1] : null],
								});
							}
						}}
						className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
						placeholder="0"
					/>
				</div>
				<div className="space-y-2">
					<label className="text-xs text-gray-500">{label} tối đa</label>
					<input
						type="text"
						value={
							filters[attribute] && filters[attribute][1] !== null
								? format(filters[attribute][1])
								: ""
						}
						onChange={(e) => {
							const inputValue = e.target.value.trim();
							if (inputValue === "") {
								setFilters({
									...filters,
									[attribute]: [filters[attribute] ? filters[attribute][0] : 0, null],
								});
							} else {
								const value = toNumber(inputValue);
								if (!isNaN(value)) {
									setFilters({
										...filters,
										[attribute]: [filters[attribute] ? filters[attribute][0] : 0, value],
									});
								}
							}
						}}
						className="w-full rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
						placeholder="Không giới hạn"
					/>
				</div>
			</div>
		</div>
	);
};
const SelectAddressComponent = ({ setFilter, filter }) => {
	// Derive selected city and district directly from filter state
	const selectedCity = province.find((city) => city.code === filter.apart_city);
	const selectedDistrict = selectedCity?.districts?.find(
		(district) => district.code === filter.apart_district,
	);

	const handleCityChange = (value) => {
		const numericValue = +value;
		const { apart_city, apart_district, apart_ward, ...rest } = filter;
		if (numericValue === -1) {
			// Reset all address fields when "Please select" is chosen
			setFilter({
				...rest,
				apart_city: -1,
			});
		} else {
			// Reset district and ward when city changes
			setFilter({
				...filter,
				apart_city: numericValue,
				apart_district: -1,
			});
		}
	};

	const handleDistrictChange = (value) => {
		const numericValue = +value;
		if (numericValue === -1) {
			// Reset district and ward
			const { apart_district, apart_ward, ...rest } = filter;
			setFilter(rest);
		} else {
			// Reset ward when district changes
			setFilter({
				...filter,
				apart_district: numericValue,
				apart_ward: -1,
			});
		}
	};

	const handleWardChange = (value) => {
		const numericValue = +value;
		setFilter({
			...filter,
			apart_ward: numericValue !== -1 ? numericValue : undefined,
		});
	};

	return (
		<>
			<div className="space-y-2">
				<label htmlFor="apart_city" className="text-sm font-medium">
					Tỉnh/Thành phố
				</label>
				<Select value={filter.apart_city?.toString() || "-1"} onValueChange={handleCityChange}>
					<SelectTrigger>
						<SelectValue placeholder="Chọn Tỉnh/Thành phố" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="-1">Vui lòng chọn tỉnh/thành phố</SelectItem>
						{province.map((city) => (
							<SelectItem key={city.code} value={city.code.toString()}>
								{city.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* District */}
			{selectedCity && (
				<div className="space-y-2">
					<label htmlFor="apart_district" className="text-sm font-medium">
						Quận/Huyện
					</label>
					<Select
						value={filter.apart_district?.toString() || "-1"}
						onValueChange={handleDistrictChange}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn Quận/Huyện" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="-1">Vui lòng chọn quận/huyện</SelectItem>
							{selectedCity.districts?.map((district) => (
								<SelectItem key={district.code} value={district.code.toString()}>
									{district.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Ward */}
			{selectedDistrict && (
				<div className="space-y-2">
					<label htmlFor="apart_ward" className="text-sm font-medium">
						Phường/Xã
					</label>
					<Select value={filter.apart_ward?.toString() || "-1"} onValueChange={handleWardChange}>
						<SelectTrigger>
							<SelectValue placeholder="Chọn Phường/Xã" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="-1">Vui lòng chọn phường/xã</SelectItem>
							{selectedDistrict.wards?.map((ward) => (
								<SelectItem key={ward.code} value={ward.code.toString()}>
									{ward.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		</>
	);
};
const SelectComponent = ({ attribute, setFilter, filter, options, displayName, label, unit }) => {
	return (
		<div className="space-y-2">
			<label className="text-sm font-medium">{label}</label>
			<Select
				onValueChange={(value) => {
					if (value !== -1) {
						const valueSplit = value.split("+");
						if (valueSplit.length > 1) {
							delete filter[attribute];
							setFilter({
								...filter,
								[`${attribute}_gte`]: parseInt(valueSplit[0]),
							});
						} else {
							delete filter[`${attribute}_gte`];
							setFilter({
								...filter,
								[attribute]: parseInt(valueSplit[0]),
							});
						}
					} else {
						delete filter[attribute];
						delete filter[`${attribute}_gte`];
						setFilter({
							...filter,
						});
					}
				}}
			>
				<SelectTrigger className="w-full font-medium">
					<SelectValue placeholder={displayName} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={-1}>{displayName}</SelectItem>
					{Array.from(options).map((value) => (
						<SelectItem key={value} value={value}>
							{`${attribute === "apart_type" ? ENUM_STRING_APARTMENT_TYPE[value] : value} ${unit}`}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
export const SearchFilter = ({ filter, setFilter, onFilter }) => {
	const [searchParams] = useSearchParams();
	return (
		<div className="w-full lg:w-72 bg-white rounded-xl shadow-sm p-4 h-fit space-y-2">
			<div className="mb-6 flex items-center justify-between">
				<h3 className="text-lg font-semibold">Bộ lọc</h3>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						setFilter({
							page: filter.page ?? 1,
							limit: filter.limit ?? 10,
							orderType: filter.orderType ?? "desc",
						});
					}}
					className="h-8 text-muted-foreground hover:bg-rose-400 hover:text-white"
				>
					<X className="mr-1 h-4 w-4" />
					Xóa bộ lọc
				</Button>
			</div>
			{rangeAttributes.map((item) => (
				<RangeComponent
					key={item.attribute}
					label={item.label}
					setFilters={setFilter}
					attribute={item.attribute}
					unit={item.unit}
					filters={filter}
					range={item.range}
					step={item.step}
					format={item.format}
					toNumber={item.toNumber}
				/>
			))}
			<SelectAddressComponent filter={filter} setFilter={setFilter} />
			{selectAttributes.map((item) => (
				<SelectComponent
					key={item.attribute}
					label={item.label}
					attribute={item.attribute}
					displayName={item.displayName}
					filter={filter}
					setFilter={setFilter}
					options={item.options}
					unit={item.unit}
				></SelectComponent>
			))}
			<div className="items-top flex space-x-2">
				<Checkbox
					id="terms1"
					onCheckedChange={(checked) => {
						if (!checked) delete filter.apart_status;
						setFilter({
							...filter,
							...(checked ? { apart_status: ENUM_STATUS_APARTMENT.IS_VERIFIED } : {}),
						});
					}}
					checked={filter.apart_status ?? false}
				/>
				<div className="grid gap-1.5 leading-none">
					<Label
						htmlFor="terms1"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Chỉ hiện thị tin được xác thực
					</Label>
				</div>
			</div>
			<Button
				className="mt-4 w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-0"
				onClick={async () => {
					await onFilter({
						...handleClearFilter(filter),
						...(searchParams.get("q") ? { apart_title_like: `${searchParams.get("q")}` } : {}),
					});
				}}
			>
				Tìm kiếm
			</Button>
		</div>
	);
};
