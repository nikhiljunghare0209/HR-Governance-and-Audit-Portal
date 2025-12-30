import express from "express";
import con from "../utils/db.js"; // Import the database connection
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
// Import axios for making HTTP requests

// 🧠 Why Do You Need Multer?

// By default, Express can’t understand file uploads sent from HTML forms (especially images or files). It only works well with JSON or URL-encoded data.
// When you want to upload a file (like a photo):
// The browser sends the file as multipart/form-data format
// multer is used to read this format, extract the file, and store it on the server

// 📦 What Multer Does Internally

// | Step | Task                                                          |
// | ---- | ------------------------------------------------------------- |
// | 1️⃣  | Accepts a file from an HTML form or `FormData` object         |
// | 2️⃣  | Parses `multipart/form-data` request                          |
// | 3️⃣  | Saves the file in a folder (e.g., `Public/Images`)            |
// | 4️⃣  | Adds file info to `req.file` (you can use this in your logic) |
// | 5️⃣  | Allows the rest of your route (like saving to DB) to continue |

import multer from "multer"; // Import multer for handling file uploads
import path from "path"; // Import path for handling file paths

const router = express.Router();

//Below is the route for admin login
//below backend code will receive the login data sent from your frontend.
// The route router.post("/adminlogin", ...) listens for POST requests at /adminlogin.
// When your frontend sends a POST request to http://localhost:3000/auth/adminlogin with the login data (email and password), this function runs.
// The data is accessed using req.body.email and req.body.password.
// Final Flow Summary of below middleware : if  the email and password are valid

// | Action                                                           | Result  |

// | ---------------------------------------------------------------- | ------  |

// 1)| Admin enters correct email/password                              | ✅      |
// 2)| Backend finds match and then  creates JWT
// {
//   "role": "admin",
//   "email": "admin@example.com",
//   "id": 1
// }

// 3)| JWT includes role, email, id                                     | ✅      |
// 4)| Token stored in browser cookie                                   | ✅      |
// 5)| Frontend gets `{ loginStatus: true }`                            | ✅      |
// 6)| Next time user opens the app, `/verify` uses token to auto-login | ✅      |

// Understanding con.query() in Node.js + MySQL

// This document explains how con.query() works, what err and result contain, and how database data becomes JSON — in a simple, step‑by‑step format.

// 1️⃣ What is con.query()?

// con.query() is a function provided by the MySQL driver for Node.js.
// It is used to:
// Send an SQL query to the database
// Receive data from the database
// Handle errors if the query fails

// General Syntax
// con.query(sqlQuery, valuesArray, callbackFunction)

// 2️⃣ Your Example Code
// const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
// con.query(
//   sql,
//   [req.body.email, req.body.password],
//   (err, result) => {
//     // response handling
//   }
// );

// 3️⃣ First Parameter: SQL Query
// "SELECT * FROM admin WHERE email = ? AND password = ?"
// This is a SQL command
// ? are placeholders
// Actual values are passed separately

// Why use ? placeholders?
// Prevents SQL Injection
// Automatically escapes values
// Makes query secure

// 4️⃣ Second Parameter: Values Array:
// [req.body.email, req.body.password]
// This array replaces the ? placeholders in order:
// Placeholder	Value
// First ?	req.body.email
// Second ?	req.body.password

// Internally, MySQL executes:
// SELECT * FROM admin WHERE email = 'abc@gmail.com' AND password = '1234'

// 5️⃣ Third Parameter: Callback Function

// (err, result) => { }
// This function runs after the database finishes execution.
// Why callback is needed?
// Database operations are asynchronous (they take time).
// Node.js does not wait — it continues execution and calls this function once the DB responds.

// 6️⃣ err Parameter (Error Object)

// if (err) {
//   console.log(err);
// }
// err === null → Query successful
// err !== null → Something went wrong

// Example Error

// {
//   code: 'ER_NO_SUCH_TABLE',
//   message: "Table 'admin' doesn't exist"
// }

// 7️⃣ result Parameter (Database Data)

// Important Question ❓
// Is result JSON?
// Answer:
// ❌ Not JSON

// ✅ JavaScript Object (Array of Objects)

// 8️⃣ How Data Looks in result

// Database Table:

// id	email	password
// 1	admin@gmail.com	123

// result in Node.js

// [
//   {
//     id: 1,
//     email: "admin@gmail.com",
//     password: "123"
//   }
// ]

// This is a JavaScript array
// Each row = one JavaScript object

// 9️⃣ Why result is Always an Array?
// Because:
// SQL queries can return multiple rows
// MySQL always sends results as a list

// So we check:

// if (result.length > 0) {
//   // data exists
// }

// ---

// 🔁 SELECT vs INSERT vs UPDATE Results

// SELECT Query

// [
//   { id: 1, email: "admin@gmail.com" }
// ]

// INSERT Query

// {
//   affectedRows: 1,
//   insertId: 5
// }

// UPDATE / DELETE Query

// {
//   affectedRows: 1,
//   changedRows: 1
// }

// 🔄 How Data Becomes JSON

// When you send response:

// res.json(result);
// Express does:
// 1. JavaScript Object → JSON string
// 2. Sends JSON to frontend/browser

// Final JSON Sent to Client

// [
//   {
//     "id": 1,
//     "email": "admin@gmail.com"
//   }
// ]

// ---

// 🧠 Complete Flow Summary

// 1. Client sends email & password
// 2. Express route is triggered
// 3. con.query() sends SQL to MySQL
// 4. MySQL executes query
// 5. MySQL returns rows
// 6. Node converts rows → JS objects
// 7. Callback receives err & result
// 8. Express converts JS object → JSON
// 9. JSON is sent to client

// ✅ One‑Line Summary
// > MySQL returns rows → Node converts them into JavaScript objects → Express converts them into JSON

// 🔐 Best Practice (Important)

// ❌ Never store plain passwords
// ✅ Use hashing (bcrypt):
// bcrypt.compare(inputPassword, dbPassword)

router.post("/adminlogin", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res
      .status(400)
      .json({ loginStatus: false, Error: "Invalid credentials" });

  const sql = "SELECT * FROM admin WHERE email = ?";
  con.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.status(500).json({ loginStatus: false, Error: "query error" });
    }

    if (!result || result.length === 0) {
      // Generic message to avoid revealing which part failed
      return res
        .status(401)
        .json({ loginStatus: false, Error: "Invalid email or password" });
    }

    const admin = result[0];
    // Compare provided password with hashed password stored in DB
    bcrypt.compare(password.toString(), admin.password, (err, match) => {
      if (err) {
        console.error("bcrypt error:", err);
        return res
          .status(500)
          .json({ loginStatus: false, Error: "Authentication error" });
      }
      if (!match) {
        return res
          .status(401)
          .json({ loginStatus: false, Error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { role: "admin", email: admin.email, id: admin.id },
        process.env.JWT_SECRET || "jwt_secret_key",
        { expiresIn: "10d" }
      );

      // Set secure cookie options
      res.cookie("token", token, {
        
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      });

      return res.json({ loginStatus: true, admin: { id: admin.id, email: admin.email } });
    });
  });
});



router.get("/category", (req, res) => {
  const sql = "SELECT * FROM category";
  con.query(sql, (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "query error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_category", (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  con.query(sql, [req.body.category], (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "query error" });
    }
    return res.json({ Status: true, message: "Category added successfully" });
  });
});

//  image uplode

// 🔹 multer.diskStorage(...)
// This tells multer how and where to save uploaded files.
// Below we save uploaded files in the folder Public/Images.

// 🔸 filename: (req, file, cb) => { ... }
// cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
// This line generates a unique file name for each uploaded file.
// ✅ this will Prevents overwriting files with same name
// ✅this will Ensures every file is uniquely named
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Below code  creates an instance of multer, and tells it:
// “Hey multer, when a file is uploaded, use this storage configuration (the one we created earlier) to decide where to save the file and what to name it.”
// So now, the upload object has the power to accept and save uploaded files — exactly as you instructed in the storage settings.
const upload = multer({
  storage: storage,
});

// upload.single("image"): accept one file with the form field name "image"
// That file is automatically saved in your folder
// Multer fills req.file with info like:

// {
//   fieldname: 'image',
//   originalname: 'photo.jpg',
//   filename: 'image_1722031142099.jpg',
//   path: 'Public/Images/image_1722031142099.jpg',
//   ...
// }

// router.post("/add_employee", upload.single("image"), (req, res) => {
//   const sql = `
//     INSERT INTO employee 
//     (name, email, password, salary, address, category_id, image)
//     VALUES (?, ?, ?, ?, ?, ?, ?)`;

//   // Password Encryption :
//   // bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
//   // above line hashed password using bcrypt
//   // If password = "12345", after hashing it becomes something like:
//   // $2b$10$2MnoNH09iVmmljfoEUn8r.Vc9TXpE7G43P9upT8x...
//   //here We use .toString() to make sure the password is a string before hashing — because bcrypt requires the input to be a string.

//   bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
//     if (err) {
//       return res.json({ Status: false, Error: "Password hash error" });
//     }

//     const values = [
//       req.body.name,
//       req.body.email,
//       hash,
//       req.body.salary,
//       req.body.address,
//       req.body.category_id,
//       req.file?.filename || null, // safer to check file presence
//     ];

//     con.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("MySQL Error:", err);
//         return res.json({ Status: false, Error: "MySQL query error" });
//       }
//       return res.json({ Status: true, message: "Employee added successfully" });
//     });
//   });
// });
router.post("/add_employee", upload.single("image"), (req, res) => {

  // ✅ STEP 3.2 CHANGE START
  // Added admin_id column in SQL
  const sql = `
    INSERT INTO employee 
    (name, email, password, salary, address, category_id, image, admin_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // ✅ STEP 3.2 CHANGE END

  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) {
      return res.json({ Status: false, Error: "Password hash error" });
    }

    // ✅ STEP 3.2 CHANGE START
    // Added req.body.admin_id at the end
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.salary,
      req.body.address,
      req.body.category_id,
      req.file?.filename || null,
      req.body.admin_id, // 👈 VERY IMPORTANT
    ];
    // ✅ STEP 3.2 CHANGE END

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res.json({ Status: false, Error: "MySQL query error" });
      }
      return res.json({ Status: true, message: "Employee added successfully" });
    });
  });
});


// router.post("/add_admin", (req, res) => {
//   const { email, password } = req.body || {};
//   if (!email || !password)
//     return res
//       .status(400)
//       .json({ Status: false, Error: "Email and password required" });

//   bcrypt.hash(password.toString(), 10, (err, hash) => {
//     if (err) {
//       console.error("bcrypt.hash error:", err);
//       return res
//         .status(500)
//         .json({ Status: false, Error: "Password hash error" });
//     }

//     const sql = "INSERT INTO admin (email, password) VALUES (?, ?)";
//     con.query(sql, [email, hash], (err, result) => {
//       if (err) {
//         console.error("MySQL Error:", err);
//         return res
//           .status(500)
//           .json({ Status: false, Error: "MySQL query error" });
//       }
//       return res.json({
//         Status: true,
//         admin: {
//           id: result.insertId, // 🔧 CORRECT
//           email: email, 
//         },
//         message: "Admin added successfully",
//       });
//     });
//   });
// });

// ================= ADD ADMIN =================
router.post("/add_admin", upload.single("image"), (req, res) => {
  const { name, email, password, role, department, created_by } = req.body;

  // ✅ Basic validation
  if (!name || !email || !password) {
    return res.json({
      Status: false,
      Error: "Name, Email and Password are required",
    });
  }

  bcrypt.hash(password.toString(), 10, (err, hash) => {
    if (err) {
      return res.json({
        Status: false,
        Error: "Password hash error",
      });
    }

    // ✅ SQL with image + created_by
    const sql = `
      INSERT INTO admin 
      (name, email, password, role, department, image, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      email,
      hash,
      role || "admin",
      department || null,
      req.file?.filename || null, // ✅ image handled by SAME multer
      created_by || null,         // ✅ admin who created admin
    ];

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res.json({
          Status: false,
          Error: "Database error",
        });
      }

      return res.json({
        Status: true,
        admin: {
          id: result.insertId,
          email,
        },
        message: "Admin added successfully",
      });
    });
  });
});



router.get("/employee", (req, res) => {
  const sql = "SELECT * FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// router.get("/employee", (req, res) => {
//   const search = req.query.search || "";
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 5;
//   const offset = (page - 1) * limit;

//   const sql = `
//     SELECT 
//       employee.id,
//       employee.name,
//       employee.email,
//       employee.salary,
//       employee.image,
//       category.category_name
//     FROM employee
//     LEFT JOIN category ON employee.category_id = category.id
//     WHERE 
//       employee.id LIKE ? OR
//       employee.name LIKE ? OR
//       employee.email LIKE ? OR
//       category.category_name LIKE ?
//     LIMIT ? OFFSET ?
//   `;

//   const values = [
//     `%${search}%`,
//     `%${search}%`,
//     `%${search}%`,
//     `%${search}%`,
//     limit,
//     offset,
//   ];

//   con.query(sql, values, (err, result) => {
//     if (err) {
//       console.log(err);
//       return res.json({ Status: false, Error: "Query Error" });
//     }
//     return res.json({ Status: true, Result: result });
//   });
// });
// router.get("/employee", (req, res) => {

//   res.set("Cache-Control", "no-store");
//    console.log("API HIT", req.query);
//   const search = req.query.search || "";
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 5;
//   const offset = (page - 1) * limit;

//   const sql = `
//     SELECT 
//       employee.id,
//       employee.name,
//       employee.email,
//       employee.salary,
//       employee.image,
//       category.category_name
//     FROM employee
//     LEFT JOIN category ON employee.category_id = category.id
//     WHERE 
//       employee.id LIKE ? OR
//       employee.name LIKE ? OR
//       employee.email LIKE ? OR
//       category.category_name LIKE ?
//     LIMIT ? OFFSET ?
//   `;

//   const values = [
//     `%${search}%`,
//     `%${search}%`,
//     `%${search}%`,
//     `%${search}%`,
//     limit,
//     offset,
//   ];

//   con.query(sql, values, (err, result) => {
//     if (err) {
//       return res.json({ Status: false, Error: "Query Error" });
//     }
//     return res.json({ Status: true, Result: result });
//   });
// });

// Search employee by id or name
router.get("/search_employee", (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.json({ Status: false, Error: "Query is required" });
  }

  const sql = "SELECT * FROM employee WHERE id = ? OR name LIKE ?";
  con.query(sql, [query, `%${query}%`], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});


router.get("/employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    UPDATE employee 
    SET name = ?, email = ?, salary = ?, address = ?, category_id = ? 
    WHERE id = ?
  `;
  const values = [
    req.body.name,
    req.body.email,
    req.body.salary,
    req.body.address,
    req.body.category_id,
  ];

  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "Query Error: " + err });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_count", (req, res) => {
  const sql = "SELECT COUNT(id) AS admin FROM admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employee_count", (req, res) => {
  const sql = "select count(id) as employee from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/salary_count", (req, res) => {
  const sql = "select sum(salary) as salary from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_records", (req, res) => {
  const sql = "select * from admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/employees/:adminId", (req, res) => {
  const adminId = req.params.adminId;

  const sql = "SELECT * FROM employee WHERE admin_id = ?";

  con.query(sql, [adminId], (err, result) => {
    if (err) return res.json({ Status: false, Error: err });
    return res.json({ Status: true, Result: result });
  });
});


router.get("/logout", (req, res) => {
  //due to below statement cookie is deleted from browser storage
  res.clearCookie("token");
  return res.json({ Status: true });
});

// router.get("/admin/:id", (req, res) => {
//   const id = req.params.id;

//   const sql = "SELECT id, email FROM admin WHERE id = ?";
//   con.query(sql, [id], (err, result) => {
//     if (err) {
//       return res.json({ Status: false, Error: "Database error" });
//     }

//     if (result.length === 0) {
//       return res.json({ Status: false, Error: "Admin not found" });
//     }

//     return res.json({
//       Status: true,
//       Result: result[0],
//     });
//   });
// });

// ================= ADMIN PROFILE =================
router.get("/admin/:id", (req, res) => {
  const id = req.params.id;

  const sql = `
    SELECT 
      a.id,
      a.name,
      a.email,
      a.role,
      a.department,
      a.image,
      a.created_at,
      creator.name AS created_by_name,
      creator.email AS created_by_email
    FROM admin a
    LEFT JOIN admin creator ON a.created_by = creator.id
    WHERE a.id = ?
  `;

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({ Status: false, Error: "Database error" });
    }

    if (result.length === 0) {
      return res.json({ Status: false, Error: "Admin not found" });
    }

    return res.json({
      Status: true,
      Result: result[0],
    });
  });
});



export { router as adminRouter };
