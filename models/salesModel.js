const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
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
  unitprice:{
    type:String
  },
  productPrice:{
    type:String,
    required:true
  },
  quality:{
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