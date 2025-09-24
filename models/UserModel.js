const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');


const signupSchema = new mongoose.Schema({
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
  phoneNumber:{
    type:Number,
    required:true
  },
  password:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    required:true
  },
  nin:{
    type:String,
    required:true
  },
  gender:{
    type:String
  },


});


signupSchema.plugin(passportLocalMongoose{
  usernameField:"emailAddress"
});
module.exports = mongoose.model("UserModel", signupSchema)