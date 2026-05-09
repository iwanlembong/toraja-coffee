const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", productController.getProducts);

router.get("/slug/:slug", productController.getProductBySlug);

router.post(
    "/",
    auth(["SUPERADMIN", "PRODUCT_ADMIN"]),
    upload.single("image"),
    productController.createProduct
);

router.put(
    "/:id",
    auth(["SUPERADMIN", "PRODUCT_ADMIN"]),
    upload.single("image"),
    productController.updateProduct
);

router.delete(
    "/:id",
    auth(["SUPERADMIN", "PRODUCT_ADMIN"]),
    productController.deleteProduct
);

module.exports = router;