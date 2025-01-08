import React, { useState, useEffect } from "react";
import SideBar from "./sidebar/AdmSidebar"

const Layout = () => {
  return (
    <div className="d-flex">
      <SideBar/>
    </div>
  )
}

export default Layout