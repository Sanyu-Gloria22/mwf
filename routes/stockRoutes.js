const express = require("express");
const router = express.Router();
 const {ensureauthenticated,ensureManager} = require("../middleware/auth");
const StockModel = require("../models/StockModel");
router.get("/stock"/*, ensureManager*/, (req, res) =>{
  res.render("stock");
});

router.post("/stock"/*,ensureManager*/,async (req, res) =>{
  try {
    const stock = new StockModel(req.body)
      console.log(req.body);
    await stock.save();
    res.redirect("/stock");
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


router.get("/editstock/:id",  async (req, res) => {
  let item = await StockModel.findById(req.params.id);
  res.render(`editstock`, {item});
});
router.put('/editstock/:id', async (req, res) =>{
  try {
    const product = await StockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new :true }
    );
    if (!product) {
      return res.status(400).send("Product not found.")
    }
    res.redirect("/stocklist");
  } catch (error) {}
});


router.post("/deletestock", async (req, res) =>{
  try {
    await StockModel.deleteOne({_id:req.body.id});
    res.redirect("stocklist")
  } catch (error) {
    console.log(error.message)
    res.status(400).send("Unable to delete items from the database")
  }
})


module.exports = router;