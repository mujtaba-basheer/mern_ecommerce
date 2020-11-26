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
// @route   GET /api/products/:id
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

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.remove();
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product Not Found");
    }
});

// @desc    Create a product
// @route   POST /api/products/:id
// @access  Private/Admin

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample Name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample Brand",
        category: "Sample Category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample Description",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        brand,
        image,
        category,
        countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.brand = brand || product.brand;
        product.image = image || product.image;
        product.countInStock = countInStock || product.countInStock;
        product.category = category || product.category;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
};
