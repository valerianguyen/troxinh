const ApartmentService = require("../services/apartment.service");
const { SUCCESS, CREATED } = require("../core/success.response");
class ApartmentController {
	static getApartmentById = async (req, res) => {
		const { apart_id } = req.params;
		return new SUCCESS({
			metadata: await ApartmentService.getApartmentById({
				apart_id,
				role: req?.user?.role,
				id: req?.user?.userId,
			}),
		}).send(res);
	};
	static createApartment = async (req, res) => {
		return new CREATED({
			metadata: await ApartmentService.createApartment(req.user.userId, {
				...req.body,
				ip_address:
					req.headers["x-forwarded-for"] ||
					req.connection.remoteAddress ||
					req.socket.remoteAddress ||
					req.connection.socket.remoteAddress,
			}),
		}).send(res);
	};
	static updateApartment = async (req, res) => {
		const { apart_id } = req.params;
		return new SUCCESS({
			metadata: await ApartmentService.updateApartment(apart_id, req.user.userId, req.body),
		}).send(res);
	};
	static getMyApartment = async (req, res) => {
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		return new SUCCESS({
			metadata: await ApartmentService.searchApartment({
				data: {
					...filter,
					usr_id: req.user.userId,
				},
				role: req.user.role,
				page,
				limit,
				orderBy,
				orderType,
				stat: true,
			}),
		}).send(res);
	};
	static searchApartment = async (req, res) => {
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		return new SUCCESS({
			metadata: await ApartmentService.searchApartment({
				data: {
					...filter,
					usr_id: req?.user?.userId || filter.usr_id,
				},
				page,
				limit,
				role: req?.user?.role,
				orderBy,
				orderType,
			}),
		}).send(res);
	};
	static deleteApartment = async (req, res) => {
		const { apart_id } = req.params;
		if (!apart_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		if (isNaN(apart_id)) {
			throw new BadRequestError("Tham số không đúng");
		}
		return new SUCCESS({
			metadata: await ApartmentService.deleteApartment(apart_id),
		}).send(res);
	};
	static async publishApartment(req, res) {
		const { apart_id, userId } = req.params;
		if (!apart_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		if (isNaN(apart_id)) {
			throw new BadRequestError("Tham số không đúng");
		}
		return new SUCCESS({
			metadata: await ApartmentService.publishApartment(apart_id, userId),
		}).send(res);
	}
	static async unPublishApartment(req, res) {
		const { apart_id, userId } = req.params;
		if (!apart_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		if (isNaN(apart_id)) {
			throw new BadRequestError("Tham số không đúng");
		}
		return new SUCCESS({
			metadata: await ApartmentService.unPublishApartment(apart_id, userId),
		}).send(res);
	}
	static async blockApartment(req, res) {
		const { apart_id, userId } = req.params;
		const { reason } = req.body;
		if (!apart_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		if (isNaN(apart_id)) {
			throw new BadRequestError("Tham số không đúng");
		}
		return new SUCCESS({
			metadata: await ApartmentService.blockApartment(apart_id, userId, reason),
		}).send(res);
	}
	static async boostApartment(req, res) {
		const { apart_id } = req.params;
		const { userId } = req.user;
		const { priority, duration } = req.body;
		return new SUCCESS({
			metadata: await ApartmentService.boostApartment({
				apart_id,
				userId,
				priority,
				duration,
				ip_address:
					req.headers["x-forwarded-for"] ||
					req.connection.remoteAddress ||
					req.socket.remoteAddress ||
					req.connection.socket.remoteAddress,
			}),
		}).send(res);
	}
	static async getConfigAmountPriority(req, res) {
		return new SUCCESS({
			metadata: await ApartmentService.getConfigAmountPriority(),
		}).send(res);
	}
}
module.exports = ApartmentController;
