const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const passport = require("passport");
const UserModel = require("../models/UserModel");

// Multer setup for profile picture
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads")); // correct path to your uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


router.get("/userForm", (req, res) =>{
   res.render("userForm");
});

// Registration route
router.post("/userForm", upload.single("profilePicture"), async (req, res) => {
  const { fullName, emailAddress, userName, gender, role, phoneNumber, address, date, status, password } = req.body;

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

    // Passport handles hashing
    await UserModel.register(newUser, password);

    res.redirect("/login");
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.status(500).send("Failed to register user: " + err.message);
  }
});

router.get("/login", (req, res) =>{
  res.render("login");
});



router.post("/login", passport.authenticate("local", {failureRedirect:'/login'}), (req, res) =>{
  req.session.user = req.user;
  if(req.user.role === "Manager") {
    res.redirect("/manager");
  } else if(req.user.role === "Attendant") {
    res.redirect("/attendant");
  } else {
    res.render("nonuser");  // fixed syntax
  }
});




router.get("/getusers", async (req, res) =>{
  try {
    let users = await UserModel.find().sort({$natural:-1});
    console.log(users);
    res.render("userlist", {users});
  } catch (error) {
    res.status(400).send("Unable to get data from the data base.")
  }
});




module.exports = router;
