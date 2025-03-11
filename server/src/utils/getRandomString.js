const getRandomString = (length) => {
	return [...crypto.getRandomValues(new Uint8Array(length))]
		.map((m) => ("0" + m.toString(36)).slice(-1))
		.join("");
};
const getRandomNumber = (length) => {
	const char = "0123456789";
	return Array(length)
		.map((_) => char[Math.floor(Math.random() * char.length)])
		.join("");
};
const getRandomPassword = (length) => {
	if (length < 8) {
		throw new Error("Mật khẩu phải lớn hơn 8 ký tự");
	}
	const charUpperLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const charSpecial = "!@#$%";
	const charNumber = "0123456789";
	return (
		charSpecial[randomIndex(charSpecial.length)] +
		charUpperLetter[randomIndex(charUpperLetter.length)] +
		charNumber[randomIndex(charNumber.length)] +
		getRandomString(length - 3)
	)
		.split("")
		.sort(() => Math.random() - 0.5)
		.join("");
};
const randomIndex = (length) => Math.floor(Math.random() * length);
module.exports = {
	getRandomString,
	getRandomPassword,
	getRandomNumber,
};
