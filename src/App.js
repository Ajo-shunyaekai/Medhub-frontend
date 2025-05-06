import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";

import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";

import { NotificationProvider } from "./Buyer/BuyerRoutes/Router";
import BuyerSidebar from "./Buyer/BuyerRoutes/Router";
import AdminSidebar from "./Admin/AdminRoutes/Router";
import SupplierSidebar from "./Supplier/SupplierRoutes/Router";
import LogisticsRoutes from "./LogisticsPanel/LogisticsRoutes/Router";
import SubscriptionRoutes from "./SubscriptionPlan/LandingSubscription";
import Layout from "./Buyer/components/SharedComponents/layout";
import Loader from "./Buyer/components/SharedComponents/Loader/Loader";
import { buyerNestedRoutes, buyerRoutesConfig } from "./allRoutes";

// Socket Connection
const socket = io.connect(process.env.REACT_APP_SERVER_URL, { autoConnect: false });

const App = () => {
  const [cssFileLoaded, setCssFileLoaded] = useState(false);
  const location = useLocation();

  const currentPath = location.pathname.split("/")[1] || "buyer";

  useEffect(() => {
    const loadCss = async () => {
      try {
        if (currentPath.includes("buyer")) {
          await import("./App.css");
        } else if (currentPath.includes("supplier")) {
          await import("./SupplierApp.css");
        } else if (currentPath.includes("admin")) {
          await import("./AdminApp.css");
        } else if (currentPath.includes("logistics")) {
          await import("./logistics.css");
        }
        setCssFileLoaded(true);
      } catch (error) {
        console.error("CSS load error:", error);
      }
    };
    loadCss();
  }, [currentPath]);

  const renderSidebar = () => {
    switch (currentPath) {
      case "supplier":
        return <SupplierSidebar />;
      case "admin":
        return <AdminSidebar />;
      case "logistics":
        return <LogisticsRoutes />;
      case "subscription":
        return <SubscriptionRoutes />;
      default:
        return <BuyerSidebar />;
    }
  };

  const renderRoutes = (routes, parentPath = "") => 
    routes.map(({ path, component: Component, withSocket, children, index }, idx) => (
      <Route
        key={idx}
        path={path ? `${parentPath}${path}` : undefined}
        index={index}
        element={<Component {...(withSocket ? { socket } : {})} />}
      >
        {children && renderRoutes(children)}
      </Route>
    ));

  if (!cssFileLoaded) {
    return <Loader />;
  }

  return (
    <div className="App">
      <ToastContainer />
      {renderSidebar()}
      <Suspense fallback={<Loader />}>
        <Routes>
          {renderRoutes(buyerRoutesConfig)}
          <Route
            path="/buyer"
            element={
              <NotificationProvider>
                <Layout />
              </NotificationProvider>
            }
          >
            {renderRoutes(buyerNestedRoutes)}
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
