const { ENUM_ROLE, ENUM_APARTMENT_CATEGORIES } = require("../constant");
const { apiResponse } = require("../utils/response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertParam } = require("../utils/");
const Order = require("../models/order.model");
const Apartment = require("../models/apartment.model");
const User = require("../models/user.model");
const { ENUM_ORDER } = require("../constant");
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");
class OrderService {
	// get order by order code
	// get all order for user and admin
	// calculate revenue
	static async getOrderByCode({ order_code, usr_id }) {
		const order = await Order.findOne({
			where: {
				order_code,
				order_usr_id: usr_id,
			},
			include: [
				{
					model: Apartment,
					as: "apartment",
					attributes: [
						"apart_id",
						"apart_title",
						"apart_price",
						"apart_address",
						"apart_description",
					],
				},
			],
			attributes: [
				"order_code",
				"order_amount",
				"order_status",
				"order_info",
				"order_note",
				"createdAt",
				"order_pay_date",
				"order_bank_tran_no",
				"order_transaction_no",
				"order_bank_code",
			],
		});
		if (!order) {
			throw new NotFoundError("Không tìm thấy đơn hàng");
		}
		return apiResponse({
			message: "Thông tin đơn hàng",
			code: 200,
			data: order,
		});
	}
	static async getOrders({
		usr_id,
		role,
		filter,
		limit = 10,
		page = 1,
		orderBy = "createdAt",
		orderType = "desc",
	}) {
		const { result: query, errors } = convertParam(filter);
		if (errors.length > 0) {
			throw new BadRequestError(errors.join(", "));
		}
		if (role === ENUM_ROLE.USER && query?.usr_id) {
			delete query.usr_id;
		}
		const [orders, totalCount] = await Promise.all([
			Order.findAll({
				where: {
					...query,
					...([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF].includes(role) ? {} : { order_usr_id: usr_id }),
				},
				include: [
					{
						model: Apartment,
						as: "apartment",
						attributes: ["apart_id", "apart_title", "apart_price", "apart_address"],
					},
				],
				attributes: [
					"order_code",
					"order_amount",
					"order_status",
					"order_info",
					"order_note",
					"createdAt",
					"order_pay_date",
					"order_bank_tran_no",
					"order_transaction_no",
					"order_bank_code",
				],
				limit: +limit,
				offset: (+page - 1) * +limit,
				order: [[orderBy, orderType]],
			}),
			Order.count({
				where: {
					...([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF].includes(role) ? {} : { order_usr_id: usr_id }),
					...query,
				},
			}),
		]);
		return apiResponse({
			message: "Danh sách đơn hàng",
			code: 200,
			data: {
				orders,
				totalCount,
			},
		});
	}

	static async calculateRevenue({ startDate = null, endDate = null }) {
		// Set default date range if not provided
		const end = endDate ? new Date(endDate) : new Date();
		const start = startDate ? new Date(startDate) : moment().subtract(1, "year").toDate();

		const dateCondition = {
			createdAt: {
				[Op.between]: [start, end],
			},
			order_status: ENUM_ORDER.SUCCESS,
		};

		// Daily revenue (for the past 30 days by default)
		const dailyRevenue = await Order.findAll({
			attributes: [
				[Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
				[Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
				[Sequelize.fn("COUNT", Sequelize.col("order_id")), "orders"],
			],
			where: {
				...dateCondition,
				createdAt: {
					[Op.gte]: moment().subtract(30, "days").toDate(),
					[Op.lte]: end,
				},
			},
			group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
			order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
		});

		// Weekly revenue
		const weeklyRevenue = await Order.findAll({
			attributes: [
				[Sequelize.fn("YEARWEEK", Sequelize.col("createdAt"), 1), "yearWeek"],
				[Sequelize.fn("MIN", Sequelize.fn("DATE", Sequelize.col("createdAt"))), "weekStart"],
				[Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
				[Sequelize.fn("COUNT", Sequelize.col("order_id")), "orders"],
			],
			where: dateCondition,
			group: [Sequelize.fn("YEARWEEK", Sequelize.col("createdAt"), 1)],
			order: [[Sequelize.fn("YEARWEEK", Sequelize.col("createdAt"), 1), "ASC"]],
		});

		// Monthly revenue
		const monthlyRevenue = await Order.findAll({
			attributes: [
				[Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"), "month"],
				[Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
				[Sequelize.fn("COUNT", Sequelize.col("order_id")), "orders"],
			],
			where: dateCondition,
			group: [Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m")],
			order: [[Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"), "ASC"]],
		});

		// Yearly revenue
		const yearlyRevenue = await Order.findAll({
			attributes: [
				[Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
				[Sequelize.fn("SUM", Sequelize.col("order_amount")), "revenue"],
				[Sequelize.fn("COUNT", Sequelize.col("order_id")), "orders"],
			],
			where: dateCondition,
			group: [Sequelize.fn("YEAR", Sequelize.col("createdAt"))],
			order: [[Sequelize.fn("YEAR", Sequelize.col("createdAt")), "ASC"]],
		});

		// Get total revenue and failed orders in a single query
		const statistics = await Order.findAll({
			attributes: [
				"order_status",
				[Sequelize.fn("SUM", Sequelize.col("order_amount")), "totalAmount"],
				[Sequelize.fn("COUNT", Sequelize.col("order_id")), "totalCount"],
			],
			where: {
				createdAt: dateCondition.createdAt,
			},
			group: ["order_status"],
		});
		const statsMap = statistics.reduce((acc, stat) => {
			acc[stat.order_status] = {
				amount: stat.dataValues.totalAmount || 0,
				count: stat.dataValues.totalCount || 0,
			};
			return acc;
		}, {});

		return apiResponse({
			message: "Lợi nhuận",
			code: 200,
			data: {
				daily: dailyRevenue,
				weekly: weeklyRevenue,
				monthly: monthlyRevenue,
				yearly: yearlyRevenue,
				stats: statsMap,
			},
		});
	}
}

module.exports = OrderService;
