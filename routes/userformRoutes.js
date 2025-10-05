const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const multer = require("multer");
const path = require("path");
const passport = require("passport");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => 
   cb(null, path.join(__dirname, "../public/uploads")),
  filename: (req, file, cb) =>
   cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/userForm", (req, res) => res.render("userForm"));

router.post("/userForm", upload.single("profilePicture"), async (req, res) => {
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

router.get("/login", (req, res) => { 
  res.render("login")
});

router.post("/login", passport.authenticate("local", { failureRedirect: '/login' }), (req, res) => {
  console.log("Logged in as:", req.user);
  req.session.user = req.user;
  if (req.user.role === "manager")
   res.redirect("/manager");
  else if (req.user.role === "Attendant") 
    res.redirect("/attendant");
  else res.render("nonuser");
});

router.get("/getusers", async (req, res) => {
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
        gender: "N/A",
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

//  Export router as default export
module.exports = router;

// Export the function separately
module.exports.createDefaultManager = createDefaultManager;
