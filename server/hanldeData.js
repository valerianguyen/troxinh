const { apartment } = require("./data/apartment.json");
const { house } = require("./data/house.json");
const { boarding_house } = require("./data/boarding_house.json");
const fs = require("fs/promises");

async function login() {
	const users = [];
	for (let i = 1; i <= 7; i++) {
		const response = await fetch("http://localhost:3001/api/auth/login", {
			headers: {
				accept: "application/json, text/plain, */*",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/json",
				"sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"Windows"',
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "same-site",
				Referer: "http://localhost:5173/",
				"Referrer-Policy": "strict-origin-when-cross-origin",
			},
			body: JSON.stringify({
				email: `anhanh${i}@gmail.com`,
				password: "anhanh",
			}),
			method: "POST",
		});
		const result = await response.json();
		users.push({
			id: result.metadata.data.user.usr_id,
			token: result.metadata.data.accessToken,
		});
	}
	await fs.writeFile(
		`./data/users.json`,
		JSON.stringify(
			{
				users,
			},
			null,
			2,
		),
	);
	return users;
}
/**
 * Adds a new apartment to the system by sending a POST request to the API.
 * 
 * @async
 * @function addApartment
 * @param {Object} params - The apartment details and authentication information
 * @param {string} params.apart_title - The title of the apartment
 * @param {number} params.apart_total_toilet - Total number of toilets
 * @param {number} params.apart_total_room - Total number of rooms
 * @param {number} params.apart_area - The area of the apartment in square meters
 * @param {string} params.apart_description - Detailed description of the apartment
 * @param {Array<string>} params.apart_images - Array of image URLs for the apartment
 * @param {string} params.apart_city - City where the apartment is located
 * @param {string} params.apart_district - District where the apartment is located
 * @param {string} params.apart_ward - Ward where the apartment is located
 * @param {number} params.apart_price - Price of the apartment
 * @param {string} params.apart_address - Full address of the apartment
 * @param {string} params.apart_category - Category of the apartment
 * @param {string} params.apart_type - Type of the apartment
 * @param {string} params.usr_id - User ID of the person adding the apartment
 * @param {string} params.token - Authentication token
 * @returns {Promise<Object>} The response from the server containing the result of the operation
 * @throws {Error} If the network request fails or the server returns an error
 */
async function addApartment({
	apart_title,
	apart_total_toilet,
	apart_total_room,
	apart_area,
	apart_description,
	apart_images,
	apart_city,
	apart_district,
	apart_ward,
	apart_price,
	apart_address,
	apart_category,
	apart_type,

	usr_id,
	token,
}) {
	const response = await fetch("http://localhost:3001/api/apartment/", {
		headers: {
			accept: "application/json, text/plain, */*",
			"accept-language": "en-US,en;q=0.9",
			authorization: `Bearer ${token}`,
			"content-type": "application/json",
			"sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": '"Windows"',
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-site",
			"x-client-id": usr_id,
			Referer: "http://localhost:5173/",
			"Referrer-Policy": "strict-origin-when-cross-origin",
		},
		body: JSON.stringify({
			apart_title: apart_title,
			apart_total_toilet: apart_total_toilet,
			apart_total_room: apart_total_room,
			apart_area: apart_area,
			apart_description: apart_description,
			apart_images: apart_images,
			apart_city: apart_city,
			apart_district: apart_district,
			apart_ward: apart_ward,
			apart_price: apart_price,
			apart_address: apart_address,
			apart_category: apart_category,
			apart_type: apart_type,
		}),
		method: "POST",
	});
	const result = await response.json();
	console.log(result.message, apart_city, apart_district, apart_ward);
}
const seekData = {
	1: apartment,
	2: house,
	3: boarding_house,
};
const district = {
	"Quận Ba Đình": ["1", "1"],
	"Quận Hoàn Kiếm": ["2", "37"],
	"Quận Tây Hồ": ["3", "91"],
	"Quận Long Biên": ["4", "115"],
	"Quận Cầu Giấy": ["5", "157"],
	"Quận Đống Đa": ["6", "178"],
	"Quận Hai Bà Trưng": ["7", "241"],
	"Quận Hoàng Mai": ["8", "301"],
	"Quận Thanh Xuân": ["9", "343"],
	"Huyện Sóc Sơn": ["16", "376"],
	"Huyện Đông Anh": ["17", "454"],
	"Huyện Gia Lâm": ["18", "526"],
	"Quận Nam Từ Liêm": ["19", "592"],
	"Huyện Thanh Trì": ["20", "640"],
	"Quận Bắc Từ Liêm": ["21", "595"],
	"Huyện Mê Linh": ["250", "8973"],
	"Quận Hà Đông": ["268", "9547"],
	"Thị xã Sơn Tây": ["269", "9610"],
	"Huyện Ba Vì": ["271", "9619"],
	"Huyện Phúc Thọ": ["272", "9727"],
	"Huyện Đan Phượng": ["273", "9805"],
	"Huyện Hoài Đức": ["274", "9847"],
	"Huyện Quốc Oai": ["275", "9922"],
	"Huyện Thạch Thất": ["276", "9955"],
	"Huyện Chương Mỹ": ["277", "10027"],
	"Huyện Thanh Oai": ["278", "10162"],
	"Huyện Thường Tín": ["279", "10228"],
	"Huyện Phú Xuyên": ["280", "10273"],
	"Huyện Ứng Hòa": ["281", "10357"],
	"Huyện Mỹ Đức": ["282", "10480"],
};
async function handleAddData() {
	let users = await login();
	Array.from(Object.keys(seekData)).forEach(async (key) => {
		console.log("Start add apartment", key);
		const data = seekData[key];
		console.log("Data length", data.length);
		for (let i = 0; i < data.length; i++) {
			const user = users[Math.floor(Math.random() * users.length)];
			try {
				await addApartment({
					apart_title: data[i]?.subject,
					apart_total_toilet: data[i]?.toilets || 1,
					apart_total_room: data[i]?.rooms || 1,
					apart_area: data[i]?.area,
					apart_description: data[i]?.body,
					apart_images: data[i]?.images.map((image) => {
						return {
							img_url: image,
							img_alt: data[i]?.subject,
						};
					}),
					apart_city: 1,
					apart_district: parseInt(district[data[i]?.area_name][0]),
					apart_ward: parseInt(district[data[i]?.area_name][1]),
					apart_price: data[i]?.price,
					apart_address: data[i]?.street_name,
					apart_category: key,
					apart_type: 2,
					usr_id: user.id,
					token: user.token,
				});
			} catch (e) {
				console.log("Add apartment fail", e);
				continue;
			}
		}
	});
}
handleAddData();
