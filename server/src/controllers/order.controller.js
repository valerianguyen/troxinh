const { SUCCESS, CREATED } = require("../core/success.response");
const OrderService = require("../services/order.service");
class OrderController {
	static async getOrderByCode(req, res) {
		const { order_code } = req.params;
		return new SUCCESS({
			metadata: await OrderService.getOrderByCode({ order_code, usr_id: req.user.userId }),
		}).send(res);
	}
	static async getOrders(req, res) {
		const { userId, role } = req.user;
		const { limit, page, orderBy, orderType, ...filter } = req.query;
		return new SUCCESS({
			metadata: await OrderService.getOrders({
				usr_id: userId,
				role,
				filter,
				limit,
				page,
				orderBy,
				orderType,
			}),
		}).send(res);
	}
	static async calculateRevenue(req, res) {
		return new SUCCESS({
			metadata: await OrderService.calculateRevenue({
				startDate: req.query.start_date,
				endDate: req.query.end_date,
			}),
		}).send(res);
	}
}
module.exports = OrderController;
