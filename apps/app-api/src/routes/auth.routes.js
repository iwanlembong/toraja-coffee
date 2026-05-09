const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");
const updateLastActive = require("../middleware/updateLastActive");

// LOGIN
router.post("/login", authController.login);

// LOGOUT
router.post("/logout", authController.logout);

// GET CURRENT USER
router.get(
    "/me",
    verifyToken,
    updateLastActive,
    authController.me
);

module.exports = router;