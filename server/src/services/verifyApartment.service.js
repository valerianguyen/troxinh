const { apiResponse } = require("../utils/response");
const { BadRequestError } = require("../core/error.response");
const VerifyApartment = require("../models/verifyApartment.model");
const Apartment = require("../models/apartment.model");
const VerifyApartmentMedia = require("../models/verifyMedia.model");
const { ENUM_STATUS_VERIFY_APARTMENT, ENUM_STATUS_APARTMENT } = require("../constant");
const sequelize = require("../dbs/init.mysql");
const User = require("../models/user.model");
class VerifyApartmentService {
	static async getVerifyApartmentMedia({
		userId,
		page = 1,
		limit = 10,
		orderType = "desc",
		orderBy = "createdAt",
	}) {
		limit = parseInt(limit);
		page = parseInt(page);
		const verifyApartment = await VerifyApartment.findAll({
			...(userId ? { where: { ver_usr_id: userId } } : {}),
			include: [
				{
					model: Apartment,
					as: "apartment",
					attributes: ["apart_id", "apart_title"],
					include: [
						{
							model: VerifyApartmentMedia,
							as: "verify_apartment_media",
						},
					],
				},
				...(!userId
					? [{ model: User, as: "user", attributes: ["usr_id", "usr_name", "usr_avatar"] }]
					: []),
			],
			order: [[orderBy, orderType]],
			limit,
			offset: (page - 1) * limit,
		});
		return apiResponse({
			data: verifyApartment,
			code: 200,
			message: "Lấy danh sách yêu cầu xác thực tin đăng thành công",
		});
	}
	static async approveVerifyApartment({ ver_id, files }) {
		try {
			const transaction = await sequelize.transaction();
			const verifyApartment = await VerifyApartment.findByPk(ver_id, { transaction });
			if (!verifyApartment) {
				throw new BadRequestError("Không tìm thấy yêu cầu xác thực tin đăng");
			}
			await verifyApartment.update(
				{ ver_status: ENUM_STATUS_VERIFY_APARTMENT.DONE },
				{ transaction },
			);
			const apartment = await Apartment.findByPk(verifyApartment.apart_id, { transaction });
			await apartment.update({ apart_status: ENUM_STATUS_APARTMENT.IS_VERIFIED }, { transaction });
			if (files) {
				await VerifyApartmentMedia.bulkCreate(
					files.map((file) => ({
						apart_id: apartment.apart_id,
						vam_url: file.filename,
					})),
					{ transaction },
				);
			}
			console.log("Approve verify apartment");
			await transaction.commit();
			return apiResponse({
				data: verifyApartment,
				code: 200,
				message: "Tin đăng đã được xác thực",
			});
		} catch (err) {
			console.log(err);
			await transaction.rollback();
			throw new BadRequestError("Có lỗi xảy ra");
		}
	}
	static async rejectVerifyApartment({ ver_id, reason }) {
		const verifyApartment = await VerifyApartment.findByPk(ver_id);
		if (!verifyApartment) {
			throw new BadRequestError("Không tìm thấy yêu cầu xác thực tin đăng");
		}
		await verifyApartment.update({
			ver_status: ENUM_STATUS_VERIFY_APARTMENT.REJECTED,
			ver_reason: reason,
		});
		return apiResponse({
			data: verifyApartment,
			code: 200,
			message: "Tin đăng đã bị từ chối",
		});
	}
}
module.exports = VerifyApartmentService;
