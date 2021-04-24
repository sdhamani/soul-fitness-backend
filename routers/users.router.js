const express = require("express");
const router = express.Router();
const { User } = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router
  .route("/")
  .get(async (req, res) => {
    const users = await User.find();
    res.json({ success: true, message: "Inside Users", users });
  })
  .post(async (req, res) => {
    const { name, email, password, cart, wishlist } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    try {
      const NewUser = new User({
        name,
        email,
        password: hashPassword,
        cart,
        wishlist,
      });
      const savedUser = await NewUser.save();
      res.status(200).json({ success: true, savedUser, message: "User Added" });
    } catch (error) {
      res.json({
        successs: false,
        message: "Not able to add User",
        errorMessage: error.message,
      });
    }
  });

router.post("/login", async (req, res) => {
  try {
    //checking if user's email is already present
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).send("User doesn't exist");
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      res.status(400).send("Incorrect Password");
    }

    ///create and assign token
    console.log(user._id);
    const token = jwt.sign({ _id: user._id }, process.env.tokenSecret);
    res.header("auth-token", token).send(token);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
