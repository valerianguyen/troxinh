const Joi = require('joi');
const createRentRequest = {
	apart_id: Joi.number().required(),
	appointmentTime: Joi.number().required(),
}
const updateStatusRentRequest = {
	status: Joi.number().required(),
}
const updateTimeRentRequest = {
	appointmentTime: Joi.number().required(),
}
const findRentRequest = {
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	orderBy: Joi.string().optional().valid('status', 'appointmentTime', 'apart_id', 'usr_id', "createdAt"),
	orderType: Joi.string().optional().valid('asc', 'desc'),
	status: Joi.number().optional(),
	appointmentTime: Joi.string().optional(),
	usr_id: Joi.number().optional(),
	apart_id: Joi.number().optional(),
}

module.exports = {
	createRentRequest,
	updateStatusRentRequest,
	updateTimeRentRequest,
	findRentRequest
}