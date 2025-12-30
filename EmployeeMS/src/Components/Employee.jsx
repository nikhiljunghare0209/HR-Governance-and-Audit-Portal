// import react from "react";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";


// const Employee = () => {
//   const [employee, setEmployee] = useState([]);

  
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/auth/employee")
//       .then((result) => {
//         if (result.data.Status) {
//           setEmployee(result.data.Result);
//         } else {
//           alert(result.data.Error);
//         }
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handleDelete = (id) => {
//   axios
//     .delete('http://localhost:3000/auth/delete_employee/' + id)
//     .then((result) => {
//       if (result.data.Status) {
//         window.location.reload()
//       } else {
//         alert(result.data.Error);
//       }
//     })
//     .catch((err) => console.log(err));
// };


//   return (
//     <div className="px-5 mt-3">
//       <div className="d-flex justify-content-center">
//         <h3>Category List</h3>
//       </div>
//       <Link to="/dashboard/add_employee" className="btn btn-success">
//         Add Employee
//       </Link>
//       <div className="px-5 mt-3">
//         {/* <div className="d-flex justify-content-center">
//           <h3>Category List</h3>
//         </div>
//         <Link to="/dashboard/add_category" className="btn btn-success">
//           Add Category
//         </Link> */}
//         <div className="mt-3">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Image</th>
//                 <th>Email</th>
//                 <th>Address</th>
//                 <th>Salary</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {employee.map((e) => (
//                 <tr>
//                   <td>{e.name}</td>
//                   <td>
//                     <img
//                       src={`http://localhost:3000/Images/` + e.image}
//                       className="employee_image"
//                     />
//                   </td>
//                   <td>{e.email}</td>
//                   <td>{e.address}</td>
//                   <td>{e.salary}</td>
//                   <td>
//                     <Link
//                       to={`/dashboard/edit_employee/` + e.id}
//                       className="btn btn-info btn-sm me-2"
//                     >
//                       Edit
//                     </Link>
//                     <button
//                       className="btn btn-warning btn-sm"
//                       onClick={()=>handleDelete(e.id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Employee;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Employee = () => {
//   const [employee, setEmployee] = useState([]);
//   const [search, setSearch] = useState("");

//   const fetchEmployees = () => {
//     axios
//       .get("http://localhost:3000/auth/employee", {
//         params: { search },
//       })
//       .then((result) => {
//         if (result.data.Status) {
//           setEmployee(result.data.Result);
//         } else {
//           alert(result.data.Error);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const handleSearch = () => {
//     fetchEmployees();
//   };

//   const handleDelete = (id) => {
//     axios
//       .delete("http://localhost:3000/auth/delete_employee/" + id)
//       .then((result) => {
//         if (result.data.Status) {
//           fetchEmployees();
//         } else {
//           alert(result.data.Error);
//         }
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="px-5 mt-3">

//       {/* 🔍 SEARCH BAR */}
//       <div className="d-flex mb-3">
//         <input
//           type="text"
//           className="form-control me-2"
//           placeholder="Search by ID, Name, Email, or Department"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button className="btn btn-primary" onClick={handleSearch}>
//           Search
//         </button>
//       </div>

//       <Link to="/dashboard/add_employee" className="btn btn-success mb-3">
//         Add Employee
//       </Link>

//       <table className="table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Image</th>
//             <th>Email</th>
//             <th>Department</th>
//             <th>Address</th>
//             <th>Salary</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employee.length > 0 ? (
//             employee.map((e) => (
//               <tr key={e.id}>
//                 <td>{e.id}</td>
//                 <td>{e.name}</td>
//                 <td>
//                   <img
//                     src={`http://localhost:3000/Images/${e.image}`}
//                     className="employee_image"
//                     alt=""
//                   />
//                 </td>
//                 <td>{e.email}</td>
//                 <td>{e.category_name}</td>
//                 <td>{e.address}</td>
//                 <td>{e.salary}</td>
//                 <td>
//                   <Link
//                     to={`/dashboard/edit_employee/${e.id}`}
//                     className="btn btn-info btn-sm me-2"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     className="btn btn-warning btn-sm"
//                     onClick={() => handleDelete(e.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="text-center">
//                 No employee found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Employee;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Employee = () => {
//   const [employee, setEmployee] = useState([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 5;

//   // 🔁 Fetch employees
//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/auth/employee", {
//         params: { search, page, limit },
//       });

//       if (res.data.Status) {
//         setEmployee(res.data.Result);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ⏳ Debounced Search
//   useEffect(() => {
//     const delay = setTimeout(() => {
//       fetchEmployees();
//     }, 500);

//     return () => clearTimeout(delay);
//   }, [search, page]);

//   // ❌ Delete
//   const handleDelete = (id) => {
//     axios
//       .delete("http://localhost:3000/auth/delete_employee/" + id)
//       .then(() => fetchEmployees());
//   };

//   return (
//     <div className="px-5 mt-3">

//       {/* 🔍 SEARCH BAR */}
//       <div className="d-flex mb-3">
//         <input
//           type="text"
//           className="form-control me-2"
//           placeholder="Search by ID, Name, Email, Department"
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             setPage(1);
//           }}
//         />
//       </div>

//       <Link to="/dashboard/add_employee" className="btn btn-success mb-3">
//         Add Employee
//       </Link>

//       {/* 📋 TABLE */}
//       <table className="table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Image</th>
//             <th>Email</th>
//             <th>Department</th>
//             <th>Salary</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employee.length > 0 ? (
//             employee.map((e) => (
//               <tr key={e.id}>
//                 <td>{e.id}</td>
//                 <td>{e.name}</td>
//                 <td>
//                   <img
//                     src={`http://localhost:3000/Images/${e.image}`}
//                     className="employee_image"
//                     alt=""
//                   />
//                 </td>
//                 <td>{e.email}</td>
//                 <td>{e.category_name}</td>
//                 <td>{e.salary}</td>
//                 <td>
//                   <Link
//                     to={`/dashboard/edit_employee/${e.id}`}
//                     className="btn btn-info btn-sm me-2"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     className="btn btn-warning btn-sm"
//                     onClick={() => handleDelete(e.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" className="text-center">
//                 No Data Found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* 🔢 PAGINATION */}
//       <div className="d-flex justify-content-center mt-3">
//         <button
//           className="btn btn-secondary me-2"
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//         >
//           Prev
//         </button>
//         <span className="mt-2">Page {page}</span>
//         <button
//           className="btn btn-secondary ms-2"
//           onClick={() => setPage(page + 1)}
//         >
//           Next
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Employee;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Employee = () => {
//   const [employee, setEmployee] = useState([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 5;

//   // 🔁 Fetch employees
//   const fetchEmployees = async (pageNo = page) => {
//     try {
//       const res = await axios.get("http://localhost:3000/auth/employee", {
//         params: { search, page: pageNo, limit },
//       });

//       if (res.data.Status) {
//         setEmployee(res.data.Result);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // 🔃 Initial load (no search)
//   useEffect(() => {
//     fetchEmployees(1);
//   }, []);

//   // 🔍 Search button click
//   const handleSearch = () => {
//     setPage(1);
//     fetchEmployees(1);
//   };

//   // ❌ Delete
//   const handleDelete = (id) => {
//     axios
//       .delete("http://localhost:3000/auth/delete_employee/" + id)
//       .then(() => fetchEmployees(page));
//   };

//   return (
//     <div className="px-5 mt-3">

//       {/* 🔍 SEARCH BAR */}
//       <div className="d-flex mb-3">
//         <input
//           type="text"
//           className="form-control me-2"
//           placeholder="Search by ID, Name, Email, Department"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button className="btn btn-primary" onClick={handleSearch}>
//           Search
//         </button>
//       </div>

//       <Link to="/dashboard/add_employee" className="btn btn-success mb-3">
//         Add Employee
//       </Link>

//       {/* 📋 TABLE */}
//       <table className="table">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Image</th>
//             <th>Email</th>
//             <th>Department</th>
//             <th>Salary</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employee.length > 0 ? (
//             employee.map((e) => (
//               <tr key={e.id}>
//                 <td>{e.id}</td>
//                 <td>{e.name}</td>
//                 <td>
//                   <img
//                     src={`http://localhost:3000/Images/${e.image}`}
//                     className="employee_image"
//                     alt=""
//                   />
//                 </td>
//                 <td>{e.email}</td>
//                 <td>{e.category_name}</td>
//                 <td>{e.salary}</td>
//                 <td>
//                   <Link
//                     to={`/dashboard/edit_employee/${e.id}`}
//                     className="btn btn-info btn-sm me-2"
//                   >
//                     Edit
//                   </Link>
//                   <button
//                     className="btn btn-warning btn-sm"
//                     onClick={() => handleDelete(e.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" className="text-center">
//                 No Data Found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* 🔢 PAGINATION */}
//       <div className="d-flex justify-content-center mt-3">
//         <button
//           className="btn btn-secondary me-2"
//           disabled={page === 1}
//           onClick={() => {
//             const newPage = page - 1;
//             setPage(newPage);
//             fetchEmployees(newPage);
//           }}
//         >
//           Prev
//         </button>

//         <span className="mt-2">Page {page}</span>

//         <button
//           className="btn btn-secondary ms-2"
//           onClick={() => {
//             const newPage = page + 1;
//             setPage(newPage);
//             fetchEmployees(newPage);
//           }}
//         >
//           Next
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Employee;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + id)
      .then((result) => {
        if (result.data.Status) {
          window.location.reload();
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  // New: Handle search
  const handleSearch = () => {
    if (!searchQuery) {
      fetchEmployees(); // if search is empty, show all employees
      return;
    }
    axios
      .get(`http://localhost:3000/auth/search_employee?query=${searchQuery}`)
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Link to="/dashboard/add_employee" className="btn btn-success">
          Add Employee
        </Link>
        {/* Search bar */}
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by ID or Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + e.image}
                    className="employee_image"
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e.id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
