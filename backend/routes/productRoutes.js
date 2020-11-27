const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProductReview,
    createProduct,
} = require("./../controllers/productController");
const { protect, checkAdmin } = require("../middleware/authMiddleware");

router.route("/").get(getProducts).post(protect, checkAdmin, createProduct);
router
    .route("/:id")
    .get(getProductById)
    .delete(protect, checkAdmin, deleteProduct)
    .put(protect, checkAdmin, updateProduct);

router.route("/:id/review").post(protect, createProductReview);

module.exports = router;
