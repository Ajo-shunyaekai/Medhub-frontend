// Import dependencies
import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import io from "socket.io-client";
import { postRequestWithToken } from "../api/Requests";
import { fetchUserData } from "../../redux/reducers/userDataSlice";
import { useDispatch } from "react-redux";

// Lazy-load the components
const SupplierSidebar = lazy(() =>
  import("../components/SharedComponents/Sidebar/SupSidebar")
);

const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const SupplierNotificationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
  const supplierIdLocalStorage = localStorage?.getItem("supplier_id");
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
      if (response?.code === 200) {
        setNotificationList(response.result.data);
        setCount(response.result.totalItems);
      } else {
      }
    });
  };

  const fetchInvoiceCount = () => {
    const obj = {
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
    };
    postRequestWithToken("supplier/get-invoice-count", obj, (response) => {
      if (response?.code === 200) {
        setInvoiceCount(response.result);
      } else {
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
        if (response?.code === 200) {
          setRefresh(true);
        } else {
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
      localStorage?.clear();
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

function Router() {
  return <div>{<Outlet />}</div>;
}

export default Router;
