const express = require("express");
const path = express("path");


const app = express();
const port = 3000;



app.get("/index", (req, res) =>{
  res.send('Welcome to Mayoundo Wood and Furniture');
});



app.use((req, res) => {
  res.status(404).send(`Oops! Route not found.`);
});

app.listen(port, () => console.log(`listening on port ${port}`));