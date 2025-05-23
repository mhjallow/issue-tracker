import { useEffect, useState } from "react";
// - useEffect: Runs code when the component shows up (like "on page load")
// - useState: Creates a "memory" which stores information temporarily

function App() { //The top level piece of the application, the visible part of the app.

  //Creates a memory box named message. setMessage is the tool used to change the content of the message later. We start with an empty string.
  const [message, setMessage] = useState("");

  useEffect(() => { //Runs the code inside once, when the page first loads
    fetch("http://localhost:5000/") //sending a fetch request to the server
      .then((response) => response.text()) //taking the response and converting it to plain text
      .then((data) => setMessage(data))//Whatever comes back gets saved into message using setMessage
      .catch((error) => console.error("Error fetching data:", error)); //error handling so the app doesn't crash
  }, []); //The '[]' means don't run this again unless something changes

  return ( //returning the HTML structure to display things on the page
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-green-700">{message}</h1>
    </div>
  );
}

export default App;