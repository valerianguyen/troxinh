const TicketService = require('../services/ticket.service');
const { CREATED, SUCCESS } = require('../core/success.response');
class TicketController {
	static async createTicket(req, res) {
		return new CREATED({
			metadata: await TicketService.createTicket({
				...req.body,
				usr_id: req.user.userId,
			})
		}).send(res)
	}
	static async getTicketById(req, res) {
		const { userId, role } = req.user;
		return new SUCCESS({
			metadata: await TicketService.getTicketById(req.params.ticketId, userId, role)
		}).send(res)
	}
	static async updateTicketStatus(req, res) {
		return new SUCCESS({
			metadata: await TicketService.updateTicketStatus(req.params.ticketId, req.query.status)
		}).send(res)
	}
	static async searchTicket(req, res) {
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		const {userId,role} = req.user;
		return new SUCCESS({
			metadata: await TicketService.searchTicket({
				filter,
				limit,
				page,
				orderBy,
				orderType,
				userId,
				role
			})
		}).send(res)
	}
	static async replyTicket(req, res) {
		return new CREATED({
			metadata: await TicketService.replyTicket({
				...req.body,
				ticket_id: req.params.ticketId,
				ticket_reply_by: req.user.role,
				usr_id: req.user.userId
			})
		}).send(res)
	}
	static async cancelTicket(req, res) {
		return new SUCCESS({
			metadata: await TicketService.cancelTicket(req.params.ticketId, req.user.userId)
		}).send(res)
	}
}
module.exports = TicketController;