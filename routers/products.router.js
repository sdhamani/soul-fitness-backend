const express = require("express");
const router = express.Router();
const { Product } = require("../models/product.model");
const { extend } = require("lodash");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find({});
      res.json({ success: true, products });
    } catch (error) {
      res.status(500).json({
        successs: false,
        message: "Not able to get products",
        errorMessage: error.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const product = req.body;
      const NewProduct = new Product(product);
      const savedProduct = await NewProduct.save();
      res.json({ success: true, product, message: "Product Added" });
    } catch (error) {
      res.json({
        successs: false,
        message: "Not able to add product",
        errorMessage: error.message,
      });
    }
  });

router.param("productId", async (req, res, next, id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "product not found" });
    }

    req.product = product;
    next();
  } catch {
    res
      .status(400)
      .json({ success: false, message: "could not retrieve product " });
  }
});

// 607ac3cfba33f10327642680
router
  .route("/:productId")
  .get(async (req, res) => {
    const { product } = req;
    product.__v = undefined;
    res.json({ success: true, message: "Testing", product });
  })
  .post(async (req, res) => {
    try {
      console.log("trying to post");
      const newProduct = req.body;
      console.log(newProduct);
      let { product } = req;
      product = extend(product, newProduct);
      product = await product.save();
      res.json({ success: true, product, message: "Product Added" });
    } catch (error) {
      res.json({ success: false, errorMessage: error.message });
    }
  })
  .delete(async (req, res) => {
    let { product } = req;
    await product.remove();
    res.json({ success: true, message: "delete" });
  });

router.route("/").post(async (req, res) => {
  try {
    const product = req.body;
    const newProduct = new Product(product);
    const saveProduct = await newProduct.save();
    console.log(newProduct);
    res.json({ success: true, saveProduct });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Not able to add product",
      errorMessage: error.message,
    });
  }
});

module.exports = router;
