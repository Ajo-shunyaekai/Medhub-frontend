// Import dependencies
import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import io from "socket.io-client";
import Loader from "../components/SharedComponents/Loader/Loader";
import { postRequestWithToken } from "../api/Requests";
import { fetchUserData } from "../../redux/reducers/userDataSlice";
import { useDispatch } from "react-redux";
import SuuplierAddressList from "../components/Orders/SupplierLogistics/SupplierLogisticsAddress"
import AddNewAddress from "../components/Orders/SupplierLogistics/SupplierAddAddress"
import EditNewAddress from "../components/Orders/SupplierLogistics/SupplierEditAddress"
 
// Lazy-load the components
const SupplierSidebar = lazy(() =>
  import("../components/SharedComponents/Sidebar/SupSidebar")
);
const SuccessModal = lazy(() =>
  import("../components/SharedComponents/Signup/SuccessModal")
);
const Layout = lazy(() => import("../components/SharedComponents/Layout"));
const Login = lazy(() =>
  import("../components/SharedComponents/Signup/SupplierLogin")
);
const Signup = lazy(() =>
  import("../components/SharedComponents/Signup/SupplierSignUp")
);
const Dashboard = lazy(() => import("../components/Dashboard/index"));
const Inquiry = lazy(() =>
  import("../components/Inquiry/InquiryPurchaseOrders")
);
const InquiryRequest = lazy(() =>
  import("../components/Inquiry/InquiryRequest/OnGoingOrder")
);
const PurchasedOrder = lazy(() =>
  import("../components/Inquiry/PurchasedOrder/PurchasedOrder")
);
const Invoices = lazy(() => import("../components/Invoices/Invoice"));
const PendingInvoice = lazy(() =>
  import("../components/Invoices/PendingInvoices/PendingInvoice")
);
const PaidInvoice = lazy(() =>
  import("../components/Invoices/PaidInvoices/CompleteInvoice")
);
const ProformaList = lazy(() =>
  import("../components/Invoices/ProformaInvoices/ProformaList")
);
const Orders = lazy(() => import("../components/Orders/Order"));
const ActiveOrder = lazy(() =>
  import("../components/Orders/ActiveOrders/ActiveOrder")
);
const CompleteOrder = lazy(() =>
  import("../components/Orders/CompletedOrders/CompleteOrder")
);
const Products = lazy(() => import("../components/Products/NewProducts/Product.js"));
const NewProducts = lazy(() =>
  import("../components/Products/NewProducts/NewProduct")
);
const SecondaryMarket = lazy(() =>
  import("../components/Products/NewProducts/SecondaryMarket.js")
);
const Support = lazy(() => import("../components/Support/Support"));
const AddProduct = lazy(() => import("../components/Products/AddProduct/AddProduct.js"));
const ProductDetails = lazy(() =>
  import("../components/Products/ProductDetails/ProductDetails.js")
);
const EditProduct = lazy(() => import("../components/Products/AddProduct/EditAddProduct.js"));
const InquiryRequestDetails = lazy(() =>
  import("../components/Inquiry/InquiryRequest/InquiryRequestDetails")
);
const PurchasedOrderDetails = lazy(() =>
  import("../components/Inquiry/PurchasedOrder/PurchasedOrderDetails")
);
const ProformaInvoice = lazy(() =>
  import("../components/Invoices/ProformaInvoices/ProformaInvoice")
);
const ActiveOrderDetails = lazy(() =>
  import("../components/Orders/ActiveOrdersDetails")
);
const InvoiceDesign = lazy(() =>
  import("../components/Invoices/InvoiceDesign")
);
const ProformaInvoiceDetails = lazy(() =>
  import("../components/Invoices/ProformaInvoices/ProformaDetailsPage")
);
const CreateInvoice = lazy(() =>
  import("../components/Invoices/CreateInvoice")
);
const BuyerDetails = lazy(() => import("../components/Products/ProductDetails/BuyerDetails.js"));
const InquiryRequestList = lazy(() =>
  import("../components/Dashboard/DashboardList/InquiryRequestList")
);
const PurchasedOrderList = lazy(() =>
  import("../components/Dashboard/DashboardList/PurchasedOrdersList")
);
const ActiveOrders = lazy(() =>
  import("../components/Dashboard/DashboardList/DashboardOngoing")
);
const CompletedOrder = lazy(() =>
  import("../components/Dashboard/DashboardList/CompletedOrders")
);
const PendingInvoicesList = lazy(() =>
  import("../components/Dashboard/DashboardList/PendingInvoicesList")
);
const CompletedInvoicesList = lazy(() =>
  import("../components/Dashboard/DashboardList/CompletedInvoicesList")
);
const BuyerCompletedList = lazy(() =>
  import("../components/Products/Buyer/BuyerCompletedList")
);
const BuyerActiveList = lazy(() =>
  import("../components/Products/Buyer/BuyerActiveList")
);
const BuyerPendingList = lazy(() =>
  import("../components/Products/Buyer/BuyerPendingList")
);
const NotificationList = lazy(() =>
  import("../components/SharedComponents/Notification/NotificationList")
);
const Subscription = lazy(() => import("../components/Subscription/Subscription"));
const TransactionHistory = lazy(() => import("../components/Subscription/TransactionHistory"));
const Plan = lazy(() => import("../components/Subscription/Plan"));
const SubscriptionInvoiceDetails = lazy(() => import("../components/Subscription/SubscriptionInvoiceDetails.js"));
const Profile = lazy(() =>
  import("../components/SharedComponents/Profile/profile")
);
const PrivacyPolicy = lazy(() => import("../../Policies/PrivcyPolicy"));
const TermsConditions = lazy(() => import("../../Policies/Terms&Conditions"));
const ForgotPassword = lazy(() =>
  import("../components/SharedComponents/Signup/ForgotPassword")
);
const EditProfile = lazy(() =>
  import("../components/SharedComponents/Profile/EditProfile")
);
const SupplierLogistics = lazy(() => 
  import("../components/Orders/SupplierLogistics/SupplierLogistics")
)
 
const socket = io.connect(process.env.REACT_APP_SERVER_URL);
 
export const NotificationProvider = ({ children }) => {
  const dispatch = useDispatch();
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
    const obj = {
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
    };
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
    const obj = {
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
    };
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
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
      usertype: "supplier",
    };
    postRequestWithToken(
      "supplier/update-notification-status",
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
    if (
      !supplierIdSessionStorage &&
      !supplierIdLocalStorage &&
      location.pathname !== "/supplier/sign-up"
    ) {
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
        {
          event: "editProfileRequestUpdated",
          title: "Profile Edit Request Updated",
        },
        {
          event: "addMedicineRequestUpdated",
          title: "Update on Add Medicine Request",
        },
        {
          event: "editMedicineRequestUpdated",
          title: "Update on Edit Medicine Request",
        },
      ];
 
      notificationEvents.forEach(({ event, title }) => {
        socket.on(event, (message) => {
          const enquiryLink = `${process.env.REACT_APP_SUPPLIER_URL}/notification-list`;
          showNotification(
            title,
            { body: message, icon: "/path/to/logo.png" },
            enquiryLink
          );
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
    <SupplierSidebar
      invoiceCount={invoiceCount}
      notificationList={notificationList}
      count={count}
      handleClick={handleClick}
    >
      {children}
    </SupplierSidebar>
  );
};
 
const router = createBrowserRouter([
  {
    path: "/supplier/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/supplier/sign-up",
    element: (
      <Suspense fallback={<Loader />}>
        <Signup socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/supplier/forgot-password",
    element: (
      <Suspense fallback={<Loader />}>
        <ForgotPassword socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/supplier/privacy-policy",
    element: (
      <Suspense fallback={<Loader />}>
        <PrivacyPolicy socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/supplier/terms-and-conditions",
    element: (
      <Suspense fallback={<Loader />}>
        <TermsConditions socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/supplier",
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
        path: "product",
        element: (
          <Suspense fallback={<Loader />}>
            <Products socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "newproduct",
            element: (
              <Suspense fallback={<Loader />}>
                <NewProducts socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "secondarymarket",
            element: (
              <Suspense fallback={<Loader />}>
                <SecondaryMarket socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "inquiry-request-list",
        element: (
          <Suspense fallback={<Loader />}>
            <InquiryRequestList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "purchased-orders-list",
        element: (
          <Suspense fallback={<Loader />}>
            <PurchasedOrderList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "ongoing-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <ActiveOrders socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "completed-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <CompletedOrder socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "pending-invoices-list",
        element: (
          <Suspense fallback={<Loader />}>
            <PendingInvoicesList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "completed-invoices-list",
        element: (
          <Suspense fallback={<Loader />}>
            <CompletedInvoicesList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "inquiry-purchase-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <Inquiry socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "ongoing",
            element: (
              <Suspense fallback={<Loader />}>
                <InquiryRequest socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "purchased",
            element: (
              <Suspense fallback={<Loader />}>
                <PurchasedOrder socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "invoice",
        element: (
          <Suspense fallback={<Loader />}>
            <Invoices socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "pending",
            element: (
              <Suspense fallback={<Loader />}>
                <PendingInvoice socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "paid",
            element: (
              <Suspense fallback={<Loader />}>
                <PaidInvoice socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "proforma",
            element: (
              <Suspense fallback={<Loader />}>
                <ProformaList socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "order",
        element: (
          <Suspense fallback={<Loader />}>
            <Orders socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "active",
            element: (
              <Suspense fallback={<Loader />}>
                <ActiveOrder socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "completed",
            element: (
              <Suspense fallback={<Loader />}>
                <CompleteOrder socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "add-product",
        element: (
          <Suspense fallback={<Loader />}>
            <AddProduct socket={socket} />
          </Suspense>
        ),
      },
      {
        // path: "product-details/:medicineId",
        path: "product-details",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        // path: "edit-product/:medicineId",
        path: "edit-product",
        element: (
          <Suspense fallback={<Loader />}>
            <EditProduct socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "inquiry-request-details/:inquiryId",
        element: (
          <Suspense fallback={<Loader />}>
            <InquiryRequestDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "purchased-order-details/:purchaseOrderId",
        element: (
          <Suspense fallback={<Loader />}>
            <PurchasedOrderDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "proforma-invoice/:purchaseOrderId",
        element: (
          <Suspense fallback={<Loader />}>
            <ProformaInvoice socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "active-orders-details/:orderId",
        element: (
          <Suspense fallback={<Loader />}>
            <ActiveOrderDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "invoice-design/:invoiceId",
        element: (
          <Suspense fallback={<Loader />}>
            <InvoiceDesign socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "proforma-invoice-details/:orderId",
        element: (
          <Suspense fallback={<Loader />}>
            <ProformaInvoiceDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "create-invoice/:orderId",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateInvoice socket={socket} />
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
        path: "buyer-completed-list/:buyerId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerCompletedList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-active-list/:buyerId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerActiveList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "buyer-pending-list/:buyerId",
        element: (
          <Suspense fallback={<Loader />}>
            <BuyerPendingList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "Support",
        element: (
          <Suspense fallback={<Loader />}>
            <Support socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "subscription",
        element: (
          <Suspense fallback={<Loader />}>
            <Subscription socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "transaction-history",
            element: (
              <Suspense fallback={<Loader />}>
                <TransactionHistory socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "current-plan",
            element: (
              <Suspense fallback={<Loader />}>
                <Plan socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "subscription-invoice-details",
        element: (
          <Suspense fallback={<Loader />}>
            <SubscriptionInvoiceDetails socket={socket} />
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
        path: "profile/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <Profile socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "edit-profile/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <EditProfile socket={socket} />
          </Suspense>
        ),
      },
      {
        path:"logistics-form/:orderId/:supplierId",
        element:(
          <Suspense fallback={<Loader />}>
            <SupplierLogistics socket={socket}/>
          </Suspense>
        )
      },
      {
        path:"add-new-address/:orderId/:supplierId",
        element:<AddNewAddress/>
      },
      {
        path:"edit-new-address/:orderId/:supplierId/:addressId",
        element:<EditNewAddress/>
      },
      {
        path:"logistics-address/:orderId/:supplierId",
        element:<SuuplierAddressList/>
      },
    ],
  },
  {
    path: "/supplier/sign-up",
    element: (
      <Suspense fallback={<Loader />}>
        <SuccessModal socket={socket} />
      </Suspense>
    ),
  },
]);
function Router() {
  return <RouterProvider router={router} />;
}
 
export default Router;