const express = require("express");
const router = express.Router("router");

const salesModel = require("../models/salesModel");
router.get("/sales", (req, res) =>{
  res.render("sales")
});

router.post("/sales", async (req, res) =>{
  try {
    const stock = new salesModel(req.body)
      console.log(req.body);
    await stock.save();
    res.redirect("/saleslist");
  } catch (error) {
    console.log(error)
  }
});

router.get("/saleslist", async (req, res) =>{
  try {
    let items = (await salesModel.find()).toSorted({$natural:-1});
    console.log(items);
    res.render("saleslist", {items});
  } catch (error) {
    res.status(400).send("Unable to get data from the data base.")
  }
  
});


module.exports = router;