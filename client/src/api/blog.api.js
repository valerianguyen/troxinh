import axiosClient from './axiosClient';

export default class BlogApi {
	static async getBlogs(params) {
		const url = "/blogs";
		return axiosClient.get(url, { params });
	}
	static async getBlogById(blog_id) {
		const url = `/blogs/${blog_id}`;
		return axiosClient.get(url);
	}
	static async createBlog(blog) {
		const url = "/blogs";
		return axiosClient.post(url, blog);
	}
	static async updateBlog(blog_id, blog) {
		const url = `/blogs/${blog_id}`;
		return axiosClient.put(url, blog);
	}
	static async deleteBlog(blog_id) {
		const url = `/blogs/${blog_id}`;
		return axiosClient.delete(url);
	}
	static async getMyBlogs(params) {
		const url = "/blogs/a/my";
		return axiosClient.get(url, { params });
	}
}
