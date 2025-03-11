"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkRole } = require("../../middlewares/checkAuth.middleware");
const PaymentController  = require("../../controllers/payment.controller");


const router = express.Router();
router.get(
	"/vnpay-return",
	asyncHandler(PaymentController.returnURL),
);	
module.exports = router;