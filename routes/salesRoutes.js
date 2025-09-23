const express = require("express");
const router = express.Router("router");


router.get("/sales", (req, res) =>{
  res.render("sales")
});

router.post("/sales", (req, res) =>{
  console.log(req.body);
});

module.exports = router;