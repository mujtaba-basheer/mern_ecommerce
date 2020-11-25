const asyncHandler = require("express-async-handler");
const User = require("./../models/userModel");
const generateToken = require("./../utils/generateToken");

// @desc    Auth uer & get token
// @route   POST /api/user/login
// @access  Public

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        if (user.matchPassword(password)) {
            const { _id: id, name, email, isAdmin } = user;
            res.json({ id, name, email, isAdmin, token: generateToken(id) });
        } else {
            res.status(401);
            throw new Error("Invalid email or password.");
        }
    } else {
        res.status(404);
        throw new Error("Use not found.");
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });

    if (user) {
        const { _id: id, name, email, isAdmin } = user;
        res.json({ id, name, email, isAdmin, token: generateToken(id) });
    } else {
        res.status(400);
        throw new Error("Invalid user data.");
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { _id: id, name, email, isAdmin } = user;
        res.json({ id, name, email, isAdmin });
    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        const { _id: id, name, email, isAdmin } = updatedUser;
        res.json({ id, name, email, isAdmin, token: generateToken(id) });
    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});

    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) res.json(user);
    else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();

        const { _id: id, name, email, isAdmin } = updatedUser;
        res.json({ id, name, email, isAdmin });
    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};
