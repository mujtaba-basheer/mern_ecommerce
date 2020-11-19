const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("colors");

const productRoutes = require("./routes/productRoutes");

dotenv.config();

connectDB();

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/api/products", productRoutes);

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
