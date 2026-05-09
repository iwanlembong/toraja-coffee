const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const { auth } = require("../middleware/auth");

router.get("/", auth(["SUPERADMIN", "ORDER_ADMIN"]), orderController.getOrders);

router.post("/", orderController.createOrder);

router.put("/:id/status", auth(["SUPERADMIN", "ORDER_ADMIN"]), orderController.updateStatus);

router.delete("/:id", auth(["SUPERADMIN", "ORDER_ADMIN"]), orderController.deleteOrder);

module.exports = router;