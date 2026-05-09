const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");
const { auth } = require("../middleware/auth");

router.get(
    "/",
    auth(["SUPERADMIN"]),
    analyticsController.getAnalytics
);

module.exports = router;