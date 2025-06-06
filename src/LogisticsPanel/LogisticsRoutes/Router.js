import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Loader from "../components/SharedComponents/Loader/Loader";

const AddInventory      = lazy(() => import("../components/Inventory/AddInventory/InventoryForm"));
const AddVehicle        = lazy(() => import("../components/Vehicle/NewAddVehicle/NewAddVehicle"));
const Dashboard         = lazy(() => import("../components/Dashboard/NewDashboard"));
const Error             = lazy(() => import("../components/SharedComponents/Error/Error"));
const ForgotPassword    = lazy(() => import("../components/ForgotPassword/ForgotPassword"));
const InventoryList     = lazy(() => import("../components/Inventory/NewInventoryList/NewInventoryList"));
const LogisticsLayout   = lazy(() => import("../components/SharedComponents/LogisticsLayout"));
const Login             = lazy(() => import("../components/Login/Login"));
const LogisticsDetails  = lazy(() => import("../components/Orders/NewOrderDetails/NewOrderDetails"));
const Orders            = lazy(() => import("../components/Orders/NewOrder"));
const PickupOrders      = lazy(() => import("../components/PickupOrders/NewPickupOrder/NewPickupOrder"));
const PickupDetails     = lazy(() => import("../components/PickupOrders/NewPickupOrderDetails/NewPickupOrderDetails"));
const Profile           = lazy(() => import("../components/SharedComponents/Profile/Profile"));
const Shipment          = lazy(() => import("../components/Shipment/NewShipment"));
const Signup            = lazy(() => import("../components/Signup/Signup"));
const Tracking          = lazy(() => import("../components/Tracking/NewTrackingForm/NewTrackingForm"));
const VehicleList       = lazy(() => import("../components/Vehicle/NewVehicleList/NewVehicleList"));
// const ActiveOrder       = lazy(() => import("../components/Orders/ActiveOrders/ActiveOrder"));
// const CompleteOrder     = lazy(() => import("../components/Orders/CompletedOrders/CompleteOrder"));
// const PendingOrder      = lazy(() => import("../components/Orders/PendingOrders/PendingOrders"));

const router = createBrowserRouter([
  {
    path    : "/logistics/login",
    element : <Login />,
  },
  {
    path    : "/logistics/forgot-password",
    element : <ForgotPassword />,
  },
  {
    path    : "/logistics/sign-up",
    element : <Signup />,
  },
  {
    path     : "/logistics",
    // element  : <Layout />,
    element  : <LogisticsLayout />,
    children : [
      {
        index   : true,
        element: <Dashboard />
      },
      {
        path     : "order",
        element  : <Orders />,
        // children : [
        //   { path : "active",     element: <ActiveOrder /> },
        //   { path : "completed",  element: <CompleteOrder /> },
        //   { path : "pending",    element: <PendingOrder /> },
        // ],
      },
      {
        path    : "logistics-details/:requestId",
        element : <LogisticsDetails />,
      },
      {
        path    : "pickup-order",
        element : <PickupOrders />,
      },
      {
        path    : "pickup-order-details/:requestId",
        element : <PickupDetails />,
      },
      {
        path    : "add-inventory",
        element : <AddInventory />,
      },
      {
        path    : "inventory-list",
        element : <InventoryList />,
      },
      {
        path    : "add-vehicle",
        element : <AddVehicle />,
      },
      {
        path    : "vehicle-list",
        element : <VehicleList />,
      },
      {
        path    : "shipment",
        element : <Shipment />,
      },
      {
        path    : "tracking",
        element : <Tracking />,
      },
      {
        path    : "profile",
        element : <Profile />,
      },
    ],
  },
  {
    path    : '*',
    element : <Error />
  },
]);

function Router() {
  return <div>{<Outlet />}</div>;
}

export default Router;
