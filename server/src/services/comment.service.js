const Comment = require("../models/comment.model");
const Apartment = require("../models/apartment.model");
const { apiResponse } = require("../utils/response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { ENUM_COMMENT, ENUM_RENT_REQUEST, ENUM_ROLE } = require("../constant");
const RentRequest = require("../models/rentRequest.model");
const { getInfoData } = require("../utils");
const { convertParam } = require("../utils");
const User = require("../models/user.model");
class CommentService {
	static async createComment(usr_id, data) {
		const { cmt_rate, apart_id, cmt_content } = data;
		const comment = await Comment.create({
			usr_id,
			apart_id,
			cmt_rate,
			cmt_content,
		});
		return apiResponse({
			code: 201,
			message: "Comment request created successfully",
			data: getInfoData(
				["cmt_content", "cmt_rate", "apart_id", "usr_id", "createdAt", "cmt_id"],
				comment,
			),
		});
	}
	static async getCommentById({
		apart_id,
		filter,
		limit = 10,
		page = 1,
		orderBy = "cmt_rate",
		orderType = "asc",
	}) {
		const [comments, totalCount] = await Promise.all([
			Comment.findAll({
				where: {
					apart_id,
					...filter,
				},
				include: [
					{
						model: User,
						as: "user",
						attributes: ["usr_id", "usr_name", "usr_avatar"],
					},
				],
				limit: +limit,
				offset: (+page - 1) * +limit,
				order: [[orderBy, orderType]],
			}),
			Comment.count({ where: { apart_id } }),
		]);
		return apiResponse({
			message: "Comment found",
			code: 200,
			data: {
				comments,
				totalCount,
			},
		});
	}

	static async searchComment({
		usr_id,
		filter,
		role = ENUM_ROLE.USER,
		page = 1,
		limit = 10,
		orderBy = "cmt_rate",
		orderType = "asc",
	}) {
		// Safeguard against invalid inputs
		page = Math.max(1, parseInt(page, 10) || 1);
		limit = Math.max(1, parseInt(limit, 10) || 10);
		const offset = (page - 1) * limit;

		// Convert and validate filter parameters
		const { result: cleanedFilter, errors } = convertParam(filter || {});
		if (errors.length) throw new BadRequestError(errors.join(", "));
		// Extract dynamic filters
		const { usr_name, ...otherFilters } = cleanedFilter;

		// Construct dynamic 'where' and 'include' conditions
		const userWhere = usr_name ? { usr_name } : {};
		const commentWhere = {
			...otherFilters,
		};

		const includeUser = {
			model: User,
			as: "user",
			attributes: ["usr_name", "usr_avatar"],
			where: userWhere,
			required: true,
		};

		// Query comments with pagination and ordering
		const comments = await Comment.findAll({
			include: [includeUser],
			attributes: [
				"cmt_id",
				"usr_id",
				"apart_id",
				"cmt_rate",
				"cmt_content",
				"createdAt",
			],
			where: commentWhere,
			limit,
			offset,
			order: [
				["createdAt", "desc"],
				[orderBy, orderType === "desc" ? "DESC" : "ASC"],
			],
		});

		// Count total comments for pagination
		const totalCount = await Comment.count({
			include: [includeUser],
			where: commentWhere,
		});

		// Construct API response
		return apiResponse({
			message: "Comments found",
			data: {
				comments,
				totalCount,
			},
			code: 200,
		});
	}
	static async deleteComment(cmt_id) {
		const comment = await Comment.findByPk(cmt_id);
		if (!comment) {
			throw new NotFoundError("Không tìm thấy bình luận nào");
		}
		await comment.destroy();
		return apiResponse({
			message: "Comment deleted successfully",
		});
	}
}
module.exports = CommentService;
