// Import the Express library so we can create our web server
const express = require("express");

// Create an instance of an Express application
const app = express();

// Define a port number for our server to listen on
// It will use the environment variable PORT if it's set, otherwise default to 3000
const PORT = process.env.PORT || 3000;

/*
  Define a route for the root URL ("/").
  When someone visits http://localhost:3000/, this function will run.
  `req` is the request from the client (like the browser),
  `res` is the response we send back.
*/
app.get("/", (req, res) => {
  // Send a simple text response to the browser
  res.send("Welcome to the backend!");
});

/*
We will not be using a data base so we will store all of this in memory

lets add users in our memory
*/

let users = [
    { id: 1, name: "Eddie" },
    { id: 2, name: "Kai" }
];
  
/*
So we will now add an endpoint
The goal would be to retrive all user
*/
app.get("/users", (req, res) => {
    // now this returns all the users
    res.json(users);
});

/*
  Start the server and make it listen for incoming requests on the defined PORT.
  When the server starts successfully, log a message to the terminal.
*/
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

