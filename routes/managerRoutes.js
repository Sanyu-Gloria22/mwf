const express = require("express");
const router = express.Router();
const StockModel = require("../models/StockModel");

router.get("/manager", async (req, res) => {
  try {
    const items = await StockModel.find();

    // Separate categories
    const furniture = items.filter(p => p.productType.toLowerCase() === "furniture");
    const wood = items.filter(p => p.productType.toLowerCase() === "wood");

    // Calculate totals
    const calculateTotals = arr => {
      const totalItems = arr.reduce((sum, p) => sum + p.quantity, 0);
      const totalValue = arr.reduce((sum, p) => sum + p.productPrice * p.quantity, 0);
      return { totalItems, totalValue };
    };

    const furnitureTotals = calculateTotals(furniture);
    const woodTotals = calculateTotals(wood);

    // Render manager dashboard
    res.render("manager", {
      furniture,
      wood,
      furnitureTotals,
      woodTotals,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading manager dashboard");
  }
});

module.exports = router;
