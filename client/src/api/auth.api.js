import axiosClient from './axiosClient';

export default class AuthApi {
	static register(data) {
		return axiosClient.post("/auth/register", data);
	}
	static login(data) {
		return axiosClient.post("/auth/login", data);
	}
	static renew() {
		return axiosClient.post("/auth/renew");
	}
	static logout() {
		return axiosClient.post("/auth/logout");
	}
	static changePassword(data) {
		return axiosClient.post("/auth/change-password", data);
	}
	static forgotPassword(data) {
		return axiosClient.post("/auth/forgot-password", data);
	}
}
