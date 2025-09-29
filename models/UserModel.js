const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
  // profile:{
  //   type:String,
  //   required:false
  // },
  fullName:{
    type:String,
    required:true
  },
  emailAddress:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  userName:{
    type:String,
    required:true,
  },
  // userId:{
  //   type:Number,
  //   required:true,
  //   unique:true
  // },
  gender:{
    type:String,
    required:true
  },
  role:{
    type:String,
    required:true
  },
  phoneNumber:{
    type:Number,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  date:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  },

});


userSchema.plugin(passportLocalMongoose,{
  usernameField:"emailAddress"
});
const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

module.exports = UserModel;