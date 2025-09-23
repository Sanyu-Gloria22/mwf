// Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose")

require("dotenv").config();
const UserModel = require("./models/userModel");


//import routes
const salesRoutes = require("./routes/salesRoutes");
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");

//installations
const app = express();
const port = 3001;

//configurations
mongoose.connect(process.env.MONGODB_URL, {
  //  useNewUrlParser: true,
  //  useUnifiedTopology: true
});

mongoose.connection
  .on('open', () =>{
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });


// setting view engine
app.set("view engine", "pug");
app.set('views', path.join(__dirname, 'views'));



//Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); 




//Routes
app.use("/",salesRoutes);
app.use("/",authRoutes);
app.use("/",stockRoutes);










app.use((req, res) => {
  res.status(404).send(`Oops! Route not found.`);
});


app.listen(port, () => console.log(`listening on port ${port}`));
