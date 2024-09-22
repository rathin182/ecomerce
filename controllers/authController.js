const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { generateToken } = require("../utils/generateToken")

const registerSchema = Joi.object({
    fullname: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

module.exports.registerUser = async (req, res) => {
    try {
      // Validate the request body against the Joi schema
      const { error } = registerSchema.validate(req.body);
  
      if (error) {
        // If validation fails, return a 400 response with the error message
        return res.status(400).send({ message: error.details[0].message });
      }
  
      let { fullname, email, password } = req.body;

      let user = await userModel.findOne({email: email});
      if (user) {req.flash("error", "user alredy exist");
        return res.redirect("/"); };
  
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          if (err) res.send(err.message);
          else {
          //Create the user if validation passes
            let user = await userModel.create({
              email,
              password: hash,
              fullname,
            });
  
           let token = generateToken(user);
           res.cookie("token", token)
           
           res.send("user created successfully");
          }
        });
      });
    } catch (err) {
      console.log(err.message);
    }
}

module.exports.loginUser = async (req, res) => {
  let { email, password } = req.body;
  
let user = await userModel.findOne({email: email})
 if (!user) {req.flash("error", "user does not exist");
  return res.redirect("/"); }
bcrypt.compare(password, user.password, function (err, result) {
  if (result) {
    let token = generateToken(user);
    res.cookie("token", token)
    res.redirect("/shop");
  } else {
    req.flash("error", "wrong password");
  return res.redirect("/");
  }
});
}

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
}