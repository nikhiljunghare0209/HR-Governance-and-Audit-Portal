import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
const Category = () => {
  const [category, setCategory] = React.useState([])
  useEffect(() => {
    axios.get("http://localhost:3000/auth/category")
    .then(result=>{
      if(result.data.Status){

// When setCategory(result.data.Result) is called, React internally:
// Updates the category variable with the new data.
// Re-renders your component (automatically).
// So now, category.map(...) runs with the updated list.

      setCategory(result.data.Result);}
      else{
        alert(result.data.Error);
      }
    }).catch(err => console.log(err));
  },[])
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Category List</h3>
      </div>
      <Link to="/dashboard/add_category" className="btn btn-success">
        Add Category
      </Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
          {
            category.map(c=>(
              <tr>
                <td>{c.name}</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
