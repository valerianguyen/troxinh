const Ticket = require('../models/ticketSupport.model');
const ReplyTicket = require('../models/replyTicket.model');
const { ENUM_STATUS_TICKET, ENUM_ROLE } = require('../constant');
const { apiResponse } = require('../utils/response');
const { convertParam } = require('../utils');
const { NotFoundError, BadRequestError } = require('../core/error.response');
const User = require('../models/user.model');
const { Op } = require('sequelize');
class TicketService {
	static async createTicket(data) {
		const {
			usr_id,
			ticket_title,
			ticket_content
		} = data;
		const ticket = await Ticket.create({
			usr_id,
			ticket_title,
			ticket_content
		})
		return apiResponse({
			code: 201,
			message: "Ticket created successfully",
			data: ticket
		})
	}
	static async getTicketById(ticketId, userId, role) {
		const ticket = await Ticket.findOne({
			where: {
				ticket_id: ticketId,
				...(() => (role == ENUM_ROLE.STAFF ? {} : {
					usr_id: userId,
				}))()
			},
			include: [{
				model: ReplyTicket,
				as: 'replies',
				attributes: ["ticket_reply_by", "message", "createdAt"],
				order: [["createdAt", "desc"]]
			}, {
				model: User,
				as: "user",
				attributes: ["usr_id", "usr_name"]
			}, {
				model: User,
				as: "staff",
				attributes: ["usr_id", "usr_name"]
			}],
			attributes: ["ticket_id", "ticket_title", "ticket_content", "ticket_status", "createdAt"],
		});
		if (!ticket) {
			throw new NotFoundError("Không tìm thấy phiếu hỗ trợ.")
		}
		return apiResponse({
			code: 200,
			message: "Ticket found",
			data: ticket
		})
	}
	static async searchTicket({ filter, limit = 10, page = 1, orderBy = "createdAt", orderType = "asc", role, userId }) {
		limit = +limit;
		page = +page;
		const { result, errors } = convertParam(filter)
		if (result?.staff_id && ENUM_ROLE.STAFF != role) {
			delete result.staff_id;
		}
		if (errors.length) {
			throw new BadRequestError(errors.join(","))
		}
		const whereUser = {
			...result,
			usr_id: userId
		}
		const whereStaff = {
			...result,
			[Op.or]: {
				staff_id: role == ENUM_ROLE.STAFF ? userId : "",
				ticket_status: role == ENUM_ROLE.USER ? undefined : {
					[Op.ne]: ENUM_STATUS_TICKET.REPLYING
				},
			}
		}
		const tickets = await Ticket.findAll({
			where: role == ENUM_ROLE.USER ? whereUser : whereStaff,
			limit,
			...(role == ENUM_ROLE.USER ? {
			} : { include: [{ model: User, as: "user", attributes: ["usr_id", "usr_name", "usr_avatar"] }] }),
			offset: (page - 1) * limit,
			order: [[orderBy, orderType]],
			attributes: ["ticket_id", "ticket_title", "ticket_content", "ticket_status", "createdAt"],
		});
		const totalCount = await Ticket.count({
			where: role == ENUM_ROLE.USER ? whereUser : whereStaff
		})
		return apiResponse({
			code: 200,
			message: "Tickets found",
			data: {
				tickets,
				totalCount
			}
		})
	}
	static async updateTicketStatus(ticketId, status) {
		if (!status) {
			throw new BadRequestError("Thiếu trạng thái phiếu")
		}
		const ticket = await Ticket.findOne({
			where: {
				ticket_id: ticketId
			}
		});
		if (!ticket) {
			throw new NotFoundError("Không tìm thấy phiếu hỗ trợ.")
		}
		if (![ENUM_STATUS_TICKET.PENDING, ENUM_STATUS_TICKET.REPLYING].includes(ticket.ticket_status)) {
			throw new BadRequestError("Phiếu đã bị hủy,từ chối hoặc đã xử lý.")
		}
		// When the ticket is replied by staff, the status will be changed to REPLYING, you cannot change the status into rejected status
		if (ticket.ticket_status == ENUM_STATUS_TICKET.REPLYING && status == ENUM_STATUS_TICKET.REJECTED) {
			throw new BadRequestError("Bạn không thể đánh dấu là từ chối khi phiếu đang ở trạng thái xử lý")
		}
		// When the ticket is pending, the status cannot be changed into done status
		if (ticket.ticket_status == ENUM_STATUS_TICKET.PENDING && status == ENUM_STATUS_TICKET.DONE) {
			throw new BadRequestError("Bạn không thể đánh dấu là đã xử lý khi phiếu đang ở trạng thái chờ")
		}
		// When the ticket is canceled, the status cannot be changed into done/pending or replying
		if (ticket.ticket_status == ENUM_STATUS_TICKET.CANCEL && [ENUM_STATUS_TICKET.DONE, ENUM_STATUS_TICKET.PENDING, ENUM_STATUS_TICKET.REPLYING].includes(status)) {
			throw new BadRequestError("Bạn không thể đánh dấu là đã xử lý, chờ hoặc đang xử lý khi phiếu đã bị hủy")
		}
		ticket.ticket_status = status;
		await ticket.save();
		return apiResponse({
			code: 200,
			message: "Ticket status updated",
			data: ticket
		})
	}
	static async cancelTicket(ticketId, userId) {

		const ticket = await Ticket.findOne({
			where: {
				ticket_id: ticketId,
				usr_id: userId
			}
		});
		if (!ticket) {
			throw new NotFoundError("Không tìm thấy phiếu hỗ trợ.")
		}
		// only pending tickets can be canceled
		if ([ENUM_STATUS_TICKET.PENDING].includes(ticket.ticket_status)) {
			ticket.ticket_status = ENUM_STATUS_TICKET.CANCEL;
			await ticket.save();
			return apiResponse({
				code: 200,
				message: "Ticket canceled",
				data: ticket
			})
		}
		throw new BadRequestError("Phiếu đã bị hủy,từ chối hoặc đã xử lý.")

	}
	static async replyTicket(data) {
		const {
			ticket_reply_by,
			message,
			ticket_id,
			usr_id,
		} = data;
		const ticket = await Ticket.findOne({
			where: {
				ticket_id
			}
		});
		if (!ticket) {
			throw new NotFoundError("Không tìm thấy phiếu hỗ trợ.")
		}
		if ([ENUM_STATUS_TICKET.CANCEL, ENUM_STATUS_TICKET.DONE, ENUM_STATUS_TICKET.REJECTED].includes(ticket.ticket_status)) {
			throw new BadRequestError("Phiếu đã bị hủy,từ chối hoặc đã xử lý")
		}
		if (ticket.staff_id && ticket.staff_id != usr_id && ticket_reply_by == ENUM_ROLE.STAFF) {
			throw new BadRequestError("Phiếu hỗ trợ này đang được xử lý bởi một người khác")
		}
		if (!(ticket_reply_by == ENUM_ROLE.STAFF) && usr_id != ticket.usr_id) {
			throw new BadRequestError("Bạn không có quyền trả lời phiếu hỗ trợ này")
		}
		const [reply, _] = await Promise.all([ReplyTicket.create({
			ticket_id,
			ticket_reply_by,
			message
		}), (async () => {
			if (ticket_reply_by == ENUM_ROLE.STAFF) {
				ticket.ticket_status = ENUM_STATUS_TICKET.REPLYING;
				ticket.staff_id = usr_id;
				await ticket.save();
			}
		})()]);
		return apiResponse({
			code: 201,
			message: "Reply created successfully",
			data: reply
		})
	}
}
module.exports = TicketService;
