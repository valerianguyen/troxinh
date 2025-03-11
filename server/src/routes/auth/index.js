'use strict'
const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication } = require('../../middlewares/checkAuth.middleware')
const AuthController = require('../../controllers/auth.controller')
const validateFactory = require('../../middlewares/validation.middleware')
const { registerSchema, loginSchema ,forgotPasswordSchema,changePasswordSchema} = require('../../validations/auth.validation')
const router = express.Router()


router.post('/register', validateFactory(registerSchema), asyncHandler(AuthController.register));
router.post('/login', validateFactory(loginSchema), asyncHandler(AuthController.login));
router.post('/renew', asyncHandler(AuthController.renew));
router.post('/forgot-password', validateFactory(forgotPasswordSchema), asyncHandler(AuthController.forgotPassword));
router.use(authentication)
router.post('/logout', asyncHandler(AuthController.logout));
router.post('/change-password', validateFactory(changePasswordSchema), asyncHandler(AuthController.changePassword));


module.exports = router;