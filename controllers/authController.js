const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error", "Account already exists. Please log in!");
      return res.redirect("/")
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          res.send(err.message);
        } else {
          let createdUser = await userModel.create({
            email,
            password: hash,
            fullname,
          });
          let token = generateToken(createdUser);
          res.cookie("token", token);
          req.flash(
            "success",
            "Account created successfully! You can log in now."
          );

          // res.send("User created sucessfully");
        }
      });
    });
  } catch (err) {
    req.flash("error", "Something went wrong. Please try again!");

    res.send(err.message);
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Email or password incorrect!");

      return res.redirect("/")
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        req.flash("success", `Welcome back, ${user.fullname}!`);

        res.redirect("/shop");
      } else {
        req.flash("error", "Email or password incorrect!");

        return res.redirect("/")
      }
    });
  } catch (err) {
    req.flash("error", "Login failed. Please try again!");

    res.send(err.message);
  }
};

module.exports.logout = (req , res) => {
  res.cookie("token", "")
  res.redirect("/")
}

