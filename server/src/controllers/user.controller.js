const { SUCCESS } = require('../core/success.response');
const UserService = require('../services/users.service');

class UserController {
	static async me(req, res) {
		return new SUCCESS({
			metadata: await UserService.me(req.user.userId),
		}).send(res);
	}
	static async getAllUsers(req, res) {
		const { page, limit, orderType, orderBy, ...filter } = req.query;
		return new SUCCESS({
			metadata: await UserService.getAllUsers({
				page,
				limit,
				orderType,
				orderBy,
				filter
			}),
		}).send(res);
	}
	static async getUserById(req, res) {
		const { id } = req.params;
		return new SUCCESS({
			metadata: await UserService.getUserById(id),
		}).send(res);
	}

	static async findUser(req, res) {
		return new SUCCESS({
			metadata: await UserService.findUser(req.body),
		}).send(res);
	}
	static async updateUser(req, res) {
		const data = req.body;
		return new SUCCESS({
			metadata: await UserService.updateUser(req.user.userId, data),
		}).send(res);
	}
	static async banUser(req, res) {
		const { id } = req.params;
		return new SUCCESS({
			metadata: await UserService.banUser(id),
		}).send(res);
	}
	static async changeRoleStaff(req, res) {
		const { id } = req.params;
		return new SUCCESS({
			metadata: await UserService.changeRoleStaff(id),
		}).send(res);
	}
	static async becomeSeller(req, res) {
		return new SUCCESS({
			metadata: await UserService.becomeSeller({
				userId: req.user.userId,
				phone: req.user.phone,
				address: req.user.address
			}),
		}).send(res);
	}
}
module.exports = UserController;