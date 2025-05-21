const express = require("express");
const app = express();
const PORT = 5000;

// this is your first "route"
app.get("/", (req, res) => {
  res.send("Server is working!");
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});