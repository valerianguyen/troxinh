"use client";

import React, {
  useEffect,
  useState,
} from 'react';

import {
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

import ReportApartmentApi from '@/api/reportApartment.api';
import Avatar from '@/components/Avatar';
import PaginationComponent from '@/components/PaginationComponent';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatTimeAgo } from '@/utils';

const GROUP = {
	none: {
		header: ["Nội dung báo cáo", "Tiêu đề bài viết", "Người dùng", "Ngày báo cáo"],
		expand: [],
	},
	user: {
		header: ["Người dùng", "Email"],
		expand: ["Tiêu đề tin đăng", "Mô tả tin đăng", "Nội dung báo cáo", "Ngày báo cáo"],
	},
	apartment: {
		header: ["Tiêu đề tin đăng", "Mô tả tin đăng", "Người đăng"],
		expand: ["Nội dung báo cáo", "Người báo cáo", "Ngày báo cáo"],
	},
};

export default function ReportApartment() {
	const [search, setSearch] = useState("");
	const [data, setData] = useState({});
	const [groupBy, setGroupBy] = useState("none");
	const [expandedRows, setExpandedRows] = useState([]);
	const [filter, setFilter] = useState({ page: 1, limit: 2 });
	// Filter data based on search
	const handleSearch = useDebouncedCallback((term) => {
		const key = "apart_title_like";
		if (term !== "") {
			setFilter({ ...filter, [key]: term, page: 1 });
			groupedData(groupBy, { ...filter, page: 1, [key]: term }, true);
		} else {
			if (filter[key]) {
				delete filter[key];
			}
			groupedData(groupBy, filter, true);
		}
	}, 500);
	// Group data if needed
	const groupedData = async (value, filter = {}, refresh = false) => {
		if (value === "none" && refresh) {
			const res = await ReportApartmentApi.searchReport({
				filter,
			});
			if (res.status === 200) {
				setData({
					none: {
						data: res.metadata.data.reports,
						total: res.metadata.data.total,
					},
				});
			}
		}
		if (value === "user") {
			if (!data["user"] || refresh) {
				const res = await ReportApartmentApi.groupByUserId({
					filter,
				});
				if (res.status === 200) {
					setData((prev) => ({
						...prev,
						user: {
							data: res.metadata.data.users,
							total: res.metadata.data.total,
						},
					}));
				}
			}
		}
		if (value === "apartment") {
			if (!data["apartment"] || refresh) {
				const res = await ReportApartmentApi.groupByApartmentId({
					filter,
				});
				if (res.status === 200) {
					setData((prev) => ({
						...prev,
						apartment: {
							data: res.metadata.data.apartments,
							total: res.metadata.data.total,
						},
					}));
				}
			}
		}
		setGroupBy(value);
	};

	const toggleRow = (id) => {
		setExpandedRows((prev) =>
			prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
		);
	};

	const isRowExpanded = (id) => expandedRows.includes(id);
	useEffect(() => {
		groupedData(groupBy, filter, true);
	}, [filter.limit, filter.page]);
	return (
		<Card className="w-full max-w-6xl mx-auto">
			<CardHeader>
				<CardTitle>Báo cáo của người dùng</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
					<div className="flex-1">
						<Input
							placeholder="Tìm kiếm theo tiêu đề tin đăng..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								handleSearch(e.target.value);
							}}
							className="max-w-sm"
						/>
					</div>
					<Select
						value={groupBy}
						onValueChange={(value) => {
							groupedData(value);
						}}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Group by..." />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">Mặc định</SelectItem>
							<SelectItem value="user">Nhóm theo người báo cáo</SelectItem>
							<SelectItem value="apartment">Nhóm theo tin</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								{GROUP[groupBy]?.header.map((header, index) => {
									return (
										<TableHead key={header} data-test={`report-${header}`}>
											{header}
										</TableHead>
									);
								})}
							</TableRow>
						</TableHeader>
						<TableBody>
							{data[groupBy]?.data?.map((item, index) => (
								<React.Fragment
									key={
										groupBy === "none"
											? item.report_id
											: groupBy === "user"
											? item.usr_id
											: item.apart_id
									}
								>
									<TableRow>
										{groupBy !== "none" ? (
											<>
												<TableCell>
													<div className="flex items-center">
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 flex-grow-0 flex-shrink-0"
															onClick={() =>
																toggleRow(groupBy === "user" ? item.usr_id : item.apart_id)
															}
														>
															{isRowExpanded(groupBy === "user" ? item.usr_id : item.apart_id) ? (
																<ChevronDown className="h-4 w-4" />
															) : (
																<ChevronRight className="h-4 w-4" />
															)}
														</Button>
														{groupBy === "user" ? (
															<>
																<NavLink to={`/user/profile/${item.usr_id}`}>
																	<Avatar
																		size={10}
																		usr_avatar={item.usr_avatar}
																		usr_name={item.usr_name}
																	></Avatar>
																</NavLink>
															</>
														) : (
															<NavLink className="line-clamp-1" to={`/apartment/${item.apart_id}`}>
																{item.apart_title}
															</NavLink>
														)}
													</div>
												</TableCell>
												{groupBy === "user" ? (
													<>
														<TableCell>{item.usr_email}</TableCell>
													</>
												) : (
													<>
														<TableCell>
															<span className="line-clamp-1">{item.apart_description}</span>
														</TableCell>
														<TableCell>
															<NavLink to={`/user/profile/${item.user.usr_id}`}>
																<Avatar
																	size={10}
																	usr_avatar={item.user.usr_avatar}
																	usr_name={item.user.usr_name}
																></Avatar>
															</NavLink>
														</TableCell>
													</>
												)}
											</>
										) : (
											<>
												<TableCell>{item.report_content}</TableCell>
												<TableCell>
													<NavLink
														className="line-clamp-1"
														to={`/apartment/${item.apartment.apart_id}`}
													>
														{item.apartment.apart_title}
													</NavLink>
												</TableCell>
												<TableCell>
													<NavLink to={`/user/profile/${item.user.usr_id}`}>
														<Avatar
															size={10}
															usr_avatar={item.user.usr_avatar}
															usr_name={item.user.usr_name}
														></Avatar>
													</NavLink>
												</TableCell>
												<TableCell>{formatTimeAgo(item.createdAt)}</TableCell>
											</>
										)}
									</TableRow>
									{groupBy !== "none" &&
										isRowExpanded(groupBy === "user" ? item.usr_id : item.apart_id) && (
											<TableRow>
												<TableCell colSpan={5}>
													<div className="py-2 px-4">
														<Table>
															<TableHeader>
																<TableRow>
																	{GROUP[groupBy]?.expand.map((header, index) => {
																		return (
																			<TableHead key={header}>
																				<span className="w-max inline-block">{header}</span>
																			</TableHead>
																		);
																	})}
																</TableRow>
															</TableHeader>
															<TableBody>
																{item.reports.map((report, index) => (
																	<TableRow key={index}>
																		{groupBy === "user" ? (
																			<>
																				<TableCell>{report.apartment.apart_title}</TableCell>
																				<TableCell>
																					<span className="line-clamp-1">
																						{report.apartment.apart_description}
																					</span>
																				</TableCell>
																				<TableCell>{report.report_content}</TableCell>
																				<TableCell>
																					<span className="w-max inline-block">
																						{formatTimeAgo(report.createdAt)}
																					</span>
																				</TableCell>
																			</>
																		) : (
																			<>
																				<TableCell>{report.report_content}</TableCell>
																				<TableCell>
																					<NavLink to={`/user/profile/${report.user.usr_id}`}>
																						<Avatar
																							size={10}
																							usr_avatar={report.user.usr_avatar}
																							usr_name={report.user.usr_name}
																						></Avatar>
																					</NavLink>
																				</TableCell>
																				<TableCell>{formatTimeAgo(report.createdAt)}</TableCell>
																			</>
																		)}
																	</TableRow>
																))}
															</TableBody>
														</Table>
													</div>
												</TableCell>
											</TableRow>
										)}
								</React.Fragment>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
			<PaginationComponent total={data[groupBy]?.total} filter={filter} setFilter={setFilter} />
		</Card>
	);
}
