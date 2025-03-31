const { apiResponse } = require("../utils/response");
const { BadRequestError, AuthorizedError, NotFoundError } = require("../core/error.response");
const BlogModel = require("../models/blog.model");
const UserModel = require("../models/user.model");
const { ENUM_ROLE } = require("../constant");
class BlogService {
	//curd
	static async createBlog({ blog_title, blog_content, blog_image, usr_id }) {
		if (!blog_title || !blog_content || !blog_image || !usr_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		const blog = await BlogModel.create({
			blog_title,
			blog_content,
			blog_image,
			usr_id,
		});
		return apiResponse({
			code: 200,
			message: "Create blog successfully",
			data: blog,
		});
	}
	static async getMyBlogs({
		page = 1,
		limit = 10,
		orderBy = "blog_id",
		orderType = "desc",
		user_id,
		role,
	}) {
		page = +page;
		limit = +limit;
		const offset = (page - 1) * limit;
		const blogs = await BlogModel.findAndCountAll({
			where: {
				...(role === ENUM_ROLE.ADMIN ? {} : { usr_id: user_id }),
			},
			...(ENUM_ROLE.ADMIN === role
				? {
						include: {
							model: UserModel,
							as: "user",
							attributes: ["usr_id", "usr_name", "usr_avatar"],
						},
				  }
				: {}),
			order: [[orderBy, orderType]],
			limit,
			offset,
		});
		return apiResponse({
			code: 200,
			message: "Get my blogs successfully",
			data: {
				blogs: blogs.rows,
				total: blogs.count,
			},
		});
	}
	static async getBlogs({ page = 1, limit = 10, orderBy = "blog_id", orderType = "desc" }) {
		page = +page;
		limit = +limit;
		const offset = (page - 1) * limit;
		const blogs = await BlogModel.findAndCountAll({
			include: {
				model: UserModel,
				as: "user",
				attributes: ["usr_id", "usr_name", "usr_avatar"],
			},
			order: [[orderBy, orderType]],
			limit,
			offset,
		});

		return apiResponse({
			code: 200,
			message: "Get blogs successfully",
			data: {
				blogs: blogs.rows,
				total: blogs.count,
			},
		});
	}
	static async getBlogById({ blog_id }) {
		const blog = await BlogModel.findByPk(blog_id, {
			include: {
				model: UserModel,
				as: "user",
				attributes: ["usr_id", "usr_name", "usr_avatar"],
			},
		});
		if (!blog) {
			throw new NotFoundError("Không tìm thấy bài viết");
		}
		return apiResponse({
			code: 200,
			message: "Get blog successfully",
			data: blog,
		});
	}
	static async updateBlog({ blog_id, blog_title, blog_content, blog_image, user_id }) {
		if (!blog_id || !blog_title || !blog_content || !blog_image) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		const blog = await BlogModel.findOne({
			where: {
				blog_id,
				usr_id: user_id,
			},
		});
		if (!blog) {
			throw new NotFoundError("Không tìm thấy bài viết");
		}
		blog.blog_title = blog_title;
		blog.blog_content = blog_content;
		blog.blog_image = blog_image;
		await blog.save();
		return apiResponse({
			code: 200,
			message: "Update blog successfully",
			data: blog,
		});
	}
	static async deleteBlog({ blog_id, user_id }) {
		if (!blog_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		const blog = await BlogModel.findOne({
			where: {
				blog_id,
				usr_id: user_id,
			},
		});
		if (!blog) {
			throw new NotFoundError("Không tìm thấy bài viết");
		}
		await blog.destroy();
		return apiResponse({
			code: 200,
			message: "Delete blog successfully",
			data: blog,
		});
	}
}

module.exports = BlogService;
