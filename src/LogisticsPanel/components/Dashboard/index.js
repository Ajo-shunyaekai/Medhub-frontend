import React from 'react'
import Dashboard from "./Dashboard"
import { Outlet } from "react-router-dom";

const index = () => {
  return (
    <div>
      <Dashboard />
      <Outlet/>
    </div>
  )
}

export default index