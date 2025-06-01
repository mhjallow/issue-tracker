const express = require("express"); //Loads the express tool
const cors = require("cors"); //Loads the CORS tool. This is necessary for now becuase the front and back ends run on two different local ports.

const app = express(); //Creating an express application

// Enable CORS
app.use(cors());

//Enable server to read JSON from the frontend
app.use(express.json());


//When someone visits the address "/" send back a message
app.get("/", (req, res) => {
  res.send("Your server is working!");
});

//Creating a list of issues that consist of an id number, title, and status.
let issues = [
  {id: 1, title: "Fix login bug", status: "open"},
  {id: 2, title: "Improve page speed", status: "in progress"},
  {id: 3, title: "Update user dashboard", status: "done"},
];
let nextId = issues.length + 1 //

//Adding new route to give list of issues in JSON format
app.get("/api/issues", (req, res) => {
  res.json(issues);
});


//Creating new POST route to receive new issue data
app.post("/api/issues", (req, res) =>{

  //Pull the title from the form and return an error if the title is missing
  const {title} = req.body;

  //Input validation, if title is empty or only spaces, return error
  if(!title || !title.trim()){
    return res.status(400).json({error: "Title is required"});
  }

  //Create a new issue from the given data and add id and status
  const newIssue = {
    id: nextId++,
    title,
    status: "open"
  };

  //Add the new issue to the list
  issues.push(newIssue);
  res.status(201).json(newIssue) //Send the new issue to the frontend

});

//Creating new DELETE route to remove issues from the backend
app.delete("/api/issues/:id", (req, res) => {
  const id = parseInt(req.params.id); //Pull id from URL
  const index = issues.findIndex((issue) => issue.id === id); //Find the index of the issue with the given ID

  //If index is not in list, return an error
  if(index === -1){
    return res.status(404).json({error: "Issue not found"});
  }

  issues.splice(index, 1); //Remove one item from the list, starting at index, effectively removing the item at the given index
  res.status(204).send();
});

//Creating new PUT route to update existing issues on the backend
app.put("/api/issues/:id", (req, res) =>{
  const id = parseInt(req.params.id, 10);
  const {title} = req.body;

  //Find issue and make sure it exists
  const issue = issues.find((i) => i.id === id);
  if(!issue){
    return res.status(404).json({error: "Issue not found"});
  }

  //Make sure title is valid
  if(!title || !title.trim()){
    return res.status(400).json({error: "Title is required"});
  }

  issue.title = title.trim();
  res.status.json(issue);
})


const PORT = 5000; //Storing the port number


app.listen(PORT, () => { //Start listening for requests on the port number, and run the code inside once the server is running
  console.log(`Server is running on port ${PORT}`);
});