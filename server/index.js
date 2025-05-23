const express = require("express");
const cors = require("cors"); //Loads the CORS tool. This is necessary for now becuase the front and back ends run on two different local ports.

const app = express();

// Enable CORS
app.use(cors());

app.get("/", (req, res) => {
  res.send("Your server is working!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});