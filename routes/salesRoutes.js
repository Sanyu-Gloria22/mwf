const express = require("express");
const router = express.Router();
const {ensureauthenticated, ensureAttendant } = require("../middleware/auth");

const salesModel = require("../models/salesModel");
router.get("/sales", (req, res) =>{
  res.render("sales")
});

router.post("/sales", ensureauthenticated,ensureAttendant, async (req, res) =>{
  try {
    const {
      customerName,
      productName,
      productType,
      quantity,
      unitPrice,
      color,
      measurement,
      salesDate,
      paymentMethod,
      totalPrice,
      transport
    } = req.body;
    const userId = req.session.user._Id;

    const sale = new salesModel({
      customerName,
      productName,
      productType,
      quantity,
      unitPrice,
      color,
      measurement,
      salesDate,
      paymentMethod,
      salesAgent: userId,
      totalPrice,
      transport
    });
      console.log(req.body);
    await sale.save();
    res.redirect("/saleslist");
  } catch (error) {
    console.error("Error saving sale:", error.message);
  res.status(400).send("Error saving data: " + error.message);
  }
});

router.get("/saleslist", async (req, res) =>{
  try {
  let items = await salesModel.find().sort({ $natural: -1 });
    console.log(items);
    res.render("saleslist", {items});
  } catch (error) {
    res.status(400).send("Unable to get data from the data base.")
  }
  
});


module.exports = router;