const express = require("express");
const router = express.Router();

const {
  restockProduct,
  getInventoryHistory,
} = require("../controllers/inventory.controller");

router.post("/restock/:id", restockProduct);
router.get("/", getInventoryHistory);

module.exports = router;