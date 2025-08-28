import React from 'react'
import { Navigate } from 'react-router-dom'
//this component checks if the user is authenticated by checking localStorage for a "valid" key
//if the key exists, it renders the children components, otherwise it redirects to the home page  

const PrivateRoute = ({children}) => {
  return localStorage.getItem("valid") ? children : <Navigate to="/" />
}

export default PrivateRoute
