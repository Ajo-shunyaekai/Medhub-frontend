import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../assets/style/secondsidebar.module.css";
import { BiPurchaseTagAlt } from "react-icons/bi";
import OnGoingOrder from "./InquiryRequest/OnGoingOrder";
import PurchasedOrder from "./PurchasedOrder/PurchasedOrder";
import { postRequestWithToken } from "../../api/Requests";
import Loader from "../SharedComponents/Loader/Loader";
import { toast } from "react-toastify";
import { apiRequests } from "../../../api";

const InquiryPurchaseOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [inquiryList, setInquiryList] = useState([]);
  const [totalInquiries, setTotalInquiries] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const inquiryPerPage = 10;

  const [poList, setPOList] = useState([]);
  const [totalPoList, setTotalPoList] = useState();

  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/supplier/inquiry-purchase-orders/ongoing":
        return "ongoing";
      case "/supplier/inquiry-purchase-orders/purchased":
        return "purchased";
      default:
        return "ongoing";
    }
  };

  const activeLink = getActiveLinkFromPath(location.pathname);

  const handleLinkClick = (link) => {
    setCurrentPage(1);
    switch (link) {
      case "ongoing":
        navigate("/supplier/inquiry-purchase-orders/ongoing");
        break;
      case "purchased":
        navigate("/supplier/inquiry-purchase-orders/purchased");
        break;
      default:
        navigate("/supplier/inquiry-purchase-orders/ongoing");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async () => {
    const supplierIdSessionStorage = localStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage.clear();
      navigate("/supplier/login");
      return;
    }
    const status = activeLink === "ongoing" ? "pending" : "completed";
    const obj = {
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
      status: status,
      pageNo: currentPage,
      pageSize: inquiryPerPage,
      usertype: "Supplier",
    };

    try {
      const response = await apiRequests.getRequest(
        `enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${inquiryPerPage}&status=${status}`
      );
      if (response?.code === 200) {
        setInquiryList(response.result.data);
        setTotalInquiries(response.result.totalItems);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
    if (activeLink === "purchased") {
      obj.status = "active";
      postRequestWithToken(
        "purchaseorder/get-po-list",
        obj,
        async (response) => {
          if (response?.code === 200) {
            setPOList(response.result.data);
            setTotalPoList(response.result.totalItems);
          } else {
            toast(response.message, { type: "error" });
          }
          setLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeLink, currentPage]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
          Inquiry & Purchased Orders
          </div>
        </div>
        
        <div className={styles.content}>
        <div className={styles.sidebar}>
              <div
               onClick={() => handleLinkClick("ongoing")}
               className={`${styles.tab} ${activeLink === "ongoing" ? "active" : ""}`}
              >
               <BiPurchaseTagAlt
                  className={styles.icon}
                />
                <div className={styles.text}>Inquiry Request</div>
              </div>
              <div
                 onClick={() => handleLinkClick("purchased")}
                 className={`${styles.tab} ${activeLink === "purchased" ? "active" : ""}`}
              >
               <BiPurchaseTagAlt
                  className={styles.icon}
                />
                <div className={styles.text}>Purchased Orders</div>
              </div>
            </div>
            <div className={styles.main}>
                {activeLink === "ongoing" && (
                  <OnGoingOrder
                    inquiryList={inquiryList}
                    totalInquiries={totalInquiries}
                    currentPage={currentPage}
                    inquiryPerPage={inquiryPerPage}
                    handlePageChange={handlePageChange}
                    activeLink={activeLink}
                  />
                )}
                {activeLink === "purchased" && (
                  <PurchasedOrder
                    poList={poList}
                    totalPoList={totalPoList}
                    currentPage={currentPage}
                    inquiryPerPage={inquiryPerPage}
                    handlePageChange={handlePageChange}
                    activeLink={activeLink}
                  />
                )}
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default InquiryPurchaseOrder;
