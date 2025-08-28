import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    category_id: "",
  });

  const [category, setCategory] = React.useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          setEmployee({
            name: result.data.Result[0].name,
            email: result.data.Result[0].email,
            address: result.data.Result[0].address,
            salary: result.data.Result[0].salary,
            category_id: result.data.Result[0].category_id,
          });
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_employee/${id}`, employee)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name || ""}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              id="InputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email || ""}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">Salary</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={employee.salary || ""}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={employee.address || ""}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              onChange={(e) =>
                setEmployee({ ...employee, category_id: e.target.value })
              }
              required
            >
              <option value="">-- Select Category --</option>
              {category.map((c) => (
                <option value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
