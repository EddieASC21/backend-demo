/*
====================================================================================
What is an API?
------------------------------------------------------------------------------------
- API stands for **Application Programming Interface**.
- In backend development, an API allows two systems (e.g. frontend & backend) 
  to communicate by sending **HTTP requests** and receiving **HTTP responses**.

- A RESTful API follows specific rules that treat data as **resources**, 
  and allows clients to perform **CRUD operations**:
    - Create
    - Read
    - Update
    - Delete

====================================================================================
What is an Endpoint?
------------------------------------------------------------------------------------
- An **endpoint** is a URL route on the server that performs a specific action.
- Each endpoint is tied to an **HTTP method** like GET, POST, PUT, or DELETE.

- For example:
    - `GET /users` → Get a list of users
    - `POST /users` → Add a new user
    - `PUT /users/2` → Update user with ID = 2
    - `DELETE /users/3` → Remove user with ID = 3

====================================================================================
HTTP Methods in RESTful APIs
------------------------------------------------------------------------------------
1. GET
   - Used to **retrieve** data from the server.
   - Example: `GET /users` returns a list of users.

2. POST
   - Used to **create** new data on the server.
   - Requires a request body (e.g. new user info).
   - Example: `POST /users` with `{ "name": "Alice" }` adds a user.

3. PUT
   - Used to **update** existing data.
   - Also requires a request body.
   - Example: `PUT /users/1` updates the name of user with ID 1.

4. DELETE
   - Used to **remove** data from the server.
   - Example: `DELETE /users/1` deletes the user with ID 1.

====================================================================================
Summary Example:
------------------------------------------------------------------------------------
If you're building a simple USERS API...

- `GET /users`       → Return all users
- `GET /users/:id`   → Return a specific user by ID
- `POST /users`      → Create a new user
- `PUT /users/:id`   → Update a user's data
- `DELETE /users/:id`→ Delete a user by ID

These routes are called **endpoints** and together, they define your backend API.
====================================================================================
*/


// -----------------------------------------
// 1. SETUP
// -----------------------------------------

// Import the Express library so we can create our web server
const express = require("express");

// Create an instance of an Express application
const app = express();

// Define the port number to listen on (defaults to 3000 if not set via environment)
const PORT = process.env.PORT || 3000;

// Middleware to allow Express to parse incoming JSON request bodies
app.use(express.json());

// -----------------------------------------
// 2. ROOT ENDPOINT
// -----------------------------------------

/*
  GET /
  A simple root route to test that the backend is working.
  Visit: http://localhost:3000/
*/
app.get("/", (req, res) => {
    res.send("Welcome to the backend!");
  });
  
// -----------------------------------------
// 3. USER API (In-memory "database")
// -----------------------------------------

// We'll store users in a simple array (this is a mock database)
let users = [
    { id: 1, name: "Eddie" },
    { id: 2, name: "Kai" }
];
  
  /*
    GET /users
    Retrieves all users from our "database"
  */
app.get("/users", (req, res) => {
    res.json(users);
});
  
  /*
    GET /users/:id
    Retrieves a single user by ID
    - Parses the ID from the route
    - Finds a user that matches
    - Returns 404 if not found
  */
app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
});
  
  /*
    POST /users
    Adds a new user to our "database"
    - Expects a JSON body like: { "name": "NewUser" }
    - Assigns a new ID based on array length
  */
app.post("/users", (req, res) => {
    const newUser = {
      id: users.length + 1,
      name: req.body.name
    };
    users.push(newUser);
    res.status(201).json(newUser);
});
  
  /*
    PUT /users/:id
    Updates an existing user's name
    - Finds user by ID
    - Updates their name from req.body
  */
app.put("/users/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
  
    user.name = req.body.name;
    res.json(user);
});
  
  /*
    DELETE /users/:id
    Removes a user by their ID
    - Filters out the user from the array
  */
app.delete("/users/:id", (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.json({ message: "User deleted" });
});

// -----------------------------------------
// 4. BANK API (In-memory bank logic)
// -----------------------------------------

// In-memory store for balance and transactions
let balance = 0;
let transactions = [];

/*
  GET /balance
  Returns the current balance of the account
*/
app.get("/balance", (req, res) => {
  res.json({ balance });
});

/*
  POST /deposit
  Adds money to the account
  - Expects: { "amount": 100 }
  - Validates the amount is a number > 0
  - Updates balance and records the transaction
*/
app.post("/deposit", (req, res) => {
  const amount = req.body.amount;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid deposit amount" });
  }

  balance += amount;

  transactions.push({
    type: "deposit",
    amount,
    date: new Date().toISOString()
  });

  res.json({ message: `Deposited $${amount}`, balance });
});

/*
  POST /withdraw
  Withdraws money from the account
  - Expects: { "amount": 50 }
  - Validates the amount and checks for sufficient funds
  - Updates balance and records the transaction
*/
app.post("/withdraw", (req, res) => {
  const amount = req.body.amount;

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid withdrawal amount" });
  }

  if (amount > balance) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  balance -= amount;

  transactions.push({
    type: "withdrawal",
    amount,
    date: new Date().toISOString()
  });

  res.json({ message: `Withdrew $${amount}`, balance });
});

/*
  GET /transactions
  Returns a list of all past transactions
  - Each transaction has a type, amount, and date
*/
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

/*
  DELETE /transactions
  Clears all transaction history
*/
app.delete("/transactions", (req, res) => {
  transactions = [];
  res.json({ message: "All transactions cleared." });
});

// -----------------------------------------
// 5. START SERVER
// -----------------------------------------

/*
  Start the server and make it listen for requests
  - Once running, it logs the server URL to the console
*/
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/*
 All curl test for the end points are here below:
 
 GET /users – Get all users

 curl http://localhost:3000/users

 GET /users/:id – Get user by ID

 curl http://localhost:3000/users/1

 POST /users – Add a new user

 curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie"}'
  
  PUT /users/:id – Update a user's name

  curl -X PUT http://localhost:3000/users/2 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Kai"}'

  DELETE /users/:id – Delete a user

  curl -X DELETE http://localhost:3000/users/1

  For the bank:

  GET /balance – Check current balance

  curl http://localhost:3000/balance

  POST /deposit – Deposit money

  curl -X POST http://localhost:3000/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount": 500}'

  POST /withdraw – Withdraw money

  curl -X POST http://localhost:3000/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 200}'

  to show not enough funds:

  curl -X POST http://localhost:3000/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 999999}'

  GET /transactions – View transaction history

  curl http://localhost:3000/transactions

  DELETE /transactions – Clear all transactions

  curl -X DELETE http://localhost:3000/transactions

 */