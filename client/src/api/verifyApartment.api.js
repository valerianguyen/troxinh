import axiosClient from './axiosClient';

export default class VerifyApartmentApi {
	static getVerifyApartments() {
		return axiosClient.get("/verify-apartment");
	}
	static approveApartment(id, data) {
		return axiosClient.post(`/verify-apartment/approve/${id}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	static rejectApartment(id, reason) {
		return axiosClient.post(`/verify-apartment/reject/${id}`, {
			reason,
		});
	}
}
