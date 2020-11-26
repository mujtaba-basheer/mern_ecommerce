const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("colors");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();

connectDB();

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/config/paypal", (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));

app.use(notFound);

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(
    port,
    console.log(
        `Server running in ${process.env.NODE_ENV} on port ${port}...`.yellow
            .bold
    )
);
