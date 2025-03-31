import axiosClient from './axiosClient';

export default class ApartmentApi {
	static getMyApartment(params) {
		return axiosClient.get("apartment/a/my/seller", {
			params: params,
		});
	}
	static searchApartment(params) {
		return axiosClient.get(`apartment/a/search`, {
			params: params,
		});
	}
	static searchGuestApartment(params) {
		return axiosClient.get(`apartment/g/search`, {
			params: params,
		});
	}
	static getApartmentById(apart_id) {
		if (localStorage.getItem("accessToken")) {
			return axiosClient.get(`apartment/${apart_id}`);
		}
		return axiosClient.get(`apartment/g/${apart_id}`);
	}
	static createApartment(data) {
		return axiosClient.post("apartment/", data);
	}
	static updateApartment(apart_id, data) {
		return axiosClient.put(`apartment/${apart_id}`, data);
	}
	static deleteApartment(apart_id) {
		return axiosClient.delete(`apartment/${apart_id}`);
	}
	static publishApartment(userId, apart_id) {
		return axiosClient.post(`apartment/publish/${userId}/${apart_id}`);
	}
	static unPublishApartment(userId, apart_id) {
		return axiosClient.post(`apartment/unpublish/${userId}/${apart_id}`);
	}
	static blockApartment(userId, apart_id, reason) {
		return axiosClient.post(`apartment/block/${userId}/${apart_id}`, { reason });
	}
	static boostApartment(apart_id, data) {
		return axiosClient.post(`apartment/boost/${apart_id}`, data);
	}
	static getConfigAmountPriority() {
		return axiosClient.get("apartment/boost/config");
	}
	static payApartment(apart_id) {
		return axiosClient.post(`apartment/pay/${apart_id}`);
	}
	static unBlockApartment(userId, apart_id) {
		return axiosClient.post(`apartment/unblock/${userId}/${apart_id}`);
	}
	static verifyApartment(apart_id) {
		return axiosClient.post(`apartment/verify/${apart_id}`);
	}
}
