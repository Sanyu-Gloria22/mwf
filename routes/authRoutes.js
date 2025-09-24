const express = require("express");
const router = express.Router();
// const passport = require("passport")

const UserModel = require("../models/userModel");

router.get("/", (req, res) => {
  res.render("index",{title: "index page"})
});


router.get("/signup", (req, res) =>{
  res.render("signUp",{title: "signUp page"})
});

router.post("/signup", (req, res) =>{
  const user = new UserModel(req.body);
  user.save()
  console.log(req.body);
  res.redirect("/login");
});

router.get("/sales", (req, res) =>{
  res.render("sales",{title: "sales page"})
});

router.post("/sale", (req, res) =>{
  console.log(req.body);
});

router.get("/login", (req, res)=>{
  res.render("login",{title: "login page"});
});

router.post("/login", (req, res) =>{
  console.log(req.body);
  res.redirect("/manager")
});








module.exports = router;