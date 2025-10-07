const express = require("express");
const router = express.Router();
const moment = require("moment");
const StockModel = require("../models/StockModel");
const SalesModel = require("../models/salesModel");
const UserModel = require("../models/userModel"); // Assuming this model represents attendants
const { ensureManager } = require("../middleware/auth");

router.get("/manager", ensureManager, async (req, res) => {
  try {

    const today = moment().startOf("day").toDate();
    const tomorrow = moment(today).add(1, "days").toDate();


    // Furniture totals
    const furnitureTotals = await StockModel.aggregate([
      { $match: { productType: "Furniture" } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$productPrice"] } }
        }
      }
    ]);
    console.log("Furniture aggregation result:", furnitureTotals);

    // Wood totals
    const woodTotals = await StockModel.aggregate([
      { $match: { productType: "Wood" } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$productPrice"] } }
        }
      }
    ]);

    // Low stock items count (quantity less than 10 or any threshold)
    const lowStockCount = await StockModel.countDocuments({
      quantity: { $lt: 10 }
    });

    // Active attendants count (assuming users with role 'attendant' and active status)
    const activeAttendants = await UserModel.countDocuments({
      role: "attendant",
      isActive: true
    });

    // Total sales count
   const todaySalesResult = await SalesModel.aggregate([
      { $match: { date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, totalSales: { $sum: "$total" } } }
    ]);

   const totalSales = todaySalesResult[0] ? todaySalesResult[0].totalSales : 0;
    // Total revenue sum
    const revenueResult = await SalesModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.render("manager", {
      furnitureTotals: furnitureTotals[0] || { totalItems: 0, totalValue: 0 },
      woodTotals: woodTotals[0] || { totalItems: 0, totalValue: 0 },
      lowStockCount,
      activeAttendants,
      totalSales,
      totalRevenue
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    res.status(500).send("Error fetching dashboard data.");
  }
});

module.exports = router;
