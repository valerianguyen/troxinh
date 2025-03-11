const { ENUM_ROLE, ENUM_APARTMENT_CATEGORIES } = require("../constant");
const Favorites = require("../models/favorite.model");
const { apiResponse } = require("../utils/response");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { validateAddress, getInfoData, convertParam } = require("../utils/");
const sequelize = require("../dbs//init.mysql");
const { Op } = require("sequelize");
const Apartment = require("../models/apartment.model");
const Image = require("../models/images.model");
class FavoriteService {
	// store favorite apartment
	// remove favorite apartment
	// search favorite apartment
	static async storeFavoriteApartment({ usr_id, apart_id }) {
		const favorite = await Favorites.findOne({
			where: {
				usr_id,
				apart_id,
			},
		});
		if (!favorite) {
			const newFavorite = await Favorites.create({ usr_id, apart_id });
			return apiResponse({
				data: newFavorite,
				message: "Favorite apartment added successfully",
				code: 201,
			});
		}
		return apiResponse({
			data: favorite,
			message: "Favorite apartment already exists",
			code: 201,
		});
	}
	static async removeFavoriteApartment({ usr_id, apart_id }) {
		const favorite = await Favorites.findOne({
			where: {
				usr_id,
				apart_id,
			},
		});
		if (!favorite) {
			throw new BadRequestError("Favorite apartment does not exist");
		}
		await favorite.destroy();
		return apiResponse({
			message: "Favorite apartment removed successfully",
			code: 200,
		});
	}
	static async searchFavoriteApartment({
		usr_id,
		page = 1,
		limit = 10,
		orderBy = "createdAt",
		orderType = "desc",
	}) {
		// search by usr_id
		page = Math.max(1, parseInt(page, 10) || 1);
		limit = Math.max(1, parseInt(limit, 10) || 10);
		const offset = (page - 1) * limit;
		const favorites = await Favorites.findAndCountAll({
			where: {
				usr_id,
			},
			include: [
				{
					model: Apartment,
					as: "apartment",
					attributes: [
						"apart_id",
						"apart_title",
						"apart_price",
						"apart_address",
						"apart_description",
						"apart_category",
					],
					include:[
						{
							model: Image,
							as: "images",
							attributes: ["img_alt", "img_url"],
							limit: 1,
						}
					]
				},
			],
			attributes:["createdAt"],
			offset,
			limit: limit,
			order: [[orderBy, orderType]],
		});
		return apiResponse({
			data: {
				favorites: favorites.rows,
				total: favorites.count,
				page,
				limit,
			},
			message: "Favorite apartment list",
			code: 200,
		});
	}
	static async getFavoriteApartment({ usr_id, apart_id }) {
		const favorite = await Favorites.findOne({
			where: {
				usr_id,
				apart_id,
			},
		});
		if (!favorite) {
			throw new NotFoundError("Favorite apartment does not exist");
		}
		return apiResponse({
			data: favorite ? 1 : 0,
			message: "Favorite apartment",
			code: "x10000",
		});
	}
}
module.exports = FavoriteService;
