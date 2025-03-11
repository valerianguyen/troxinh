const fs = require("fs");
const path = require("path");
const { apiResponse } = require("../utils/response");
const { BadRequestError, AuthorizedError } = require("../core/error.response");
const BLACKLIST_FILE = path.join(__dirname, "../data/blacklist.json");
class BacklistWordService {
	static async loadBlacklist() {
		const data = fs.readFileSync(BLACKLIST_FILE, "utf-8");
		return apiResponse({
			code: 200,
			message: "Load blacklist successfully",
			data: JSON.parse(data).banned_words.map((word) => word.normalize("NFC").toLowerCase()) || [],
		});
	}
	static async addBlacklist({ words }) {
		if (!words) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		const { data } = await BacklistWordService.loadBlacklist();
		const newWords = words
			.split(",")
			.map((word) => word.trim().normalize("NFC").toLowerCase())
			.filter((w) => w.length > 0);

		// Tránh thêm từ trùng lặp
		const updatedBlacklist = Array.from(new Set([...data, ...newWords]));

		fs.writeFileSync(
			BLACKLIST_FILE,
			JSON.stringify({ banned_words: updatedBlacklist }, null, 4),
			"utf-8",
		);

		return apiResponse({
			code: 200,
			message: "Add blacklist successfully",
			data: updatedBlacklist,
		});
	}
	static async removeBlacklist({ words }) {
		if (!words) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}

		const { data } = await BacklistWordService.loadBlacklist();
		const wordsToRemove = words
			.split(",")
			.map((word) => word.trim().normalize("NFC").toLowerCase());

		// Loại bỏ các từ có trong danh sách xóa
		const newBlacklist = data.filter((word) => !wordsToRemove.includes(word));

		fs.writeFileSync(
			BLACKLIST_FILE,
			JSON.stringify({ banned_words: newBlacklist }, null, 4),
			"utf-8",
		);

		return apiResponse({
			code: 200,
			message: "Remove blacklist successfully",
			data: newBlacklist,
		});
	}

	static async checkSentence({ sentence }) {
		const { data: blacklistData } = await BacklistWordService.loadBlacklist();

		// Chuẩn hóa danh sách blacklist
		const normalizedBlacklist = blacklistData.map((word) => word.normalize("NFC"));

		// Chuẩn hóa và tách câu thành các từ
		const words = sentence.split(" ").map((word) => word.normalize("NFC"));

		// Kiểm tra từ cấm
		const bannedWords = words.filter((word) => normalizedBlacklist.includes(word));

		return apiResponse({
			code: 200,
			message: "Check sentence successfully",
			data: [...new Set(bannedWords)],
		});
	}
}
module.exports = BacklistWordService;
