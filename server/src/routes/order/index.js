"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkRole } = require("../../middlewares/checkAuth.middleware");
const OrderController = require("../../controllers/order.controller");
const { ENUM_ROLE } = require("../../constant");

const router = express.Router();
router.use(authentication);


router.get("/", asyncHandler(OrderController.getOrders));
router.get("/revenue", checkRole([ENUM_ROLE.ADMIN,ENUM_ROLE.STAFF]), asyncHandler(OrderController.calculateRevenue));
router.get(
	"/:order_code",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.USER]),
	asyncHandler(OrderController.getOrderByCode),
);
module.exports = router;
