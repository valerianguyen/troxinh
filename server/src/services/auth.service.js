"use strict";
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { BadRequestError, AuthorizedError } = require("../core/error.response");
const { getInfoData } = require("../utils");

const { apiResponse } = require("../utils/response");
const TokenService = require("./tokens.service");
const { generateTokenPair } = require("../utils/generateToken");
const EmailService = require("./email.service");
const { Op } = require("sequelize");
const { ENUM_TYPE_ORDER } = require("../constant/index.js");
class AuthService {
	static async register({ email, password, fullName, phone }) {
		const user = await User.findOne({
			where: {
				[Op.or]: [{ usr_email: email }, { usr_phone: phone }],
			},
		});
		if (user) {
			throw new BadRequestError("Tài khoản đã được đăng ký");
		}

		const newUser = await User.create({
			usr_email: email,
			usr_password: bcrypt.hashSync(password, 10),
			usr_name: fullName,
			usr_phone: phone,
		});
		const tokens = await TokenService.createToken({
			usr_id: newUser.usr_id,
			usr_role: newUser.usr_role,
		});
		if (!tokens) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		return apiResponse({
			code: 200,
			message: "Register successfully",
			data: {
				user: getInfoData(
					["usr_name", "usr_email", "usr_phone", "usr_address", "usr_avatar", "usr_role", "usr_id"],
					newUser,
				),
				tokens,
			},
		});
	}
	static async login({ email, password }) {
		if (!email || !password) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		const user = await User.findOne({ where: { usr_email: email } });
		if (!user || !bcrypt.compareSync(password, user.usr_password)) {
			throw new AuthorizedError("Tài khoản hoặc mật khẩu không chính xác");
		}
		const tokens = await TokenService.createToken({
			usr_id: user.usr_id,
			usr_role: user.usr_role,
		});
		if (!tokens) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		return apiResponse({
			code: 200,
			message: "Login successfully",
			data: {
				user: getInfoData(
					["usr_name", "usr_email", "usr_phone", "usr_address", "usr_avatar", "usr_role", "usr_id"],
					user,
				),
				tokens,
			},
		});
	}

	static async logout({ userId, token_time }) {
		const result = await TokenService.deleteToken({
			userId,
			timestamp: "" + token_time,
		});
		if (!result) {
			throw new BadRequestError("Có lỗi xảy ra");
		}

		return apiResponse({
			code: 200,
			message: "Logout successfully",
			data: result,
		});
	}
	static async refreshToken({ userId, token_value }) {
		const tokens = await TokenService.renewToken({
			userId,
			token_value,
		});
		if (!tokens) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		return apiResponse({
			code: 200,
			message: "Refresh token successfully",
			data: tokens,
		});
	}
	static async changePassword({ userId, currentPassword, newPassword, confirmPassword }) {
		if (newPassword !== confirmPassword) {
			throw new BadRequestError("Mật khẩu mới không trùng khớp");
		}
		const user = await User.findOne({ where: { usr_id: userId } });
		if (!user) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		if (!bcrypt.compareSync(currentPassword, user.usr_password)) {
			throw new BadRequestError("Mật khẩu cũ không chính xác");
		}
		const result = await User.update(
			{
				usr_password: bcrypt.hashSync(newPassword, 10),
			},
			{
				where: { usr_id: userId },
			},
		);
		if (!result) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		return apiResponse({
			code: 200,
			message: "Đổi mật khẩu thành công",
			data: result ? 1 : 0,
		});
	}
	static async forgotPassword({ email }) {
		const user = await User.findOne({ where: { usr_email: email } });
		if (!user) {
			throw new BadRequestError("Email không tồn tại");
		}
		const newPassword = Math.random().toString(36).slice(-8);
		const result = await User.update(
			{
				usr_password: bcrypt.hashSync(newPassword, 10),
			},
			{
				where: { usr_id: user.usr_id },
			},
		);
		if (!result) {
			throw new BadRequestError("Có lỗi xảy ra");
		}
		// send email
		EmailService.send({ receiver: email, templateName: "forgotPassword" })({
			name: user.usr_name,
			new_password: newPassword,
		});
		return apiResponse({
			code: 200,
			message: "Mật khẩu mới đã được gửi qua email",
			data: result ? 1 : 0,
		});
	}
}

module.exports = AuthService;
