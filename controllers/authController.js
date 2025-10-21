const userModel = require("../models/user-model");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken")


module.exports.registerUser = async (req, res) => {
  try {
    let { email, fullname, password } = req.body;
    let existingUser = await  userModel.findOne({email})
    if(existingUser) {
        return res.status(401).send("already have an account, please login")
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
          let token = generateToken(createdUser)
          res.cookie("token", token)
          res.send("User created sucessfully");
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
}

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await  userModel.findOne({email})
    if(!user) {
        return res.status(401).send("Email or password incorrect")
    }
    bcrypt.compare(password, user.password, (err , result) => {
      if(result) {
        let token = generateToken(user)
        res.cookie("token" , token)
        res.send("you can login")
      } else {
        return res.status(401).send("Email or password incorrect")
      }
    })
  } catch (err) {
    res.send(err.message);
  }
}
    
    
