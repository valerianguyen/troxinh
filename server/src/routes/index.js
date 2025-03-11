'use strict'
const express = require('express')
const router = express.Router()


router.use("/user", require("./users"));
router.use("/auth", require("./auth"));
router.use("/apartment", require("./apartment"));
router.use("/requests", require("./rentRequest"));
router.use("/comments", require("./comments"));
router.use("/ticket", require("./ticket"));
router.use("/favorite", require("./favorite"));
router.use("/report", require("./reportApartment"));
router.use("/payment", require("./payment"));
router.use("/order", require("./order"));
router.use("/blacklist-words", require("./blacklistWord"));	
module.exports = router;