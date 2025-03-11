const Joi = require('joi');

const updateUserBody = {
	usr_name: Joi.string().optional(),
	usr_phone: Joi.string().optional(),
	usr_address: Joi.string().optional(),
	usr_avatar: Joi.string().optional(),
}
const findUserBody = {
	usr_email: Joi.number().optional(),
	...updateUserBody,
}
const queryUser = {
	usr_role: Joi.string().optional(),
	usr_name: Joi.string().optional(),
	usr_phone: Joi.string().optional(),
	usr_email: Joi.string().optional(),
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	orderBy: Joi.string().optional().default('usr_id').valid(...Object.keys(findUserBody)),
	orderType: Joi.string().default('desc').optional().valid('asc', 'desc'),
}
module.exports = {
	updateUserBody,
	findUserBody,
	queryUser
};