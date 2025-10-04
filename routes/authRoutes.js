const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");

const UserModel = require("../models/userModel");


//image upload config
let storage = multer.diskStorage({
  distination:(req,file,cb) => {
    cb(null, "/public/uploads")
  },
   filename:(req,file,cb) => {
    cb(null,file.originalname)
  }
})
const upload = multer({storage:storage})
router.get("/", (req, res) => {
  res.render("index",{title: "index page"})
});


// router.post("/signup", async(req, res) =>{
//   try {
//     const user = new UserModel(req.body);
//     console.log(req.body);
//     let existingUser = await UserModel.findOne({emailAddress:req.body.emailAdress});
//     if(existingUser){
//       return res.status(400).send("EmailAddress already registered, try using another one")
//     }else{
//       await UserModel.register(user,req.body.password,(error) =>{
//         if(error){
//           throw error;
//         }
//         res.redirect("/login");
//       })
//     }
//   } catch (error) {
//     req.status(400).send("Something went wrong");
//   }
// });


// router.get("/login", (req, res)=>{
//   res.render("login",{title: "login page"});
// });

// router.post("/login", passport.authenticate("local", {failureRedirect:'/login'}), (req, res) =>{
//   req.session.user = req.user;
//   if(req.user.role === "Manager") {
//    res.redirect("/manager")
//   }else if(req.user.role === "Attendant") {
//    res.redirect("/attendant")
//   }else (res.render("nonuser"))
// });


// router.post("/login", (req, res) =>{
//   res.redirect("/manager")
// });


router.get("/attendant", (req, res) =>{
  res.render("attendant");
});



router.get("/products", (req, res) =>{
  res.render("products");
});





// router.get("/userForm", (req, res) =>{
//   res.render("userForm");
// });

// router.post("/userForm", upload.single("profilePicture"), async (req, res) =>{
//   try {
//     const user = new UserModel(req.body)
//     user.profilePicture = req.file.path
//       console.log(req.body);
//     await user.save();  
//     res.redirect("/getusers");
//   } catch (error) {
//     console.error(error)
//   }
// });

module.exports = router;