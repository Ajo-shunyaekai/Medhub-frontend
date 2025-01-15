import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, createBrowserRouter, RouterProvider } from "react-router-dom";
import io from 'socket.io-client';
import { postRequestWithToken } from '../api/Requests';
import logo from "../assest/Images/logo.svg"
import AdmSidebar from "../components/shared-components/sidebar/AdmSidebar"
import Layout from "../components/shared-components/Layout"
import Login from "../components/shared-components/login/Login"
import Dashboard from "../components/dashboard/index"
import ManageCommission from "../components/manage-commission/index"
import BuyerRequest from "../components/manage-buyer/buyerrequest/BuyerRequest"
import ApprovedBuyer from "../components/manage-buyer/buyerrequest/ApprovedBuyer"
import RejectedBuyer from "../components/manage-buyer/buyerrequest/RejectedBuyer"
import BuyerRequestDetails from "../components/manage-buyer/buyerrequest/DetailsBuyerRequest"
import BuyerDetails from "../components/manage-buyer/buyerrequest/BuyerDetails"
import BuyerInquiry from "../components/manage-buyer/inquiry/index"
import OngoingInquiry from "../components/manage-buyer/inquiry/Ongoing-Inquiries/BuyerOngoingInquiry"
import PurchasedOrders from "../components/manage-buyer/inquiry/Purchased-Order/BuyerPurchasedOrder"
import BuyerInvoice from "../components/manage-buyer/invoices/index"
import BuyerPaid from "../components/manage-buyer/invoices/paid/BuyerPaid"
import BuyerPending from "../components/manage-buyer/invoices/pending/BuyerPending"
import BuyerProforma from "../components/manage-buyer/invoices/proforma/BuyerProforma"
import BuyerOrder from "../components/manage-buyer/order/index"
import BuyerActiveOrder from "../components/manage-buyer/order/ActiveOrder/ActiveBuyerOrder"
import BuyerCompleteOrder from "../components/manage-buyer/order/CompletedOrder/CompletedBuyerOrder"
import BuyerSupport from "../components/manage-buyer/support/index"
import BuyerComplaint from '../components/manage-buyer/support/complaint/BuyerComplaint';
import BuyerFeedback from '../components/manage-buyer/support/feedback/BuyerFeedback';
import BuyerTransaction from "../components/manage-buyer/transaction/index"
import BuyerTransactionDetails from "../components/manage-buyer/transaction/BuyerTransactionDetails"
import OngoingInquiryDetails from "../components/manage-buyer/inquiry/Ongoing-Inquiries/OngoingInquiriesDetails"
import BuyerPurchasedOrderDetails from "../components/manage-buyer/inquiry/Purchased-Order/BuyerPurchasedOrderDetails"
import OrderDetails from "../components/manage-buyer/order/OrderDetails"
import BuyerInvoiceDetails from "../components/manage-buyer/invoices/BuyerInvoiceDetails"
import BuyerProformaDetails from "../components/manage-buyer/invoices/proforma/BuyerProformaDetails"
import BuyerComplaintDetails from "../components/manage-buyer/support/complaint/BuyerComplaintDetails"
import BuyerFeedbackDetails from "../components/manage-buyer/support/feedback/BuyerFeedbackDetails"
import SellerRequest from "../components/manage-supplier/SupplierRequest/SellerRequest"
import ApprovedSeller from "../components/manage-supplier/SupplierRequest/ApprovedSeller"
import RejectedSeller from "../components/manage-supplier/SupplierRequest/RejectedSeller"
import SellerTransaction from "../components/manage-supplier/Transaction/SellerTransaction"
import SellerInquiry from "../components/manage-supplier/Inquiry/index"
import InquiryRequest from "../components/manage-supplier/Inquiry/InquiryRequest/InquiryRequest"
import SellerPurchasedOrder from "../components/manage-supplier/Inquiry/PurchasedOrder/PurchasedOrder"
import SellerOrder from "../components/manage-supplier/Order/index"
import SellerActiveOrder from "../components/manage-supplier/Order/ActiveOrder/ActiveSellerOrder"
import SellerCompleteOrder from "../components/manage-supplier/Order/CompletedOrder/CompletedSellerOrder"
import SellerInvoice from "../components/manage-supplier/Invoice/index"
import SellerPaid from "../components/manage-supplier/Invoice/Paid/PaidInvoice"
import SellerPending from "../components/manage-supplier/Invoice/Pending/PendingInvoice"
import SellerProforma from "../components/manage-supplier/Invoice/Proforma/SellerProformaInvoice"
import SellerSupport from "../components/manage-supplier/Support/index"
import SellerComplaint from "../components/manage-supplier/Support/Complaint/SellerComplaint"
import SellerFeedback from "../components/manage-supplier/Support/Feedback/Feedback"
import SellerRequestDetails from "../components/manage-supplier/SupplierRequest/SupplierRequestDetails"
import SellerDetails from "../components/manage-supplier/SupplierRequest/SupplierDetails"
import SellerTransactionDetails from "../components/manage-supplier/Transaction/SellerTransactionDetails"
import SellerInquiryDetails from "../components/manage-supplier/Inquiry/InquiryRequest/SellerInquiryDetails"
import SellerPurchasedOrderDetails from "../components/manage-supplier/Inquiry/PurchasedOrder/SellerPurchasedOrderDetails"
import SellerOrderDetails from "../components/manage-supplier/Order/OrderDetails"
import SellerInvoiceDetails from "../components/manage-supplier/Invoice/SellerInvoiceDetails"
import SellerProformaDetails from "../components/manage-supplier/Invoice/Proforma/ProformaInvoiceDetails"
import SellerComplaintDetails from "../components/manage-supplier/Support/Complaint/SellerComplaintDetails"
import SellerFeedbackDetails from "../components/manage-supplier/Support/Feedback/SellerFeedbackDetails"
import TotalRequestList from "../components/dashboard/DashboardList/TotalRequestList"
import TotalApprovedRequest from "../components/dashboard/DashboardList/TotalApprovedRequest"
import TotalPO from "../components/dashboard/DashboardList/TotalPO"
import TotalActiveOrders from "../components/dashboard/DashboardList/TotalActiveOrders"
import TotalCompletedOrders from "../components/dashboard/DashboardList/TotalCompletedOrder"
import InquiriesDashList from '../components/dashboard/DashboardList/InquiriesDashList';
import TotalInquiriesRequest from '../components/dashboard/DashboardList/TotalInquiriesRequest';
import TotalOngoingInquiries from '../components/dashboard/DashboardList/TotalOngoingInquiries';
import ProductRequests from "../components/manage-products/ProductRequest/ProductRequests"
import NewProductRequest from "../components/manage-products/ProductRequest/NewProductRequest"
import SecondaryProductRequest from "../components/manage-products/ProductRequest/SecondaryProductRequest"
import ProductUpdateRequest from "../components/manage-products/ProductUpdateRequest/ProductUpdateRequest"
import NewProductUpdateRequest from "../components/manage-products/ProductUpdateRequest/NewProductUpdateRequest"
import SecondaryUpdateRequest from "../components/manage-products/ProductUpdateRequest/SecondaryUpdateRequest"
import ApprovedProducts from "../components/manage-products/ApprovedProducts/ApprovedProduct"
import ApprovedNewProducts from "../components/manage-products/ApprovedProducts/ApprovedNewProducts"
import ApprovedSecondaryProducts from "../components/manage-products/ApprovedProducts/ApprovedSecondaryProducts"
import RejectedProducts from "../components/manage-products/RejectedProducts/RejectedProduct"
import RejectedNewProducts from "../components/manage-products/RejectedProducts/RejectedNewProduct"
import RejectedSecondaryProducts from "../components/manage-products/RejectedProducts/RejectedSecondaryProducts"
import ProductDetails from "../components/manage-products/ProductDetails"
import ProductRequestDetails from "../components/manage-products/ProductRequestDetails"
import SecondaryProductRequestDetails from "../components/manage-products/SecondaryProductRequestDetails"
import EditProductDetails from "../components/manage-products/EditUpdateProductdetails"
import EditSecondaryDetails from "../components/manage-products/EditUpdateSecondaryDetails"
import SecondaryProductDetails from "../components/manage-products/SecondaryProductDetails"
import NotificationList from "../components/shared-components/notification/NotificationList"
import Profile from "../components/shared-components/Profile/profile"
const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export function NotificationProvider({ children }) {
    const navigate = useNavigate();
    const adminIdSessionStorage = sessionStorage.getItem("admin_id");
    const adminIdLocalStorage = localStorage.getItem("admin_id");

    const [notificationList, setNotificationList] = useState([]);
    const [count, setCount] = useState();
    const [refresh, setRefresh] = useState(false);

    // Notification logic
    const showNotification = (title, options, url) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, options);
            notification.onclick = () => {
                window.focus();
                window.location.href = url;
            };
        }
    };

    const fetchNotifications = () => {
        const obj = { admin_id: adminIdSessionStorage || adminIdLocalStorage };
        postRequestWithToken('admin/get-notification-list', obj, (response) => {
            if (response.code === 200) {
                setNotificationList(response.result.data);
                setCount(response.result.totalItems);
            } else {
                console.log('Error in fetching notifications');
            }
        });
    };

    const handleClick = (id, event) => {
        const obj = {
            admin_id: adminIdSessionStorage || adminIdLocalStorage,
            notification_id: id,
            event,
            status: 1,
            user_type: 'admin'
        };
        postRequestWithToken('admin/update-notification-status', obj, (response) => {
            if (response.code === 200) {
                setRefresh(true);
            } else {
                console.log('Error in updating notification status');
            }
        });
    };

    useEffect(() => {
        if (adminIdSessionStorage || adminIdLocalStorage) {

            const adminId = adminIdSessionStorage || adminIdLocalStorage;
            socket.emit('registerAdmin', adminId);



            fetchNotifications();

            socket.on('buyerRegistered', (message) => {
                const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
                showNotification('New Buyer Registration Request', {
                    body: message,
                    icon: logo,
                }, link);
                fetchNotifications();
            });

            socket.on('supplierRegistered', (message) => {
                const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
                showNotification('New Supplier Registration Request', {
                    body: message,
                    icon: logo,
                }, link);
                fetchNotifications();
            });

            socket.on('medicineRequest', (message) => {
                const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
                showNotification('New Medicine Approval Request', {
                    body: message,
                    icon: logo,
                }, link);
                fetchNotifications();
            });

            socket.on('newMedicineEditRequest', (message) => {
                const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
                showNotification('New Medicine Edit Approval Request', {
                    body: message,
                    icon: logo,
                }, link);
                fetchNotifications();
            });

            socket.on('secondaryMedicineEditRequest', (message) => {
                const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
                showNotification('New Secondary Medicine Edit Approval Request', {
                    body: message,
                    icon: logo,
                }, link);
                fetchNotifications();
            });

            return () => {
                socket.off('buyerRegistered');
                socket.off('supplierRegistered');
                socket.off('medicineRequest');
                socket.off('newMedicineEditRequest');
                socket.off('secondaryMedicineEditRequest');
            };
        }
    }, [refresh, adminIdSessionStorage, adminIdLocalStorage]);

    useEffect(() => {
        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            navigate("/admin/login");
        }
    }, [adminIdSessionStorage, adminIdLocalStorage, navigate]);
    return (
        <AdmSidebar
            notificationList={notificationList}
            count={count}
            handleClick={handleClick}>
            {children}
        </AdmSidebar>
    );
}
const router = createBrowserRouter([
    {
        path: "/admin/login",
        element: <Login socket={socket} />,
    },
    {
        path: "/admin/",
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
                path: "total-request-list",
                element: <TotalRequestList />
            },
            {
                path: "inquiries-section",
                element: <InquiriesDashList />,
                children: [
                    {
                        path: "request",
                        element: <TotalInquiriesRequest />
                    },
                    {
                        path: "ongoing",
                        element: <TotalOngoingInquiries />
                    },

                ]
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "notification-list",
                element: <NotificationList />
            },
            {
                path: "total-approved-request",
                element: <TotalApprovedRequest />
            },
            {
                path: "total-PO",
                element: <TotalPO />
            },
            {
                path: "total-active-orders",
                element: <TotalActiveOrders />
            },
            {
                path: "total-completed-order",
                element: <TotalCompletedOrders />
            },
            {
                path: "manage-commission",
                element: <ManageCommission />
            },
            {
                path: "buyer-request",
                element: <BuyerRequest />
            },
            {
                path: "approved-buyer",
                element: <ApprovedBuyer />
            },
            {
                path: "rejected-buyer",
                element: <RejectedBuyer />
            },
            {
                path: "buyer-request-details/:buyerId",
                element: <BuyerRequestDetails />
            },
            {
                path: "buyer-details/:buyerId",
                element: <BuyerDetails />
            },
            {
                path: "buyer-inquiry",
                element: <BuyerInquiry />,
                children: [
                    {
                        path: "ongoing-inquiry",
                        element: <OngoingInquiry />
                    },
                    {
                        path: "purchased-order",
                        element: <PurchasedOrders />
                    },

                ]
            },
            {
                path: "buyer-invoice",
                element: <BuyerInvoice />,
                children: [
                    {
                        path: "paid",
                        element: <BuyerPaid />
                    },
                    {
                        path: "pending",
                        element: <BuyerPending />
                    },
                    {
                        path: "proforma",
                        element: <BuyerProforma />
                    },

                ]
            },
            {
                path: "buyer-order",
                element: <BuyerOrder />,
                children: [
                    {
                        path: "active",
                        element: <BuyerActiveOrder />
                    },
                    {
                        path: "complete",
                        element: <BuyerCompleteOrder />
                    },
                ]
            },
            {
                path: "buyer-support",
                element: <BuyerSupport />,
                children: [
                    {
                        path: "complaint",
                        element: <BuyerComplaint />
                    },
                    {
                        path: "feedback",
                        element: <BuyerFeedback />
                    },
                ]
            },
            {
                path: "buyer-transaction",
                element: <BuyerTransaction />,
            },
            {
                path: "buyer-transaction-details/:invoiceId",
                element: <BuyerTransactionDetails />,
            },
            {
                path: "ongoing-inquiries-details/:inquiryId",
                element: <OngoingInquiryDetails />,
            },
            {
                path: "buyer-purchased-order-details/:purchaseOrderId",
                element: <BuyerPurchasedOrderDetails />,
            },
            {
                path: "order-details/:orderId",
                element: <OrderDetails />,
            },
            {
                path: "buyer-invoice-details/:invoiceId",
                element: <BuyerInvoiceDetails />,
            },
            {
                path: "buyer-proforma-details/:orderId",
                element: <BuyerProformaDetails />,
            },
            {
                path: "buyer-complaint-details/:supportId",
                element: <BuyerComplaintDetails />,
            },
            {
                path: "buyer-feedback-details/:supportId",
                element: <BuyerFeedbackDetails />,
            },
            // start the seller routes
            {
                path: "seller-request",
                element: <SellerRequest />,
            },
            {
                path: "approved-seller",
                element: <ApprovedSeller />,
            },
            {
                path: "rejected-seller",
                element: <RejectedSeller />,
            },
            {
                path: "seller-transaction",
                element: <SellerTransaction />,
            },
            {
                path: "seller-inquiry",
                element: <SellerInquiry />,
                children: [
                    {
                        path: "inquiry-request",
                        element: <InquiryRequest />
                    },
                    {
                        path: "purchased-order",
                        element: <SellerPurchasedOrder />
                    },

                ]
            },
            {
                path: "seller-order",
                element: <SellerOrder />,
                children: [
                    {
                        path: "active",
                        element: <SellerActiveOrder />
                    },
                    {
                        path: "complete",
                        element: <SellerCompleteOrder />
                    },

                ]
            },
            {
                path: "seller-invoice",
                element: <SellerInvoice />,
                children: [
                    {
                        path: "paid",
                        element: <SellerPaid />
                    },
                    {
                        path: "pending",
                        element: <SellerPending />
                    },
                    {
                        path: "proforma",
                        element: <SellerProforma />
                    },

                ]
            },
            {
                path: "seller-support",
                element: <SellerSupport />,
                children: [
                    {
                        path: "complaint",
                        element: <SellerComplaint />
                    },
                    {
                        path: "feedback",
                        element: <SellerFeedback />
                    },
                ]
            },
            {
                path: "seller-request-details/:supplierId",
                element: <SellerRequestDetails />,
            },
            {
                path: "seller-details/:supplierId",
                element: <SellerDetails />,
            },
            {
                path: "seller-transaction-details/:invoiceId",
                element: <SellerTransactionDetails />,
            },
            {
                path: "seller-inquiry-details/:inquiryId",
                element: <SellerInquiryDetails />,
            },
            {
                path: "seller-purchased-order-details/:purchaseOrderId",
                element: <SellerPurchasedOrderDetails />,
            },
            {
                path: "seller-order-details/:orderId",
                element: <SellerOrderDetails />,
            },
            {
                path: "seller-invoice-details/:invoiceId",
                element: <SellerInvoiceDetails />,
            },
            {
                path: "proforma-invoice-details/:orderId",
                element: <SellerProformaDetails />,
            },
            {
                path: "seller-complaint-details/:supportId",
                element: <SellerComplaintDetails />,
            },
            {
                path: "seller-feedback-details/:supportId",
                element: <SellerFeedbackDetails />,
            },
            // start the product request
            {
                path: "product-requests",
                element: <ProductRequests />,
                children: [
                    {
                        path: "newproduct",
                        element: <NewProductRequest />
                    },
                    {
                        path: "secondary",
                        element: <SecondaryProductRequest />
                    },
                ]
            },
            {
                path: "product-update-requests",
                element: <ProductUpdateRequest />,
                children: [
                    {
                        path: "newproduct",
                        element: <NewProductUpdateRequest />
                    },
                    {
                        path: "secondary",
                        element: <SecondaryUpdateRequest />
                    },
                ]
            },
            {
                path: "approved-product",
                element: <ApprovedProducts />,
                children: [
                    {
                        path: "newproduct",
                        element: <ApprovedNewProducts />
                    },
                    {
                        path: "secondary",
                        element: <ApprovedSecondaryProducts />
                    },

                ]
            },
            {
                path: "rejected-product",
                element: <RejectedProducts />,
                children: [
                    {
                        path: "newproduct",
                        element: <RejectedNewProducts />
                    },
                    {
                        path: "secondary",
                        element: <RejectedSecondaryProducts />
                    },
                ]
            },
            {
                path: "product-details/:medicineId",
                element: <ProductDetails socket={socket} />,
            },
            {
                path: "product-request-details/:medicineId",
                element: <ProductRequestDetails socket={socket} />,
            },
            {
                path: "secondary-product-request-details/:medicineId",
                element: <SecondaryProductRequestDetails socket={socket} />,
            },
            {
                path: "edit-product-details/:medicineId",
                element: <EditProductDetails socket={socket} />,
            },
            {
                path: "edit-secondary-details/:medicineId",
                element: <EditSecondaryDetails socket={socket} />,
            },
            {
                path: "secondary-product-details/:medicineId",
                element: <SecondaryProductDetails />,
            },
        ],
    },
]);
function Router() {
    return <RouterProvider router={router} />;
}

export default Router;