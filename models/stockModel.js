const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  customer:{
    type:String,
    required:true
  },
  productName:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  productType:{
    type:Number,
    required:true
  },
  quantity:{
    type:String,
    required:true,
  },
  pricePerUnit:{
    type:String
  },
  dateOfSale:{
    type:String,
    required:true
  },
  paymentMethode:{
    type:String
  },
  salesAgentName:{
    type:String,
    required:true
  },
  transport:{
    type:String,
    required:true
  },


});




module.exports = mongoose.model("StockModel", stockSchema)