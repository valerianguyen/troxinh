const Joi = require('joi');

const createReport = {
	apart_id: Joi.number().required(),
	report_content: Joi.string().required(),
}
const updateReport = {
	report_id: Joi.number().required(),
	report_content: Joi.string().required(),
}
const searchReport = {
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	orderBy: Joi.string().optional().valid('createdAt'),
	orderType: Joi.string().optional().valid('asc', 'desc'),
	usr_name_like: Joi.string().optional(),
	apart_title_like: Joi.string().optional(),
}
const getReportById = {
	apart_id: Joi.number().required(),
}
const groupByUserId = {
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	orderBy: Joi.string().optional().valid('createdAt'),
	orderType: Joi.string().optional().valid('asc', 'desc'),
	usr_name_like: Joi.string().optional(),
}
const groupByApartmentId = {
	page: Joi.number().optional(),
	limit: Joi.number().optional(),
	orderBy: Joi.string().optional().valid('createdAt'),
	orderType: Joi.string().optional().valid('asc', 'desc'),
	apart_title_like: Joi.string().optional(),
}

module.exports={
	createReport,
	updateReport,
	searchReport,
	getReportById,
	groupByUserId,
	groupByApartmentId
	
}