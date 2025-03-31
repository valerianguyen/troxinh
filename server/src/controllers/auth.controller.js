const AuthService = require("../services/auth.service");
const { BadRequestError } = require("../core/error.response");
const { SUCCESS, CREATED } = require("../core/success.response");

class AuthController {
	static async register(req, res) {
		const { email, password, fullName, phone } = req.body;
		const result = await AuthService.register({ email, password, fullName, phone });
		const { accessToken, refreshToken } = result.data.tokens;
		delete result.data.tokens;
		return new CREATED({
			metadata: {
				...result,
				data: {
					...result.data,
					accessToken,
				},
			},
		})
			.setCookie(res, "refreshToken", refreshToken)
			.send(res);
	}

	static async login(req, res) {
		const { email, password } = req.body;
		const result = await AuthService.login({ email, password });
		const { accessToken, refreshToken } = result.data.tokens;
		delete result.data.tokens;
		return new SUCCESS({
			metadata: {
				...result,
				data: {
					...result.data,
					accessToken,
				},
			},
		})
			.setCookie(res, "refreshToken", refreshToken)
			.send(res);
	}

	static async renew(req, res) {
		const token = req.cookies["refreshToken"];
		const { ["x-client-id"]: userId } = req.headers;
		if (!userId) {
			throw new BadRequestError("Lỗi xác thực");
		}
		const result = await AuthService.refreshToken({ userId, token_value: token });
		const { accessToken, refreshToken } = result.data;
		delete result.data;
		return new SUCCESS({
			metadata: {
				...result,
				accessToken,
			},
		})
			.setCookie(res, "refreshToken", refreshToken)
			.send(res);
	}

	static async logout(req, res) {
		const { userId, tokenTime } = req.user;

		const result = await AuthService.logout({ userId, token_time: tokenTime });
		return new SUCCESS({ metadata: result }).send(res);
	}

	static async changePassword(req, res) {
		const { userId } = req.user;
		const { currentPassword, newPassword, confirmPassword } = req.body;
		const result = await AuthService.changePassword({
			userId,
			currentPassword,
			newPassword,
			confirmPassword,
		});
		return new SUCCESS({ metadata: result }).send(res);
	}
	static async forgotPassword(req, res) {
		const { email } = req.body;
		const result = await AuthService.forgotPassword({ email });
		return new SUCCESS({ metadata: result }).send(res);
	}
}
module.exports = AuthController;
