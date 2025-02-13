import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import io from "socket.io-client";
import Loader from "./Loader/Loader";

// Lazy-load the components
const SubscriptionPage = lazy(() => import("./SubscriptionPage"));
const PaymentSuccessful = lazy(() => import("./PayementSucsessful"));
const PaymentFailure = lazy(() => import("./PaymentFailure"));
const ThankYou= lazy(() => import("./SubscriptionThankYou"));
const socket = io.connect(process.env.REACT_APP_SERVER_URL);
const router = createBrowserRouter([
  {
    path: "/subscription/:userType/:userId/select-plan",
    element: (
      <Suspense fallback={<Loader />}>
        <SubscriptionPage socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/subscription/:userType/:userId/successful",
    element: (
      <Suspense fallback={<Loader />}>
        <PaymentSuccessful socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/subscription/:userType/:userId/failure",
    element: (
      <Suspense fallback={<Loader />}>
        <PaymentFailure socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/subscription/thank-you",
    element: (
      <Suspense fallback={<Loader />}>
        <ThankYou socket={socket} />
      </Suspense>
    ),
  },

]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
