import {
  useEffect,
  useState,
} from 'react';

import { format } from 'date-fns';
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  Receipt,
  ShoppingCart,
  XCircle,
} from 'lucide-react';
import {
  NavLink,
  useParams,
} from 'react-router-dom';

import OrderApi from '@/api/order.api';
import Loading from '@/components/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ENUM_ORDER } from '@/constant';
import { formatCurrency } from '@/utils/formatCurrency';

import NotFound from '../_notFound';

export default function PaymentStatusPage() {
	const { orderCode } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	// This would typically come from an API or route params
	if (!orderCode) return <NotFound />;
	const statusConfig = {
		[ENUM_ORDER.SUCCESS]: {
			title: "Thanh toán thành công",
			icon: <CheckCircle className="h-16 w-16 text-green-500" />,
			color: "bg-green-500/10 border-green-500/20",
			badge: (
				<Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
					Đã thanh toán
				</Badge>
			),
		},
		[ENUM_ORDER.PENDING]: {
			title: "Đang chờ thanh toán",
			icon: <Clock className="h-16 w-16 text-amber-500" />,
			color: "bg-amber-500/10 border-amber-500/20",
			badge: (
				<Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">
					Đang chờ thanh toán
				</Badge>
			),
		},
		[ENUM_ORDER.FAILED]: {
			title: "Thanh toán thất bại",
			icon: <XCircle className="h-16 w-16 text-red-500" />,
			color: "bg-red-500/10 border-red-500/20",
			badge: <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Thất bại</Badge>,
		},
	};

	useEffect(() => {
		async function getOrder() {
			const response = await OrderApi.getOrderByCode(orderCode);
			if (response?.status === 200) {
				setOrder({
					...response.metadata.data,
				});
			}
			setLoading(false);
		}
		getOrder();
	}, []);
	if (loading) return <Loading />;
	if (!order) return <NotFound />;
	return (
		<div className="min-h-screen flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 gap-8 flex flex-col">
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className={`p-6 rounded-full mb-4 ${statusConfig[order.order_status].color}`}>
					{statusConfig[order.order_status].icon}
				</div>
				<h2 className="text-2xl md:text-3xl font-bold mb-2">
					{statusConfig[order.order_status].title}
				</h2>
				<p className="text-gray-400 mb-4 max-w-md">{order.order_note}</p>
				{statusConfig[order.order_status].badge}
			</div>

			<Card className="mb-6">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-xl">Mã đơn hàng: {order.order_code}</CardTitle>
							<CardDescription className="flex items-center mt-1">
								<CalendarIcon className="h-4 w-4 mr-1" />
								{format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
							</CardDescription>
						</div>
						<div className="text-right">
							<div className="text-sm text-muted-foreground">Số tiền</div>
							<div className="text-xl font-bold">{formatCurrency(order.order_amount)}</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<h3 className="font-medium flex items-center mb-2">
							<ShoppingCart className="h-4 w-4 mr-2" />
							Thông tin đơn hàng
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
							<div>
								<div className="text-sm text-muted-foreground">Mô tả</div>
								<div>{order.order_info}</div>
							</div>
							{order.order_note && (
								<div>
									<div className="text-sm text-muted-foreground">Ghi chú</div>
									<div>{order.order_note}</div>
								</div>
							)}
						</div>
					</div>

					<Separator />

					<div>
						<h3 className="font-medium flex items-center mb-2">
							<Package className="h-4 w-4 mr-2" />
							Thông tin tin đăng
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
							<div>
								<div className="text-sm text-muted-foreground">Mã tin đăng</div>
								<NavLink
									to={`/apartment/${order.apartment.apart_id}`}
									className={"text-blue-500 hover:underline"}
								>
									#{order.apartment.apart_id}
								</NavLink>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Tiêu đề</div>
								<div>
									<NavLink
										to={`/apartment/${order.apartment.apart_id}`}
										className={"text-blue-500 hover:underline break-words"}
									>
										{order.apartment.apart_title}
									</NavLink>
								</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Mô tả</div>
								<div className="line-clamp-2">{order.apartment.apart_description}</div>
							</div>
						</div>
					</div>

					{order?.order_status !== 0 && (
						<>
							<Separator />
							<div>
								<h3 className="font-medium flex items-center mb-2">
									<CreditCard className="h-4 w-4 mr-2" />
									Thông tin thanh toán
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
									{order.order_pay_date && (
										<div>
											<div className="text-sm text-muted-foreground">Ngày thanh toán</div>
											<div>{format(new Date(order.order_pay_date), "dd/MM/yyyy HH:mm")}</div>
										</div>
									)}
									{order.order_bank_tran_no && (
										<div>
											<div className="text-sm text-muted-foreground">Mã giao dịch ngân hàng</div>
											<div>{order.order_bank_tran_no}</div>
										</div>
									)}
									{order.order_transaction_no && (
										<div>
											<div className="text-sm text-muted-foreground">Mã giao dịch</div>
											<div>{order.order_transaction_no}</div>
										</div>
									)}
								</div>
							</div>
						</>
					)}
				</CardContent>
				<CardFooter className="flex justify-end gap-2">
					{order?.order_status !== 1 && (
						<Button className="bg-red-500 text-white">
							Thanh toán {order?.order_status == -1 && "lại"}
						</Button>
					)}
					{order?.order_status === 1 && (
						<Button variant="outline">
							<Receipt className="h-4 w-4 mr-2" />
							In hóa đơn
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
