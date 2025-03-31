const Joi = require("joi");
const registerSchema = {
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	fullName: Joi.string().required(),
	phone: Joi.string().required(),
};
const loginSchema = {
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
};
const forgotPasswordSchema = {
	email: Joi.string().email().required(),
};
const changePasswordSchema = {
	currentPassword: Joi.string().min(6).required(),
	newPassword: Joi.string().min(6).required(),
	confirmPassword: Joi.string().min(6).required(),
};
module.exports = {
	registerSchema,
	loginSchema,
	forgotPasswordSchema,
	changePasswordSchema,
};
