'use strict'
const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const UserController = require('../../controllers/user.controller')
const { authentication, checkRole } = require('../../middlewares/checkAuth.middleware')
const { ENUM_ROLE } = require('../../constant')
const validateFactory = require('../../middlewares/validation.middleware')
const { queryUser, updateUserBody } = require('../../validations/user.validation')
const router = express.Router()

router.use(authentication)
router.get("/me", asyncHandler(UserController.me));
router.get('/', checkRole([ENUM_ROLE.ADMIN,ENUM_ROLE.STAFF]), validateFactory(queryUser), asyncHandler(UserController.getAllUsers));
router.get('/:id', asyncHandler(UserController.getUserById));
router.put('/', validateFactory(updateUserBody), asyncHandler(UserController.updateUser));
router.post('/ban/:id', checkRole([ENUM_ROLE.ADMIN]), asyncHandler(UserController.banUser));
router.put('/role/:id', checkRole([ENUM_ROLE.ADMIN]), asyncHandler(UserController.changeRoleStaff));
router.post('/become-seller', checkRole([ENUM_ROLE.USER]), asyncHandler(UserController.becomeSeller));
module.exports = router;
