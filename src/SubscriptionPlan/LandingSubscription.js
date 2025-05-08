import React from "react";
import { Outlet } from "react-router-dom";

function Router() {
  return <div>{<Outlet />}</div>;
}

export default Router;
