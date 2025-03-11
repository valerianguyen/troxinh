const Joi = require('joi');
const { ENUM_COMMENT } = require('../constant');

module.exports = {
	// POST /v1/comments
	createComment: {
		apart_id: Joi.number().required(),
		cmt_content: Joi.string().required(),
		cmt_rate: Joi.number().required(),
	},

	// GET /v1/comments
	searchComments: {
		usr_name: Joi.string().optional(),
		status: Joi.string().optional(),
		cmt_rate: Joi.number().optional().min(1).max(5),
		page: Joi.number().optional(),
		limit: Joi.number().optional(),
		orderBy: Joi.string().optional().valid('status', 'createdAt', 'usr_id', 'cmt_rate', 'apart_id'),
		orderType: Joi.string().optional().valid("desc", "asc"),
	},
	guestSearchComment: {
		page: Joi.number().optional(),
		limit: Joi.number().optional(),
		cmt_rate: Joi.number().optional().min(1).max(5),
		cmt_status: Joi.string().optional(),
		orderBy: Joi.string().optional().valid('createdAt', 'cmt_rate'),
		orderType: Joi.string().optional().valid("desc", "asc"),
	},

	// PUT /v1/comments/:commentId
	updateComment: {
		cmt_id: Joi.number().required(),
		status: Joi.number().required().valid(ENUM_COMMENT.REJECTED,ENUM_COMMENT.APPROVED),
	},

	// DELETE /v1/comments/:commentId
	deleteComment: {
		cmt_id: Joi.number().required(),
	},
}