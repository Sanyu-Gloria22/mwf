const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  customerName:{
    type:String,
    required:true,
    trim:true
  },
  productName:{
    type:String,
    required:true,
  },
  productType:{
    type:String,
    required:true
  },
  quantity:{
    type:String,
    required:true,
  },
  unitPrice:{
    type:String,
    required:true
  },
  
  color:{
    type:String
  },
  measurement:{
    type:String,
    required:true,
  },
  salesDate:{
    type:String,
    required:true
  },
  paymentMethod:{
    type:String,
    required:true
  },
  salesAgent:{
    type:String,
    required:true
  },
  totalPrice:{
    type:Number,
    required:true
  },
  transport:{
    type:String,
  }
});




module.exports = mongoose.model("salesModel", salesSchema)