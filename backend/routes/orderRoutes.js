const express = require("express");
const router = express.Router();
const { protect, checkAdmin } = require("../middleware/authMiddleware");
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
} = require("./../controllers/orderController");

router
    .route("/")
    .post(protect, addOrderItems)
    .get(protect, checkAdmin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, checkAdmin, updateOrderToDelivered);

module.exports = router;
