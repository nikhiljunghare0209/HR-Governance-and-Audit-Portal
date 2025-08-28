import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';

const app = express();

//Purpose:
// This enables CORS (Cross-Origin Resource Sharing) for your Express server.

// Importance:
// Allows your frontend (React app) to make requests to your backend (Express server) even if they run on different ports or domains.
// Without this, browsers block requests from your frontend (e.g., localhost:3001) to your backend (localhost:3000) for security reasons.
// The cors() middleware automatically sets the necessary HTTP headers to allow these cross-origin requests.

app.use(
  cors({
    origin: ["http://localhost:5173"], // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allows cookies to be sent with requests
  })
);

//Below middleware Purpose:
// When you send login data from the frontend using axios (or fetch), it is sent as JSON in the request body.
// The middleware app.use(express.json()); on your backend parses this JSON, so you can access the data as req.body.email and req.body.password in your route handler.

// Importance:
// Allows your backend to easily access and use data sent in the body of POST, PUT, or PATCH requests.
// Without this, req.body would be undefined for JSON requests, so your backend wouldn’t receive the login data or any other JSON data sent from the frontend.

app.use(express.json());

//✅ What is cookie-parser?
// cookie-parser is a middleware in Express that helps your server read cookies from the incoming request.
// 💡 Why do we need it?
// When a client (like a browser) sends a request, it may include cookies like this:
   // GET /dashboard HTTP/1.1
   // Host: localhost:3000
   // Cookie: token=abc123xyz
// By default, Express doesn’t know how to read or parse this cookie string.

// 🧠 What does cookieParser() do?
// When you write:
    // app.use(cookieParser());
// It tells Express:
// “Please use cookie-parser to read any cookies sent by the client and make them available in req.cookies.”


app.use(cookieParser());

//below middleware Purpose:
// This middleware mounts the adminRouter on the /auth path. It means any route defined in adminRouter will be accessible with URLs starting with /auth.

// Importance:
// Organizes your backend routes by grouping all authentication-related routes under /auth.
// For example, the route /adminlogin in adminRouter becomes accessible as /auth/adminlogin.
// Makes your code modular and easier to maintain by separating route logic into different files.

app.use("/auth", adminRouter);
app.use("/employee", EmployeeRouter);
app.use(express.static("Public"));



// ✅ Full flow
// Frontend (Start component) sends a GET request to /verify
// Backend runs verifyUser middleware
// If token is valid ➜ allow access and return user info (role & id)
// If not ➜ return error (Not authenticated or Wrong token)

// 🧠 Let's break down the middleware:

// const verifyUser = (req, res, next) => {
// This defines a middleware function that runs before your route logic.
// It receives req (request), res (response), and next (to move to the next function).

// const token = req.cookies.token;
// This gets the token from cookies.

// You need to use cookie-parser for req.cookies to work.
// This token is set when the user logs in (e.g., via res.cookie('token', ...)).

// if (token) {
// Check if a token exists.

// If yes → proceed to verify it.
// If no → user is not logged in → send an error response.


// jwt.verify(token, "jwt_secret_key", (err, decoded) => {
// Use jwt.verify() from jsonwebtoken to decode and verify the token.
// "jwt_secret_key" must match the key used when the token was created.
// decoded will contain the payload from the token (like user ID, role).


// if (err) return res.json({ Status: false, Error: "Wrong Token" });
// If the token is invalid (expired, tampered, wrong key), send an error.

// req.id = decoded.id;
// req.role = decoded.role;
// Save the decoded info (like id and role) in the request object so you can use it in the next function (route handler).


// next();
// Everything is fine → go to the next step (which is the actual route /verify).

// 🛑 Else (no token case)
// } else {
//   return res.json({ Status: false, Error: "Not authenticated" });
// }
// If no token was found in cookies, send a message saying user is not logged in.

// 🔄 Route that uses it:

// app.get("/verify", verifyUser, (req, res) => {
//   return res.json({ status: true, role: req.role, id: req.id });
// });
// This route uses verifyUser as middleware.
// If the user is verified, it returns the role and id of the user to the frontend.

// 🧭 What happens in your frontend?
// In Start.jsx file :


// useEffect(() => {
//   axios.get('http://localhost:3000/verify')
//     .then(result => {
//       if (result.data.Status) {
//         if (result.data.role === "admin") {
//           navigate('/dashboard');
//         } else {
//           navigate(`/employee_detail/` + result.data.id);
//         }
//       }
//     })
// }, []);
// When the page loads, it checks if the user is logged in by calling /verify

// If verified:
  // If admin ➜ go to dashboard
  // If employee ➜ go to that employee's detail page



const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
      if (err) return res.json({ Status: false, Error: "Wrong Token" });
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, Error: "Not authenticated" });
  }
};

app.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, role: req.role, id: req.id });
});

//in listen function we can use port 3000 and callback function
//this callback function will be executed when the server starts successfully
//it is used to log a message indicating that the server is running and listening on the specified port.
//This is useful for debugging and confirming that the server is up and running.  

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Middleware

// Middleware functions in Express are functions that have access to the request (req), response (res), and the next middleware function (next) in the application’s request-response cycle.

// Middleware can:
// Modify the request or response objects
// End the request-response cycle
// Call next() to pass control to the next middleware or route handler
// Middleware is usually registered with app.use() or as the first argument in a route (e.g., app.get('/', middlewareFn, handlerFn)).
// Middleware runs for all or specific routes, depending on how it’s set up.

// Route Handler

// A route handler is a function that responds to a specific HTTP request (GET, POST, etc.) on a specific path.
// It is registered with methods like app.get(), app.post(), etc.
// Route handlers are responsible for sending the final response to the client (e.g., HTML, JSON, etc.).
// If a route handler sends a response, the cycle ends there.
