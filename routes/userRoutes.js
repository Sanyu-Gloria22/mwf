const express = require("express");
const router = express.Router("router");

router.get("/user", async (req, res) =>{
  try {
    let users = await UserModel.findOne().sort({$natual: -1});
    console.log(users)
    res.render("user", {users})
  } catch (error) {
    res.status(400).send("Unable to get users data from the database.")
  }
});




module.exports = router;