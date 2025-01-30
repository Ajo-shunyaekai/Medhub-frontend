import React, { useEffect, useState, createContext, useContext } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate, useLocation, Navigate } from "react-router-dom";
import Layout from "../components/SharedComponents/layout";
import Profile from "../components/SharedComponents/Profile/profile"
import Login from "../components/SharedComponents/Login/Login";
import Dashboard from "../components/Dashboard/index";
import Orders from "../components/Orders/index"
import DashboardActiveOrders from "../components/Dashboard/DashboardList/ActiveOrders"
import DashboardOngoingOrders from "../components/Dashboard/DashboardList/OngoingOrders"
import DashboardCompletedOrders from "../components/Dashboard/DashboardList/CompletedOrders"
import DashboardPendingOrders from "../components/Dashboard/DashboardList/PendingOrders"
import LogisticsDetails from "../components/Orders/OrderDetails/LogisticsDetails";
import ActiveOrder from "../components/Orders/ActiveOrders/ActiveOrder"
import CompleteOrder from "../components/Orders/CompletedOrders/CompleteOrder"
import PendingOrder from "../components/Orders/PendingOrders/PendingOrders"
import OngoingOrder from "../components/Orders/OngoingOrders/OngoingOrders"
// Routes
const router = createBrowserRouter([
    {
        path: "/logistics/login",
        element: <Login />,
    },
    {
        path: "/logistics",
        element: <Layout />,
        children: [
            // {
            //     index: true,
            //     element: <Dashboard />,
            // },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "order",
                element: <Orders />,
                children: [
                    {
                        path: "active",
                        element: <ActiveOrder />,
                    },
                    {
                        path: "completed",
                        element: <CompleteOrder />
                    },
                    {
                        path: "pending",
                        element: <PendingOrder />,
                    },
                    {
                        path: "ongoing",
                        element: <OngoingOrder />
                    },
                ]
            },
            {
                path: "logistics-details",
                element: <LogisticsDetails />
            },
            {
                path: "active-orders",
                element: <DashboardActiveOrders />,
            },
            {
                path: "ongoing-orders",
                element: <DashboardOngoingOrders />
            },
            {
                path: "completed-orders",
                element: <DashboardCompletedOrders />,
            },
            {
                path: "pending-orders",
                element: <DashboardPendingOrders />
            },


        ],
    },
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;