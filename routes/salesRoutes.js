const express = require("express");
const router = express.Router();
const {ensureauthenticated, ensureAttendant } = require("../middleware/auth");

const salesModel = require("../models/salesModel");


router.get("/attendant", ensureAttendant, (req, res) =>{
  res.render("attendant");
});


router.get("/sales",ensureAttendant, (req, res) =>{
  res.render("sales")
});

router.post("/sales",ensureAttendant, async (req, res) =>{
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
    const userId = req.session.user._id;

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
      attendant: userId,
      totalPrice,
      transport
    });
      console.log("logged in attendant", userId);
    await sale.save();
    res.redirect("/saleslist");
  } catch (error) {
    console.error("Error saving sale:", error.message);
  res.status(400).send("Error saving data: " + error.message);
  }
});

router.get("/saleslist", /*ensureAttendant,*/ async (req, res) => {
  try {
    let items = await salesModel
      .find()
      .sort({ $natural: -1 })
      .populate("attendant", "fullName emailAddress role");

    res.render("saleslist", { items });
  } catch (error) {
    console.error("Error fetching sales:", error.message);
    res.status(400).send("Unable to get data from the database.");
  }
});


router.get("/editsales/:id",  async (req, res) => {
  let item = await StockModel.findById(req.params.id);
  res.render(`editstock`, {item});
});
router.put('/editsales/:id', async (req, res) =>{
  try {
    const product = await StockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new :true }
    );
    if (!product) {
      return res.status(400).send("Product not found.")
    }
    res.redirect("/stocksales");
  } catch (error) {}
});


router.post("/deletesales", async (req, res) =>{
  try {
    await StockModel.deleteOne({_id:req.body.id});
    res.redirect("stocklist")
  } catch (error) {
    console.log(error.message)
    res.status(400).send("Unable to delete items from the database")
  }
})




module.exports = router;