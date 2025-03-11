//Path : src\middlewares\validation.middleware.js
"use strict";
const { BadRequestError } = require("../core/error.response");
const Joi = require("joi");
const { pick, getInfoData } = require("../utils");
const { asyncHandler } = require("../helpers/asyncHandler");

const validateFactory = (schema) => {
	return asyncHandler(async (req, res, next) => {
		const validSchema = pick(req, ["params", "query", "body"]);
		const object = getInfoData(Object.keys(schema), validSchema);
		const { _, error } = Joi.compile(schema).validate(object);
		if (error) {
			const errorMessage = error.details
				.map((detail) => {
					return detail.message;
				})
				.join(", ");
			throw new BadRequestError(errorMessage);
		}
		next();
	});
};

module.exports = validateFactory;
