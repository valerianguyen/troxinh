"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkRole } = require("../../middlewares/checkAuth.middleware");
const { ENUM_ROLE } = require("../../constant");
const validateFactory = require("../../middlewares/validation.middleware");
const { queryUser, updateUserBody } = require("../../validations/user.validation");
const { upload } = require("../../configs/config.multer");
const router = express.Router();
const VerifyApartmentController = require("../../controllers/verifyApartment.controller");

router.use(authentication);
router.get("/", asyncHandler(VerifyApartmentController.getVerifyApartmentMedia));
router.post(
	"/approve/:ver_id",
	upload.array("files", 5),
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(VerifyApartmentController.approveVerifyApartment),
);
router.post(
	"/reject/:ver_id",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(VerifyApartmentController.rejectVerifyApartment),
);
module.exports = router;
