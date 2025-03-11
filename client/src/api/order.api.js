import axiosClient from './axiosClient';

export default class OrderApi {
	static getOrderByCode(order_code) {
		return axiosClient.get(`/order/${order_code}`);
	}
	static getOrders(params) {
		return axiosClient.get("/order", { params });
	}
	static calculateRevenue(params) {
		return axiosClient.get("/order/revenue", { params });
	}
}

