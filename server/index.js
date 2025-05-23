const express = require("express"); //Loads the express tool
const cors = require("cors"); //Loads the CORS tool. This is necessary for now becuase the front and back ends run on two different local ports.

const app = express(); //Creating an express application

// Enable CORS
app.use(cors());


//When someone visits the address "/" send back a message
app.get("/", (req, res) => {
  res.send("Your server is working!");
});


const PORT = 5000; //Storing the port number


app.listen(PORT, () => { //Start listening for requests on the port number, and run the code inside once the server is running
  console.log(`Server is running on port ${PORT}`);
});