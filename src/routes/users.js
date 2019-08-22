const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
require("../models/Users");
const { registerValidation } = require("../utils/inputValidator");
const userModel = mongoose.model("users");

//get login
router.get("/login", (req, res) => {
  res.render("users/login");
});

//get register route
router.get("/register", (req, res) => {
  res.render("users/register");
});

//create account register
router.post("/register", (req, res) => {
  const errors = registerValidation(req);
  if (errors.length > 0) {
    res.render("users/register", {
      userError: errors,
      l_name: req.body.l_name,
      f_name: req.body.f_name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      confirm_password: req.body.confirm_password
    });
  } else {
    const newUser = {
      name: `${req.body.f_name} ${req.body.l_name}`,
      email: req.body.email,
      username: req.body.username,
      password: req.body.confirm_password
    };
    userModel.findOne({ email: newUser.email }).then(user => {
      if (user) {
        errors.push({ text: "email already exist" });
        res.render("users/register", {
          userError: errors,
          l_name: req.body.l_name,
          f_name: req.body.f_name,
          email: req.body.email,
          username: req.body.username
        });
        return;
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          new userModel(newUser)
            .save()
            .then(user => {
              console.log(user);
              req.flash("success_msg", "Your account is now ready");
              res.redirect("/users/login");
            })
            .catch(err => console.error(err));
        });
      });
    });
  }
});

//login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/diary",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//logout
router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/users/login");
});

module.exports = router;
