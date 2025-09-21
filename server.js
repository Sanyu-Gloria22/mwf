// Dependencies
const express = require("express");

//import routes
const salesRoutes = require("./routes/salesRouter");

//installations
const app = express();
const port = 3001;


//Middlewares
app. use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 


app.get("/", (req, res) => {
 res.send("index");
});

app.get("/sales", (req, res) =>{
  res.sendFile(__dirname + "/html/sales.html");
});

app.post("/sales", (req, res) =>{
  console.log(req.body);
});


app.get("/products", (req, res) =>{
  res.sendFile(_dirname + "/products.html");
});

app.post("/products", (req, res) =>{
  console.log(req.body);
});


//Routes
app.use("/",salesRoutes)








app.use((req, res) => {
  res.status(404).send(`Oops! Route not found.`);
});


app.listen(port, () => console.log(`listening on port ${port}`));
