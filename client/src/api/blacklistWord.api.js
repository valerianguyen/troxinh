import axiosClient from './axiosClient';

export default class BlacklistWordApi {
	static async getBlacklistWord() {
		return await axiosClient.get("blacklist-words");
	}

	static async addBlacklistWord(data) {
		return await axiosClient.post("blacklist-words", {
			words: data,
		});
	}

	static async deleteBlacklistWord(data) {
		return await axiosClient.post(`blacklist-words/delete`, {
			words: data,
		});
	}
}
