const CommentService = require('../services/comment.service');
const { SUCCESS, CREATED } = require('../core/success.response');
const { ENUM_ROLE, ENUM_RENT_REQUEST } = require('../constant');
class CommentController {
	static async createComment(req, res) {
		const { userId } = req.user;
		const { apart_id } = req.params;
		const data = req.body;
		const comment = await CommentService.createComment(userId, {
			...data,
			apart_id
		});
		return new CREATED({ metadata: comment }).send(res);
	}
	static async getCommentById(req, res) {
		const { apartmentId } = req.params;
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		const Comment = await CommentService.getCommentById({
			apart_id: +apartmentId,
			filter,
			page,
			limit,
			orderBy,
			orderType
		});
		return new SUCCESS({ metadata: Comment }).send(res);
	}
	// just using by seller and admin
	static async searchComment(req, res) {
		const { userId, role } = req.user;
		const { page, limit, orderBy, orderType, ...filter } = req.query;
		const Comment = await CommentService.searchComment({ usr_id: userId, role, filter, page, limit, orderBy, orderType });
		return new SUCCESS({ metadata: Comment }).send(res);
	}
	static async updateStatusComment(req, res) {
		const { cmt_id } = req.params;
		const { status } = req.query;
		const comment = await CommentService.updateStatusComment(cmt_id, status);
		return new SUCCESS({ metadata: comment }).send(res);
	}
	static async deleteComment(req, res) {
		const { cmt_id } = req.params;
		const comment = await CommentService.deleteComment(cmt_id);
		return new SUCCESS({ metadata: comment }).send(res);
	}

}
module.exports = CommentController;

