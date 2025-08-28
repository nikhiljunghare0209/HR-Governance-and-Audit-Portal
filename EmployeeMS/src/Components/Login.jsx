import React from "react";
import "./style.css";

// Purpose of axios:

// axios is used to make HTTP requests (like GET, POST, PUT, DELETE) from our React app to a backend server or API.
//It helps you communicate with your backend, send data (like login credentials), and receive responses (like authentication results).

import axios from "axios";
import {useNavigate} from "react-router-dom";
import Dashboard from "./dashboard";
import {useState} from  "react";
const Login = () => {
  const [value, setValue] = React.useState({
    email: "",
    password: "",
  });
  //below hook is used to manage the error state
  //It initializes the error state to null, which means no error is present initially.
  //As the user interacts with the login form, if an error occurs (like invalid credentials), this state can be updated to display the error message.
  //This allows the component to conditionally render error messages based on the value of this state 
  const [error,setError]=useState(null)
  const navigate = useNavigate();
  axios.defaults.withCredentials = true; // This line ensures that cookies are sent with requests
  // This is important for maintaining sessions and authentication in your app.
  // It allows your frontend to send cookies (like session tokens) with requests to your backend.


 
  const handleSubmit = (e) => {
    // Prevents the default form submission (which would reload the page)
    e.preventDefault();

    //Below code Sends a POST request to the backend API with the login form data (email and password)
    
    // flow of code
    
    //1. Here, value is an object like { email: "abc@example.com", password: "12345" }.
    //2. axios converts the data to JSON:
        // axios automatically converts the value object into JSON format and puts it in the body of the HTTP request.
    //3. HTTP POST request is made:
        //  axios sends this request to your backend server at the URL you provided.("http://localhost:3000/auth/adminlogin")
    //4. Backend (Express) receives the request:
        // Your backend uses the middleware app.use(express.json()); to read and parse the JSON data from the request body.more information of app.use(express.json()) in index.js file
    //4. Backend can access the data:
        // Now, in your backend route, you can access the data as req.body.email and req.body.password.
    axios
      .post("http://localhost:3000/auth/adminlogin", value)

      // If the request is successful, logs the response to the console
      .then(result => {
        if(result.data.loginStatus){

// below statement Stores a key-value pair: "valid" = "true" which is used to indicate that the user is logged in
// This is useful for checking the login status of the user in other parts of your application.
// This data persists even if the user refreshes the page or closes the browser
// Unlike a cookie or state, it does not expire automatically 
// it remains until explicitly removed by your code or the user clears their browser storage.

          localStorage.setItem("valid",true)
          navigate('/dashboard')
        }else{
          setError(result.data.Error)
        }
      })

      // If there is an error with the request, logs the error to the console
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-warning">
          {error && error}
        </div>
        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValue({ ...value, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) => setValue({ ...value, password: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <button className="btn btn-success w-100 rounded-0 mb-2">
            Login
          </button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2" />
            <label htmlFor="password">
              You are Agree with terms & conditions
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
