const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    authUser,
    registerUser,
    getUserProfile,
} = require("./../controllers/uerController");

router.post("/login", authUser);
router.route("/profile").get(protect, getUserProfile);
router.route("/").post(registerUser);

module.exports = router;
