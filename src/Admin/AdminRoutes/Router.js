import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate, Outlet } from "react-router-dom";
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
// End supplier individual product routes
const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export function AdminNotificationProvider({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");

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
      localStorage?.clear();
      navigate("/admin/login");
    }
  }, [adminIdSessionStorage, adminIdLocalStorage, navigate]);

  useEffect(() => {
    localStorage?.getItem("_id") &&
      dispatch(fetchUserData(localStorage?.getItem("_id")));
  }, [localStorage?.getItem("_id")]);

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
function Router() {
  return <div>{<Outlet />}</div>;
}

export default Router;
