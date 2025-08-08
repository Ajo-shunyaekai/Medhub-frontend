import React, { Suspense, useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
 
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
 
import { BuyerNotificationProvider } from "./Buyer/BuyerRoutes/Router";
import { AdminNotificationProvider } from "./Admin/AdminRoutes/Router";
import { SupplierNotificationProvider } from "./Supplier/SupplierRoutes/Router";
import Layout from "./Buyer/components/SharedComponents/layout";
import Loader from "./Buyer/components/SharedComponents/Loader/Loader";
// import LogisticsLayout from "./LogisticsPanel/components/SharedComponents/LogisticsLayout";
import {
  adminNestedRoutes,
  adminRoutesConfig,
  buyerNestedRoutes,
  buyerRoutesConfig,
  // logisticsNestedRoutes,
  // logisticsRoutesConfig,
  newLogisticNestedRoutes,
  newLogisticRoutesConfig,
  subscriptionRoutesConfig,
  supplierNestedRoutes,
  supplierRoutesConfig,
} from "./allRoutes";
import Error from "./Buyer/components/SharedComponents/Error/Error";
import { initGA, sendPageview } from "./analytics";
 
import { Document, Page } from 'react-pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import LogisticLayout from "./Logistics/Components/SharedComponents/LogisticLayout";
import { LogisticsNotificationProvider } from "./Logistics/LogisticsRoutes/Router";
GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;
 
 
// Socket Connection
const socket = io.connect(process.env.REACT_APP_SERVER_URL, {
  autoConnect: false,
});
 
const App = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [cssFileLoaded, setCssFileLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    socket.connect();  
    socket.on('connect', () => {
      setSocketConnected(true);  
    });
    socket.on('disconnect', () => {
      setSocketConnected(false);  
    });

    return () => {
      socket.disconnect();  
    };
  }, []);
 
  useEffect(() => {
    sendPageview(location?.pathname + location?.search);
  }, [location]);
 
  const currentPath = location.pathname?.split("/")[1] || "buyer";
 
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
 
  const renderRoutes = (routes, parentPath = "") =>
    routes.map(({ path, component: Component, children, index }, idx) => (
      <Route
        key={idx}
        path={path ? `${parentPath}${path}` : undefined}
        index={index}
        element={<Component socket={socket} />}
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
      <Suspense fallback={<Loader />}>
        <Routes>
          {renderRoutes(buyerRoutesConfig)}
          <Route
            path="/buyer"
            element={
              <BuyerNotificationProvider>
                <Layout socket={socket}/>
              </BuyerNotificationProvider>
            }
          >
            {renderRoutes(buyerNestedRoutes)}
          </Route>
          {renderRoutes(supplierRoutesConfig)}
          <Route
            path="/supplier"
            element={
              <SupplierNotificationProvider socket={socket}>
                <Layout socket={socket}/>
              </SupplierNotificationProvider>
            }
          >
            {renderRoutes(supplierNestedRoutes)}
          </Route>
          {renderRoutes(adminRoutesConfig)}
          <Route
            path="/admin"
            element={
              <AdminNotificationProvider socket={socket}>
                <Layout socket={socket}/>
              </AdminNotificationProvider>
            }
          >
            {renderRoutes(adminNestedRoutes)}
          </Route>
          {/* {renderRoutes(logisticsRoutesConfig)}
          <Route path="/logistics" element={<LogisticsLayout />}>
            {renderRoutes(logisticsNestedRoutes)}
          </Route> */}
 
          {renderRoutes(newLogisticRoutesConfig)}
          <Route path="/logistic" element={
             <LogisticsNotificationProvider socket={socket}>
               <LogisticLayout socket={socket}/>
              </LogisticsNotificationProvider>}>
             {renderRoutes(newLogisticNestedRoutes)}
          </Route>
          {renderRoutes(subscriptionRoutesConfig)}
          <Route path="*" element={<Error socket={socket} />} />
        </Routes>
      </Suspense>
    </div>
  );
};
 
export default App;
 
 