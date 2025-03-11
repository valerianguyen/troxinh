const { SUCCESS, CREATED } = require("../core/success.response");
const FavoriteService = require("../services/favorite.service");
class FavoriteController {
	static storeFavoriteApartment = async (req, res) => {
		return new CREATED({
			metadata: await FavoriteService.storeFavoriteApartment({
				usr_id: req.user.userId,
				apart_id: req.params.apart_id,
			}),
		}).send(res);
	};
	static removeFavoriteApartment = async (req, res) => {
		return new SUCCESS({
			metadata: await FavoriteService.removeFavoriteApartment({
				usr_id: req.user.userId,
				apart_id: req.params.apart_id,
			}),
		}).send(res);
	};
	static searchFavoriteApartment = async (req, res) => {
		const { page, limit, orderBy, orderType } = req.query;
		return new SUCCESS({
			metadata: await FavoriteService.searchFavoriteApartment({
				usr_id: req.user.userId,
				page,
				limit,
				orderBy,
				orderType,
			}),
		}).send(res);
	};
	static getFavoriteApartment = async (req, res) => {
		return new SUCCESS({
			metadata: await FavoriteService.getFavoriteApartment({
				usr_id: req.user.userId,
				apart_id: req.params.apart_id,
			}),
		}).send(res);
	};
}
module.exports = FavoriteController;
