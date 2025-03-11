import axiosClient from "./axiosClient";
export default class RentRequestApi {
	static createRentRequest(data) {
		return axiosClient.post('requests/', data);
	}
	static updateStatusRentRequest(rentRequestId, data) {
		return axiosClient.patch(`requests/status/${rentRequestId}`, {},{
			params: data
		});
	}
	static updateTimeRentRequest(rentRequestId, data) {
		return axiosClient.patch(`requests/time/${rentRequestId}`, {}, {
			params: data
		});
	}
	static searchRentRequest(params) {
		return axiosClient.get(`requests`,{},{
			params: params
		});
	}
}
