const asyncHandler = require("express-async-handler");
const Product = require("./../models/productModel");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/product/:id
// @access  Public

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product Not Found");
    }
});

module.exports = { getProducts, getProductById };