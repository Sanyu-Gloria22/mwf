const express = require("express");
const router = express.Router("router");

const StockModel = require("../models/StockModel");
router.get("/stock", (req, res) =>{
  res.render("stock");
});

router.post("/stock", async (req, res) =>{
  try {
    const stock = new StockModel(req.body)
      console.log(req.body);
    await stock.save();
    res.redirect("/manager");
  } catch (error) {
    console.error(error)
  }
});

router.get("/manager", (req, res) =>{
  res.render("manager");
});



module.exports = router;