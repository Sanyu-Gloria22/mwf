const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  productName:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  productType:{
    type:String,
    required:true
  },
  quantity:{
    type:String,
    required:true,
  },
  costPrice:{
    type:String
  },
  quanlity:{
    type:String,
    require:true
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




module.exports = mongoose.model("StockModel", stockSchema)