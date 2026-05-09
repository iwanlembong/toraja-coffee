const express = require("express");
const router = express.Router();

const contentController = require("../controllers/content.controller");
const { auth } = require("../middleware/auth");

// GET content (public)
router.get("/", contentController.getContent);

// UPDATE content (protected)
router.put(
    "/:id",
    auth(["SUPERADMIN", "CONTENT_ADMIN"]),
    contentController.updateContent
);

module.exports = router;