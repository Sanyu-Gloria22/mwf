const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productType:{
    type:String,
    required:true
  },
  productName:{
    type:String,
    required:true,
    trim:true
  },
  quantity:{
    type:Number,
    required:true,
  },
  costPrice:{
    type:Number
  },
  productPrice:{
    type:Number,
    required:true
  },
  quality:{
    type:String,
    required:true
  },
  color:{
    type:String,
    required:true
  },
  measurement:{
    type:String,
    required:true,
  },
  date:{
    type:String,
    required:true
  },
  supplierName:{
    type:String,
    required:true
  }
});




module.exports = mongoose.model("StockModel", stockSchema  )