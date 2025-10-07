const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const multer = require("multer");
const path = require("path");
const passport = require("passport");
const {ensureauthenticated,ensureManager} = require("../middleware/auth");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => 
   cb(null, path.join(__dirname, "../public/uploads")),
  filename: (req, file, cb) =>
   cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/userForm",(req, res) => {
  res.render("userForm")
});

router.post("/userForm", upload.single("profilePicture")/*, ensureManager*/,async (req, res) => {
  const { 
    fullName, 
    emailAddress, 
    userName, 
    gender, 
    role, 
    phoneNumber, 
    address, 
    date, 
    status, 
    password 
  } = req.body;

  try {
    const newUser = new UserModel({
      fullName,
      emailAddress,
      userName,
      gender,
      role,
      phoneNumber,
      address,
      date,
      status,
      profilePicture: req.file ? req.file.filename : null,
    });

    await UserModel.register(newUser, password);
    res.redirect("/login");
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).send("Failed to register user: " + err.message);
  }
});


router.get("/getusers", /*ensureManager,*/ async (req, res) => {
  try {
    const users = await UserModel.find().sort({ $natural: -1 });
    res.render("userlist", { users });
  } catch (err) {
    res.status(400).send("Unable to get data from the database.");
  }
});

// Function to create default manager
async function createDefaultManager() {
  try {
    const existingManager = await UserModel.findOne({ role: "manager" });
    if (!existingManager) {
      const newManager = new UserModel({
        fullName: "System Manager",
        emailAddress: "manager@mwf.com",
        userName: "manager",
        gender: "Unknown manager",
        role: "manager",
        phoneNumber: 700000000,
        address: "MWF HQ",
        date: new Date().toLocaleDateString(),
        status: "Active",
        profilePicture: null,
      });
      await UserModel.register(newManager, "manager123");
      console.log("Default Manager created: manager@mwf.com / manager123");
    } else {
      console.log("Manager already exists");
    }
  } catch (err) {
    console.error("Error creating default manager:", err);
  }
}

//Edting users
router.get("/edit-profile",  async (req, res) => {
  let item = await StockModel.findById(req.params.id);
  res.render(`edit-profile`, {item});
});
router.put('/edit-profile', async (req, res) =>{
  try {
    const product = await StockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new :true }
    );
    if (!product) {
      return res.status(400).send("Product not found.")
    }
    res.redirect("/getusers");
  } catch (error) {}
});


// Toggle user active status
router.get("/user/:id/toggle",(req, res) => {
 res.redirect("/getusers");
});


router.post("/users/:id/toggle", /*ensureManager*/async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Flip the current status
    user.isActive = !user.isActive;
    await user.save();

    res.redirect("/getusers"); // redirect back to your list
  } catch (error) {
    console.error("Error toggling user:", error.message);
    res.status(500).send("Error toggling user status");
  }
});


//  Export router as default export
module.exports = router;

// Export the function separately
module.exports.createDefaultManager = createDefaultManager;
