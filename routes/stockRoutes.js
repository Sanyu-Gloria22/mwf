const express = require("express");
const router = express.Router();
const { ensureauthenticated, ensureManager } = require("../middleware/auth");
const StockModel = require("../models/StockModel");

// Show add stock form
router.get("/stock", ensureManager, (req, res) => {
  res.render("stock");
});

// Handle add stock form
router.post("/stock", ensureManager, async (req, res) => {
  try {
    const stock = new StockModel(req.body);
    console.log("New stock data:", req.body);

    await stock.save();
    res.redirect("/stocklist");
  } catch (error) {
    console.error("Error adding stock:", error.message);
    res.status(500).send("Failed to add stock.");
  }
});

// View stock list
router.get("/stocklist", ensureManager, async (req, res) => {
  try {
    let items = await StockModel.find().sort({ $natural: -1 });
    console.log("Stock items:", items);

    res.render("stocklist", { items });
  } catch (error) {
    console.error("Error fetching stock list:", error.message);
    res.status(400).send("Unable to get data from the database.");
  }
});

// Edit stock form
router.get("/editstock/:id", ensureManager, async (req, res) => {
  try {
    let item = await StockModel.findById(req.params.id);
    if (!item) return res.status(404).send("Stock item not found.");

    res.render("editstock", { item });
  } catch (error) {
    console.error("Error loading edit form:", error.message);
    res.status(400).send("Error loading stock item.");
  }
});

// Update stock
router.put("/editstock/:id", ensureManager, async (req, res) => {
  try {
    const product = await StockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    res.redirect("/stocklist");
  } catch (error) {
    console.error("Error updating stock:", error.message);
    res.status(500).send("Error updating stock item.");
  }
});

// Delete stock
router.post("/deletestock", ensureManager, async (req, res) => {
  try {
    await StockModel.deleteOne({ _id: req.body.id });
    res.redirect("/stocklist");  // ✅ fixed
  } catch (error) {
    console.error("Error deleting stock:", error.message);
    res.status(400).send("Unable to delete item from the database.");
  }
});

module.exports = router;
