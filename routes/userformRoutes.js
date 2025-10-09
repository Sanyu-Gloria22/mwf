const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");
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
router.post("/userForm", upload.single("profilePicture"), ensureManager, async (req, res) => {
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
    // Server-side validation
    const errors = [];

    // Required field validation
    if (!fullName || fullName.trim().length < 2) {
      errors.push("Full name is required and must be at least 2 characters long");
    }

    if (!emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      errors.push("Valid email address is required");
    }

    if (!userName || userName.trim().length < 3) {
      errors.push("Username is required and must be at least 3 characters long");
    }

    if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
      errors.push("Please select a valid gender");
    }

    if (!role || !['attendant', 'manager', 'admin'].includes(role)) {
      errors.push("Please select a valid role");
    }

    if (!phoneNumber || !/^\+?[\d\s-()]{10,}$/.test(phoneNumber.replace(/\s/g, ''))) {
      errors.push("Valid phone number is required (at least 10 digits)");
    }

    if (!address || address.trim().length < 5) {
      errors.push("Address is required and must be at least 5 characters long");
    }

    if (!date || isNaN(new Date(date).getTime())) {
      errors.push("Valid date is required");
    }

    if (!status || !['active', 'inactive'].includes(status)) {
      errors.push("Please select a valid status");
    }

    if (!password || password.length < 8) {
      errors.push("Password is required and must be at least 8 characters long");
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (password && !passwordRegex.test(password)) {
      errors.push("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }

    // File validation if uploaded
    if (req.file) {
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        errors.push("Profile picture must be a JPEG, PNG, or GIF image");
      }

      if (req.file.size > maxFileSize) {
        errors.push("Profile picture must be less than 5MB");
      }
    }

    // Check if email already exists
    const existingEmail = await UserModel.findOne({ emailAddress });
    if (existingEmail) {
      errors.push("Email address is already registered");
    }

    // Check if username already exists
    const existingUsername = await UserModel.findOne({ userName });
    if (existingUsername) {
      errors.push("Username is already taken");
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      // Get stocks data to re-render the form
      const stocks = await StockModel.find();
      return res.render("userform", { 
        error: errors.join(', '),
        formData: req.body, // Pass back form data to maintain state
        stocks 
      });
    }

    // Create new user
    const newUser = new UserModel({
      fullName: fullName.trim(),
      emailAddress: emailAddress.trim(),
      userName: userName.trim(),
      gender,
      role,
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      date,
      status,
      profilePicture: req.file ? req.file.filename : null,
    });

    // Register user with passport-local-mongoose
    await UserModel.register(newUser, password);
    
    // Redirect with success message
    req.session.successMessage = "User registered successfully!";
    res.redirect("/userform");

  } catch (err) {
    console.error("Error registering user:", err.message);
    
    // Handle specific errors
    let errorMessage = "Failed to register user";
    
    if (err.name === 'UserExistsError') {
      errorMessage = "User already exists with that username or email";
    } else if (err.name === 'MissingPasswordError') {
      errorMessage = "Password is required";
    } else {
      errorMessage = "Failed to register user: " + err.message;
    }

    // Get stocks data to re-render the form
    const stocks = await StockModel.find();
    res.render("userform", { 
      error: errorMessage,
      formData: req.body, // Pass back form data
      stocks 
    });
  }
});


// Get all users route
router.get("/getusers", ensureManager, async (req, res) => {
  try {
    console.log("Fetching users list...");
    const users = await UserModel.find().sort({ createdAt: -1 });
    console.log(`Found ${users.length} users`);
    res.render("userlist", { users });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).render("error", { 
      message: "Unable to get data from the database.",
      error: err 
    });
  }
});

// Function to create default manager
async function createDefaultManager() {
  try {
    console.log("🔍 Checking for existing manager...");
    const existingManager = await UserModel.findOne({ role: "manager" });
    
    if (!existingManager) {
      console.log("👨‍💼 No manager found, creating default manager...");
      
      const newManager = new UserModel({
        fullName: "System Manager",
        emailAddress: "manager@mwf.com",
        userName: "manager",
        gender: "Male",
        role: "manager",
        phoneNumber: "700000000",
        address: "MWF HQ",
        date: new Date(),
        status: "active",
        profilePicture: null,
      });
      
      await UserModel.register(newManager, "manager123");
      console.log(" Default Manager created successfully!");
      console.log(" Email: manager@mwf.com");
      console.log(" Password: manager123");
      console.log("Username: manager");
    } else {
      console.log("Manager account already exists");
    }
  } catch (err) {
    console.error("Error creating default manager:", err.message);
    if (err.name === 'UserExistsError') {
      console.error("⚠️ Manager user already exists in the system");
    }
  }
}

// Initialize default manager when this module loads
createDefaultManager();

module.exports = router;

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


router.post("/users/:id/toggle", ensureManager, async (req, res) => {
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
