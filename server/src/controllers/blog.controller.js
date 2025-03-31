const { SUCCESS, CREATED } = require("../core/success.response");
const BlogService = require("../services/blog.service");
class BlogController {
	static getBlogById = async (req, res) => {
		const { blog_id } = req.params;
		return new SUCCESS({
			metadata: await BlogService.getBlogById({
				blog_id,
			}),
		}).send(res);
	};
	static createBlog = async (req, res) => {
		const { blog_title, blog_content, blog_image } = req.body;
		return new CREATED({
			metadata: await BlogService.createBlog({
				blog_title,
				blog_content,
				blog_image,
				usr_id: req.user.userId,
			}),
		}).send(res);
	};
	static updateBlog = async (req, res) => {
		const { blog_id } = req.params;
		const { blog_title, blog_content, blog_image } = req.body;
		return new SUCCESS({
			metadata: await BlogService.updateBlog({
				blog_id,
				blog_title,
				blog_content,
				blog_image,
				user_id: req.user.userId,
			}),
		}).send(res);
	};

	static getBlogs = async (req, res) => {
		const { page, limit, orderBy, orderType } = req.query;
		return new SUCCESS({
			metadata: await BlogService.getBlogs({
				page,
				limit,
				orderBy,
				orderType,
			}),
		}).send(res);
	};
	static async getMyBlogs(req, res) {
		const { page, limit, orderBy, orderType } = req.query;
		return new SUCCESS({
			metadata: await BlogService.getMyBlogs({
				page,
				limit,
				orderBy,
				orderType,
				user_id: req.user.userId,
				role: req.user.role,
			}),
		}).send(res);
	}
	static deleteBlog = async (req, res) => {
		const { blog_id } = req.params;
		return new SUCCESS({
			metadata: await BlogService.deleteBlog({
				blog_id,
				user_id: req.user.userId,
			}),
		}).send(res);
	};
}
module.exports = BlogController;
