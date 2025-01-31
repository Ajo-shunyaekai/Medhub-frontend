import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import io from "socket.io-client";
import { postRequestWithToken } from "../api/Requests";
import logo from "../assest/Images/logo.svg";
import AdmSidebar from "../components/shared-components/sidebar/AdmSidebar";
import Layout from "../components/shared-components/Layout";
import Login from "../components/shared-components/login/Login";
import Dashboard from "../components/dashboard/index";
import ManageCommission from "../components/manage-commission/index";
import BuyerRequest from "../components/manage-buyer/buyerrequest/BuyerRequest";
import ApprovedBuyer from "../components/manage-buyer/buyerrequest/ApprovedBuyer";
import RejectedBuyer from "../components/manage-buyer/buyerrequest/RejectedBuyer";
import BuyerRequestDetails from "../components/manage-buyer/buyerrequest/DetailsBuyerRequest";
import BuyerDetails from "../components/manage-buyer/buyerrequest/BuyerDetails";
import BuyerInquiry from "../components/manage-buyer/inquiry/index";
import OngoingInquiry from "../components/manage-buyer/inquiry/Ongoing-Inquiries/BuyerOngoingInquiry";
import PurchasedOrders from "../components/manage-buyer/inquiry/Purchased-Order/BuyerPurchasedOrder";
import BuyerInvoice from "../components/manage-buyer/invoices/index";
import BuyerPaid from "../components/manage-buyer/invoices/paid/BuyerPaid";
import BuyerPending from "../components/manage-buyer/invoices/pending/BuyerPending";
import BuyerProforma from "../components/manage-buyer/invoices/proforma/BuyerProforma";
import BuyerOrder from "../components/manage-buyer/order/index";
import BuyerActiveOrder from "../components/manage-buyer/order/ActiveOrder/ActiveBuyerOrder";
import BuyerCompleteOrder from "../components/manage-buyer/order/CompletedOrder/CompletedBuyerOrder";
import BuyerSupport from "../components/manage-buyer/support/index";
import BuyerComplaint from "../components/manage-buyer/support/complaint/BuyerComplaint";
import BuyerFeedback from "../components/manage-buyer/support/feedback/BuyerFeedback";
import BuyerTransaction from "../components/manage-buyer/transaction/index";
import BuyerTransactionDetails from "../components/manage-buyer/transaction/BuyerTransactionDetails";
import OngoingInquiryDetails from "../components/manage-buyer/inquiry/Ongoing-Inquiries/OngoingInquiriesDetails";
import BuyerPurchasedOrderDetails from "../components/manage-buyer/inquiry/Purchased-Order/BuyerPurchasedOrderDetails";
import OrderDetails from "../components/manage-buyer/order/OrderDetails";
import BuyerInvoiceDetails from "../components/manage-buyer/invoices/BuyerInvoiceDetails";
import BuyerProformaDetails from "../components/manage-buyer/invoices/proforma/BuyerProformaDetails";
import BuyerComplaintDetails from "../components/manage-buyer/support/complaint/BuyerComplaintDetails";
import BuyerFeedbackDetails from "../components/manage-buyer/support/feedback/BuyerFeedbackDetails";
import SellerRequest from "../components/manage-supplier/SupplierRequest/SellerRequest";
import ApprovedSeller from "../components/manage-supplier/SupplierRequest/ApprovedSeller";
import RejectedSeller from "../components/manage-supplier/SupplierRequest/RejectedSeller";
import SellerTransaction from "../components/manage-supplier/Transaction/SellerTransaction";
import SellerInquiry from "../components/manage-supplier/Inquiry/index";
import InquiryRequest from "../components/manage-supplier/Inquiry/InquiryRequest/InquiryRequest";
import SellerPurchasedOrder from "../components/manage-supplier/Inquiry/PurchasedOrder/PurchasedOrder";
import SellerOrder from "../components/manage-supplier/Order/index";
import SellerActiveOrder from "../components/manage-supplier/Order/ActiveOrder/ActiveSellerOrder";
import SellerCompleteOrder from "../components/manage-supplier/Order/CompletedOrder/CompletedSellerOrder";
import SellerInvoice from "../components/manage-supplier/Invoice/index";
import SellerPaid from "../components/manage-supplier/Invoice/Paid/PaidInvoice";
import SellerPending from "../components/manage-supplier/Invoice/Pending/PendingInvoice";
import SellerProforma from "../components/manage-supplier/Invoice/Proforma/SellerProformaInvoice";
import SellerSupport from "../components/manage-supplier/Support/index";
import SellerComplaint from "../components/manage-supplier/Support/Complaint/SellerComplaint";
import SellerFeedback from "../components/manage-supplier/Support/Feedback/Feedback";
import SellerRequestDetails from "../components/manage-supplier/SupplierRequest/SupplierRequestDetails";
import SellerDetails from "../components/manage-supplier/SupplierRequest/SupplierDetails";
import SellerTransactionDetails from "../components/manage-supplier/Transaction/SellerTransactionDetails";
import SellerInquiryDetails from "../components/manage-supplier/Inquiry/InquiryRequest/SellerInquiryDetails";
import SellerPurchasedOrderDetails from "../components/manage-supplier/Inquiry/PurchasedOrder/SellerPurchasedOrderDetails";
import SellerOrderDetails from "../components/manage-supplier/Order/OrderDetails";
import SellerInvoiceDetails from "../components/manage-supplier/Invoice/SellerInvoiceDetails";
import SellerProformaDetails from "../components/manage-supplier/Invoice/Proforma/ProformaInvoiceDetails";
import SellerComplaintDetails from "../components/manage-supplier/Support/Complaint/SellerComplaintDetails";
import SellerFeedbackDetails from "../components/manage-supplier/Support/Feedback/SellerFeedbackDetails";
import TotalRequestList from "../components/dashboard/DashboardList/TotalRequestList";
import TotalApprovedRequest from "../components/dashboard/DashboardList/TotalApprovedRequest";
import TotalPO from "../components/dashboard/DashboardList/TotalPO";
import TotalActiveOrders from "../components/dashboard/DashboardList/TotalActiveOrders";
import TotalCompletedOrders from "../components/dashboard/DashboardList/TotalCompletedOrder";
import InquiriesDashList from "../components/dashboard/DashboardList/InquiriesDashList";
import TotalInquiriesRequest from "../components/dashboard/DashboardList/TotalInquiriesRequest";
import TotalOngoingInquiries from "../components/dashboard/DashboardList/TotalOngoingInquiries";
import ProductRequests from "../components/manage-products/ProductRequest/ProductRequests";
import NewProductRequest from "../components/manage-products/ProductRequest/NewProductRequest";
import SecondaryProductRequest from "../components/manage-products/ProductRequest/SecondaryProductRequest";
import ProductUpdateRequest from "../components/manage-products/ProductUpdateRequest/ProductUpdateRequest";
import NewProductUpdateRequest from "../components/manage-products/ProductUpdateRequest/NewProductUpdateRequest";
import SecondaryUpdateRequest from "../components/manage-products/ProductUpdateRequest/SecondaryUpdateRequest";
import ApprovedProducts from "../components/manage-products/ApprovedProducts/ApprovedProduct";
import ApprovedNewProducts from "../components/manage-products/ApprovedProducts/ApprovedNewProducts";
import ApprovedSecondaryProducts from "../components/manage-products/ApprovedProducts/ApprovedSecondaryProducts";
import RejectedProducts from "../components/manage-products/RejectedProducts/RejectedProduct";
import RejectedNewProducts from "../components/manage-products/RejectedProducts/RejectedNewProduct";
import RejectedSecondaryProducts from "../components/manage-products/RejectedProducts/RejectedSecondaryProducts";
import ProductDetails from "../components/manage-products/ProductDetails";
import ProductRequestDetails from "../components/manage-products/ProductRequestDetails";
import SecondaryProductRequestDetails from "../components/manage-products/SecondaryProductRequestDetails";
import EditProductDetails from "../components/manage-products/EditUpdateProductdetails";
import EditSecondaryDetails from "../components/manage-products/EditUpdateSecondaryDetails";
import SecondaryProductDetails from "../components/manage-products/SecondaryProductDetails";
import NotificationList from "../components/shared-components/notification/NotificationList";
import Profile from "../components/shared-components/Profile/profile";
import { fetchUserData } from "../../redux/reducers/userDataSlice";
import { useDispatch } from "react-redux";
import BuyerEditProfile from "../components/manage-buyer/support/UpdateProfile/EditProfileList";
import BuyerEditProfileDetails from "../components/manage-buyer/support/UpdateProfile/EditProfileDetails";
import SupplierEditProfile from "../components/manage-supplier/Support/UpdateProfile/EditProfileList";
import SupplierEditProfileDetails from "../components/manage-supplier/Support/UpdateProfile/EditProfileDetails";
const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export function NotificationProvider({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminIdSessionStorage = sessionStorage.getItem("admin_id");
  const adminIdLocalStorage = localStorage.getItem("admin_id");

  const [notificationList, setNotificationList] = useState([]);
  const [count, setCount] = useState();
  const [refresh, setRefresh] = useState(false);

  // Notification logic
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
    const obj = { admin_id: adminIdSessionStorage || adminIdLocalStorage };
    postRequestWithToken("admin/get-notification-list", obj, (response) => {
      if (response.code === 200) {
        setNotificationList(response.result.data);
        setCount(response.result.totalItems);
      } else {
        console.log("Error in fetching notifications");
      }
    });
  };

  const handleClick = (id, event) => {
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      notification_id: id,
      event,
      status: 1,
      user_type: "admin",
    };
    postRequestWithToken(
      "admin/update-notification-status",
      obj,
      (response) => {
        if (response.code === 200) {
          setRefresh(true);
        } else {
          console.log("Error in updating notification status");
        }
      }
    );
  };

  useEffect(() => {
    if (adminIdSessionStorage || adminIdLocalStorage) {
      const adminId = adminIdSessionStorage || adminIdLocalStorage;
      socket.emit("registerAdmin", adminId);

      fetchNotifications();

      socket.on("buyerRegistered", (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification(
          "New Buyer Registration Request",
          {
            body: message,
            icon: logo,
          },
          link
        );
        fetchNotifications();
      });

      socket.on("supplierRegistered", (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification(
          "New Supplier Registration Request",
          {
            body: message,
            icon: logo,
          },
          link
        );
        fetchNotifications();
      });

      socket.on("medicineRequest", (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification(
          "New Medicine Approval Request",
          {
            body: message,
            icon: logo,
          },
          link
        );
        fetchNotifications();
      });

      socket.on("newMedicineEditRequest", (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification(
          "New Medicine Edit Approval Request",
          {
            body: message,
            icon: logo,
          },
          link
        );
        fetchNotifications();
      });

      socket.on("secondaryMedicineEditRequest", (message) => {
        const link = `${process.env.REACT_APP_ADMIN_URL}/notification-list`;
        showNotification(
          "New Secondary Medicine Edit Approval Request",
          {
            body: message,
            icon: logo,
          },
          link
        );
        fetchNotifications();
      });

      return () => {
        socket.off("buyerRegistered");
        socket.off("supplierRegistered");
        socket.off("medicineRequest");
        socket.off("newMedicineEditRequest");
        socket.off("secondaryMedicineEditRequest");
      };
    }
  }, [refresh, adminIdSessionStorage, adminIdLocalStorage]);

  useEffect(() => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      navigate("/admin/login");
    }
  }, [adminIdSessionStorage, adminIdLocalStorage, navigate]);

  useEffect(() => {
    sessionStorage.getItem("_id") &&
      dispatch(fetchUserData(sessionStorage.getItem("_id")));
  }, [sessionStorage.getItem("_id")]);

  return (
    <AdmSidebar
      notificationList={notificationList}
      count={count}
      handleClick={handleClick}
    >
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
        element: <Dashboard socket={socket} />,
      },
      {
        path: "total-request-list",
        element: <TotalRequestList socket={socket} />,
      },
      {
        path: "inquiries-section",
        element: <InquiriesDashList socket={socket} />,
        children: [
          {
            path: "request",
            element: <TotalInquiriesRequest socket={socket} />,
          },
          {
            path: "ongoing",
            element: <TotalOngoingInquiries socket={socket} />,
          },
        ],
      },
      {
        path: "profile",
        element: <Profile socket={socket} />,
      },
      {
        path: "notification-list",
        element: <NotificationList socket={socket} />,
      },
      {
        path: "total-approved-request",
        element: <TotalApprovedRequest socket={socket} />,
      },
      {
        path: "total-PO",
        element: <TotalPO socket={socket} />,
      },
      {
        path: "total-active-orders",
        element: <TotalActiveOrders socket={socket} />,
      },
      {
        path: "total-completed-order",
        element: <TotalCompletedOrders socket={socket} />,
      },
      {
        path: "manage-commission",
        element: <ManageCommission socket={socket} />,
      },
      {
        path: "buyer-request",
        element: <BuyerRequest socket={socket} />,
      },
      {
        path: "approved-buyer",
        element: <ApprovedBuyer socket={socket} />,
      },
      {
        path: "rejected-buyer",
        element: <RejectedBuyer socket={socket} />,
      },
      {
        path: "buyer-request-details/:buyerId",
        element: <BuyerRequestDetails socket={socket} />,
      },
      {
        path: "buyer-details/:buyerId",
        element: <BuyerDetails socket={socket} />,
      },
      {
        path: "buyer-inquiry",
        element: <BuyerInquiry socket={socket} />,
        children: [
          {
            path: "ongoing-inquiry",
            element: <OngoingInquiry socket={socket} />,
          },
          {
            path: "purchased-order",
            element: <PurchasedOrders socket={socket} />,
          },
        ],
      },
      {
        path: "buyer-invoice",
        element: <BuyerInvoice socket={socket} />,
        children: [
          {
            path: "paid",
            element: <BuyerPaid socket={socket} />,
          },
          {
            path: "pending",
            element: <BuyerPending socket={socket} />,
          },
          {
            path: "proforma",
            element: <BuyerProforma socket={socket} />,
          },
        ],
      },
      {
        path: "buyer-order",
        element: <BuyerOrder socket={socket} />,
        children: [
          {
            path: "active",
            element: <BuyerActiveOrder socket={socket} />,
          },
          {
            path: "complete",
            element: <BuyerCompleteOrder socket={socket} />,
          },
        ],
      },
      {
        path: "buyer-support",
        element: <BuyerSupport socket={socket} />,
        children: [
          {
            path: "complaint",
            element: <BuyerComplaint socket={socket} />,
          },
          {
            path: "feedback",
            element: <BuyerFeedback socket={socket} />,
          },
          {
            path: "edit-profile",
            element: <BuyerEditProfile socket={socket} />,
          },
        ],
      },
      {
        path: "buyer-edit-profile-details/:id",
        element: <BuyerEditProfileDetails socket={socket} />,
      },
      {
        path: "buyer-transaction",
        element: <BuyerTransaction socket={socket} />,
      },
      {
        path: "buyer-transaction-details/:invoiceId",
        element: <BuyerTransactionDetails socket={socket} />,
      },
      {
        path: "ongoing-inquiries-details/:inquiryId",
        element: <OngoingInquiryDetails socket={socket} />,
      },
      {
        path: "buyer-purchased-order-details/:purchaseOrderId",
        element: <BuyerPurchasedOrderDetails socket={socket} />,
      },
      {
        path: "order-details/:orderId",
        element: <OrderDetails socket={socket} />,
      },
      {
        path: "buyer-invoice-details/:invoiceId",
        element: <BuyerInvoiceDetails socket={socket} />,
      },
      {
        path: "buyer-proforma-details/:orderId",
        element: <BuyerProformaDetails socket={socket} />,
      },
      {
        path: "buyer-complaint-details/:supportId",
        element: <BuyerComplaintDetails socket={socket} />,
      },
      {
        path: "buyer-feedback-details/:supportId",
        element: <BuyerFeedbackDetails socket={socket} />,
      },
      // start the seller routes
      {
        path: "supplier-request",
        element: <SellerRequest socket={socket} />,
      },
      {
        path: "approved-supplier",
        element: <ApprovedSeller socket={socket} />,
      },
      {
        path: "rejected-supplier",
        element: <RejectedSeller socket={socket} />,
      },
      {
        path: "supplier-transaction",
        element: <SellerTransaction socket={socket} />,
      },
      {
        path: "supplier-inquiry",
        element: <SellerInquiry socket={socket} />,
        children: [
          {
            path: "inquiry-request",
            element: <InquiryRequest socket={socket} />,
          },
          {
            path: "purchased-order",
            element: <SellerPurchasedOrder socket={socket} />,
          },
        ],
      },
      {
        path: "supplier-order",
        element: <SellerOrder socket={socket} />,
        children: [
          {
            path: "active",
            element: <SellerActiveOrder socket={socket} />,
          },
          {
            path: "complete",
            element: <SellerCompleteOrder socket={socket} />,
          },
        ],
      },
      {
        path: "supplier-invoice",
        element: <SellerInvoice socket={socket} />,
        children: [
          {
            path: "paid",
            element: <SellerPaid socket={socket} />,
          },
          {
            path: "pending",
            element: <SellerPending socket={socket} />,
          },
          {
            path: "proforma",
            element: <SellerProforma socket={socket} />,
          },
        ],
      },
      {
        path: "supplier-support",
        element: <SellerSupport socket={socket} />,
        children: [
          {
            path: "complaint",
            element: <SellerComplaint socket={socket} />,
          },
          {
            path: "feedback",
            element: <SellerFeedback socket={socket} />,
          },
          {
            path: "edit-profile",
            element: <SupplierEditProfile socket={socket} />,
          },
        ],
      },
      {
        path: "supplier-edit-profile-details/:id",
        element: <SupplierEditProfileDetails socket={socket} />,
      },
      {
        path: "supplier-request-details/:supplierId",
        element: <SellerRequestDetails socket={socket} />,
      },
      {
        path: "supplier-details/:supplierId",
        element: <SellerDetails socket={socket} />,
      },
      {
        path: "supplier-transaction-details/:invoiceId",
        element: <SellerTransactionDetails socket={socket} />,
      },
      {
        path: "supplier-inquiry-details/:inquiryId",
        element: <SellerInquiryDetails socket={socket} />,
      },
      {
        path: "supplier-purchased-order-details/:purchaseOrderId",
        element: <SellerPurchasedOrderDetails socket={socket} />,
      },
      {
        path: "supplier-order-details/:orderId",
        element: <SellerOrderDetails socket={socket} />,
      },
      {
        path: "supplier-invoice-details/:invoiceId",
        element: <SellerInvoiceDetails socket={socket} />,
      },
      {
        path: "proforma-invoice-details/:orderId",
        element: <SellerProformaDetails socket={socket} />,
      },
      {
        path: "supplier-complaint-details/:supportId",
        element: <SellerComplaintDetails socket={socket} />,
      },
      {
        path: "supplier-feedback-details/:supportId",
        element: <SellerFeedbackDetails socket={socket} />,
      },
      // start the product request
      {
        path: "product-requests",
        element: <ProductRequests socket={socket} />,
        children: [
          {
            path: "newproduct",
            element: <NewProductRequest socket={socket} />,
          },
          {
            path: "secondary",
            element: <SecondaryProductRequest socket={socket} />,
          },
        ],
      },
      {
        path: "product-update-requests",
        element: <ProductUpdateRequest socket={socket} />,
        children: [
          {
            path: "newproduct",
            element: <NewProductUpdateRequest socket={socket} />,
          },
          {
            path: "secondary",
            element: <SecondaryUpdateRequest socket={socket} />,
          },
        ],
      },
      {
        path: "approved-product",
        element: <ApprovedProducts socket={socket} />,
        children: [
          {
            path: "newproduct",
            element: <ApprovedNewProducts socket={socket} />,
          },
          {
            path: "secondary",
            element: <ApprovedSecondaryProducts socket={socket} />,
          },
        ],
      },
      {
        path: "rejected-product",
        element: <RejectedProducts socket={socket} />,
        children: [
          {
            path: "newproduct",
            element: <RejectedNewProducts socket={socket} />,
          },
          {
            path: "secondary",
            element: <RejectedSecondaryProducts socket={socket} />,
          },
        ],
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
