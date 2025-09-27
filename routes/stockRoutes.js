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

router.get("/stocklist", async (req, res) =>{
  try {
    let items = await StockModel.find().sort({$natural:-1});
    console.log(items);
    res.render("stocklist", {items});
  } catch (error) {
    res.status(400).send("Unable to get data from the data base.")
  }
});



module.exports = router;