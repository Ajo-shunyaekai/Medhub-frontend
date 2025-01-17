// Import dependencies
import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { postRequestWithToken } from '../api/Requests';
import SupplierSidebar from "../components/SharedComponents/Sidebar/SupSidebar"
import SuccessModal from "../components/SharedComponents/Signup/SuccessModal"
import Layout from "../components/SharedComponents/Layout"
import Login from "../components/SharedComponents/Signup/SupplierLogin"
import Signup from "../components/SharedComponents/Signup/SupplierSignUp"
import Dashboard from "../components/Dashboard/index"
import Inquiry from "../components/Inquiry/InquiryPurchaseOrders"
import InquiryRequest from "../components/Inquiry/InquiryRequest/OnGoingOrder"
import PurchasedOrder from "../components/Inquiry/PurchasedOrder/PurchasedOrder"
import Invoices from "../components/Invoices/Invoice"
import PendingInvoice from '../components/Invoices/PendingInvoices/PendingInvoice';
import PaidInvoice from "../components/Invoices/PaidInvoices/CompleteInvoice"
import ProformaList from '../components/Invoices/ProformaInvoices/ProformaList';
import Orders from "../components/Orders/Order"
import ActiveOrder from "../components/Orders/ActiveOrders/ActiveOrder"
import CompleteOrder from '../components/Orders/CompletedOrders/CompleteOrder';
import Products from "../components/Products/Product"
import NewProducts from "../components/Products/NewProducts/NewProduct"
import SecondaryMarket from "../components/Products/SecondaryProducts/SecondaryMarket"
import Support from "../components/Support/Support"
import AddProduct from "../components/Products/AddProduct"
import PendingProductsList from "../components/Products/PendingProducts/PendingProducts"
import ProductDetails from "../components/Products/ProductDetails"
import SecondaryProductDetails from "../components/Products/SecondaryProducts/SecondaryProductDetails"
import EditSecondaryProduct from "../components/Products/EditSecondaryProduct"
import EditProduct from "../components/Products/EditAddProduct"
import InquiryRequestDetails from "../components/Inquiry/InquiryRequest/InquiryRequestDetails"
import PurchasedOrderDetails from "../components/Inquiry/PurchasedOrder/PurchasedOrderDetails"
import ProformaInvoice from "../components/Invoices/ProformaInvoices/ProformaInvoice"
import ActiveOrderDetails from "../components/Orders/ActiveOrdersDetails"
import InvoiceDesign from "../components/Invoices/InvoiceDesign"
import ProformaInvoiceDetails from "../components/Invoices/ProformaInvoices/ProformaDetailsPage"
import CreateInvoice from "../components/Invoices/CreateInvoice"
import BuyerDetails from "../components/Products/BuyerDetails"
import InquiryRequestList from "../components/Dashboard/DashboardList/InquiryRequestList"
import PurchasedOrderList from "../components/Dashboard/DashboardList/PurchasedOrdersList"
import ActiveOrders from "../components/Dashboard/DashboardList/DashboardOngoing"
import CompletedOrder from "../components/Dashboard/DashboardList/CompletedOrders"
import PendingInvoicesList from "../components/Dashboard/DashboardList/PendingInvoicesList"
import CompletedInvoicesList from "../components/Dashboard/DashboardList/CompletedInvoicesList"
import BuyerCompletedList from "../components/Products/Buyer/BuyerCompletedList"
import BuyerActiveList from "../components/Products/Buyer/BuyerActiveList"
import BuyerPendingList from "../components/Products/Buyer/BuyerPendingList"
import NotificationList from "../components/SharedComponents/Notification/NotificationList"
import Subscription from "../components/Subscription/index"
import Profile from "../components/SharedComponents/Profile/profile"
import SubscriptionMembership from "../components/Subscription/SubscriptionMembership";
import PrivacyPolicy from "../../Policies/PrivcyPolicy"
import TermsConditions from "../../Policies/Terms&Conditions"
import ForgotPassword from "../components/SharedComponents/Signup/ForgotPassword"
const socket = io.connect(process.env.REACT_APP_SERVER_URL);
export const NotificationProvider = ({ children }) => {
    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");
    const location = useLocation();
    const navigate = useNavigate();

    const [invoiceCount, setInvoiceCount] = useState();
    const [notificationList, setNotificationList] = useState([]);
    const [count, setCount] = useState();
    const [refresh, setRefresh] = useState(false);

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
        const obj = { supplier_id: supplierIdSessionStorage ||  supplierIdLocalStorage};
        postRequestWithToken("supplier/get-notification-list", obj, (response) => {
            if (response.code === 200) {
                setNotificationList(response.result.data);
                setCount(response.result.totalItems);
            } else {
                console.log("Error in fetching notifications");
            }
        });
    };

    const fetchInvoiceCount = () => {
        const obj = { supplier_id: supplierIdSessionStorage ||  supplierIdLocalStorage };
        postRequestWithToken("supplier/get-invoice-count", obj, (response) => {
            if (response.code === 200) {
                setInvoiceCount(response.result);
            } else {
                console.log("Error in fetching invoice count");
            }
        });
    };

    const handleClick = (id, event) => {
        const obj = {
            notification_id: id,
            event,
            status: 1,
            supplier_id : supplierIdSessionStorage || supplierIdLocalStorage,
            user_type: 'supplier'
        };
        postRequestWithToken("supplier/update-notification-status", obj, (response) => {
            if (response.code === 200) {
                setRefresh(true);
            } else {
                console.log("Error in updating notification status");
            }
        });
    };

    useEffect(() => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage && location.pathname !== "/supplier/sign-up") {
            navigate("/supplier/login");
        }
    }, [location.pathname]);

    useEffect(() => {
        if (supplierIdSessionStorage || supplierIdLocalStorage) {
            const supplierId = supplierIdSessionStorage || supplierIdLocalStorage;


            fetchInvoiceCount();
            fetchNotifications();

            socket.emit("register", supplierId);

            const notificationEvents = [
                { event: "newEnquiry", title: "New Enquiry Received" },
                { event: "POCreated", title: "PO Created" },
                { event: "POEdited", title: "PO Edited" },
                { event: "logisticsRequest", title: "Logistics Booking Request" },
                { event: "invoicePaymentStatusUpdated", title: "Invoice Payment Done" },
                { event: "addMedicineRequestUpdated", title: "Update on Add Medicine Request" },
                { event: "editMedicineRequestUpdated", title: "Update on Edit Medicine Request" },
            ];

            notificationEvents.forEach(({ event, title }) => {
                socket.on(event, (message) => {
                    const enquiryLink = `${process.env.REACT_APP_SUPPLIER_URL}/notification-list`;
                    showNotification(title, { body: message, icon: "/path/to/logo.png" }, enquiryLink);
                    fetchNotifications();
                });
            });

            socket.on("updateNotification", () => {
                fetchNotifications();
            });

            return () => {
                notificationEvents.forEach(({ event }) => {
                    socket.off(event);
                });
                socket.off("updateNotification");
            };
        }
    }, [supplierIdSessionStorage, supplierIdLocalStorage, refresh]);

    return (
        <SupplierSidebar invoiceCount = {invoiceCount} notificationList={notificationList} count={count} handleClick = {handleClick}>
            {children}
        </SupplierSidebar>
    );
};

const router = createBrowserRouter([
    {
        path: "/supplier/login",
        element: <Login  socket={socket}/>,
    },
    {
        path: "/supplier/sign-up",
        element: <Signup socket={socket}/>,
    },
    {
path:"/supplier/forgot-password",
element:<ForgotPassword/>
    },
    {
        path: "/supplier/privacy-policy",
        element: <PrivacyPolicy/>,
    },
    {
        path: "/supplier/terms-and-conditions",
        element: <TermsConditions/>,
    },
    {
        path: "/supplier",
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
                path: "product",
                element: <Products />,
                children: [
                    {
                        path: "newproduct",
                        element: <NewProducts />,
                    },
                    {
                        path: "secondarymarket",
                        element: <SecondaryMarket />,
                    },
                ]
            },
            {
                path: "inquiry-request-list",
                element: <InquiryRequestList/>,
            },
            {
                path: "purchased-orders-list",
                element: <PurchasedOrderList/>,
            },
            {
                path: "ongoing-orders",
                element: <ActiveOrders />,
            },
            {
                path: "completed-orders",
                element: <CompletedOrder/>,
            },
            {
                path: "pending-invoices-list",
                element: <PendingInvoicesList/>,
            },
            {
                path: "completed-invoices-list",
                element: <CompletedInvoicesList/>,
            },
            {
                path: "inquiry-purchase-orders",
                element: <Inquiry />,
                children: [
                    {
                        path: "ongoing",
                        element: <InquiryRequest />,
                    },
                    {
                        path: "purchased",
                        element: <PurchasedOrder />,
                    },
                ]
            },
            {
                path: "invoice",
                element: <Invoices />,
                children: [
                    {
                        path: "pending",
                        element: <PendingInvoice />,
                    },
                    {
                        path: "paid",
                        element: <PaidInvoice />,
                    },
                    {
                        path: "proforma",
                        element: <ProformaList />,
                    },
                ]
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
                        element: <CompleteOrder />,
                    },
                ]
            },
            {
                path: "add-product",
                element: <AddProduct socket={socket}/>,
            },
            {
                path: "pending-products-list",
                element: <PendingProductsList />,
            },
            {
                path: "product-details/:medicineId",
                element: <ProductDetails />,
            },
            {
                path: "secondary-product-details/:medicineId",
                element: <SecondaryProductDetails />,
            },
            {
                path: "edit-secondary-product/:medicineId",
                element: <EditSecondaryProduct socket={socket} />,
            },
            {
                path: "edit-product/:medicineId",
                element: <EditProduct socket={socket} />,
            },
            {
                path: "inquiry-request-details/:inquiryId",
                element: <InquiryRequestDetails socket={socket} />,
            },
            {
                path: "purchased-order-details/:purchaseOrderId",
                element: <PurchasedOrderDetails />,
            },
            {
                path: "proforma-invoice/:purchaseOrderId",
                element: <ProformaInvoice socket={socket} />,
            },
            {
                path: "active-orders-details/:orderId",
                element: <ActiveOrderDetails />,
            },
            {
                path: "invoice-design/:invoiceId",
                element: <InvoiceDesign />,
            },
            {
                path: "proforma-invoice-details/:orderId",
                element: <ProformaInvoiceDetails />,
            },
            {
                path: "create-invoice/:orderId",
                element: <CreateInvoice socket={socket} />
            },
            {
                path: "buyer-details/:buyerId",
                element: <BuyerDetails/>
            },
            {
                path: "buyer-completed-list/:buyerId",
                element: <BuyerCompletedList/>
            },
            {
                path: "buyer-active-list/:buyerId",
                element: <BuyerActiveList/>,
            },
            {
                path: "buyer-pending-list/:buyerId",
                element: <BuyerPendingList/>,
            },
            {
                path: "Support",
                element: <Support />,
            },
            {
path:"subscription",
element:<Subscription/>
            },
            {
path:"subscription-membership",
element:<SubscriptionMembership/>
            },
            {
                path:"notification-list",
                element:<NotificationList/>
            },{
                path:"profile",
                element:<Profile/>
            }
        ],
    },
    {
        path: "/supplier/sign-up",
        element: <SuccessModal/>,
    },
]);
function Router() {
    return <RouterProvider router={router} />;
}

export default Router;