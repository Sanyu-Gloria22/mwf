// Dependencies
const express = require("express");
const path = express("path");


//import routes


//instantiations
const app = express();
const port = 3000;

//configurations

//setting up mongoDB configurations
mongoose.connect(process.env.MONGODB_URI, {

  //  useNewUrlParser: true,
  //  useUnifiedTopology: true

})
.then(() => console.log(" Connected to MongoDB Atlas"))
.catch(err => console.error(" MongoDB connection error:", err));


//setting engine to pug

app.get("/index", (req, res) =>{
  res.send('Welcome to Mayoundo Wood and Furniture');
});



app.use((req, res) => {
  res.status(404).send(`Oops! Route not found.`);
});

app.listen(port, () => console.log(`listening on port ${port}`));