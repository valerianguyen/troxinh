const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// Generate access token
function generateAccessToken({ id, timestamp }) {
	return jwt.sign({ id, timestamp }, accessTokenSecret, { expiresIn: "3d" });
}

// Generate refresh token
function generateRefreshToken({ id }) {
	return jwt.sign({ id }, refreshTokenSecret, { expiresIn: "7d" });
}
function generateTokenPair({ id, timestamp }) {
	return {
		accessToken: generateAccessToken({ id, timestamp }),
		refreshToken: generateRefreshToken({ id }),
	}
}
module.exports = { generateTokenPair };
