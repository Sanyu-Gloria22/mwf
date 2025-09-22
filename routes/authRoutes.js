const express = require("express");
const router = express.Router();
// const passport = require("passport")


router.get("/", (req, res) => {
  res.render("index",{title: "index page"})
});


router.get("/signup", (req, res) =>{
  res.render("signUp",{title: "signUp page"})
});

router.post("/signup", (req, res) =>{
  console.log(req.body);
});






module.exports = router;