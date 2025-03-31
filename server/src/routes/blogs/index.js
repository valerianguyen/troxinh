"use strict";
const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, checkRole } = require("../../middlewares/checkAuth.middleware");
const BlogController = require("../../controllers/blog.controller");
const validateFactory = require("../../middlewares/validation.middleware");
const {
	createComment,
	searchComments,
	guestSearchComment,
	updateComment,
	deleteComment,
} = require("../../validations/comment.validation");
const { ENUM_ROLE } = require("../../constant");
const router = express.Router();
router.get("/", asyncHandler(BlogController.getBlogs));
router.get("/:blog_id", asyncHandler(BlogController.getBlogById));
router.use(authentication);
router.get(
	"/a/my",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(BlogController.getMyBlogs),
);
router.post(
	"/",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(BlogController.createBlog),
);
router.put(
	"/:blog_id",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(BlogController.updateBlog),
);
router.delete(
	"/:blog_id",
	checkRole([ENUM_ROLE.ADMIN, ENUM_ROLE.STAFF]),
	asyncHandler(BlogController.deleteBlog),
);
module.exports = router;
