import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "../components/SharedComponents/Loader/Loader";

const AddVehicle        = lazy(() => import("../components/Vehicle/NewAddVehicle/NewAddVehicle"));
const Dashboard         = lazy(() => import("../components/Dashboard/NewDashboard"));
const Error             = lazy(() => import("../components/SharedComponents/Error/Error"));
const Inventory         = lazy(() => import("../components/Inventory/NewInventoryList/InventoryForm"));
const LogisticsLayout   = lazy(() => import("../components/SharedComponents/LogisticsLayout"));
const Login             = lazy(() => import("../components/Login/Login"));
const LogisticsDetails  = lazy(() => import("../components/Orders/NewOrderDetails/NewOrderDetails"));
const Orders            = lazy(() => import("../components/Orders/NewOrder"));
const PickupOrders      = lazy(() => import("../components/PickupOrders/NewPickupOrder/NewPickupOrder"));
const PickupDetails     = lazy(() => import("../components/PickupOrders/NewPickupOrderDetails/NewPickupOrderDetails"));
const Profile           = lazy(() => import("../components/SharedComponents/Profile/Profile"));
const Shipment          = lazy(() => import("../components/Shipment/NewShipment"));
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
        path    : "inventory",
        element : <Inventory />,
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
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default Router;
