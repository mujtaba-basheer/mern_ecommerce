const express = require("express");
const router = express.Router();
const { protect, checkAdmin } = require("../middleware/authMiddleware");
const {
    getUsers,
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getUserById,
    updateUser,
} = require("./../controllers/uerController");

router.post("/login", authUser);
router
    .route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.route("/").post(registerUser).get(protect, checkAdmin, getUsers);
router
    .route("/:id")
    .delete(protect, checkAdmin, deleteUser)
    .get(protect, checkAdmin, getUserById)
    .put(protect, checkAdmin, updateUser);

module.exports = router;
