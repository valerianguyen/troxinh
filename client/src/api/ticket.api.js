import axiosClient from "./axiosClient";
export default class TicketApi {
	static createTicket(data) {
		return axiosClient.post('ticket/', data);
	}
	static getTicketById(ticketId) {
		return axiosClient.get(`ticket/${ticketId}`);
	}
	static searchTicket(params) {
		return axiosClient.get(`ticket/`, { params });
	}
	static replyTicket(ticketId, data) {
		return axiosClient.post(`ticket/${ticketId}/reply`, data);
	}
	static cancelTicket(ticketId) {
		return axiosClient.put(`ticket/${ticketId}/cancel`);
	}
	static updateTicketStatus(ticketId, data) {
		return axiosClient.put(`ticket/${ticketId}`, {}, {
			params: data
		});
	}
}
/**
 * router.post('/', checkRole([ENUM_ROLE.USER]), validateFactory(createTicket), asyncHandler(TicketController.createTicket));
router.get('/:ticketId', checkRole([ENUM_ROLE.STAFF, ENUM_ROLE.USER]), asyncHandler(TicketController.getTicketById));
router.get('/', checkRole([ENUM_ROLE.STAFF, ENUM_ROLE.USER]), validateFactory(searchTicket), asyncHandler(TicketController.searchTicket));
router.post('/:ticketId/reply', checkRole([ENUM_ROLE.STAFF, ENUM_ROLE.USER]), validateFactory(replyTicket), asyncHandler(TicketController.replyTicket));
router.put('/:ticketId/cancel', checkRole([ENUM_ROLE.USER]), asyncHandler(TicketController.cancelTicket));
router.put('/:ticketId/', checkRole([ENUM_ROLE.STAFF]), validateFactory(updateTicketStatus), asyncHandler(TicketController.updateTicketStatus));
 */