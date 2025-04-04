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

export default Router;
