const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const router = express.Router();
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", (req, res) => {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async (req, res) => {
  let products = await productModel.find();
  let sucess = req.flash("sucess");
  res.render("shop", { products, sucess });
});

router.get("/addtocart/:id", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  console.log(user);
  user.cart.push(req.params.id);
  await user.save();
  req.flash("sucess", "Added to cart");
  res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");

    // Calculate per-item total and attach it to each product
    const cartItems = user.cart.map((item) => {
      const bill = Number(item.price) + 20 - Number(item.discount);
      return { ...item._doc, bill }; // _doc gives plain JS object from Mongoose document
    });

    const totalBill = user.cart.reduce((acc, item) => {
      return acc + (Number(item.price) + 20 - Number(item.discount));
    }, 0);

    res.render("cart", { user, cartItems , totalBill });
  } catch (err) {
    console.error(err);
    res.redirect("/shop");
  }
});

router.get("/logout", isLoggedIn, (req, res) => {
  res.render("shop");
});

module.exports = router;
