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



import multer from "multer";// Import multer for handling file uploads
import path from "path";// Import path for handling file paths



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


router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) {
      console.error("Query error:", err);
      return res.json({ loginStatus: false, Error: "query error" });
    }
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email,id:result[0].id },
        "jwt_secret_key",
        { expiresIn: "10d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Invalid email or password",
      });
    }
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
    cb(null, 'Public/Images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
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

router.post("/add_employee", upload.single("image"), (req, res) => {
  const sql = `
    INSERT INTO employee 
    (name, email, password, salary, address, category_id, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;


// Password Encryption :
// bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
// above line hashed password using bcrypt
// If password = "12345", after hashing it becomes something like:
       // $2b$10$2MnoNH09iVmmljfoEUn8r.Vc9TXpE7G43P9upT8x...
//here We use .toString() to make sure the password is a string before hashing — because bcrypt requires the input to be a string.       

  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) {
      return res.json({ Status: false, Error: "Password hash error" });
    }

    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.salary,
      req.body.address,
      req.body.category_id,
      req.file?.filename || null, // safer to check file presence
    ];

    con.query(sql, values, (err, result) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res.json({ Status: false, Error: "MySQL query error" });
      }
      return res.json({ Status: true, message: "Employee added successfully" });
    });
  });
});


router.get('/employee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"});
        return res.json({Status: true, Result: result});
    });
});


router.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});


router.put('/edit_employee/:id', (req, res) => {
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
    req.body.category_id
  ];

  con.query(sql, [...values, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error"+err });
    return res.json({ Status: true, Result: result });
  });
});

router.delete('/delete_employee/:id', (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE id = ?";
  
  con.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({ Status: false, Error: "Query Error: " + err });
    }
    return res.json({ Status: true, Result: result });
  });
});


router.get('/admin_count', (req, res) => {
  const sql = "SELECT COUNT(id) AS admin FROM admin";
  con.query(sql , (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error: " + err });
    return res.json({ Status: true, Result: result });
  });
});


router.get('/employee_count', (req, res) => {
  const sql = "select count(id) as employee from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});


router.get('/salary_count', (req, res) => {
  const sql = "select sum(salary) as salary from employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});


router.get('/admin_records', (req, res) => {
  const sql = "select * from admin";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" + err });
    return res.json({ Status: true, Result: result });
  });
});


router.get('/logout', (req, res) => {
  //due to below statement cookie is deleted from browser storage
  res.clearCookie('token');
  return res.json({ Status: true });
});


 
export { router as adminRouter };

