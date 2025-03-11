'use strict'
const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, checkRole } = require('../../middlewares/checkAuth.middleware')
const RentRequestController = require('../../controllers/rentRequest.controller')
const validateFactory = require('../../middlewares/validation.middleware')
const { updateStatusRentRequest, updateTimeRentRequest, createRentRequest, findRentRequest } = require('../../validations/rentRequest.validation')
const { ENUM_ROLE } = require('../../constant')

const router = express.Router()
router.use(authentication)
router.post("/", checkRole([ENUM_ROLE.USER]), validateFactory(createRentRequest), asyncHandler(RentRequestController.createRentRequest))
router.patch("/status/:rentRequestId", validateFactory(updateStatusRentRequest), checkRole([ENUM_ROLE.USER, ENUM_ROLE.SELLER]), asyncHandler(RentRequestController.updateStatusRentRequest))
router.patch("/time/:rentRequestId", validateFactory(updateTimeRentRequest), checkRole([ENUM_ROLE.USER]), asyncHandler(RentRequestController.updateTimeRentRequest))
router.get("/", checkRole([ENUM_ROLE.USER]), validateFactory(findRentRequest), asyncHandler(RentRequestController.searchRentRequest))

module.exports = router;