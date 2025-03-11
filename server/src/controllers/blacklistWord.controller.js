const BlacklistService = require("../services/blacklistWord.service");
const { SUCCESS, CREATED } = require("../core/success.response");
class BlacklistWordController {
	static loadBlacklist = async (req, res) => {
		return new SUCCESS({
			metadata: await BlacklistService.loadBlacklist(),
		}).send(res);
	};
	static addBlacklist = async (req, res) => {
		return new CREATED({
			metadata: await BlacklistService.addBlacklist(req.body),
		}).send(res);
	};
	static removeBlacklist = async (req, res) => {
		return new CREATED({
			metadata: await BlacklistService.removeBlacklist(req.body),
		}).send(res);
	};
}
module.exports = BlacklistWordController;
