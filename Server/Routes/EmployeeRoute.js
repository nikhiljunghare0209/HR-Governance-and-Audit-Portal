import express from "express";
import con from "../utils/db.js"; // Import the database connection
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation
import bcrypt from "bcrypt";
import multer from "multer";

const router=express.Router()

router.post("/employee_login", (req, res) => {
  console.log("Login API hit", req.body);

  const sql = "SELECT * from employee Where email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err)
          return res.json({ loginStatus: false, Error: "Wrong Password" });
        if (response) {
          const email = result[0].email;
          const token = jwt.sign(
            { role: "employee", email: email,id:result[0].id },
            "employee_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ loginStatus: true,id:result[0].id });
        }
      });
    } else {
      return res.json({
        loginStatus: false,
        Error: "Invalid email or password",
      });
    }
  });
});


router.get('/detail/:id', (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM employee where id = ?`;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({Status:false});
    return res.json(result);
  });
});


// Even though logout doesn't fetch data, it still represents a simple server-side action (clearing a cookie). A GET request is often used for logout in many systems because:
// GET is easy to call from frontend as  axios.get()).
// Browsers support GET well for URL actions (like logging out via link/button).
// ✅ HTTP GET is "safe" and idempotent (no side effects on server state — and repeating it won't cause damage).



router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});



export { router as EmployeeRouter };
