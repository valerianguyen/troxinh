const Joi = require('joi');
const { ENUM_STATUS_TICKET } = require('../constant');

module.exports = {
	createTicket: {
		ticket_title: Joi.string().required(),
		ticket_content: Joi.string().required(),
	},
	searchTicket: {
		page: Joi.number().integer().min(1).default(1),
		limit: Joi.number().integer().min(1).default(10),
		orderBy: Joi.string().valid('ticket_id', 'ticket_title', 'createdAt').default('createdAt'),
		orderType: Joi.string().valid('asc', 'desc').default('desc'),
		ticket_status: Joi.number().integer().valid(...Object.values(ENUM_STATUS_TICKET)).optional(),
		usr_id: Joi.number().integer().optional(),
	},
	updateTicketStatus: {
		status: Joi.number().integer().valid(...Object.values(ENUM_STATUS_TICKET)).required(),
	},
	replyTicket: {
		message: Joi.string().required(),
	},
	getTicketById: {
		ticketId: Joi.number().integer().required()
	}
}