'use strict';
const RentRequest = require('../models/rentRequest.model');
const { isValidTimestamp, isWithinNextDay, isValidFutureDate, getInfoData, convertParam } = require('../utils');
const { apiResponse } = require('../utils/response');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const Apartment = require('../models/apartment.model');
const { ENUM_RENT_REQUEST, ENUM_ROLE } = require('../constant');

class RentRequestService {
	static async createRentRequest(usr_id, data) {

		const {
			apart_id,
			appointmentTime,
		} = data;
		const isValidTime = isValidTimestamp(appointmentTime);
		if (!isValidTime) {
			throw new BadRequestError('Thời gian không đúng định dạng');
		}
		const isInDay = isValidFutureDate(appointmentTime);
		if (!isInDay) {
			throw new BadRequestError('Thời gian thuê phải là trong ngày hoặc tương lai');
		}
		const apartment = await Apartment.findByPk(apart_id);
		if (!apartment) {
			throw new NotFoundError('Không tìm thấy tin đăng nào');
		}
		const rentRequest = await RentRequest.create({
			usr_id,
			apart_id,
			appointmentTime,
		})
		return apiResponse({
			code: 201,
			message: 'Rent request created successfully',
			data: getInfoData(["status", "usr_id", "apart_id", "appointmentTime", "request_id"], rentRequest),
		});
	}
	static async searchRentRequest({ usr_id, filter, role = ENUM_ROLE.USER, page = 1, limit = 10, orderBy = 'status', orderType = 'asc' }) {
		const offset = (page - 1) * limit;
		const { result, errors } = convertParam(filter);
		if (errors.length) {
			throw new BadRequestError(errors.join(', '));
		}
		// search by user
		if (role === ENUM_ROLE.USER) {
			if (result?.usr_id) delete result.usr_id;
			if (result?.orderBy == 'usr_id') result.orderBy = 'status';
			const rentRequest = await RentRequest.findAll({
				include: [{
					model: Apartment,
					as: "apartment",
					attributes: ["apart_title"],
				}],
				where: {
					usr_id,
					...result,
				},
				attributes: ["request_id", "usr_id", "apart_id", "appointmentTime", "status", "createdAt"],
				limit,
				offset,
				order: [[orderBy, orderType]],
			});
			return apiResponse({
				message: 'Rent request found',
				data: rentRequest
			})
		}
		// search by seller
		const rentRequest = await RentRequest.findAll({
			include: [{
				model: Apartment,
				as: "apartment",
				attributes: ["apart_title"],
				where: {
					usr_id
				}
			}],
			attributes: ["request_id", "usr_id", "apart_id", "appointmentTime", "status", "createdAt"],
			where: result,
			limit,
			offset,
			order: [["createdAt","desc"],[orderBy, orderType]],
		});
		return apiResponse({
			message: 'Rent request found',
			data: rentRequest,
		});
	}
	static async updateRentRequestStatus(rentRequest_id, usr_id, status, role) {
		const rentRequest = await RentRequest.findOne({
			where: {
				request_id: rentRequest_id,
			}
		});
		if (role != ENUM_ROLE.SELLER && usr_id != rentRequest.usr_id) {
			throw new BadRequestError('Chỉ có chủ sở hữu mới có thể hủy');
		}
		if (!rentRequest) {
			throw new BadRequestError('Yêu cầu thuê không tìm thấy');
		}
		if (role != ENUM_ROLE.USER && status == ENUM_RENT_REQUEST.CANCEL) {
			throw new BadRequestError('Chỉ có người thuê mới có thể hủy');
		}
		if (rentRequest.status === ENUM_RENT_REQUEST.PENDING) {
			rentRequest.status = status;
			await rentRequest.save();
			return apiResponse({
				message: 'Rent request updated successfully',
				data: getInfoData(["status", "usr_id", "apart_id", "appointmentTime", "createdAt"], rentRequest),
			});
		}
		throw new BadRequestError('Yêu cầu đã bị hủy, từ chối hoặc đã được chấp thuận.');

	}
	static async updateTimeRentRequest(rentRequest_id, appointmentTime, userId) {
		const isValidTime = isValidTimestamp(appointmentTime);
		if (!isValidTime) {
			throw new BadRequestError('Thời gian không đúng định dạng');
		}
		const isInDay = isValidFutureDate(appointmentTime);
		if (!isInDay) {
			throw new BadRequestError('Thời gian thuê phải là trong ngày hoặc tương lai');
		}
		const rentRequest = await RentRequest.findOne({
			where: {
				request_id: rentRequest_id,
				usr_id: userId
			}
		});
		if (!rentRequest) {
			throw new BadRequestError('Yêu cầu thuê không tìm thấy');
		}
		if (rentRequest.status === ENUM_RENT_REQUEST.PENDING) {
			rentRequest.appointmentTime = appointmentTime;
			await rentRequest.save();
			return apiResponse({
				message: 'Rent request updated successfully',
				data: getInfoData(["status", "usr_id", "apart_id", "appointmentTime", "createdAt"], rentRequest),
			});
		}
		throw new BadRequestError('Yêu cầu đã bị hủy,từ chối hoặc đã được chấp thuận.');
	}

}
module.exports = RentRequestService;