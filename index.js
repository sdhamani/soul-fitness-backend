const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const products = require("./data/products");

const PORT = 3000;
const { Product } = require("./models/product.model");

const initializeDBConnection = require("./db/db.connection");
const productsRouter = require("./routers/products.router");
const userRouter = require("./routers/users.router");
const cartRouter = require("./routers/cart.router");
const wishlistRouter = require("./routers/wishlist.router");

initializeDBConnection();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const addProductsToDB = async () => {
  try {
    console.log("inside add products");
    products.forEach(async (product) => {
      const newProduct = new Product(product);
      const savedProduct = await newProduct.save();
    });
  } catch (error) {
    console.log("error while populating products into DB", error.message);
  }
};

// addProductsToDB();
app.use("/products", productsRouter);
app.use("/user", userRouter);
app.use("/cart", cartRouter);
app.use("/wishlist", wishlistRouter);

app.get("/", (req, res) => {
  console.log(req);
  res.json({ success: true, message: "Welcome to Soul Fitness" });
});

app.use("*", function (req, res) {
  res.status(400).json("Page Not Found");
});

app.listen(PORT, () => {
  console.log("server started");
});
