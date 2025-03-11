import axiosClient from './axiosClient';

export default class CommentApi {
	static getCommentById(apartmentId,params) {
		return axiosClient.get(`comments/${apartmentId}`,{
			params
		});
	}
	static createComment(apart_id, data) {
		return axiosClient.post(`comments/${apart_id}`, data);
	}
	static searchComment(params) {
		return axiosClient.get("comments/", {
			params,
		});
	}
	static updateStatusComment(cmt_id, data) {
		return axiosClient.put(`comments/${cmt_id}`, {}, {
			params: data,
		});
	}
	static deleteComment(cmt_id) {
		return axiosClient.delete(`comments/${cmt_id}`);
	}

}
