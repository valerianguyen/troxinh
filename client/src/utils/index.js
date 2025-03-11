import { province } from '@/data/province.js';

export const config = import.meta.env;

export const checkLogin = (user) => {
	let flag = true;
	const { usr_id, usr_avatar, usr_name, usr_role } = user;
	if (!usr_id || !usr_avatar || !usr_name || isNaN(usr_role)) {
		flag = false;
	}
	return flag && localStorage.getItem("accessToken");
};
export function toLocaleString(dateInput, locale = "vi-VI", options = {}) {
	const date = new Date(dateInput); // Convert input to Date object
	return date.toLocaleString(locale, options); // Format as locale string
}
export const getLocationString = (city, district, ward) => {
	return province[`${city}-${district}-${ward}`];
};
export const formatTimeAgo = (timestamp) => {
	const now = new Date();
	const past = new Date(timestamp);
	const diffInSeconds = Math.floor((now - past) / 1000);

	// Time intervals in seconds
	const intervals = {
		năm: 31536000,
		tháng: 2592000,
		tuần: 604800,
		ngày: 86400,
		giờ: 3600,
		phút: 60,
		giây: 1,
	};

	for (const [unit, secondsInUnit] of Object.entries(intervals)) {
		const count = Math.floor(diffInSeconds / secondsInUnit);

		if (count > 0) {
			// Handle plural/singular
			return `${count} ${unit} trước`;
		}
	}

	return "Vừa xong";
};
export const toCapitalized = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
export const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("vi-VI", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};
export function checkSentence({ sentence, blacklistData }) {
	const normalizedBlacklist = blacklistData.map((word) => word.normalize("NFC"));
	const words = sentence.split(" ").map((word) => word.normalize("NFC"));
	const bannedWords = words.filter((word) => normalizedBlacklist.includes(word));

	return {
		bannedWords: [...new Set(bannedWords)],
		isSafe: bannedWords.length === 0,
	};
}
// Example usage:
// const timestamp = '2024-11-17T10:24:02.000Z';
// console.log(formatTimeAgo(Date.now()));
// Usage examples:
// console.log(toLocaleString("2024-11-11T10:48:06.000Z"));  // ISO string
// console.log(toLocaleString(1609459200000));  // Timestamp
// console.log(
//   toLocaleString("2024-11-11T10:48:06.000Z", "en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   })
// );
