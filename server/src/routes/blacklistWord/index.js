"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkRole } = require("../../middlewares/checkAuth.middleware");
const BlacklistWordController = require("../../controllers/blacklistWord.controller");
const { ENUM_ROLE } = require("../../constant");
const router = express.Router();

router.get("/", asyncHandler(BlacklistWordController.loadBlacklist));
router.use(authentication);
router.post(
	"/",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(BlacklistWordController.addBlacklist),
);
router.post(
	"/delete",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(BlacklistWordController.removeBlacklist),
);
module.exports = router;
