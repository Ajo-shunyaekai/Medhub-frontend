import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  Suspense,
  lazy,
  useRef, 
  useCallback
} from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { postRequestWithToken } from "../../api/Requests";
import io from "socket.io-client";
 
import { fetchUserData } from "../../redux/reducers/userDataSlice";
import { useDispatch } from "react-redux";
import Loader from "../components/SharedComponents/Loader/Loader";
import LogisticsAddress from "../components/Orders/OrderDetails/BuyerLogistics/LogisticsAddress"
import LogisticsAddNewAddress from "../components/Orders/OrderDetails/BuyerLogistics/AddNewAddress";
import LogisticsEditNewAddress from "../components/Orders/OrderDetails/BuyerLogistics/EditNewAddress";
// import socket from '../../utils/Socket.js'
// Lazy-load the components
const Sidebar = lazy(() =>
  import("../components/SharedComponents/Sidebar/Sidebar")
);
const Layout = lazy(() => import("../components/SharedComponents/layout"));
const Login = lazy(() => import("../components/SharedComponents/Login/Login"));
const SignUp = lazy(() =>
  import("../components/SharedComponents/SignUp/SignUp")
);
const Dashboard = lazy(() => import("../components/Dashboard/index"));
const Buy = lazy(() => import("../components/Buy/index"));
const Inquiry = lazy(() => import("../components/Inquiry/index"));
const Order = lazy(() => import("../components/Orders/index"));
const MySupplier = lazy(() => import("../components/MySuppliers/index"));

const Invoice = lazy(() => import("../components/Invoice/index"));
const Support = lazy(() => import("../components/Support/index"));
const BySupplier = lazy(() => import("../components/Buy/BySupplier/BySupplier"));
const ByProduct = lazy(() => import("../components/Buy/ByProduct/BuyProduct"));

const Subscription = lazy(() => import("../components/Subscription/Subscription.js"));
const CurrentPlan = lazy(() => import("../components/Subscription/Plan.js"));
const TransactionHistory = lazy(() => import("../components/Subscription/TransactionHistory.js"));


const SecondaryMarket = lazy(() =>
  import("../components/Buy/SecondaryMarket/Buy2ndMarket")
);
const SupplierDetails = lazy(() =>
  import("../components/Buy/BySupplier/SupplierDetails")
);

// const SearchMarketProductDetails = lazy(() =>
//   import("../components/Buy/SecondaryMarket/SearchMarketProductDetails")
// );
const OnGoingOrder = lazy(() =>
  import("../components/Inquiry/Inquiry/OnGoingOrder")
);
const PurchasedOrder = lazy(() =>
  import("../components/Inquiry/PurchasedOrder/PurchasedOrder")
);
const ActiveOrder = lazy(() =>
  import("../components/Orders/ActiveOrders/ActiveOrder")
);
const CompletedOrders = lazy(() =>
  import("../components/Orders/CompletedOrders/CompleteOrder")
);
const PendingInvoice = lazy(() =>
  import("../components/Invoice/Pending/PendingInvoice")
);
const PaidInvoice = lazy(() =>
  import("../components/Invoice/Paid/CompleteInvoice")
);
const ProformaInvoice = lazy(() =>
  import("../components/Invoice/Proforma/ProformaInvoice")
);
const OnGoingInquiriesList = lazy(() =>
  import("../components/Dashboard/DashboardList/OngoingInquiriesList")
);
const PurchasedOrdersList = lazy(() =>
  import("../components/Dashboard/DashboardList/PurchasedOrdersList")
);
const ActiveOrders = lazy(() =>
  import("../components/Dashboard/DashboardList/ActiveOrders")
);
const CompletedOrder = lazy(() =>
  import("../components/Dashboard/DashboardList/CompletedOrders")
);
const CompleteInvoicesList = lazy(() =>
  import("../components/Dashboard/DashboardList/CompleteInvoicesList")
);
const PendingInvoicesList = lazy(() =>
  import("../components/Dashboard/DashboardList/PendingInvoicesList")
);
const ProductDetails = lazy(() =>
  import("../components/Buy/Details/ProductDetails.js")
);
const SimilarProducts = lazy(() =>
  import("../components/Buy/UiShared/ProductCards/ProductCard.js")
);
const OtherSupplier = lazy(() =>
  import("../components/Buy/Details/SupplierMedicineCard.js")
);
const SearchProductDetails = lazy(() =>
  import("../components/Buy/Details/SearchProductDetails.js")
);
// const MarketProductDetails = lazy(() =>
//   import("../components/Buy/SecondaryMarket/MarketProductDetails")
// );
const OnGoingInquiriesDetails = lazy(() =>
  import("../components/Inquiry/Inquiry/OnGoingInquiriesDetails")
);
const CancelInquiryList = lazy(() =>
  import("../components/Inquiry/Inquiry/CancelnquiryList")
);
const PurchaseOrderDetails = lazy(() =>
  import("../components/Inquiry/PurchasedOrder/PurchasedOrderDetails")
);
const CreatePO = lazy(() =>
  import("../components/Inquiry/PurchasedOrder/CreatePO")
);
const EditCreatePO = lazy(() =>
  import("../components/Inquiry/PurchasedOrder/EditCreatePO")
);
const OrderDetails = lazy(() =>
  import("../components/Orders/OrderDetails/OrderDetails")
);
const InvoiceDesign = lazy(() => import("../components/Invoice/invoiceDesign"));
const PerformaInvoiceDetails = lazy(() =>
  import("../components/Invoice/ProformaInvoiceDetails")
);
const SendInquiry = lazy(() =>
  import("../components/Buy/SendInquiry/SendInquiry")
);
const ThankYou = lazy(() => import("../components/Buy/SendInquiry/ThankYou"));
const NotificationList = lazy(() =>
  import("../components/SharedComponents/Notification/NotificationList")
);
const SupplyProductList = lazy(() =>
  import("../components/Buy/BySupplier/SupplyProductList")
);
const SupplyOrderList = lazy(() =>
  import("../components/Buy/BySupplier/SupplyOrderList")
);
const SupplySecondaryList = lazy(() =>
  import("../components/Buy/BySupplier/SupplySecondaryList")
);
const SupplierCompleted = lazy(() =>
  import("../components/supplier/SuplierCompleted")
);
const SupplierActive = lazy(() =>
  import("../components/supplier/SupplierActive")
);
// const SupplierPending = lazy(() =>
//   import("../components/supplier/SupplierPending")
// );
const Profile = lazy(() =>
  import("../components/SharedComponents/Profile/profile")
);
const PrivacyPolicy = lazy(() => import("../../Policies/PrivcyPolicy"));
const TermsConditions = lazy(() => import("../../Policies/Terms&Conditions"));
const ForgotPassword = lazy(() =>
  import("../components/SharedComponents/Login/ForgotPassword")
);
const EditProfile = lazy(() =>
  import("../components/SharedComponents/Profile/EditProfile")
);
const LogisticsForm = lazy(() =>
  import("../components/Orders/OrderDetails/BuyerLogistics/LogisticsForm")
);
const SubscriptionInvoiceDetails = lazy(() =>
  import("../components/Subscription/SubscriptionInvoiceDetails.js")
);
const Error = lazy(() =>
  import("../components/SharedComponents/Error/Error.jsx")
);
// const socket = io.connect(process.env.REACT_APP_SERVER_URL);

const socket = io.connect(process.env.REACT_APP_SERVER_URL, {
  autoConnect: false,
});
 
export function NotificationProvider({ children }) {
  const dispatch = useDispatch();
  const buyerIdSessionStorage = localStorage.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage.getItem("buyer_id");
  const [notificationList, setNotificationList] = useState([]);
  const [count, setCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const buyerId =
    localStorage.getItem("buyer_id") || localStorage.getItem("buyer_id");
 
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
      if (response?.code === 200) {
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
      if (response?.code === 200) {
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
      usertype: "buyer",
    };
    postRequestWithToken(
      "buyer/update-notification-status",
      obj,
      (response) => {
        if (response?.code === 200) {
          // setRefresh(true);
          fetchNotifications(); // Refresh notifications after updating
        } else {
          console.error("Error updating notification status");
        }
      }
    );
  };
 
  useEffect(() => {
    if (!buyerId && location.pathname !== "/buyer/sign-up") {
      navigate("/buyer/login");
    }
  }, [buyerId, location.pathname]);
 
  // useEffect(() => {
  //   if (buyerId) {
  //     socket.emit("registerBuyer", buyerId);
 
  //     fetchNotifications();
  //     fetchInvoiceCount();
 
  //     const notificationEvents = [
  //       { event: "enquiryQuotation", title: "New Quote Received" },
  //       { event: "orderCreated", title: "Order Created" },
  //       {
  //         event: "shipmentDetailsSubmission",
  //         title: "Shipment Details Submitted",
  //       },
  //       { event: "invoiceCreated", title: "Invoice Created" },
  //       {
  //         event: "editProfileRequestUpdated",
  //         title: "Profile Edit Request Updated",
  //       },
  //     ];
 
  //     notificationEvents.forEach(({ event, title }) => {
  //       socket.on(event, (message) => {
  //         const link = `${process.env.REACT_APP_BUYER_URL}/notification-list`;
  //         showNotification(
  //           title,
  //           { body: message, icon: "/path/to/logo.png" },
  //           link
  //         );
  //         fetchNotifications();
  //       });
  //     });
 
  //     return () => {
  //       notificationEvents.forEach(({ event }) => {
  //         socket.off(event);
  //       });
  //     };
  //   }
  // }, [buyerId, refresh]);


  useEffect(() => {
    if (!buyerId) return;

    // Ensure socket is connected only once
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("registerBuyer", buyerId);

    fetchNotifications();
    fetchInvoiceCount();

    const notificationEvents = [
      { event: "enquiryQuotation", title: "New Quote Received" },
      { event: "orderCreated", title: "Order Created" },
      { event: "shipmentDetailsSubmission", title: "Shipment Details Submitted" },
      { event: "invoiceCreated", title: "Invoice Created" },
      { event: "editProfileRequestUpdated", title: "Profile Edit Request Updated" },
    ];

    const handleSocketEvent = (title) => (message) => {
      const link = `${process.env.REACT_APP_BUYER_URL}/notification-list`;
      showNotification(title, { body: message, icon: "/path/to/logo.png" }, link);
      fetchNotifications();
    };

    notificationEvents.forEach(({ event, title }) => {
      socket.on(event, handleSocketEvent(title));
    });

    return () => {
      socket.disconnect(); 
      notificationEvents.forEach(({ event }) => {
        socket.off(event);
      });
    };
  }, [buyerId]);
 
  useEffect(() => {
    localStorage.getItem("_id") &&
      dispatch(fetchUserData(localStorage.getItem("_id")));
  }, [localStorage.getItem("_id")]);
 
  return (
    <Sidebar
      invoiceCount={invoiceCount}
      notificationList={notificationList}
      count={count}
      handleClick={handleClick}
    >
      {children}
    </Sidebar>
  );
}


 
// Routes
const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: (
  //     <Suspense fallback={<Loader />}>
  //       <Navigate to="/buyer" replace />
  //     </Suspense>
  //   ),
  // },
  {
    path: "/buyer/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/buyer/forgot-password",
    element: (
      <Suspense fallback={<Loader />}>
        <ForgotPassword socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/buyer/sign-up",
    element: (
      <Suspense fallback={<Loader />}>
        <SignUp socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/buyer/privacy-policy",
    element: (
      <Suspense fallback={<Loader />}>
        <PrivacyPolicy socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/buyer/terms-and-conditions",
    element: (
      <Suspense fallback={<Loader />}>
        <TermsConditions socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "/buyer",
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
        path: "edit-profile/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <EditProfile socket={socket} />
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
        path: "ongoing-inquiries-list",
        element: (
          <Suspense fallback={<Loader />}>
            <OnGoingInquiriesList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "purchased-orders-list",
        element: (
          <Suspense fallback={<Loader />}>
            <PurchasedOrdersList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "active-orders",
        element: (
          <Suspense fallback={<Loader />}>
            <ActiveOrders socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "completed-order",
        element: (
          <Suspense fallback={<Loader />}>
            <CompletedOrder socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "complete-invoices-list",
        element: (
          <Suspense fallback={<Loader />}>
            <CompleteInvoicesList socket={socket} />
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
        path: "buy",
        element: (
          <Suspense fallback={<Loader />}>
            <Buy socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "suppliers",
            element: (
              <Suspense fallback={<Loader />}>
                <BySupplier socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "new-products",
            element: (
              <Suspense fallback={<Loader />}>
                <ByProduct socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "secondary-market",
            element: (
              <Suspense fallback={<Loader />}>
                <SecondaryMarket socket={socket} />
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
        children: [
          {
            path: "similar-products",
            element: (
              <Suspense fallback={<Loader />}>
                <SimilarProducts socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "other-supplier",
            element: (
              <Suspense fallback={<Loader />}>
                <OtherSupplier socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "search-product-details/:id",  
        element: (
          <Suspense fallback={<Loader />}>
            <SearchProductDetails socket={socket} />
          </Suspense>
        ),
      },
      
      // {
      //   path: "market-product-details/:medicineId",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <MarketProductDetails socket={socket} />
      //     </Suspense>
      //   ),
      // },
      {
        path: "supplier-details/:supplierId",
        element: (
          <Suspense fallback={<Loader />}>
            <SupplierDetails socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "products",
            element: (
              <Suspense fallback={<Loader />}>
                <SupplyProductList socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "secondary",
            element: (
              <Suspense fallback={<Loader />}>
                <SupplySecondaryList socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "orders",
            element: (
              <Suspense fallback={<Loader />}>
                <SupplyOrderList socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
 
      // {
      //   path: "search-product-details/:medicineId",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <SearchProductDetails socket={socket} />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: "search-market-product-details/:medicineId",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <SearchMarketProductDetails socket={socket} />
      //     </Suspense>
      //   ),
      // },
      {
        path: "send-inquiry",
        element: (
          <Suspense fallback={<Loader />}>
            <SendInquiry socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "inquiry",
        element: (
          <Suspense fallback={<Loader />}>
            <Inquiry socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "inquiry",
            element: (
              <Suspense fallback={<Loader />}>
                <OnGoingOrder socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "purchased-order",
            element: (
              <Suspense fallback={<Loader />}>
                <PurchasedOrder socket={socket} />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "create-po/:inquiryId",
        element: (
          <Suspense fallback={<Loader />}>
            <CreatePO socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "edit-create-po/:purchaseOrderId",
        element: (
          <Suspense fallback={<Loader />}>
            <EditCreatePO socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "cancel-inquiry-list/:inquiryId",
        element: (
          <Suspense fallback={<Loader />}>
            <CancelInquiryList socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "ongoing-inquiries-details/:inquiryId",
        element: (
          <Suspense fallback={<Loader />}>
            <OnGoingInquiriesDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "purchased-order-details/:purchaseOrderId",
        element: (
          <Suspense fallback={<Loader />}>
            <PurchaseOrderDetails socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "order",
        element: (
          <Suspense fallback={<Loader />}>
            <Order socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "active-orders",
            element: (
              <Suspense fallback={<Loader />}>
                <ActiveOrder socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "completed-orders",
            element: (
              <Suspense fallback={<Loader />}>
                <CompletedOrders socket={socket} />
              </Suspense>
            ),
          },
        ],
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
        path: "my-supplier",
        element: (
          <Suspense fallback={<Loader />}>
            <MySupplier socket={socket} />
          </Suspense>
        ),
      },
      // Start the subscription section
      {
        path: "subscription",
        element: (
          <Suspense fallback={<Loader />}>
            <Subscription socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "current-plan",
            element: (
              <Suspense fallback={<Loader />}>
                <CurrentPlan socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "transaction-history",
            element: (
              <Suspense fallback={<Loader />}>
                <TransactionHistory socket={socket} />
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
      // End the subscription section
      {
        path: "invoice",
        element: (
          <Suspense fallback={<Loader />}>
            <Invoice socket={socket} />
          </Suspense>
        ),
        children: [
          {
            path: "pending-invoice",
            element: (
              <Suspense fallback={<Loader />}>
                <PendingInvoice socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "paid-invoice",
            element: (
              <Suspense fallback={<Loader />}>
                <PaidInvoice socket={socket} />
              </Suspense>
            ),
          },
          {
            path: "proforma-invoice",
            element: (
              <Suspense fallback={<Loader />}>
                <ProformaInvoice socket={socket} />
              </Suspense>
            ),
          },
        ],
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
            <PerformaInvoiceDetails socket={socket} />
          </Suspense>
        ),
      },
 
      {
        path: "support",
        element: (
          <Suspense fallback={<Loader />}>
            <Support socket={socket} />
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
        path: "supplier-completed/:supplierId",
        element: (
          <Suspense fallback={<Loader />}>
            <SupplierCompleted socket={socket} />
          </Suspense>
        ),
      },
      {
        path: "supplier-active/:supplierId",
        element: (
          <Suspense fallback={<Loader />}>
            <SupplierActive socket={socket} />
          </Suspense>
        ),
      },
      // {
      //   path: "supplier-pending/:supplierId",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <SupplierPending socket={socket} />
      //     </Suspense>
      //   ),
      // },
      {
        path: "logistics-form/:orderId/:buyerId",
        element: (
          <Suspense fallback={<Loader />}>
            <LogisticsForm socket={socket} />
          </Suspense>
        ),
      },
      {
        path:"add-new-address/:orderId/:buyerId",
        element:<LogisticsAddNewAddress/>
      },
      {
        path:"edit-new-address/:orderId/:buyerId/:addressId",
        element:<LogisticsEditNewAddress/>
      },
      {
        path:"logistics-address/:orderId/:buyerId",
        element:<LogisticsAddress/>
      }
    ],
  },
  {
    path: "/buyer/thank-you",
    element: (
      <Suspense fallback={<Loader />}>
        <ThankYou socket={socket} />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loader />}>
        <Error socket={socket} />
      </Suspense>
    ),
  }
]);
 
function Router() {
  return <RouterProvider router={router} />;
}
 
export default Router;