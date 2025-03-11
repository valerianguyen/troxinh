const { AuthorizedError, BadRequestError } = require("../core/error.response");
const Token = require("../models/token.model");
const User = require("../models/user.model");
const { generateTokenPair } = require('../utils/generateToken');
const jwt = require("jsonwebtoken");
class TokenService {
	static async createToken({ usr_id }) {
		const now = Date.now();
		const tokens = generateTokenPair({ id: usr_id,timestamp: now })
		const newToken = await Token.create({
			token_value: tokens.refreshToken,
			token_usr_id: usr_id,
			token_time: "" + now,
		});
		return newToken ? tokens : null;
	}
	static async findToken(token_value) {
		return await Token.findOne({ where: { token_value } });
	}
	static async renewToken({ userId, token_value }) {
		const userDecoded = jwt.verify(token_value, process.env.REFRESH_TOKEN_SECRET);
		if (userDecoded.id != userId) {
			throw new BadRequestError("Lỗi xác thực");
		}
		const user = await User.findOne({ where: { usr_id: userId } });
		const now = Date.now();
		const tokens = generateTokenPair({ id: user.usr_id, timestamp: now })
		const newToken = await Token.update({ token_time: "" + now, token_value: tokens.refreshToken }, {
			where: {
				token_value,
			}
		});
		return newToken[0] ? tokens : null
	}
	static async deleteToken({ userId, timestamp }) {
		return await Token.destroy({
			where: {
				token_usr_id: userId,
				token_time: timestamp,
			}
		});
	}
}
module.exports = TokenService;