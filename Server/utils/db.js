// import mysql from "mysql";

// const con= mysql.createConnection({
//     host: "localhost",
//     user:"root",
//     password:"Nikhil@0209",
//     database:"employeems",
// });

// con.connect(function(err) {
//     if (err) {
//         console.error("connecting error");
//     }
//     console.log("Connected ");
// });

// export default con;


// utils/db.js
import mysql from "mysql";

// Use a connection pool instead of a single connection
// This allows for better performance and resource management in a production environment
// The connection pool will manage multiple connections to the database, allowing for concurrent requests without creating a new connection each time.
// The connection pool will automatically handle the creation and release of connections as needed. 
const con = mysql.createPool({
  connectionLimit: 10, // optional, default is fine
  host: "localhost",
  user: "root",
  password: "Nikhil@0209",
  database: "employeems",
  multipleStatements: false
});

export default con;


// multipleStatements: false  =>[basically it prevent from SQL injection attacks]
// It controls whether you are allowed to execute multiple SQL queries in a single .query() call.

// Example if multipleStatements: true:

// con.query("SELECT * FROM users; DELETE FROM users WHERE id=1;", ...);
// Both SELECT and DELETE will run in one call.

// If multipleStatements: false (which is the default):
// Only one query is allowed per .query() execution.

