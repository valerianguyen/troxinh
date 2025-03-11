import axiosClient from './axiosClient';

export default class FavoriteApi {
	static storeFavoriteApartment(apart_id) {
		return axiosClient.post(`favorite/${apart_id}`);
	}
	static removeFavoriteApartment(apart_id) {
		return axiosClient.delete(`favorite/${apart_id}`);
	}
	static searchFavoriteApartment(params) {
		return axiosClient.get("favorite/", {
			params,
		});
	}
	static getFavoriteApartment(apart_id) {
		return axiosClient.get(`favorite/${apart_id}`);
	}
}
