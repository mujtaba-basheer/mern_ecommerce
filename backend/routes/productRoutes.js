const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
} = require("./../controllers/productController");
const { protect, checkAdmin } = require("../middleware/authMiddleware");

router.route("/").get(getProducts).post(protect, checkAdmin, createProduct);
router
    .route("/:id")
    .get(getProductById)
    .delete(protect, checkAdmin, deleteProduct)
    .put(protect, checkAdmin, updateProduct);

module.exports = router;
