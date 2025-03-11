const { ENUM_ROLE, ENUM_APARTMENT_CATEGORIES } = require("../constant");
const { apiResponse } = require("../utils/response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { validateAddress, getInfoData, convertParam } = require("../utils");
const sequelize = require("../dbs/init.mysql");
const { Op } = require("sequelize");
const Apartment = require("../models/apartment.model");
const ReportApartment = require("../models/reportApartment.model");
const User = require("../models/user.model");
const { includes } = require("lodash");
class ReportApartmentService {
	// create report for user( 1 apartment/1 report/ 1 user)
	// update report for user
	// search report for admin, staff
	// get report by id
	// delete report by id
	// group by user_id get count report of that user
	// group by apartment_id get count report of that apartment
	// UI has table and group by user_id, and apart_id and default is all
	static async createReport({ report_usr_id, report_apart_id, report_content }) {
		// if report exist
		const report = await ReportApartment.findOne({
			where: {
				report_usr_id,
				report_apart_id,
			},
		});
		if (report) {
			throw new BadRequestError("Bạn đã báo cáo bài viết này rồi");
		}
		const newReport = await ReportApartment.create({
			report_usr_id,
			report_apart_id,
			report_content,
		});
		return apiResponse({
			data: newReport,
			message: "Báo cáo thành công",
			code: 201,
		});
	}
	static async updateReport({ report_id, report_content }) {
		const report = await ReportApartment.findByPk(report_id);
		if (!report) {
			throw new NotFoundError("Báo cáo không tồn tại");
		}
		const updatedReport = await report.update({ report_content });
		return apiResponse({
			data: updatedReport,
			message: "Cập nhật báo cáo thành công",
			code: 200,
		});
	}
	static async searchReport({
		filter,
		page = 1,
		limit = 10,
		orderBy = "createdAt",
		orderType = "desc",
	}) {
		page = Math.max(1, parseInt(page, 10) || 1);
		limit = Math.max(1, parseInt(limit, 10) || 10);
		const offset = limit * (page - 1);
		const { result: query, errors } = convertParam(filter);
		if (errors.length > 0) {
			throw new BadRequestError(errors.join(", "));
		}
		const { apart_title } = query;
		const reports = await ReportApartment.findAndCountAll({
			include: [
				{
					model: User,
					as: "user",
					attributes: ["usr_id", "usr_name", "usr_email", "usr_phone", "usr_avatar"],
				},
				{
					model: Apartment,
					as: "apartment",
					attributes: ["apart_id", "apart_title", "apart_description"],
					where: apart_title ? { apart_title } : {},
				},
			],
			offset,
			limit,
			order: [[orderBy, orderType.toUpperCase()]],
		});
		return apiResponse({
			data: {
				reports: reports.rows,
				total: reports.count,
				limit,
				page,
			},
			message: "Danh sách báo cáo",
			code: 200,
		});
	}
	static async getReportById({ apart_id, usr_id }) {
		const report = await ReportApartment.findOne({
			where: {
				report_apart_id: apart_id,
				report_usr_id: usr_id,
			},
		});
		if (!report) {
			throw new NotFoundError("Báo cáo không tồn tại");
		}
		return apiResponse({
			data: report,
			message: "Thông tin báo cáo",
			code: 200,
		});
	}
	static async deleteReport(report_id) {
		const report = await ReportApartment.findByPk(report_id);
		if (!report) {
			throw new NotFoundError("Báo cáo không tồn tại");
		}
		const result = await report.destroy();
		return apiResponse({
			message: "Xóa báo cáo thành công",
			code: 200,
			data: result ? 1 : 0,
		});
	}
	static async groupByUserId({
		filter,
		page = 1,
		limit = 10,
		orderBy = "createdAt",
		orderType = "desc",
	}) {
		page = Math.max(1, parseInt(page, 10) || 1);
		limit = Math.max(1, parseInt(limit, 10) || 10);
		const offset = limit * (page - 1);
		const { result: query, errors } = convertParam(filter);
		if (errors.length > 0) {
			throw new BadRequestError(errors.join(", "));
		}
		const { apart_title } = query;
		const reports = await User.findAndCountAll({
			include: [
				{
					model: ReportApartment,
					as: "reports",
					attributes: [
						"report_id",
						"report_usr_id",
						"report_apart_id",
						"report_content",
						"createdAt",
						"updatedAt",
					],
					include: [
						{
							model: Apartment,
							as: "apartment",
							where: apart_title ? { apart_title } : {},
							attributes: ["apart_id", "apart_title", "apart_description"],
						},
					],
				},
			],
			where: {
				usr_id: {
					[Op.in]: sequelize.literal(`(
							SELECT DISTINCT report_usr_id FROM ReportApartment
					)`),
				},
			},
			attributes: ["usr_id", "usr_name", "usr_email", "usr_phone", "usr_avatar"],
			distinct: true,
			offset,
			limit,
		});
		return apiResponse({
			data: {
				users: reports.rows,
				total: reports.count,
				limit,
				page,
			},
			message: "Danh sách báo cáo theo user",
			code: 200,
		});
	}
	static async groupByApartmentId({
		filter,
		page = 1,
		limit = 10,
		orderBy = "createdAt",
		orderType = "desc",
	}) {
		page = Math.max(1, parseInt(page, 10) || 1);
		limit = Math.max(1, parseInt(limit, 10) || 10);
		const offset = limit * (page - 1);
		const { result: query, errors } = convertParam(filter);
		if (errors.length > 0) {
			throw new BadRequestError(errors.join(", "));
		}
		const { apart_title } = query;
		const reports = await Apartment.findAndCountAll({
			where: apart_title ? { apart_title } : {},
			include: [
				{
					model: ReportApartment,
					as: "reports",
					required: true,
					include: {
						model: User,
						as: "user",
						attributes: ["usr_id", "usr_name", "usr_email", "usr_phone", "usr_avatar"],
					},
				},
				{
					model: User,
					as: "user",
					attributes: ["usr_id", "usr_name", "usr_email", "usr_phone", "usr_avatar"],
				},
			],
			order: [[{ model: ReportApartment, as: "reports" }, orderBy, orderType]],
			distinct: true,
			offset,
			limit,
		});
		return apiResponse({
			data: {
				apartments: reports.rows,
				total: reports.count,
				limit,
				page,
			},
			message: "Danh sách báo cáo theo tin đăng",
			code: 200,
		});
	}
}
module.exports = ReportApartmentService;
