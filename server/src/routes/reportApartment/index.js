"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkRole } = require("../../middlewares/checkAuth.middleware");
const ReportApartmentController = require("../../controllers/reportApartment.controller");
const validateFactory = require("../../middlewares/validation.middleware");
const {
	createReport,
	updateReport,
	searchReport,
	getReportById,
	groupByUserId,
	groupByApartmentId,
} = require("../../validations/reportApartment.validation");
const { ENUM_ROLE } = require("../../constant");

const router = express.Router();
router.use(authentication);
router.post(
	"/:apart_id",
	validateFactory(createReport),
	checkRole([ENUM_ROLE.USER]),
	asyncHandler(ReportApartmentController.createReport),
);
router.put(
	"/:report_id",
	validateFactory(updateReport),
	checkRole([ENUM_ROLE.USER]),
	asyncHandler(ReportApartmentController.updateReport),
);
router.get(
	"/",
	validateFactory(searchReport),
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(ReportApartmentController.searchReport),
);

router.delete(
	"/:report_id",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(ReportApartmentController.deleteReport),
);
router.get(
	"/group/user",
	validateFactory(groupByUserId),
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(ReportApartmentController.groupByUserId),
);
router.get(
	"/group/apartment",
	validateFactory(groupByApartmentId),
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(ReportApartmentController.groupByApartmentId),
);
router.get(
	"/:apart_id",
	validateFactory(getReportById),
	asyncHandler(ReportApartmentController.getReport),
);
module.exports = router;
