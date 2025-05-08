import React, { useEffect, useState, lazy } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { postRequestWithToken } from "../../api/Requests";
import io from "socket.io-client";

import { fetchUserData } from "../../redux/reducers/userDataSlice";
import { useDispatch } from "react-redux";
const Sidebar = lazy(() =>
  import("../components/SharedComponents/Sidebar/Sidebar")
);
const socket = io.connect(process.env.REACT_APP_SERVER_URL, {
  autoConnect: false,
});

export function BuyerNotificationProvider({ children }) {
  const dispatch = useDispatch();
  const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
  const buyerIdLocalStorage = localStorage?.getItem("buyer_id");
  const [notificationList, setNotificationList] = useState([]);
  const [count, setCount] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const buyerId =
    localStorage?.getItem("buyer_id") || localStorage?.getItem("buyer_id");

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
      localStorage?.clear();
      navigate("/buyer/login");
    }
  }, [buyerId, location.pathname]);
  useEffect(() => {
    if (!buyerId) return;
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("registerBuyer", buyerId);

    fetchNotifications();
    fetchInvoiceCount();

    const notificationEvents = [
      { event: "enquiryQuotation", title: "New Quote Received" },
      { event: "orderCreated", title: "Order Created" },
      {
        event: "shipmentDetailsSubmission",
        title: "Shipment Details Submitted",
      },
      { event: "invoiceCreated", title: "Invoice Created" },
      {
        event: "editProfileRequestUpdated",
        title: "Profile Edit Request Updated",
      },
    ];

    const handleSocketEvent = (title) => (message) => {
      const link = `${process.env.REACT_APP_BUYER_URL}/notification-list`;
      showNotification(
        title,
        { body: message, icon: "/path/to/logo.png" },
        link
      );
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
    localStorage?.getItem("_id") &&
      dispatch(fetchUserData(localStorage?.getItem("_id")));
  }, [localStorage?.getItem("_id")]);

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

function Router() {
  return <div>{<Outlet />}</div>;
}

export default Router;
