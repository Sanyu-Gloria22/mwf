const express = require("express");
const router = express.Router("router");


router.get("/sales", (req, res) =>{
  res.render("sales")
});

router.post("/sales", (req, res) =>{
  console.log(req.body);
});

router.get("/saleslist", (req, res) =>{
  res.render("saleslist",{title: "saleslist page"})
});


module.exports = router;