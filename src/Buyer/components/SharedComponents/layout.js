import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../SharedComponents/Sidebar/Sidebar";

function Layout() {
  // State to manage notifications
  const [notificationList, setNotificationList] = useState([]);
  const [count, setCount] = useState(0);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Make sure to replace with the correct API endpoint
        const response = await fetch("/api/get-notification-list"); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Check if data exists and has the necessary properties
        if (data && data.notifications) {
          setNotificationList(data.notifications);
          setCount(data.totalCount || 0); // Use totalCount if available, else set 0
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []); // Only runs on mount

  // Handle notification click
  const handleNotificationClick = (notificationId, event) => {
    const markNotificationRead = async () => {
      try {
        await fetch(`/api/notifications/${notificationId}`, {
          method: "POST",
          body: JSON.stringify({ status: "read" }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Remove the notification from the list after it is marked as read
        setNotificationList((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );
        setCount((prevCount) => prevCount - 1);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    };

    markNotificationRead();
  };

  return (
    <div className="d-flex">
      <Sidebar
        notificationList={notificationList}
        count={count}
        handleClick={handleNotificationClick}
      />
    </div>
  );
}

export default Layout;
