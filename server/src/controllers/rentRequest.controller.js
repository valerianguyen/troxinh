const RentRequestService = require('../services/rentRequest.service');
const { SUCCESS, CREATED } = require('../core/success.response');
const { ENUM_ROLE, ENUM_RENT_REQUEST } = require('../constant');
class RentRequestController {
	static async createRentRequest(req, res) {
		const { userId } = req.user;
		const data = req.body;
		const rentRequest = await RentRequestService.createRentRequest(userId, data);
		return new CREATED({ metadata: rentRequest }).send(res);
	}

	static async searchRentRequest(req, res) {
		const { userId, role } = req.user;
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		const rentRequest = await RentRequestService.searchRentRequest({ usr_id: userId, role, filter, page, limit, orderBy, orderType });
		return new SUCCESS({ metadata: rentRequest }).send(res);
	}
	static async updateStatusRentRequest(req, res) {
		const { rentRequestId } = req.params;
		const { status } = req.query;
		const { userId, role } = req.user;
		const rentRequest = await RentRequestService.updateRentRequestStatus(rentRequestId, userId, status, role);
		return new SUCCESS({ metadata: rentRequest }).send(res);
	}
	static async updateTimeRentRequest(req, res) {
		const { rentRequestId } = req.params;
		const { appointmentTime } = req.query;
		const { userId } = req.user;
		const rentRequest = await RentRequestService.updateTimeRentRequest(rentRequestId, appointmentTime, userId);
		return new SUCCESS({ metadata: rentRequest }).send(res);
	}

}
module.exports = RentRequestController;

