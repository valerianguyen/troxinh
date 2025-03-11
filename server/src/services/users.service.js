const User = require("../models/user.model");
const { apiResponse } = require("../utils/response");
const { BadRequestError } = require("../core/error.response");
const { getInfoData, convertParam } = require("../utils");
const { ENUM_ROLE } = require("../constant");
const Apartment = require("../models/apartment.model");
const Comment = require("../models/comment.model");
const sequelize = require("../dbs/init.mysql");

class UserService {
	static async me(userId) {
		return apiResponse({
			code: 200,
			message: "Get me successfully",
			data: getInfoData(
				["usr_id", "usr_avatar", "usr_name", "usr_role", "usr_phone", "usr_address", "usr_email"],
				await User.findByPk(userId),
			),
		});
	}
	static async getAllUsers({
		page = 1,
		limit = 10,
		orderBy = "usr_id",
		orderType = "desc",
		filter,
	}) {
		limit = +limit;
		page = +page;
		const offset = (page - 1) * limit;
		const { result, errors } = convertParam(filter);
		if (errors.length) {
			throw new BadRequestError(errors.join(", "));
		}
		return apiResponse({
			code: 200,
			message: "Get all users successfully",
			data: {
				users: await User.findAll({
					where: {
						...result,
					},
					attributes: {
						include: [
							[
								sequelize.literal(`(
									SELECT AVG(apartment_avg_rating)
									FROM (
										SELECT AVG(Comment.cmt_rate) as apartment_avg_rating
										FROM Apartment
										LEFT JOIN Comment ON Apartment.apart_id = Comment.apart_id
										WHERE Apartment.usr_id = User.usr_id
										GROUP BY Apartment.apart_id
									) as ApartmentRatings
								)`),
								"overall_avg_rating",
							],
							// Fixed calculation for total reports
							[
								sequelize.literal(`(
									SELECT SUM(apartment_total_report)
									FROM (
										SELECT COUNT(ReportApartment.report_apart_id) as apartment_total_report
										FROM Apartment
										LEFT JOIN ReportApartment ON Apartment.apart_id = ReportApartment.report_apart_id
										WHERE Apartment.usr_id = User.usr_id
										GROUP BY Apartment.apart_id
									) as ApartmentReports
								)`),
								"total_reports",
							],
						],
					},
					include: [],
					limit,
					offset,
					order: [
						["overall_avg_rating", "desc"],
						["total_reports", "desc"],
						["usr_totals_apartment", "desc"],
						[orderBy, orderType],
					],
				}),
				totalCount: await User.count({ where: { ...result } }),
			},
		});
	}
	static async getUserById(id) {
		if (isNaN(id)) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		const user = await User.findByPk(id, {
			attributes: [
				"usr_id",
				"usr_avatar",
				"usr_name",
				"usr_role",
				"usr_phone",
				"usr_address",
				"usr_email",
				"createdAt",
				"usr_totals_apartment",
			],
		});
		if (user.usr_role === ENUM_ROLE.BAN) {
			throw new BadRequestError("Tài khoản này đã bị cấm");
		}
		return apiResponse({
			code: 200,
			message: "Get user by id successfully",
			data: user,
		});
	}
	static async findUser(where) {
		return apiResponse({
			code: 200,
			message: "Find user successfully",
			data: await User.findOne({ where }),
		});
	}
	static async updateUser(id, data = {}) {
		if (isNaN(id)) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		try {
			const result = await User.update(data, {
				where: {
					usr_id: id,
				},
			});
			if (!result[0]) {
				return apiResponse({
					code: 404,
					message: "User not found",
				});
			}
		} catch (err) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		return apiResponse({
			code: 200,
			message: "Update user successfully",
			data: getInfoData(
				["usr_id", "usr_avatar", "usr_name", "usr_role", "usr_phone", "usr_address", "usr_email"],
				await User.findByPk(id),
			),
		});
	}
	static async banUser(id) {
		if (isNaN(id)) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		const data = await User.update(
			{
				usr_role: ENUM_ROLE.BAN,
			},
			{
				where: {
					usr_id: id,
				},
			},
		);
		if (!data[0]) {
			return apiResponse({
				code: 404,
				message: "User not found",
			});
		}
		return apiResponse({
			code: 200,
			message: "Tài khoản này đã bị cấm",
			data: data,
		});
	}
	static async changeRoleStaff(id) {
		if (isNaN(id)) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		const data = await User.update(
			{
				usr_role: ENUM_ROLE.STAFF,
			},
			{
				where: {
					usr_id: id,
				},
			},
		);
		if (!data[0]) {
			return apiResponse({
				code: 404,
				message: "User not found",
			});
		}
		return apiResponse({
			code: 200,
			message: "Change role successfully",
			data: data,
		});
	}
	// static async becomeSeller({ userId, phone, address }) {
	// 	if (isNaN(userId)) {
	// 		throw new BadRequestError("Có lỗi xảy ra")
	// 	}
	// 	if (!phone || !address) {
	// 		throw new BadRequestError("Bạn phải cung cấp email và số điện thoại")
	// 	}
	// 	const data = await User.update({
	// 		usr_role: ENUM_ROLE.SELLER,
	// 	}, {
	// 		where: {
	// 			usr_id: userId,
	// 		},
	// 	})
	// 	if (!data[0]) {
	// 		return apiResponse({
	// 			code: 404,
	// 			message: "User not found",
	// 		});
	// 	}
	// 	return apiResponse({
	// 		code: 200,
	// 		message: "Become seller successfully",
	// 		data: data,
	// 	});
	// }
}
module.exports = UserService;
