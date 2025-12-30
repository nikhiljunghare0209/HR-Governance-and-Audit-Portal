import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  const navigate = useNavigate();

  // ✅ CHANGED: use one object like AddEmployee
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    department: "",
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(admin);
    // ✅ NEW: get logged-in admin
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    const loggedAdmin = JSON.parse(adminData);

    // ✅ NEW: FormData (same pattern as AddEmployee)
    const formData = new FormData();
    formData.append("name", admin.name);
    formData.append("email", admin.email);
    formData.append("password", admin.password);
    formData.append("role", admin.role);
    formData.append("department", admin.department);
    formData.append("image", admin.image);

    // ✅ VERY IMPORTANT: who created this admin
    formData.append("created_by", loggedAdmin.id);

    axios
      .post("http://localhost:3000/auth/add_admin", formData)
      .then((result) => {
        if (result.data.Status) {
          alert("Admin added successfully");
          navigate("/dashboard");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h3 className="text-center">Add Admin</h3>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Name"
            onChange={(e) =>
              setAdmin({ ...admin, name: e.target.value })
            }
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            onChange={(e) =>
              setAdmin({ ...admin, email: e.target.value })
            }
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            onChange={(e) =>
              setAdmin({ ...admin, password: e.target.value })
            }
            required
          />

          {/* ROLE */}
          <select
            className="form-select mb-2"
            onChange={(e) =>
              setAdmin({ ...admin, role: e.target.value })
            }
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>

          {/* DEPARTMENT */}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Department"
            onChange={(e) =>
              setAdmin({ ...admin, department: e.target.value })
            }
          />

          {/* IMAGE */}
          <input
            type="file"
            className="form-control mb-3"
            accept="image/*"
            onChange={(e) =>
              setAdmin({ ...admin, image: e.target.files[0] })
            }
          />

          <button className="btn btn-success w-100">
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;

