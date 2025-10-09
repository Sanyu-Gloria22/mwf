const express = require("express");
const router = express.Router();
const { ensureauthenticated } = require("../middleware/auth");
const salesModel = require("../models/salesModel");
const StockModel = require("../models/StockModel");

router.get("/attendant", ensureauthenticated, (req, res) => {
  res.render("attendant");
});

// FIXED: Render sales form (not saleslist)
router.get("/sales", ensureauthenticated, async (req, res) => {
  try {
    const stocks = await StockModel.find();
    res.render("sales", { stocks }); // Changed from "saleslist" to "sales"
  } catch (error) {
    console.error("Error loading stock items:", error.message);
    res.status(500).send("Failed to load stock data.");
  }
});

// FIXED: Complete POST route with proper error handling and stock update
router.post("/sales", ensureauthenticated, async (req, res) => {
  try {
    console.log("Received form data:", req.body);
    console.log("User session:", req.session.user);

    const userId = req.session.user._id;
    const {
      customerName,
      productName,
      productType,
      quantity,
      unitPrice,
      salesDate,
      paymentMethod,
      transport,
    } = req.body;

    // Validate required fields
    if (!customerName || !productName || !productType || !quantity || !unitPrice || !salesDate || !paymentMethod) {
      return res.status(400).send("All fields are required");
    }

    // Check stock availability
    const stock = await StockModel.findOne({ 
      productType: productType, 
      productName: productName 
    });
    
    if (!stock) {
      return res.status(400).send("Product not found in stock");
    }

    if (stock.quantity < Number(quantity)) {
      return res.status(400).send("Insufficient stock");
    }

    // Calculate total price
    let total = unitPrice * quantity;
    if (transport) {
      total *= 1.05;
    }

    // Create sale record
    const sale = new salesModel({
      customerName,
      productName,
      productType,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      salesDate,
      paymentMethod,
      attendant: userId,
      totalPrice: total,
      transport: !!transport,
    });

    console.log("Saving sale:", sale);
    await sale.save();

    // FIXED: Update stock quantity
    stock.quantity -= Number(quantity);
    await stock.save();

    console.log("Stock updated:", stock);
    
    res.redirect("/saleslist");
  } catch (error) {
    console.error("Error saving sale:", error.message);
    res.status(500).send("Error saving data: " + error.message);
  }
});

// FIXED: Sales list route
router.get("/saleslist", ensureauthenticated, async (req, res) => {
  try {
    const items = await salesModel
      .find()
      .sort({ createdAt: -1 }) // Changed from $natural to createdAt for better sorting
      .populate("attendant", "fullName emailAddress role");
    
    const currentUser = req.session.user || req.user;
    console.log("Current user:", currentUser);
    res.render("saleslist", { items, currentUser });
  } catch (error) {
    console.error("Error fetching sales:", error.message);
    res.status(500).send("Unable to get data from the database.");
  }
});

// FIXED: Edit sales route (should use salesModel, not StockModel)
router.get("/editsales/:id", ensureauthenticated, async (req, res) => {
  try {
    const item = await salesModel.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Sale not found");
    }
    res.render("editsales", { item }); // Fixed template name
  } catch (error) {
    console.error("Error fetching sale:", error.message);
    res.status(500).send("Unable to load sale data.");
  }
});

// FIXED: Update sales route
router.post("/editsales/:id", ensureauthenticated, async (req, res) => { // Changed from PUT to POST for form submission
  try {
    const product = await salesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(400).send("Sale not found.");
    }
    res.redirect("/saleslist"); // Fixed redirect path
  } catch (error) {
    console.error("Error updating sale:", error.message);
    res.status(500).send("Unable to update sale.");
  }
});

// FIXED: Delete sales route
router.post("/deletesales", ensureauthenticated, async (req, res) => {
  try {
    await salesModel.deleteOne({ _id: req.body.id }); // Fixed model name
    res.redirect("/saleslist"); // Fixed redirect path
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Unable to delete item from the database");
  }
});

module.exports = router;