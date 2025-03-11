'use strict'
const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, checkRole } = require('../../middlewares/checkAuth.middleware')
const CommentController = require('../../controllers/comment.controller')
const validateFactory = require('../../middlewares/validation.middleware')
const { createComment, searchComments, guestSearchComment, updateComment, deleteComment } = require("../../validations/comment.validation")
const { ENUM_ROLE } = require('../../constant')
const router = express.Router()
router.get('/:apartmentId', validateFactory(guestSearchComment), asyncHandler(CommentController.getCommentById));
router.use(authentication)
router.post('/:apart_id', checkRole([ENUM_ROLE.USER]), validateFactory(createComment), asyncHandler(CommentController.createComment));
router.get('/', checkRole([ENUM_ROLE.ADMIN,ENUM_ROLE.STAFF]), validateFactory(searchComments), asyncHandler(CommentController.searchComment));
router.put('/:cmt_id', checkRole([ENUM_ROLE.ADMIN,ENUM_ROLE.STAFF]), validateFactory(updateComment), asyncHandler(CommentController.updateStatusComment));
router.delete('/:cmt_id', checkRole([ENUM_ROLE.ADMIN,ENUM_ROLE.STAFF]), validateFactory(deleteComment), asyncHandler(CommentController.deleteComment));
module.exports = router;