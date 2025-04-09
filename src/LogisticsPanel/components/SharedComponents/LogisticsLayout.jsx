import React from "react";
import Section from "../UI/Section";
import Header from "./Header/Header";
import { Outlet } from "react-router-dom";

function LogisticsLayout() {
  return (
    <Section>
      <div className="row">
        <div className="col-12">
          <Header />
        </div>
      </div>
      <div className="row" style={{ marginTop: "60px" }}>
        <div className="col-12">
          <Outlet />
        </div>
      </div>
    </Section>
  );
}

export default LogisticsLayout;
