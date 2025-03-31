"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkRole } = require("../../middlewares/checkAuth.middleware");
const FavoriteController = require("../../controllers/favorite.controller");
const { ENUM_ROLE } = require("../../constant");

const router = express.Router();
router.use(authentication);
router.post(
	"/:apart_id",
	asyncHandler(FavoriteController.storeFavoriteApartment),
);
router.delete(
	"/:apart_id",
	asyncHandler(FavoriteController.removeFavoriteApartment),
);
router.get(
	"/",
	asyncHandler(FavoriteController.searchFavoriteApartment),
);
router.get(
	"/:apart_id",
	asyncHandler(FavoriteController.getFavoriteApartment),
);
module.exports = router;
