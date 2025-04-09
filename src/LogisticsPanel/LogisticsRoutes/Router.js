import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Loader from "../components/SharedComponents/Loader/Loader";

// const AddVehicle        = lazy(() => import("../components/Vehicle/index"));
const AddVehicle        = lazy(() => import("../components/Vehicle/NewAddVehicle/NewAddVehicle"));
const ActiveOrder       = lazy(() => import("../components/Orders/ActiveOrders/ActiveOrder"));
const CompleteOrder     = lazy(() => import("../components/Orders/CompletedOrders/CompleteOrder"));
// const Dashboard         = lazy(() => import("../components/Dashboard/index"));
const Dashboard         = lazy(() => import("../components/Dashboard/NewDashboard"));
// const Inventory         = lazy(() => import("../components/Inventory/index"));
const Inventory         = lazy(() => import("../components/Inventory/NewInventoryList/NewInventoryList"));
const LogisticsLayout   = lazy(() => import("../components/SharedComponents/LogisticsLayout"));
// const Layout            = lazy(() => import("../components/SharedComponents/layout"));
// const Login             = lazy(() => import("../components/SharedComponents/Login/Login"));
const Login             = lazy(() => import("../components/Login/Login"));
const LogisticsDetails  = lazy(() => import("../components/Orders/OrderDetails/LogisticsDetails"));
const OngoingOrder      = lazy(() => import("../components/Orders/OngoingOrders/OngoingOrders"));
// const Orders            = lazy(() => import("../components/Orders/index"));
const Orders            = lazy(() => import("../components/Orders/NewOrder"));
// const PickupOrders      = lazy(() => import("../components/PickupOrders/index"));
const PickupOrders      = lazy(() => import("../components/PickupOrders/NewPickupOrder/NewPickupOrder"));
const PickupDetails     = lazy(() => import("../components/PickupOrders/PickupOrderDetails/PickupOrderDetails"));
const PendingOrder      = lazy(() => import("../components/Orders/PendingOrders/PendingOrders"));
const Profile           = lazy(() => import("../components/SharedComponents/Profile/profile"));
// const Shipment          = lazy(() => import("../components/Shipment/index"));
const Shipment          = lazy(() => import("../components/Shipment/NewShipment"));
// const Tracking          = lazy(() => import("../components/Tracking/index"));
const Tracking          = lazy(() => import("../components/Tracking/NewTrackingForm/NewTrackingForm"));
// const VehicleList       = lazy(() => import("../components/Vehicle/VehicleList/VehicleLIst"));
const VehicleList       = lazy(() => import("../components/Vehicle/NewVehicleList/NewVehicleList"));

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
        children : [
          { path : "active",     element: <ActiveOrder /> },
          { path : "completed",  element: <CompleteOrder /> },
          { path : "pending",    element: <PendingOrder /> },
        ],
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
]);

function Router() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default Router;

/*
import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  Suspense,
  lazy,
} from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Loader from "../components/SharedComponents/Loader/Loader";

// Lazy-load the components
const Layout = lazy(() => import("../components/SharedComponents/layout"));
const Profile = lazy(() =>
  import("../components/SharedComponents/Profile/profile")
);
const Login = lazy(() => import("../components/SharedComponents/Login/Login"));
const Dashboard = lazy(() => import("../components/Dashboard/index"));
const Orders = lazy(() => import("../components/Orders/index"));
const DashboardActiveOrders = lazy(() =>
  import("../components/Dashboard/DashboardList/ActiveOrders")
);
const DashboardOngoingOrders = lazy(() =>
  import("../components/Dashboard/DashboardList/OngoingOrders")
);
const DashboardCompletedOrders = lazy(() =>
  import("../components/Dashboard/DashboardList/CompletedOrders")
);
const DashboardPendingOrders = lazy(() =>
  import("../components/Dashboard/DashboardList/PendingOrders")
);
const LogisticsDetails = lazy(() =>
  import("../components/Orders/OrderDetails/LogisticsDetails")
);
const ActiveOrder = lazy(() =>
  import("../components/Orders/ActiveOrders/ActiveOrder")
);
const CompleteOrder = lazy(() =>
  import("../components/Orders/CompletedOrders/CompleteOrder")
);
const PendingOrder = lazy(() =>
  import("../components/Orders/PendingOrders/PendingOrders")
);
const OngoingOrder = lazy(() =>
  import("../components/Orders/OngoingOrders/OngoingOrders")
);
const Error = lazy(() =>
  import("../components/SharedComponents/Error/Error")
);

// Routes
const router = createBrowserRouter([
  {
    path: "/logistics/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/logistics",
    element: (
      <Suspense fallback={<Loader />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loader />}>
            <Profile />
          </Suspense>
        ),
      },
      {
        // path: "dashboard",
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "order",
        element: (
          <Suspense fallback={<Loader />}>
            <Orders />
          </Suspense>
        ),
        children: [
          {
            path: "active",
            element: (
              <Suspense fallback={<Loader />}>
                <ActiveOrder />
              </Suspense>
            ),
          },
          {
            path: "completed",
            element: (
              <Suspense fallback={<Loader />}>
                <CompleteOrder />
              </Suspense>
            ),
          },
          {
            path: "pending",
            element: (
              <Suspense fallback={<Loader />}>
                <PendingOrder />
              </Suspense>
            ),
          },
          {
            path: "ongoing",
            element: (
              <Suspense fallback={<Loader />}>
                <OngoingOrder />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "logistics-details/:requestId",
        element: (
          <Suspense fallback={<Loader />}>
            <LogisticsDetails/>
          </Suspense>
        ),
      },
      {
        path: "active-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <Navigate to="/buyer" replace />
          </Suspense>
        ),
      },
      {
        path: "ongoing-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <Navigate to="/buyer" replace />
          </Suspense>
        ),
      },
      {
        path: "completed-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <Navigate to="/buyer" replace />
          </Suspense>
        ),
      },
      {
        path: "pending-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <Navigate to="/buyer" replace />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader />}>
        <Error />
      </Suspense>
    ),
  }
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;*/
