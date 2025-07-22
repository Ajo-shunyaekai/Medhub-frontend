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
import { useDispatch } from "react-redux";
import { postRequestWithToken } from "../../api/Requests";
// Lazy-load the components
const LogisticsSidebar = lazy(() =>
  import("../Components/SharedComponents/Sidebar/LogisticsSidebar")
);


/* const router = createBrowserRouter([
  {
    path    : "/logistic/login",
    element : <LoginLayout />,
  },
]) */


const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const LogisticsNotificationProvider = ({ children }) => {
  const dispatch = useDispatch();
  const logisticsIdSessionStorage = localStorage?.getItem("partner_id");
  const logisticsIdLocalStorage = localStorage?.getItem("partner_id");
  
  const location = useLocation();
  const navigate = useNavigate();

  const [invoiceCount, setInvoiceCount] = useState(0);
/*  const [notificationList, setNotificationList] = useState([]);  */

  const notificationList = [
    {
      "_id": {
        "$oid": "66eab07b8eb4da3de638d897"
      },
      "notification_id": "NOT-f0068726",
      "event": "enquiry",
      "event_type": "Enquiry request",
      "from": "buyer",
      "to": "supplier",
      "from_id": "BYR-jmn98sdanx",
      "to_id": "SUP-88363ef1b2c6a",
      "event_id": "INQ-06d9c6e6",
      "message": "Inquiry Alert! You’ve received an inquiry about INQ-06d9c6e6",
      "status": 1,
      "createdAt": {
        "$date": "2024-09-18T10:50:35.843Z"
      },
      "updatedAt": {
        "$date": "2024-09-18T10:50:35.843Z"
      },
      "__v": 0
    },
    {
      "_id": {
        "$oid": "66eab07b8eb4da3de638d897"
      },
      "notification_id": "NOT-f0068726",
      "event": "enquiry",
      "event_type": "Enquiry request",
      "from": "buyer",
      "to": "supplier",
      "from_id": "BYR-jmn98sdanx",
      "to_id": "SUP-88363ef1b2c6a",
      "event_id": "INQ-06d9c6e6",
      "message": "Inquiry Alert! You’ve received an inquiry about INQ-06d9c6e6",
      "status": 1,
      "createdAt": {
        "$date": "2024-09-18T10:50:35.843Z"
      },
      "updatedAt": {
        "$date": "2024-09-18T10:50:35.843Z"
      },
      "__v": 0
    },
    {
      "_id": {
        "$oid": "66eab07b8eb4da3de638d897"
      },
      "notification_id": "NOT-f0068726",
      "event": "enquiry",
      "event_type": "Enquiry request",
      "from": "buyer",
      "to": "supplier",
      "from_id": "BYR-jmn98sdanx",
      "to_id": "SUP-88363ef1b2c6a",
      "event_id": "INQ-06d9c6e6",
      "message": "Inquiry Alert! You’ve received an inquiry about INQ-06d9c6e6",
      "status": 1,
      "createdAt": {
        "$date": "2024-09-18T10:50:35.843Z"
      },
      "updatedAt": {
        "$date": "2024-09-18T10:50:35.843Z"
      },
      "__v": 0
    },
    {
      "_id": {
        "$oid": "66eab07b8eb4da3de638d897"
      },
      "notification_id": "NOT-f0068726",
      "event": "enquiry",
      "event_type": "Enquiry request",
      "from": "buyer",
      "to": "supplier",
      "from_id": "BYR-jmn98sdanx",
      "to_id": "SUP-88363ef1b2c6a",
      "event_id": "INQ-06d9c6e6",
      "message": "Inquiry Alert! You’ve received an inquiry about INQ-06d9c6e6",
      "status": 1,
      "createdAt": {
        "$date": "2024-09-18T10:50:35.843Z"
      },
      "updatedAt": {
        "$date": "2024-09-18T10:50:35.843Z"
      },
      "__v": 0
    },
  ]

  const [count, setCount] = useState(0);
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
      logistics_id: logisticsIdSessionStorage || logisticsIdLocalStorage,
    };
    /*  postRequestWithToken("logistics/get-notification-list", obj, (response) => {
      if (response?.code === 200) {
        setNotificationList(response.result.data);
        setCount(response.result.totalItems);
      } else {
      }
    }); */
  };


    const fetchInvoiceCount = () => {
      const obj = {
        logistics_id: logisticsIdSessionStorage || logisticsIdLocalStorage,
      };
     /*   postRequestWithToken("logistics/get-invoice-count", obj, (response) => {
        if (response?.code === 200) {
          setInvoiceCount(response.result);
        } else {
        }
      }); */
    };

    const handleClick = (id, event) => {
      const obj = {
        notification_id: id,
        event,
        status: 1,
        logistics_id: logisticsIdSessionStorage || logisticsIdLocalStorage,
        usertype: "logistics",
      };
   /*    postRequestWithToken(
        "supplier/update-notification-status",
        obj,
        (response) => {
          if (response?.code === 200) {
            setRefresh(true);
          } else {
          }
        }
      ); */
    };

    useEffect(() => {
        if (
          !logisticsIdSessionStorage &&
          !logisticsIdLocalStorage &&
          location.pathname !== "/logistic/login"
        ) {
         /*  localStorage?.clear();
          navigate("/logistic/login");  */
        }
      }, [location.pathname]); 


       useEffect(() => {
          if (logisticsIdSessionStorage || logisticsIdLocalStorage) {
            const logisticsId = logisticsIdSessionStorage || logisticsIdLocalStorage;
      
            fetchInvoiceCount();
            fetchNotifications();
      
            socket.emit("registerPartner", logisticsId);
      
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
                /* const enquiryLink = `${process.env.REACT_APP_SUPPLIER_URL}/notification-list`;
                showNotification(
                  title,
                  { body: message, icon: "/path/to/logo.png" },
                  enquiryLink
                ); */
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
        }, [logisticsIdSessionStorage, logisticsIdLocalStorage, refresh]);
      
        return(
          <LogisticsSidebar
            invoiceCount={invoiceCount}
            notificationList={notificationList}
            count={count}
            handleClick={handleClick}
          >
            {children}
          </LogisticsSidebar>
        )

}



const Router = () => {
  return (
    <div>{<Outlet/>}</div>
  )
}

export default Router