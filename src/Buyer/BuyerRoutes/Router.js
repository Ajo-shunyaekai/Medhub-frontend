import React, { useEffect, useState, createContext, useContext } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate, useLocation, Navigate } from "react-router-dom";
import { postRequestWithToken } from '../../api/Requests';
import Sidebar from "../components/SharedComponents/Sidebar/Sidebar"
import io from 'socket.io-client';
import Layout from "../components/SharedComponents/layout";
import Login from "../components/SharedComponents/Login/Login";
import SignUp from "../components/SharedComponents/SignUp/SignUp";
import Dashboard from "../components/Dashboard/index";
import Buy from "../components/Buy/index";
import Inquiry from "../components/Inquiry/index";
import Order from "../components/Orders/index";
import MySupplier from "../components/MySuppliers/index";
import Subscription from "../components/Subscription/index";
import Invoice from "../components/Invoice/index";
import Support from "../components/Support/index";
import BySeller from "../components/Buy/BySupplier/BuySeller"
import ByProduct from "../components/Buy/ByProduct/BuyProduct"
import SecondaryMarket from "../components/Buy/SecondaryMarket/Buy2ndMarket"
import SupplierDetails from "../components/Buy/BySupplier/SupplierDetails"
import SearchProductDetails from "../components/Buy/ByProduct/SearchProductDetails"
import SearchMarketProductDetails from "../components/Buy/SecondaryMarket/SearchMarketProductDetails"
import OnGoingOrder from "../components/Inquiry/Inquiry/OnGoingOrder";
import PurchasedOrder from "../components/Inquiry/PurchasedOrder/PurchasedOrder";
import ActiveOrder from "../components/Orders/ActiveOrders/ActiveOrder";
import CompletedOrders from "../components/Orders/CompletedOrders/CompleteOrder";
import SubscriptionMembership from "../components/Subscription/SubscriptionMembership";
import PendingInvoice from "../components/Invoice/Pending/PendingInvoice"
import PaidInvoice from "../components/Invoice/Paid/CompleteInvoice"
import ProformaInvoice from "../components/Invoice/Proforma/ProformaInvoice";
import OnGoingInquiriesList from "../components/Dashboard/DashboardList/OngoingInquiriesList"
import PurchasedOrdersList from "../components/Dashboard/DashboardList/PurchasedOrdersList"
import ActiveOrders from "../components/Dashboard/DashboardList/ActiveOrders"
import CompletedOrder from "../components/Dashboard/DashboardList/CompletedOrders"
import CompleteInvoicesList from "../components/Dashboard/DashboardList/CompleteInvoicesList"
import PendingInvoicesList from "../components/Dashboard/DashboardList/PendingInvoicesList"
import MedicineDetails from "../components/Buy/ByProduct/ProductDetails"
import MarketProductDetails from "../components/Buy/SecondaryMarket/MarketProductDetails"
import OnGoingInquiriesDetails from "../components/Inquiry/Inquiry/OnGoingInquiriesDetails"
import CancelInquiryList from "../components/Inquiry/Inquiry/CancelnquiryList"
import PurchaseOrderDetails from "../components/Inquiry/PurchasedOrder/PurchasedOrderDetails"
import CreatePO from "../components/Inquiry/PurchasedOrder/CreatePO"
import EditCreatePO from "../components/Inquiry/PurchasedOrder/EditCreatePO"
import OrderDetails from "../components/Orders/OrderDetails/OrderDetails"
import InvoiceDesign from "../components/Invoice/invoiceDesign"
import PerformaInvoiceDetails from "../components/Invoice/ProformaInvoiceDetails"
import SendInquiry from "../components/Buy/SendInquiry/SendInquiry"
import ThankYou from "../components/Buy/SendInquiry/ThankYou"
import NotificationList from "../components/SharedComponents/Notification/NotificationList"
import SupplyProductList from "../components/Buy/BySupplier/SupplyProductList";
import SupplyOrderList from "../components/Buy/BySupplier/SupplyOrderList";
import SupplySecondaryList from "../components/Buy/BySupplier/SupplySecondaryList";
import SupplierCompleted from "../components/supplier/SuplierCompleted"
import SupplierActive from "../components/supplier/SupplierActive"
import SupplierPending from "../components/supplier/SupplierPending"
import Profile from "../components/SharedComponents/Profile/profile"
import PrivacyPolicy from "../../Policies/PrivcyPolicy"
import TermsConditions from "../../Policies/Terms&Conditions"
import ForgotPassword from '../components/SharedComponents/Login/ForgotPassword';
const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export function NotificationProvider({ children }) {
    const buyerIdSessionStorage = sessionStorage.getItem('buyer_id');
    const buyerIdLocalStorage = localStorage.getItem('buyer_id');
    const [notificationList, setNotificationList] = useState([]);
    const [count, setCount] = useState(0);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const buyerId = sessionStorage.getItem("buyer_id") || localStorage.getItem("buyer_id");

    const showNotification = (title, options, url) => {
        if (Notification.permission === "granted") {
            const notification = new Notification(title, options);
            notification.onclick = () => {
                window.focus();
                window.location.href = url;
            };
        }
    };


    const fetchNotifications = () => {
        const obj = { buyer_id: buyerId };
        postRequestWithToken("buyer/get-notification-list", obj, (response) => {
            if (response.code === 200) {
                setNotificationList(response.result.data);
                setCount(response.result.totalItems);
            } else {
                console.error("Error fetching notification list");
            }
        });
    };

    const fetchInvoiceCount = () => {
        const obj = { buyer_id: buyerId };
        postRequestWithToken("buyer/get-invoice-count", obj, (response) => {
            if (response.code === 200) {
                setInvoiceCount(response.result || 0);
            } else {
                console.error("Error fetching invoice count");
            }
        });
    };

    const handleClick = (id, event) => {
        const obj = {
            notification_id: id,
            event,
            status: 1,
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
            user_type: 'buyer'
        };
        postRequestWithToken('buyer/update-notification-status', obj, (response) => {
            if (response.code === 200) {
                // setRefresh(true);
                // console.log("Notification status updated");
                fetchNotifications(); // Refresh notifications after updating
            } else {
                console.error('Error updating notification status');
            }
        });
    };

    useEffect(() => {
        if (!buyerId && location.pathname !== "/buyer/sign-up") {
            navigate("/buyer/login");
        }
    }, [buyerId, location.pathname]);

    useEffect(() => {
        if (buyerId) {
            socket.emit("registerBuyer", buyerId);

            fetchNotifications();
            fetchInvoiceCount();

            const notificationEvents = [
                { event: "enquiryQuotation", title: "New Quote Received" },
                { event: "orderCreated", title: "Order Created" },
                { event: "shipmentDetailsSubmission", title: "Shipment Details Submitted" },
                { event: "invoiceCreated", title: "Invoice Created" },
            ];

            notificationEvents.forEach(({ event, title }) => {
                socket.on(event, (message) => {
                    const link = `${process.env.REACT_APP_BUYER_URL}/notification-list`;
                    showNotification(title, { body: message, icon: "/path/to/logo.png" }, link);
                    fetchNotifications();
                });
            });

            return () => {
                notificationEvents.forEach(({ event }) => {
                    socket.off(event);
                });
            };
        }
    }, [buyerId, refresh]);

    return (
        <Sidebar
            invoiceCount={invoiceCount}
            notificationList={notificationList}
            count={count}
            handleClick={handleClick}>
            {children}
        </Sidebar>
    );
}

// Routes
const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/buyer" replace />,
    },
    {
        path: "/buyer/login",
        element: <Login socket={socket} />,
    },
    {
        path:"/buyer/forgot-password",
        element:<ForgotPassword/>
    },
    {
        path: "/buyer/sign-up",
        element: <SignUp socket={socket}/>,
    },
    {
        path: "/buyer/privacy-policy",
        element: <PrivacyPolicy/>,
    },
    {
        path: "/buyer/terms-and-conditions",
        element: <TermsConditions/>,
    },
    {
        path: "/buyer",
        element: (
            <NotificationProvider>
                <Layout />
            </NotificationProvider>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "ongoing-inquiries-list",
                element: <OnGoingInquiriesList />
            },
            {
                path: "purchased-orders-list",
                element: <PurchasedOrdersList />
            },
            {
                path: "active-orders",
                element: <ActiveOrders />
            },
            {
                path: "completed-order",
                element: <CompletedOrder />
            },
            {
                path: "complete-invoices-list",
                element: <CompleteInvoicesList />
            },
            {
                path: "pending-invoices-list",
                element: <PendingInvoicesList />
            },


            {
                path: "buy",
                element: <Buy />,
                children: [
                    {
                        path: "By-Supplier",
                        element: <BySeller />
                    },
                    {
                        path: "By-Product",
                        element: <ByProduct />
                    },
                    {
                        path: "Secondary-Market",
                        element: <SecondaryMarket />
                    },
                ]
            },
            {
                path: "Medicine-Details/:medicineId",
                element: <MedicineDetails />
            },
            {
                path: "Market-Product-Details/:medicineId",
                element: <MarketProductDetails />

            },
            {
                path: "Supplier-Details/:supplierId",
                element: <SupplierDetails />,
                children: [
                    {
                        path: "products",
                        element: <SupplyProductList />
                    },
                    {
                        path: "secondary",
                        element: <SupplySecondaryList />
                    },
                    {
                        path: "orders",
                        element: <SupplyOrderList />
                    },
                ]
            },

            {
                path: "Search-Product-Details/:medicineId",
                element: <SearchProductDetails />
            },
            {
                path: "Search-Market-Product-Details/:medicineId",
                element: <SearchMarketProductDetails />
            },
            {
                path: "send-inquiry",
                element: <SendInquiry socket={socket} />
            },
            {
                path: "inquiry",
                element: <Inquiry />,
                children: [
                    {
                        path: "inquiry",
                        element: <OnGoingOrder />
                    },
                    {
                        path: "purchased-order",
                        element: <PurchasedOrder />
                    },

                ]
            },
            {
                path: "Create-PO/:inquiryId",
                element: <CreatePO socket={socket} />
            },
            {
                path: "edit-create-PO/:purchaseOrderId",
                element: <EditCreatePO socket={socket} />
            },
            {
                path: "cancel-inquiry-list/:inquiryId",
                element: <CancelInquiryList />

            },
            {
                path: "ongoing-inquiries-details/:inquiryId",
                element: <OnGoingInquiriesDetails />
            },
            {
                path: "purchased-order-details/:purchaseOrderId",
                element: <PurchaseOrderDetails />
            },
            {
                path: "order",
                element: <Order />,
                children: [
                    {
                        path: "active-orders",
                        element: <ActiveOrder />
                    },
                    {
                        path: "completed-orders",
                        element: <CompletedOrders />
                    },

                ]
            },
            {
                path: "order-details/:orderId",
                element: <OrderDetails socket={socket} />
            },
            {
                path: "my-supplier",
                element: <MySupplier />,
            },
            {
                path: "subscription",
                element: <Subscription />,
            },
            {
                path: "subscription-membership",
                element: <SubscriptionMembership />
            },
            {
                path: "invoice",
                element: <Invoice socket={socket}/>,
                children: [
                    {
                        path: "pending-invoice",
                        element: <PendingInvoice socket={socket}/>
                    },
                    {
                        path: "paid-invoice",
                        element: <PaidInvoice />
                    },
                    {
                        path: "proforma-invoice",
                        element: <ProformaInvoice />
                    },

                ]
            },
            {
                path: "invoice-design/:invoiceId",
                element: <InvoiceDesign />

            },
            {
                path: "Proforma-Invoice-Details/:orderId",
                element: <PerformaInvoiceDetails />
            },

            {
                path: "support",
                element: <Support />,
            },
            {
                path: "notification-list",
                element: < NotificationList />
            },
            {
                path: "supplier-completed/:supplierId",
                element: < SupplierCompleted />
            },
            {
                path: "supplier-active/:supplierId",
                element: < SupplierActive />
            },
            {
                path: "supplier-pending/:supplierId",
                element: < SupplierPending />
            },
        ],
    },
    {
        path: "/buyer/thank-you",
        element: <ThankYou />
    }
]);

function Router() {
    return <RouterProvider router={router} />;
}

export default Router;