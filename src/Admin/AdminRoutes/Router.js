import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  useNavigate,
  useLocation,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import io from "socket.io-client";
import { postRequestWithToken } from "../api/Requests";
import logo from "../assets/Images/logo.svg";
import Loader from "../components/shared-components/Loader/Loader";
import { fetchUserData } from "../../redux/reducers/userDataSlice";
import { useDispatch } from "react-redux";

// Lazy-load the components
const AdmSidebar = lazy(() =>
  import("../components/shared-components/sidebar/AdmSidebar")
);
const Layout = lazy(() => import("../components/shared-components/Layout"));
const Login = lazy(() => import("../components/shared-components/login/Login"));
const Dashboard = lazy(() => import("../components/dashboard/index"));
const BuyerRequest = lazy(() =>
  import("../components/manage-buyer/buyerrequest/BuyerRequest")
);
const ApprovedBuyer = lazy(() =>
  import("../components/manage-buyer/buyerrequest/ApprovedBuyer")
);
const RejectedBuyer = lazy(() =>
  import("../components/manage-buyer/buyerrequest/RejectedBuyer")
);
const BuyerRequestDetails = lazy(() =>
  import("../components/manage-buyer/buyerrequest/DetailsBuyerRequest")
);
const BuyerDetails = lazy(() =>
  import("../components/manage-buyer/buyerrequest/BuyerDetails")
);
const BuyerInquiry = lazy(() =>
  import("../components/manage-buyer/inquiry/index")
);
const OngoingInquiry = lazy(() =>
  import(
    "../components/manage-buyer/inquiry/Ongoing-Inquiries/BuyerOngoingInquiry"
  )
);
const PurchasedOrders = lazy(() =>
  import(
    "../components/manage-buyer/inquiry/Purchased-Order/BuyerPurchasedOrder"
  )
);
const BuyerInvoice = lazy(() =>
  import("../components/manage-buyer/invoices/index")
);
const BuyerPaid = lazy(() =>
  import("../components/manage-buyer/invoices/paid/BuyerPaid")
);
const BuyerPending = lazy(() =>
  import("../components/manage-buyer/invoices/pending/BuyerPending")
);
const BuyerProforma = lazy(() =>
  import("../components/manage-buyer/invoices/proforma/BuyerProforma")
);
const BuyerOrder = lazy(() => import("../components/manage-buyer/order/index"));
const BuyerActiveOrder = lazy(() =>
  import("../components/manage-buyer/order/ActiveOrder/ActiveBuyerOrder")
);
const BuyerCompleteOrder = lazy(() =>
  import("../components/manage-buyer/order/CompletedOrder/CompletedBuyerOrder")
);
const BuyerSupport = lazy(() =>
  import("../components/manage-buyer/support/index")
);
const BuyerComplaint = lazy(() =>
  import("../components/manage-buyer/support/complaint/BuyerComplaint")
);
const BuyerFeedback = lazy(() =>
  import("../components/manage-buyer/support/feedback/BuyerFeedback")
);
const BuyerTransaction = lazy(() =>
  import("../components/manage-buyer/transaction/index")
);
const BuyerTransactionDetails = lazy(() =>
  import("../components/manage-buyer/transaction/BuyerTransactionDetails")
);
const OngoingInquiryDetails = lazy(() =>
  import(
    "../components/manage-buyer/inquiry/Ongoing-Inquiries/OngoingInquiriesDetails"
  )
);
const BuyerPurchasedOrderDetails = lazy(() =>
  import(
    "../components/manage-buyer/inquiry/Purchased-Order/BuyerPurchasedOrderDetails"
  )
);
const OrderDetails = lazy(() =>
  import("../components/manage-buyer/order/OrderDetails")
);
const BuyerInvoiceDetails = lazy(() =>
  import("../components/manage-buyer/invoices/BuyerInvoiceDetails")
);
const BuyerProformaDetails = lazy(() =>
  import("../components/manage-buyer/invoices/proforma/BuyerProformaDetails")
);
const BuyerComplaintDetails = lazy(() =>
  import("../components/manage-buyer/support/complaint/BuyerComplaintDetails")
);
const BuyerFeedbackDetails = lazy(() =>
  import("../components/manage-buyer/support/feedback/BuyerFeedbackDetails")
);
const SellerRequest = lazy(() =>
  import("../components/manage-supplier/SupplierRequest/SellerRequest")
);
const ApprovedSeller = lazy(() =>
  import("../components/manage-supplier/SupplierRequest/ApprovedSeller")
);
const RejectedSeller = lazy(() =>
  import("../components/manage-supplier/SupplierRequest/RejectedSeller")
);
const SellerTransaction = lazy(() =>
  import("../components/manage-supplier/Transaction/SellerTransaction")
);
const SellerInquiry = lazy(() =>
  import("../components/manage-supplier/Inquiry/index")
);
const InquiryRequest = lazy(() =>
  import("../components/manage-supplier/Inquiry/InquiryRequest/InquiryRequest")
);
const SellerPurchasedOrder = lazy(() =>
  import("../components/manage-supplier/Inquiry/PurchasedOrder/PurchasedOrder")
);
const SellerOrder = lazy(() =>
  import("../components/manage-supplier/Order/index")
);
const SellerActiveOrder = lazy(() =>
  import("../components/manage-supplier/Order/ActiveOrder/ActiveSellerOrder")
);
const SellerCompleteOrder = lazy(() =>
  import(
    "../components/manage-supplier/Order/CompletedOrder/CompletedSellerOrder"
  )
);
const SellerInvoice = lazy(() =>
  import("../components/manage-supplier/Invoice/index")
);
const SellerPaid = lazy(() =>
  import("../components/manage-supplier/Invoice/Paid/PaidInvoice")
);
const SellerPending = lazy(() =>
  import("../components/manage-supplier/Invoice/Pending/PendingInvoice")
);
const SellerProforma = lazy(() =>
  import("../components/manage-supplier/Invoice/Proforma/SellerProformaInvoice")
);
const SellerSupport = lazy(() =>
  import("../components/manage-supplier/Support/index")
);
const SellerComplaint = lazy(() =>
  import("../components/manage-supplier/Support/Complaint/SellerComplaint")
);
const SellerFeedback = lazy(() =>
  import("../components/manage-supplier/Support/Feedback/Feedback")
);
const SellerRequestDetails = lazy(() =>
  import("../components/manage-supplier/SupplierRequest/SupplierRequestDetails")
);
const SellerDetails = lazy(() =>
  import("../components/manage-supplier/SupplierRequest/SupplierDetails")
);
const SellerTransactionDetails = lazy(() =>
  import("../components/manage-supplier/Transaction/SellerTransactionDetails")
);
const SellerInquiryDetails = lazy(() =>
  import(
    "../components/manage-supplier/Inquiry/InquiryRequest/SellerInquiryDetails"
  )
);
const SellerPurchasedOrderDetails = lazy(() =>
  import(
    "../components/manage-supplier/Inquiry/PurchasedOrder/SellerPurchasedOrderDetails"
  )
);
const SellerOrderDetails = lazy(() =>
  import("../components/manage-supplier/Order/OrderDetails")
);
const Edit = lazy(() =>
  import("../components/shared-components/EditDetails/EditProfileDetails.js")
);
const SellerInvoiceDetails = lazy(() =>
  import("../components/manage-supplier/Invoice/SellerInvoiceDetails")
);
const SellerProformaDetails = lazy(() =>
  import(
    "../components/manage-supplier/Invoice/Proforma/ProformaInvoiceDetails"
  )
);
const SellerComplaintDetails = lazy(() =>
  import(
    "../components/manage-supplier/Support/Complaint/SellerComplaintDetails"
  )
);
const SellerFeedbackDetails = lazy(() =>
  import("../components/manage-supplier/Support/Feedback/SellerFeedbackDetails")
);
const TotalRequestList = lazy(() =>
  import("../components/dashboard/DashboardList/TotalRequestList")
);
const TotalApprovedRequest = lazy(() =>
  import("../components/dashboard/DashboardList/TotalApprovedRequest")
);
const TotalPO = lazy(() =>
  import("../components/dashboard/DashboardList/TotalPO")
);
const TotalActiveOrders = lazy(() =>
  import("../components/dashboard/DashboardList/TotalActiveOrders")
);
const TotalCompletedOrders = lazy(() =>
  import("../components/dashboard/DashboardList/TotalCompletedOrder")
);
const InquiriesDashList = lazy(() =>
  import("../components/dashboard/DashboardList/InquiriesDashList")
);
const TotalInquiriesRequest = lazy(() =>
  import("../components/dashboard/DashboardList/TotalInquiriesRequest")
);
const TotalOngoingInquiries = lazy(() =>
  import("../components/dashboard/DashboardList/TotalOngoingInquiries")
);
const ProductDetails = lazy(() =>
  import("../components/manage-products/ProductDetails/ProductDetails.jsx")
);
const ApprovedProducts = lazy(() =>
  import("../components/manage-products/Products/Product.js")
);
const ApprovedNewProducts = lazy(() =>
  import("../components/manage-products/Products/NewProducts.js")
);
const ApprovedSecondaryProducts = lazy(() =>
  import(
    "../components/manage-products/Products/SecondaryProducts.js"
  )
);
const NotificationList = lazy(() =>
  import("../components/shared-components/notification/NotificationList")
);
const Profile = lazy(() =>
  import("../components/shared-components/Profile/profile")
);
const BuyerEditProfile = lazy(() =>
  import("../components/manage-buyer/support/UpdateProfile/EditProfileList")
);
const BuyerEditProfileDetails = lazy(() =>
  import("../components/manage-buyer/support/UpdateProfile/EditProfileDetails")
);
const SupplierEditProfile = lazy(() =>
  import("../components/manage-supplier/Support/UpdateProfile/EditProfileList")
);
const SupplierEditProfileDetails = lazy(() =>
  import(
    "../components/manage-supplier/Support/UpdateProfile/EditProfileDetails"
  )
);
// Start supplier individual product routes
const Product = lazy(() => import("../components/manage-supplier/Product/List/Product.js"));
const NewProduct = lazy(() =>import("../components/manage-supplier/Product/List/NewProductList.js"));
const SecondaryProduct = lazy(() =>import("../components/manage-supplier/Product/List/SecondaryProductList.js"));
// const AddProduct = lazy(() =>import("../components/manage-supplier/Product/AddProduct/Addproduct.js"));
const PreviewFile = lazy(() =>import("../components/manage-supplier/Product/PreviewFile/PreviewFile.jsx"));
// End supplier individual product routes
const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export function NotificationProvider({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminIdSessionStorage = localStorage.getItem("admin_id");
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
      if (response?.code === 200) {
        setNotificationList(response.result.data);
        setCount(response.result.totalItems);
      } else {
      }
    });
  };

  const handleClick = (id, event) => {
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      notification_id: id,
      event,
      status: 1,
      usertype: "admin",
    };
    postRequestWithToken(
      "admin/update-notification-status",
      obj,
      (response) => {
        if (response?.code === 200) {
          setRefresh(true);
        } else {
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
      localStorage.clear();
      navigate("/admin/login");
    }
  }, [adminIdSessionStorage, adminIdLocalStorage, navigate]);

  useEffect(() => {
    localStorage.getItem("_id") &&
      dispatch(fetchUserData(localStorage.getItem("_id")));
  }, [localStorage.getItem("_id")]);

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
    element: (
      <Suspense fallback={<Loader />}>
        <Login socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/admin/",
    element: (
      <Suspense fallback={<Loader />}>
        <NotificationProvider>
          <Layout />
        </NotificationProvider>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Dashboard socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "preview-file",
        element: (
          <Suspense fallback={<Loader />}>
            <PreviewFile socket={socket} />
          </Suspense>
        ),
      },
    
      {
        path: "total-request-list",
        element: (
          <Suspense fallback={<Loader />}>
            <TotalRequestList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "inquiries-section",
        element: (
          <Suspense fallback={<Loader />}>
            <InquiriesDashList socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "request",
            element: (
              <Suspense fallback={<Loader />}>
                <TotalInquiriesRequest socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "ongoing",
            element: (
              <Suspense fallback={<Loader />}>
                <TotalOngoingInquiries socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
     
      {
        // path: "_id/edit",
        path: "edit-details/:userType/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <Edit socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<Loader />}>
            <Profile socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "notification-list",
        element: (
          <Suspense fallback={<Loader />}>
            <NotificationList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "total-approved-request",
        element: (
          <Suspense fallback={<Loader />}>
            <TotalApprovedRequest socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "total-PO",
        element: (
          <Suspense fallback={<Loader />}>
            <TotalPO socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "total-active-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <TotalActiveOrders socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "total-completed-order",
        element: (
          <Suspense fallback={<Loader />}>
            <TotalCompletedOrders socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-request",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerRequest socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "approved-buyer",
        element: (
          <Suspense fallback={<Loader />}>
            <ApprovedBuyer socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "rejected-buyer",
        element: (
          <Suspense fallback={<Loader />}>
            <RejectedBuyer socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-request-details/:buyerId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerRequestDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-details/:buyerId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-inquiry",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerInquiry socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "ongoing-inquiry",
            element: (
              <Suspense fallback={<Loader />}>
                <OngoingInquiry socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "purchased-order",
            element: (
              <Suspense fallback={<Loader />}>
                <PurchasedOrders socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "buyer-invoice",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerInvoice socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "paid",
            element: (
              <Suspense fallback={<Loader />}>
                <BuyerPaid socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "pending",
            element: (
              <Suspense fallback={<Loader />}>
                <BuyerPending socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "proforma",
            element: (
              <Suspense fallback={<Loader />}>
                <BuyerProforma socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "buyer-order",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerOrder socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "active",
            element: (
              <Suspense fallback={<Loader />}>
                <BuyerActiveOrder socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "complete",
            element: (
              <Suspense fallback={<Loader />}>
                <BuyerCompleteOrder socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "buyer-support",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerSupport socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "complaint",
            element: (
              <Suspense fallback={<Loader />}>
                <BuyerComplaint socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "enquiry",
            element: (
              <Suspense fallback={<Loader />}>
                <BuyerFeedback socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "edit-profile",
            element: (
              <Suspense fallback={<Loader />}>
                <BuyerEditProfile socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "buyer-edit-profile-details/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerEditProfileDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-transaction",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerTransaction socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-transaction-details/:invoiceId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerTransactionDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "ongoing-inquiries-details/:inquiryId",
        element: (
          <Suspense fallback={<Loader />}>
            <OngoingInquiryDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-purchased-order-details/:purchaseOrderId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerPurchasedOrderDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "order-details/:orderId",
        element: (
          <Suspense fallback={<Loader />}>
            <OrderDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-invoice-details/:invoiceId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerInvoiceDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-proforma-details/:orderId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerProformaDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-complaint-details/:supportId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerComplaintDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-enquiry-details/:supportId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerFeedbackDetails socket={socket} />
          </Suspense>
        ),
      },
      // start the seller routes
      {
        path: "supplier-request",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerRequest socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "approved-supplier",
        element: (
          <Suspense fallback={<Loader />}>
            <ApprovedSeller socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "rejected-supplier",
        element: (
          <Suspense fallback={<Loader />}>
            <RejectedSeller socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-transaction",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerTransaction socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-inquiry",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerInquiry socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "inquiry-request",
            element: (
              <Suspense fallback={<Loader />}>
                <InquiryRequest socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "purchased-order",
            element: (
              <Suspense fallback={<Loader />}>
                <SellerPurchasedOrder socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "supplier-order",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerOrder socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "active",
            element: (
              <Suspense fallback={<Loader />}>
                <SellerActiveOrder socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "complete",
            element: (
              <Suspense fallback={<Loader />}>
                <SellerCompleteOrder socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "supplier-invoice",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerInvoice socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "paid",
            element: (
              <Suspense fallback={<Loader />}>
                <SellerPaid socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "pending",
            element: (
              <Suspense fallback={<Loader />}>
                <SellerPending socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "proforma",
            element: (
              <Suspense fallback={<Loader />}>
                <SellerProforma socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "supplier-support",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerSupport socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "complaint",
            element: (
              <Suspense fallback={<Loader />}>
                <SellerComplaint socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "enquiry",
            element: (
              <Suspense fallback={<Loader />}>
                <SellerFeedback socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "edit-profile",
            element: (
              <Suspense fallback={<Loader />}>
                <SupplierEditProfile socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "supplier-edit-profile-details/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <SupplierEditProfileDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-request-details/:supplierId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerRequestDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-details/:supplierId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-transaction-details/:invoiceId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerTransactionDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-inquiry-details/:inquiryId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerInquiryDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-purchased-order-details/:purchaseOrderId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerPurchasedOrderDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-order-details/:orderId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerOrderDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-invoice-details/:invoiceId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerInvoiceDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "proforma-invoice-details/:orderId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerProformaDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-complaint-details/:supportId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerComplaintDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-enquiry-details/:supportId",
        element: (
          <Suspense fallback={<Loader />}>
            <SellerFeedbackDetails socket={socket} />
          </Suspense>
        ),
      },
      // start the product request
      {
        path: "products",
        element: (
          <Suspense fallback={<Loader />}>
            <ApprovedProducts socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "new",
            element: (
              <Suspense fallback={<Loader />}>
                <ApprovedNewProducts socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "secondary",
            element: (
              <Suspense fallback={<Loader />}>
                <ApprovedSecondaryProducts socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "product-details/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductDetails socket={socket} />
          </Suspense>
        ),
      },

  // start Supplier product section
  {
    path: "supplier/:supplierId/products",
    element: (
      <Suspense fallback={<Loader />}>
        <Product socket={socket} />
      </Suspense>
    ),
    children: [
      {
        path: "new",
        element: (
          <Suspense fallback={<Loader />}>
            <NewProduct socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "secondary",
        element: (
          <Suspense fallback={<Loader />}>
            <SecondaryProduct socket={socket} />
          </Suspense>
        ),
      },
    ],
  },
  // {
  //   path: "add-product",
  //   element: (
  //     <Suspense fallback={<Loader />}>
  //       <AddProduct socket={socket} />
  //     </Suspense>
  //   ),
  // },
 
 // end Supplier product section
      
     
    ],
  },
]);
function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
