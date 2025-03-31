import axiosClient from './axiosClient';

export default class UserApi {
	static me() {
		return axiosClient.get('user/me');
	}
	static getAllUsers(params) {
		return axiosClient.get('/user/', { params });
	}
	static getUserById(id) {
		return axiosClient.get(`/user/profile/${id}`);
	}
	static findUser(params) {
		return axiosClient.post('/user/find', params);
	}
	static updateUser(data) {
		return axiosClient.put(`/user/`, data);
	}
	static banUser(id) {
		return axiosClient.post(`/user/ban/${id}`);
	}
	static changeRoleStaff(id) {
		return axiosClient.put(`/user/role/${id}`);
	}
	static becomeSeller() {
		return axiosClient.post('/user/become-seller');
	}
}
