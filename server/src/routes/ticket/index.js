'use strict'
const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const TicketController = require('../../controllers/ticket.controller')
const { authentication, checkRole } = require('../../middlewares/checkAuth.middleware')
const { ENUM_ROLE } = require('../../constant')
const validateFactory = require('../../middlewares/validation.middleware')
const { createTicket, searchTicket, replyTicket, updateTicketStatus } = require('../../validations/ticket.validation')
const router = express.Router()

router.use(authentication)

router.post('/', checkRole([ENUM_ROLE.USER]), validateFactory(createTicket), asyncHandler(TicketController.createTicket));
router.get('/:ticketId', checkRole([ENUM_ROLE.STAFF, ENUM_ROLE.USER]), asyncHandler(TicketController.getTicketById));
router.get('/', checkRole([ENUM_ROLE.STAFF, ENUM_ROLE.USER]), validateFactory(searchTicket), asyncHandler(TicketController.searchTicket));
router.post('/:ticketId/reply', checkRole([ENUM_ROLE.STAFF, ENUM_ROLE.USER]), validateFactory(replyTicket), asyncHandler(TicketController.replyTicket));
router.put('/:ticketId/cancel', checkRole([ENUM_ROLE.USER]), asyncHandler(TicketController.cancelTicket));
router.put('/:ticketId/', checkRole([ENUM_ROLE.STAFF]), validateFactory(updateTicketStatus), asyncHandler(TicketController.updateTicketStatus));

module.exports = router;
// Compare this snippet from server/src/services/ticket.service.js: