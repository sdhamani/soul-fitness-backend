const express = require("express");
const router = express.Router();
const privateRoute = require("../middlewears/verifyToken");
const { Product } = require("../models/product.model");
const { User } = require("../models/user.model");
const { extend } = require("lodash");

const isProductInWishlistFun = async (userId, productId) => {
  let user = await User.findById(userId);
  let wishlist = user.wishlist;
  const isProductInWishlistArr = wishlist.filter(
    (item) => JSON.stringify(item.productId) === JSON.stringify(productId)
  );
  console.log(isProductInWishlistArr);
  if (isProductInWishlistArr.length !== 0) {
    return true;
  }
  return false;
};

router.get("/", privateRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    let user = await User.findById(userId).populate("wishlist.productId");
    let wishlist = user.wishlist;
    console.log(user);
    console.log(wishlist);
    res.json({
      success: true,
      message: "Wishlist fetched Successfully",
      wishlist: wishlist,
    });
  } catch (error) {
    res.json({
      success: true,
      message: "Error occured while getting products from wishlist",
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
      const productId = req.product._id;
      const userId = req.user._id;
      let user = await User.findById(userId);
      let wishlist = user.wishlist;
      const isProductInWishlist = await isProductInWishlistFun(
        userId,
        productId
      );
      if (isProductInWishlist) {
        let Updatedwishlist = wishlist.filter(
          (item) => JSON.stringify(item.productId) !== JSON.stringify(productId)
        );
        user.wishlist = Updatedwishlist;
        await user.save();
        let Returnuser = await User.findById(userId).populate(
          "wishlist.productId"
        );
        wishlist = Returnuser.wishlist;
        res.json({
          success: true,
          message: "Product successfully deleted from the wishlist",
          Updatedwishlist: wishlist,
        });
      } else {
        let newWishlistItem = {
          productId: productId,
          quantity: 1,
        };
        wishlist.push(newWishlistItem);
        user.wishlist = wishlist;
        await user.save();
        let Returnuser = await User.findById(userId).populate(
          "wishlist.productId"
        );
        wishlist = Returnuser.wishlist;

        res.json({
          success: true,
          message: "Product successfully added to the wishlist",
          Updatedwishlist: wishlist,
        });
      }
    } catch (error) {
      res.json({
        success: false,
        message: "Product wasn't added to Wishlist",
        errorMessage: error.message,
      });
    }
  })
  .delete(privateRoute, async (req, res) => {
    try {
      const productId = req.product._id;
      const userId = req.user._id;
      let user = await User.findById(userId);
      let wishlist = user.wishlist;
      const isProductInWishlist = await isProductInWishlistFun(
        userId,
        productId
      );
      if (!isProductInWishlist) {
        res.send({
          success: false,
          message: "Product is not present in the Wishlist",
        });
      } else {
        let Updatedwishlist = wishlist.filter(
          (item) => JSON.stringify(item.productId) !== JSON.stringify(productId)
        );
        user.wishlist = Updatedwishlist;
        await user.save();
        let Returnuser = await User.findById(userId).populate(
          "wishlist.productId"
        );
        wishlist = Returnuser.wishlist;

        res.json({
          success: true,
          message: "Product successfully deleted from the wishlist",
          Updatedwishlist: wishlist,
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
module.exports = router;
