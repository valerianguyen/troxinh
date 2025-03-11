const {
	ENUM_ROLE,
	ENUM_APARTMENT_CATEGORIES,
	ENUM_STATUS_APARTMENT,
	ENUM_PRICE_PRIORITY,
	ENUM_PRIORY,
	ENUM_STRING_PRIORY,
	ENUM_TYPE_ORDER,
} = require("../constant");
const Apartment = require("../models/apartment.model");
const Image = require("../models/images.model");
const User = require("../models/user.model");
const { apiResponse } = require("../utils/response");
const { BadRequestError } = require("../core/error.response");
const { validateAddress, getInfoData, convertParam } = require("../utils/");
const sequelize = require("../dbs//init.mysql");
const { Op } = require("sequelize");
const VNPService = require("./vnpay.service");
const Order = require("../models/order.model");
const { VNP_RETURN_URL } = require("../configs/vnpay.config");
const BlacklistWord = require("./blacklistWord.service");
const moment = require("moment");
const EmailService = require("./email.service");
function checkValidity(images) {
	return images
		.map((img, index) => (img.is_valid ? null : index + 1))
		.filter((index) => index !== null);
}

function checkQuality(images) {
	return images
		.map((img, index) => (img.is_quality_ok ? null : index + 1))
		.filter((index) => index !== null);
}

function checkLogoWatermark(images) {
	return images
		.map((img, index) => (img.is_has_logo_or_watermark ? index + 1 : null))
		.filter((index) => index !== null);
}

function checkText(images) {
	return images
		.map((img, index) => (img.text_check.has_phone || img.text_check.has_url ? index + 1 : null))
		.filter((index) => index !== null);
}
class ApartmentService {
	//get all apartment by userid
	static async getMyApartment({
		id,
		page = 1,
		limit = 10,
		orderBy = "apart_id",
		orderType = "asc",
	}) {
		const offset = (page - 1) * limit;
		if (!id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		if (isNaN(id)) {
			throw new BadRequestError("Tham số không đúng");
		}
		return apiResponse({
			code: 200,
			message: "Get all apartment successfully",
			data: await Apartment.findAll({
				where: { usr_id: id },
				limit,
				offset,
				order: [[orderBy, orderType]],
			}),
		});
	}
	static async getApartmentById({ apart_id, role = ENUM_ROLE.USER, id }) {
		const where = {
			apart_id,
		};
		if (!apart_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		if (isNaN(apart_id)) {
			throw new BadRequestError("Tham số không đúng");
		}
		if (role == ENUM_ROLE.USER) {
			if (!id) {
				where["apart_status"] = 1;
			} else {
				where[Op.or] = {
					usr_id: id,
					apart_status: 1,
				};
			}
		}
		return apiResponse({
			code: 200,
			message: "Get apartment successfully",
			data: await Apartment.findOne({
				where,
				include: [
					{
						model: Image,
						as: "images",
						required: true,
						attributes: ["img_id", "img_url"],
					},
					{
						model: User,
						as: "user",
						attributes: [
							"usr_id",
							"usr_name",
							"usr_totals_apartment",
							"usr_phone",
							"usr_address",
							"usr_email",
							"usr_avatar",
							"createdAt",
						],
					},
				],
			}),
		});
	}

	static async searchApartment({
		data,
		page = 1,
		limit = 10,
		orderBy = "apart_id",
		orderType = "asc",
		role = ENUM_ROLE.USER,
		stat = false,
	}) {
		const { result: queryParams, errors } = convertParam(data);
		const task = [];
		if (errors.length) {
			throw new BadRequestError(errors.join(","));
		}
		if (role == ENUM_ROLE.USER) {
			if (!data?.usr_id) {
				queryParams.apart_status = 1;
			} else {
				queryParams[Op.or] = {
					usr_id: data.usr_id,
					apart_status: 1,
				};
			}
		}
		if (role == ENUM_ROLE.ADMIN || role == ENUM_ROLE.STAFF) {
			delete queryParams.usr_id;
		}
		page = +page;
		limit = +limit;

		const offset = (page - 1) * limit;
		task.push(
			Apartment.findAll({
				where: queryParams,
				include: [
					{
						model: Image,
						as: "images",
						required: true,
						attributes: ["img_id", "img_url"],
					},
					{
						model: User,
						as: "user",
						required: true,
						attributes: [
							"usr_id",
							"usr_name",
							"usr_address",
							"usr_phone",
							"usr_totals_apartment",
							"usr_avatar",
						],
					},
				],
				limit,
				offset,
				order: [
					["apart_priority", "desc"],
					["createdAt", "desc"],
					[orderBy, orderType],
				],
			}),
		);
		task.push(Apartment.count({ where: queryParams }));
		if (stat) {
			task.push(
				Apartment.findAll({
					attributes: [
						[
							sequelize.fn(
								"SUM",
								sequelize.literal("CASE WHEN apart_status = 1 THEN 1 ELSE 0 END"),
							),
							"publishedCount",
						],
						[sequelize.fn("COUNT", sequelize.col("apart_id")), "totalCount"],
					],
					where: {
						usr_id: data.usr_id,
					},
					raw: true, // Ensures plain results instead of Sequelize instances
				}),
			);
		}
		const [apartments, totalCount, statData] = await Promise.all(task);
		return apiResponse({
			code: 200,
			message: "Find apartment successfully",
			data: {
				apartments,
				totalCount,
				...(statData ? { statData: statData[0] } : {}),
			},
		});
	}
	static async validImage({ image_urls }) {
		const response = await fetch("http://localhost:8000/detect/multiple/url", {
			method: "POST",
			body: JSON.stringify({ image_urls }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data);
		const invalidImages = checkValidity(data);
		const invalidQuality = checkQuality(data);
		const invalidLogoWatermark = checkLogoWatermark(data);
		const invalidText = checkText(data);
		const errors = [];
		if (invalidImages.length > 0) {
			errors.push(`Hình ảnh không hợp lệ: ${invalidImages.join(", ")}`);
		}
		if (invalidQuality.length > 0) {
			errors.push(`Hình ảnh chất lượng thấp: ${invalidQuality.join(", ")}`);
		}
		if (invalidLogoWatermark.length > 0) {
			errors.push(`Hình ảnh có logo hoặc watermark: ${invalidLogoWatermark.join(", ")}`);
		}
		if (invalidText.length > 0) {
			errors.push(`Hình ảnh chứa số điện thoại hoặc liên kết: ${invalidText.join(", ")}`);
		}
		if (errors.length > 0) {
			throw new BadRequestError(errors.join("\n"));
		}
		return true;
	}
	// create new apartment
	static async createApartment(usr_id, data) {
		const {
			apart_title = "",
			apart_total_toilet = 0,
			apart_total_room = 0,
			apart_area = 0,
			apart_description = "",
			apart_city = "",
			apart_district = "",
			apart_ward = "",
			apart_price = 0,
			apart_address = "",
			apart_images = [],
			apart_category = ENUM_APARTMENT_CATEGORIES.APARTMENT,
			apart_type = ENUM_APARTMENT_TYPE.APARTMENT,
		} = data;
		const isValidTitle = await BlacklistWord.checkSentence({ sentence: apart_title });
		if (isValidTitle.data.length > 0) {
			throw new BadRequestError(`Tiêu đề chứa từ cấm: ${isValidTitle.data.join(", ")}`);
		}
		const isValidDescription = await BlacklistWord.checkSentence({ sentence: apart_description });
		if (isValidDescription.data.length > 0) {
			throw new BadRequestError(`Mô tả chứa từ cấm: ${isValidDescription.data.join(", ")}`);
		}
		// check regex for title and description
		const regex = /^[a-zA-Z0-9\s\u00C0-\u1EF9]*$/;
		if (!regex.test(apart_title)) {
			throw new BadRequestError("Tiêu đề chỉ chứa chữ và số");
		}
		const isValid = validateAddress({
			city: apart_city,
			district: apart_district,
			ward: apart_ward,
		});

		if (!isValid) {
			throw new BadRequestError("Địa chỉ không tồn tại");
		}
		// const isValidImage = await ApartmentService.validImage({
		// 	image_urls: apart_images.map((img) => img.img_url),
		// });
		// Start a transaction
		const transaction = await sequelize.transaction();
		try {
			// Create the apartment
			const apartment = await Apartment.create(
				{
					apart_title,
					usr_id,
					apart_total_toilet,
					apart_total_room,
					apart_area,
					apart_description,
					apart_city,
					apart_district,
					apart_price,
					apart_ward,
					apart_address,
					apart_category,
					apart_type,
				},
				{ transaction },
			);
			const imageRecords = apart_images.map((img) => ({
				img_url: img.img_url,
				img_alt: img.img_alt,
				apart_id: apartment.apart_id,
			}));
			const images = await Image.bulkCreate(imageRecords, { transaction });
			const resultImages = images.map((img) => ({
				...getInfoData(["img_alt", "img_url"], img),
			}));
			// create done then create payment_url
			// create order
			const order_code = `order-${moment().format("DDHHmmss")}`;
			const order_info = `Thanh toán cho tin đăng ${apart_title}`;
			const newOrder = await Order.create(
				{
					order_code: order_code,
					order_amount: ENUM_PRICE_PRIORITY[ENUM_PRIORY.DEFAULT],
					order_info,
					order_usr_id: usr_id,
					order_apart_id: apartment.apart_id,
					order_type: ENUM_TYPE_ORDER.PAY_FOR_APARTMENT,
				},
				{
					transaction,
				},
			);
			if (!newOrder) {
				throw new BadRequestError("Không thể tạo đơn hàng");
			}
			const payment_url = await VNPService.createPaymentUrl({
				amount: ENUM_PRICE_PRIORITY[ENUM_PRIORY.DEFAULT],
				order_info,
				order_code,
				ip_address: data.ip_address,
				return_url: VNP_RETURN_URL,
			});
			await transaction.commit();
			return apiResponse({
				code: 201,
				message: "Apartment created successfully",
				data: { ...apartment.dataValues, images: resultImages, payment_url },
			});
		} catch (error) {
			// Rollback transaction on error
			await transaction.rollback();
			throw new Error(error);
		}
	}
	// update apartment
	static async updateApartment(apart_id, usr_id, data) {
		// Check if required fields are provided
		if (!apart_id || !usr_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}

		const {
			apart_title,
			apart_total_toilet,
			apart_total_room,
			apart_area,
			apart_description,
			apart_city,
			apart_district,
			apart_ward,
			apart_images,
		} = data;
		// const isValidImage = await ApartmentService.validImage({
		// 	image_urls: apart_images.map((img) => img.img_url),
		// });
		const isValid = validateAddress({
			city: apart_city,
			district: apart_district,
			ward: apart_ward,
		});
		if (!isValid) {
			throw new BadRequestError("Địa chỉ không tồn tại");
		}

		// Start a transaction
		const transaction = await sequelize.transaction();
		try {
			// Find apartment if apart_isPublished is false then you can update apart_isSold = true
			const apartment = await Apartment.findOne({ where: { apart_id, usr_id } });
			if (!apartment) {
				throw new BadRequestError("Không tìm thấy tin đăng nào");
			}
			if (apartment.apart_status !== ENUM_STATUS_APARTMENT.ACTIVE) {
				throw new BadRequestError("tin đăng chưa được công khai");
			}
			// get attributes inside body not undefined
			const attributes = Object.keys(data).reduce((acc, key) => {
				if (data[key] !== undefined) {
					acc[key] = data[key];
				}
				return acc;
			}, {});
			if (attributes?.apart_report_reason) {
				delete attributes.apart_report_reason;
			}
			// Update Apartment details
			const [updatedRows] = await Apartment.update(attributes, {
				where: { apart_id, usr_id },
				transaction,
			});

			// Update apartment images if provided
			if (apart_images) {
				await Image.destroy({ where: { apart_id }, transaction });
				const imageRecords = apart_images.map((img) => ({
					img_url: img.img_url,
					img_alt: img.img_alt,
					apart_id,
				}));
				await Image.bulkCreate(imageRecords, { transaction });
			}

			// Commit transaction
			await transaction.commit();

			return apiResponse({
				code: 200,
				message: "Apartment updated successfully",
				data: { apart_id },
			});
		} catch (error) {
			// Rollback transaction on error
			await transaction.rollback();
			throw error;
		}
	}

	// delete apartment
	static async deleteApartment(apart_id) {
		if (!apart_id) {
			throw new BadRequestError("Thiếu một số trường quan trọng");
		}
		const apartment = await Apartment.findOne({ where: { apart_id } });
		if (!apartment) {
			throw new BadRequestError("Không tìm thấy tin đăng nào");
		}
		return apiResponse({
			code: 200,
			message: "Delete apartment successfully",
			data: await Apartment.destroy({ where: { apart_id } }),
		});
	}

	static async publishApartment(apart_id, userId) {
		const transaction = await sequelize.transaction();
		try {
			const apartment = await Apartment.update(
				{ apart_status: ENUM_STATUS_APARTMENT.ACTIVE },
				{
					where: {
						apart_id,
					},
					transaction,
				},
			);
			const _ = await User.update(
				{
					usr_totals_apartment: sequelize.literal("usr_totals_apartment + 1"),
				},
				{
					where: { usr_id: userId },
					transaction: transaction,
				},
			);
			await transaction.commit();
			return apiResponse({
				code: 200,
				message: "Publish apartment successfully",
				data: apartment,
			});
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
	static async unPublishApartment(apart_id, userId) {
		const transaction = await sequelize.transaction();
		try {
			const apartment = await Apartment.update(
				{ apart_status: ENUM_STATUS_APARTMENT.PENDING },
				{
					where: {
						apart_id,
					},
					transaction,
				},
			);
			const _ = await User.update(
				{
					usr_totals_apartment: sequelize.literal("usr_totals_apartment - 1"),
				},
				{
					where: { usr_id: userId },
					transaction: transaction,
				},
			);
			await transaction.commit();
			return apiResponse({
				code: 200,
				message: "Unpublish apartment successfully",
				data: apartment,
			});
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
	static async blockApartment(apart_id, userId, reason) {
		const transaction = await sequelize.transaction();
		try {
			const apartment = await Apartment.findOne({
				where: {
					apart_id,
				},
				transaction,
			});
			await apartment.update(
				{ apart_status: ENUM_STATUS_APARTMENT.BLOCK, apart_report_reason: reason },
				{
					transaction,
				},
			);
			const user = await User.findOne({
				where: { usr_id: userId },
				transaction: transaction,
			});
			await user.update(
				{
					usr_totals_apartment: sequelize.literal("usr_totals_apartment - 1"),
				},
				{
					transaction: transaction,
				},
			);
			EmailService.send({
				receiver: user.usr_email,
				templateName: "blockApartment",
			})({
				name: user.usr_name,
				reason,
				data: apartment,
			});
			await transaction.commit();
			return apiResponse({
				code: 200,
				message: "Block apartment successfully",
				data: apartment,
			});
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
	static async boostApartment({ apart_id, userId, duration, priority, ip_address }) {
		const transaction = await sequelize.transaction();
		try {
			const apartment = await Apartment.findOne({ where: { apart_id, usr_id: userId } });
			if (!apartment) {
				throw new BadRequestError("Không tìm thấy tin đăng nào");
			}
			if (apartment.apart_status !== ENUM_STATUS_APARTMENT.ACTIVE) {
				throw new BadRequestError("Tin đăng chưa được thanh toán");
			}
			if (priority == ENUM_PRIORY.DEFAULT) {
				throw new BadRequestError("Không thể gia hạn tin thường");
			}
			if (priority < apartment.apart_priority) {
				throw new BadRequestError("Không thể gia hạn ưu tiên thấp hơn");
			}
			const newAmount = ENUM_PRICE_PRIORITY[priority] * duration;
			let amountToPay = newAmount;
			// duration is total days
			const now = new Date().getTime();
			const end_date = new Date(apartment.apart_expired_date).getTime();
			const order_data = {
				duration,
				priority,
			};
			// end_date can be null;
			if (now > end_date) {
				if (amountToPay < 10000) {
					throw new BadRequestError("Phải thanh toán ít nhất 10000đ");
				}
				order_data["newEndDate"] = new Date(now + duration * 24 * 60 * 60 * 1000).getTime();
				order_data["newStartDate"] = new Date(now).getTime();
			} else {
				const remain_time = Math.floor((end_date - now) / (24 * 60 * 60 * 1000));
				const amount_to_upgrade =
					(ENUM_PRICE_PRIORITY[priority] - ENUM_PRICE_PRIORITY[apartment.apart_priority]) *
					remain_time;
				amountToPay = newAmount + amount_to_upgrade;
				if (amountToPay < 10000) {
					throw new BadRequestError("Phải thanh toán ít nhất 10000đ");
				}
				order_data["newEndDate"] = new Date(end_date + duration * 24 * 60 * 60 * 1000).getTime();
				order_data["newStartDate"] = new Date(apartment.apart_time_start).getTime();
			}
			const order_code = `order-${moment().format("DDHHmmss")}`;
			const order_info = `Thanh toán cho gia hạn tin đăng ${apartment.apart_title} với độ ưu tiên ${ENUM_STRING_PRIORY[priority]}`;
			const newOrder = await Order.create(
				{
					order_code: order_code,
					order_amount: amountToPay,
					order_info,
					order_usr_id: userId,
					order_apart_id: apartment.apart_id,
					order_type: ENUM_TYPE_ORDER.PAY_FOR_BOOST,
					order_data: JSON.stringify(order_data),
				},
				{
					transaction,
				},
			);
			if (!newOrder) {
				throw new BadRequestError("Không thể tạo đơn hàng");
			}
			const payment_url = await VNPService.createPaymentUrl({
				amount: amountToPay,
				order_info,
				order_code,
				ip_address: ip_address,
				return_url: VNP_RETURN_URL,
			});
			if (!payment_url) {
				throw new BadRequestError("Không thể tạo đường dẫn thanh toán");
			}
			await transaction.commit();
			return apiResponse({
				code: 200,
				message: "Boost apartment successfully",
				data: {
					payment_url,
				},
			});
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
	static async getConfigAmountPriority() {
		return apiResponse({
			code: 200,
			message: "Get config amount priority successfully",
			data: ENUM_PRICE_PRIORITY,
		});
	}
}
module.exports = ApartmentService;
