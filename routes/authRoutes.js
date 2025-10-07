const express = require("express");
const router = express.Router();
const passport = require("passport");
const path = require("path");
const multer = require("multer");

const UserModel = require("../models/userModel");



router.get("/", (req, res) =>{
  res.render("index");
});


router.get("/products", (req, res) =>{
  res.render("products");
});



//login
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



// Change password form
router.get("/change-password", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.render("change-password", { user: req.user });
});

// Change password logic
router.post("/change-password", async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).send("New passwords do not match!");
  }

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Passport-Local-Mongoose provides changePassword()
    await user.changePassword(oldPassword, newPassword);
    await user.save();

    res.redirect("/login"); // log out after password change
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Failed to change password. Please try again.");
  }
});

// Multer setup for profile picture (same pattern you already use)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Edit Manager Profile
router.get("/edit-profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.render("edit-profile", { user: req.user });
});

router.post("/edit-profile", upload.single("profilePicture"), async (req, res) => {
  const { fullName, emailAddress, userName, phoneNumber, address } = req.body;
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }

    const updateData = {
      fullName,
      emailAddress,
      userName,
      phoneNumber,
      address,
    };

    // If a new profile picture is uploaded
    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }

    await UserModel.findByIdAndUpdate(req.user._id, updateData);

    res.redirect("/manager");
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).send("Failed to update profile.");
  }
});



module.exports = router;