import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState([]);
  const { id } = useParams();
  const navigate=useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:3000/employee/detail/${id}`)
      .then((result) => {
        setEmployee(result.data[0]);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleLogout = () => {
    axios.get("http://localhost:3000/employee/logout").then((result) => {
      if (result.data.Status) {
         localStorage.removeItem("valid");
        navigate("/");
      }
    }).catch(err=>consol.log(err))
  };

  return (
    <div className="bg-white rounded p-3">
      <h4 className="text-center text-success">Employee Management System</h4>
      <div className="text-center">
        <img
          src={`http://localhost:3000/images/${employee.image}`}
          className="emp_det_image"
        />
      </div>
      <h3>Name: {employee.name}</h3>
      <h3>Email: {employee.email}</h3>
      <h3>Salary: {employee.salary}</h3>
      <div className="mt-2">
        {/* <button className="btn btn-primary me-2">Edit</button> */}
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetail;
