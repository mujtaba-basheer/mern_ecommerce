const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addOrderItems } = require("./../controllers/orderController");

router.route("/").post(protect, addOrderItems);

module.exports = router;
