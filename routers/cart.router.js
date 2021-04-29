const express = require("express");
const router = express.Router();
const privateRoute = require("../middlewears/verifyToken");
const { Product } = require("../models/product.model");
const { User, Cart } = require("../models/user.model");
const { extend } = require("lodash");

const isProductInCartFun = async (userId, productId) => {
  let user = await User.findById(userId);
  let cart = user.cart;
  const isProductInCartArr = cart.filter(
    (item) => JSON.stringify(item.productId) === JSON.stringify(productId)
  );
  console.log("in ipc");
  if (isProductInCartArr.length !== 0) {
    return true;
  }
  return false;
};

router.get("/", privateRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    let user = await User.findById(userId).populate("cart.productId");
    let cart = user.cart;
    res.json({
      success: true,
      message: "Cart Items fetched Successfully",
      cart: cart,
    });
  } catch (error) {
    res.json({
      success: true,
      message: "Error occured while getting products from cart",
      userId: req.user._id,
    });
  }
});

router.param("productId", async (req, res, next, id) => {
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product not found",
      });
    }
    req.product = product;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router
  .route("/:productId")
  .post(privateRoute, async (req, res) => {
    try {
      console.log("posting");
      const productId = req.product._id;
      const userId = req.user._id;
      console.log(userId);
      let user = await User.findById(userId);
      console.log(user);
      let cart = user.cart;
      const isProductInCart = await isProductInCartFun(userId, productId);
      console.log(isProductInCart);
      if (isProductInCart) {
        res.send({
          success: false,
          message: "Product is already present in the cart",
        });
      } else {
        let newCartItem = {
          productId: productId,
          quantity: 1,
        };
        cart.push(newCartItem);
        user.cart = cart;
        await user.save();
        let Returnuser = await User.findById(userId).populate("cart.productId");
        cart = Returnuser.cart;
        res.json({
          success: true,
          message: "Product successfully added to the cart",
          Updatedcart: cart,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Product was not added to Cart",
        errorMessage: error.message,
      });
    }
  })
  .delete(privateRoute, async (req, res) => {
    try {
      const productId = req.product._id;
      const userId = req.user._id;
      let user = await User.findById(userId);
      let cart = user.cart;
      const isProductInCart = await isProductInCartFun(userId, productId);

      if (!isProductInCart) {
        res.send({
          success: false,
          message: "Product is not present in the cart",
        });
      } else {
        let Updatedcart = cart.filter(
          (item) => JSON.stringify(item.productId) !== JSON.stringify(productId)
        );
        user.cart = Updatedcart;
        await user.save();
        let Returnuser = await User.findById(userId).populate("cart.productId");
        cart = Returnuser.cart;
        res.json({
          success: true,
          message: "Product successfully deleted from the cart",
          Updatedcart: cart,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: "Product was not deleted from the wishlist",
        errorMessage: error.message,
      });
    }
  });

router.route("/:productId/:quantiy").post(privateRoute, async (req, res) => {
  try {
    const productId = req.product._id;
    const userId = req.user._id;
    const newQuantity = Number(req.params.quantiy);
    const isProductInCart = await isProductInCartFun(userId, productId);

    let user = await User.findById(userId);
    let cart = user.cart;

    if (!isProductInCart) {
      res.send({
        success: false,
        message: "Product is not present in the cart",
      });
    } else {
      let updateCartItem = cart.find(
        (item) => JSON.stringify(item.productId) === JSON.stringify(productId)
      );
      updateCartItem = extend(updateCartItem, { quantity: newQuantity });
      cart = extend(cart, { updateCartItem });
      console.log({ updateCartItem });
      user.cart = cart;
      await user.save();
      let Returnuser = await User.findById(userId).populate("cart.productId");
      cart = Returnuser.cart;
      res.json({
        success: true,
        message: "Quantity successfully updated cart",
        Updatedcart: cart,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Quantity was not updated cart",
    });
  }
});
module.exports = router;
