import {
  useEffect,
  useState,
} from 'react';

import {
  endOfWeek,
  format,
  startOfWeek,
  subMonths,
} from 'date-fns';
import {
  CalendarIcon,
  DollarSign,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import OrderApi from '@/api/order.api';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Generate sample data for different time periods
const formatData = (data, timeframe) => {
	const formatDisplayDate = (date) => {
		const formatString = {
			daily: "MMM dd",
			weekly: "MMM dd",
			monthly: "MMM yyyy",
			yearly: "yyyy",
		};
		return format(date, formatString[timeframe]);
	};
	const getDisplayDate = {
		daily: (item) => formatDisplayDate(item.date),
		weekly: (item) => {
			const startWeek = startOfWeek(item.weekStart, {
				weekStartsOn: 1,
			});
			const endWeek = endOfWeek(item.weekStart, {
				weekStartsOn: 1,
			});
			return `${format(startWeek, "MMM dd")} - ${format(endWeek, "MMM dd")}`;
			// weekStart = 9* 7
		},
		monthly: (item) => formatDisplayDate(item.month),
		yearly: (item) => item.year,
	};
	return data.map((item) => ({
		...(item.date ? { date: format(item.date, "yyyy-MM-dd") } : {}),
		displayDate: getDisplayDate[timeframe](item),
		revenue: parseFloat(item.revenue),
		orders: item.orders,
	}));
};

export default function RevenueChart() {
	const [timeframe, setTimeframe] = useState("daily");
	const [loading, setLoading] = useState(true);
	const [dateRange, setDateRange] = useState({
		from: subMonths(new Date(), 3),
		to: new Date(),
	});
	const [revenue, setRevenue] = useState(null);

	useEffect(() => {
		async function getRevenue(params) {
			const res = await OrderApi.calculateRevenue(params);
			if (res?.status === 200) {
				setRevenue(res.metadata.data);
			}
		}
		getRevenue({
			start_date: dateRange?.from,
			end_date: dateRange?.to,
		});
		setLoading(false);
	}, [dateRange?.from, dateRange?.to]);
	if (loading) return <Loading />;
	if (!revenue) return null;
	// Calculate total revenue
	const data = formatData(revenue[timeframe], timeframe);
	const totalRevenue = data.reduce((sum, item) => sum + (parseInt(item.revenue) ?? 0), 0);
	const totalOrders = data.reduce((sum, item) => sum + (parseInt(item.orders) ?? 0), 0);

	// Format currency
	const formatCurrency = (value) => {
		return new Intl.NumberFormat("vi-VI", {
			style: "currency",
			currency: "VND",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(value);
	};

	// Format date range for display
	const FormatDateRange = () => {
		return dateRange?.from ? (
			dateRange.to ? (
				<>
					{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
				</>
			) : (
				format(dateRange.from, "LLL dd, y")
			)
		) : (
			<span>Chọn khoảng thời gian</span>
		);
	};

	return (
		<div className="space-y-4 h-full flex flex-col px-4 py-3">
			<div className="flex flex-col sm:flex-row justify-between gap-4">
				<h2 className="text-lg font-semibold">Biểu đồ lợi nhuận</h2>
				<div className="flex flex-col sm:flex-row gap-2">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								id="date"
								variant={"outline"}
								className={cn(
									"w-full justify-start text-left font-normal sm:w-[300px]",
									!dateRange && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{<FormatDateRange />}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="end">
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={dateRange?.from}
								selected={dateRange}
								onSelect={(range) => {
									const now = new Date();
									const currentHours = now.getHours();
									const currentMinutes = now.getMinutes();
									const currentSeconds = now.getSeconds();

									// If range has from and to dates, set their time components
									const updatedRange = {
										from: range.from ? new Date(range.from) : undefined,
										to: range.to ? new Date(range.to) : undefined,
									};

									if (updatedRange.from) {
										updatedRange.from.setHours(currentHours, currentMinutes, currentSeconds);
									}
									if (updatedRange.to) {
										updatedRange.to.setHours(currentHours, currentMinutes, currentSeconds);
									}
									if (
										(updatedRange.from && updatedRange.from.getTime() > now.getTime()) ||
										(updatedRange.to && updatedRange.to.getTime() > now.getTime())
									) {
										return;
									}

									setDateRange(updatedRange);
								}}
								numberOfMonths={2}
								max={new Date()}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tổng lợi nhuận</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
						<p className="text-xs text-muted-foreground">Trong khoảng thời gian được chọn</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tổng số đơn hàng</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Trong khoảng thời gian được chọn</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Trung bình mỗi đơn hàng</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<rect width="20" height="14" x="2" y="5" rx="2" />
							<path d="M2 10h20" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalOrders ? formatCurrency(totalRevenue / totalOrders) : 0}
						</div>
						<p className="text-xs text-muted-foreground">Trong khoảng thời gian được chọn</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Lợi nhuận mỗi{" "}
							{timeframe === "daily"
								? "ngày"
								: timeframe === "weekly"
								? "tuần"
								: timeframe === "monthly"
								? "tháng"
								: "năm"}
						</CardTitle>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							className="h-4 w-4 text-muted-foreground"
						>
							<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
						</svg>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{data.length ? formatCurrency(totalRevenue / data.length) : 0}
						</div>
						<p className="text-xs text-muted-foreground">
							{timeframe === "daily"
								? "Trung bình mỗi ngày"
								: timeframe === "weekly"
								? "Trung bình mỗi tuần"
								: timeframe === "monthly"
								? "Trung bình mỗi tháng"
								: "Trung bình mỗi năm"}
						</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div>
							<CardTitle>Thống kê lợi nhuận</CardTitle>
							<CardDescription>
								Xem thống kê theo{" "}
								{timeframe === "daily"
									? "ngày"
									: timeframe === "weekly"
									? "tuần"
									: timeframe === "monthly"
									? "tháng"
									: "năm"}
							</CardDescription>
						</div>
						<Tabs value={timeframe} onValueChange={setTimeframe} className="w-full sm:w-auto">
							<TabsList className="grid grid-cols-4 w-full sm:w-auto">
								<TabsTrigger value="daily">Ngày</TabsTrigger>
								<TabsTrigger value="weekly">Tuần</TabsTrigger>
								<TabsTrigger value="monthly">Tháng</TabsTrigger>
								<TabsTrigger value="yearly">Năm</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</CardHeader>
				<CardContent className="pt-4">
					<div>
						<ChartContainer
							config={{
								revenue: {
									label: "Revenue",
									color: "hsl(var(--chart-1))",
								},
								orders: {
									label: "Orders",
									color: "hsl(var(--chart-2))",
								},
							}}
						>
							{timeframe === "daily" ? (
								<LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
									<XAxis dataKey="displayDate" tickLine={false} axisLine={false} tickMargin={10} />
									<YAxis
										yAxisId="left"
										tickLine={false}
										axisLine={false}
										tickFormatter={(value) => formatCurrency(value)}
									/>
									<YAxis
										yAxisId="right"
										orientation="right"
										tickLine={false}
										axisLine={false}
										domain={[0, "dataMax + 10"]}
									/>
									<CartesianGrid vertical={false} strokeDasharray="3 3" />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Line
										yAxisId="left"
										type="monotone"
										dataKey="revenue"
										stroke="var(--color-revenue)"
										strokeWidth={2}
										dot={false}
									/>
									<Line
										yAxisId="right"
										type="monotone"
										dataKey="orders"
										stroke="var(--color-orders)"
										strokeWidth={2}
										dot={false}
									/>
								</LineChart>
							) : (
								<BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
									<XAxis dataKey="displayDate" tickLine={false} axisLine={false} tickMargin={10} />
									<YAxis
										tickLine={false}
										axisLine={false}
										tickFormatter={(value) => formatCurrency(value)}
									/>
									<CartesianGrid vertical={false} strokeDasharray="3 3" />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
								</BarChart>
							)}
						</ChartContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
