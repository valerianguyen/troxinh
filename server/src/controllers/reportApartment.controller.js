const { SUCCESS, CREATED } = require("../core/success.response");
const ReportApartmentService = require("../services/reportApartment.service");
class ReportApartmentController {
	static createReport = async (req, res) => {
		return new CREATED({
			metadata: await ReportApartmentService.createReport({
				report_usr_id: req.user.userId,
				report_apart_id: req.params.apart_id,
				report_content: req.body.report_content,
			}),
		}).send(res);
	};
	static updateReport = async (req, res) => {
		return new SUCCESS({
			metadata: await ReportApartmentService.updateReport({
				report_id: req.params.report_id,
				report_content: req.body.report_content,
			}),
		}).send(res);
	};
	static searchReport = async (req, res) => {
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		return new SUCCESS({
			metadata: await ReportApartmentService.searchReport({
				page,
				limit,
				orderBy,
				orderType,
				filter,
			}),
		}).send(res);
	};
	static getReport = async (req, res) => {
		return new SUCCESS({
			metadata: await ReportApartmentService.getReportById({
				apart_id: req.params.apart_id,
				usr_id: req.user.userId,
			}),
		}).send(res);
	};
	static deleteReport = async (req, res) => {
		return new SUCCESS({
			metadata: await ReportApartmentService.deleteReport({
				report_id: req.params.report_id,
			}),
		}).send(res);
	};
	static groupByUserId = async (req, res) => {
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		return new SUCCESS({
			metadata: await ReportApartmentService.groupByUserId({
				page,
				limit,
				orderBy,
				orderType,
				filter,
			}),
		}).send(res);
	};
	static groupByApartmentId = async (req, res) => {
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		return new SUCCESS({
			metadata: await ReportApartmentService.groupByApartmentId({
				page,
				limit,
				orderBy,
				orderType,
				filter,
			}),
		}).send(res);
	};
}
module.exports = ReportApartmentController;
