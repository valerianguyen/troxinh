"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkRole } = require("../../middlewares/checkAuth.middleware");
const ApartmentController = require("../../controllers/apartment.controller");
const validateFactory = require("../../middlewares/validation.middleware");
const { ENUM_ROLE } = require("../../constant");
const {
	queryApartment,
	createApartmentBody,
	updateApartmentBody,
} = require("../../validations/apartment.validation");

const router = express.Router();
router.get("/boost/config", asyncHandler(ApartmentController.getConfigAmountPriority));
router.get(
	"/g/search",
	validateFactory(queryApartment),
	asyncHandler(ApartmentController.searchApartment),
);
router.get("/g/:apart_id", asyncHandler(ApartmentController.getApartmentById));
router.use(authentication);
router.get("/:apart_id", asyncHandler(ApartmentController.getApartmentById));
router.get("/a/my/seller", asyncHandler(ApartmentController.getMyApartment));
router.get(
	"/a/search",
	validateFactory(queryApartment),
	asyncHandler(ApartmentController.searchApartment),
);
router.post(
	"/",
	checkRole([ENUM_ROLE.USER]),
	validateFactory(createApartmentBody),
	asyncHandler(ApartmentController.createApartment),
);
router.put(
	"/:apart_id",
	checkRole([ENUM_ROLE.USER]),
	validateFactory(updateApartmentBody),
	asyncHandler(ApartmentController.updateApartment),
);
router.delete(
	"/:apart_id",
	checkRole([ENUM_ROLE.USER, ENUM_ROLE.ADMIN]),
	asyncHandler(ApartmentController.deleteApartment),
);
router.post(
	"/publish/:userId/:apart_id",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(ApartmentController.publishApartment),
);
router.post(
	"/unpublish/:userId/:apart_id",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(ApartmentController.unPublishApartment),
);
router.post(
	"/block/:userId/:apart_id",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(ApartmentController.blockApartment),
);
router.post("/boost/:apart_id", checkRole([ENUM_ROLE.USER]), asyncHandler(ApartmentController.boostApartment));

module.exports = router;
