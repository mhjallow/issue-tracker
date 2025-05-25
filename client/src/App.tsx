import { useEffect, useState } from "react";
// - useEffect: Runs code when the component shows up (like "on page load")
// - useState: Creates a "memory" which stores information temporarily

function App() { //The top level piece of the application, the visible part of the app.


  type Issue = { //Creating a type for the issues
  id: number;
  title: string;
  status: string;
  };

  
  //Creating memory box for issues
  const [issues, setIssues] = useState<Issue[]>([]);

  //sending a fetch request for the issues
  useEffect(() => {
    fetch("http://localhost:5000/api/issues")
      .then((res) => res.json())
      .then((data) => setIssues(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []); //The '[]' means don't run this again unless something changes

  return ( //Displaying the list of issues
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Issue List</h1>
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