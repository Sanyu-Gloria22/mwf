// Dependencies
const express = require("express");
const path = require("path");


//import routes
const salesRoutes = require("./routes/salesRoute");
const authRoutes = require("./routes/authRoutes");

//installations
const app = express();
const port = 3001;

//configurations

app.set("view engine", "pug");
app.set('views', path.join(__dirname, 'views'));


//Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); 




//Routes
app.use("/",salesRoutes);
app.use("/",authRoutes);










app.use((req, res) => {
  res.status(404).send(`Oops! Route not found.`);
});


app.listen(port, () => console.log(`listening on port ${port}`));
