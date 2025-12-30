import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminEmployees = () => {
  const { adminId } = useParams();
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/employees/${adminId}`)
      .then((res) => {
        if (res.data.Status) {
          setEmployees(res.data.Result);
        }
      });
  }, [adminId]);

  return (
    <div className="container mt-4">
      <h3>Employees Created By This Admin</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEmployees;
