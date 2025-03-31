"use strict";
const express = require("express");
const router = express.Router();
const { FILE_DIR } = require("../../configs");
router.use("/files", express.static(FILE_DIR));
module.exports = router;
