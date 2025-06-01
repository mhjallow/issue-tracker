import { TrashIcon, PencilIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
// - useEffect: Runs code when the component shows up (like "on page load")
// - useState: Creates a "memory" which stores information temporarily

function App() {
  //The top level piece of the application, the visible part of the app.

  type Issue = {
    //Creating a type for the issues
    id: number;
    title: string;
    status: string;
  };

  //Creating memory box for issues, which will be a list of the issue type
  const [issues, setIssues] = useState<Issue[]>([]);
  //Memory box for new title
  const [newTitle, setNewTitle] = useState("");
  //States to track which issue is being edited
  const [editingId, setEditingId] = useState<number | null>(null); //Tracks which issue is being edited
  const [editedTitle, setEditedTitle] = useState(""); //Stores the value being edited

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
    if (!newTitle.trim()) {
      //If all whitespaces are removed and the result is an empty string
      alert("Please enter a title before submitting");
      setNewTitle(""); //Clears the input box
      return;
    }

    //Send a post request to the backend with a new issue with the given title
    fetch("http://localhost:5000/api/issues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    })
      //After the data is sent to the backend, return it to the frontend as an issue with id and status and add it to the list
      .then((res) => {
        //If the backend returns an error
        if (!res.ok) {
          throw new Error("Server error");
        }
        return res.json(); //Otherwise return the response in JSON format
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

  //Handling the deletion of issues
  const handleDelete = (id: number) => {
    fetch(`http://localhost:5000/api/issues/${id}`, { method: "DELETE" })
      .then((res) => {
        if (res.status === 204) {
          setIssues(issues.filter((issue) => issue.id !== id)); //Set the list of issues to all the items in the list that do not have the given id
        } else {
          throw new Error("Deletion failed");
        }
      })
      .catch((err) => console.error("Deletion error:", err));
  };

  const handleUpdate = (id: number) => {
    //Validating Title
    if (!editedTitle.trim()) {
      alert("Title cannot be empty");
      return;
    }

    fetch(`http://localhost:5000/api/issues/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editedTitle }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update Failed");
        return res.json(); //Extract response as json
      })
      .then((updatedIssue) => {
        //Replacing the updated issue in the list, if the id matches, replace the issue with updatedIssue, if not, keep issue as is
        setIssues(
          issues.map((issue) => (issue.id === id ? updatedIssue : issue))
        );
        setEditingId(null); //Exits edit mode by setting editingId to null
      })
      .catch((err) => console.error("Update error:", err));
  };

  return (
    //Displaying the list of issues
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Issue List</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mb-6 flex gap-4"
      >
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)} //Updating event object
          className="flex-1 p-2 border rounded"
          placeholder="New issue title"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Issue
        </button>
      </form>

      <ul className="space-y-4 max-w-xl mx-auto">
        {issues.map(
          (
            issue //For each item in issues, create a list item with the title, status, and edit & delete buttons
          ) => (
            <li
              key={issue.id}
              className="p-4 bg-white rounded shadow space-y-2"
            >
              {editingId === issue.id ? ( //If an issue is being edited, show an input box with the save and cancel buttons, otherwise, show the issue regularly
                <>
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(issue.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium">{issue.title}</p>
                      <p className="text-sm text-gray-500">
                        Status: {issue.status}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingId(issue.id);
                          setEditedTitle(issue.title);
                        }}
                        className="text-blue-600 rounded-full shadow-2xl hover:shadow-lg"
                      >
                        <PencilIcon className="size-6" />
                      </button>
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="text-red-600 rounded-full shadow-2xl hover:shadow-lg"
                      >
                        <TrashIcon className="size-6" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default App;
