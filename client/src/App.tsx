import { useEffect, useState } from "react";
// - useEffect: Runs code when the component shows up (like "on page load")
// - useState: Creates a "memory" which stores information temporarily

function App() { //The top level piece of the application, the visible part of the app.


  type Issue = { //Creating a type for the issues
  id: number;
  title: string;
  status: string;
  };

  
  //Creating memory box for issues, which will be a list of the issue type
  const [issues, setIssues] = useState<Issue[]>([]);
  //Memory box for new title
  const [newTitle, setNewTitle] = useState("");


  //sending a fetch request for the issues
  useEffect(() => {
    fetch("http://localhost:5000/api/issues")
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []); //The '[]' means don't run this again unless something changes

  //Handling adding new issues
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //Keep page from reloading

    //Prevent empty or all space input
    if(!newTitle.trim()){ //If all whitespaces are removed and the result is an empty string
      alert("Please enter a title before submitting")
      setNewTitle("");
      return;
    }

    //Send a post request to the backend with a new issue with the given title
    fetch("http://localhost:5000/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({title: newTitle})
    })
    //After the data is sent to the backend, return it to the frontend as an issue with id and status and add it to the list
    .then((res) => {
      //If the backend returns an error
      if(!res.ok){
        throw new Error("Server error");
      }
      return res.json();
    })
    .then((newIssue) => {
      setIssues([...issues, newIssue]);
      setNewTitle(""); //Clears the input box
    })
    .catch((err) => {
      console.error("Post error:", err);
      alert("Something went wrong while creating the issue.");
    });
  };

  return ( //Displaying the list of issues
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Issue List</h1>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-6 flex gap-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)} //Updating event object
            className="flex-1 p-2 border rounded"
            placeholder="New issue title"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Add Issue
          </button>
        </form>

        <ul className="space-y-4 max-w-xl mx-auto">
          {issues.map((issue) => ( //For each item in issues, create a list item with the title and status
            <li key={issue.id} className="p-4 bg-white rounded shadow">
              <p className="text-lg font-medium">{issue.title}</p>
              <p className="text-sm text-gray-500">Status: {issue.status}</p>
            </li>
          ))}
        </ul>
      </div>
    );
}

export default App;