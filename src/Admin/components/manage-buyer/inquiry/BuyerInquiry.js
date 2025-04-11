import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/order.module.css";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BuyerOngoingInquiry from "./Ongoing-Inquiries/BuyerOngoingInquiry";
import BuyerPurchasedOrder from "./Purchased-Order/BuyerPurchasedOrder";
import { postRequestWithToken } from "../../../api/Requests";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";

const BuyerInquiry = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminIdSessionStorage = localStorage.getItem("admin_id");
  const adminIdLocalStorage = localStorage.getItem("admin_id");

  // Get initial active link based on the path
  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/admin/buyer-inquiry/ongoing-inquiry":
        return "inquiry";
      case "/admin/buyer-inquiry/purchased-order":
        return "purchased";
      default:
        return "inquiry";
    }
  };

  // State variables
  const [activeLink, setActiveLink] = useState(
    getActiveLinkFromPath(location.pathname)
  );

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [totalList, setTotalList] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const listPerPage = 5;

  // Handle link clicks to change active page
  const handleLinkClick = (link) => {
    setCurrentPage(1); // Reset page when switching tabs
    setActiveLink(link);

    // Navigate to appropriate route
    if (link === "inquiry") {
      navigate("/admin/buyer-inquiry/ongoing-inquiry");
    } else if (link === "purchased") {
      navigate("/admin/buyer-inquiry/purchased-order");
    }
  };

  // Fetch the inquiry or PO list based on activeLink and currentPage
  const fetchData = async () => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      navigate("/admin/login");
      return;
    }

    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      filterKey: activeLink,
      pageNo: currentPage,
      pageSize: listPerPage,
    };

    if (activeLink === "inquiry") {
      // postRequestWithToken('admin/get-inquiry-list', obj, (response) => {
      //     if (response?.code === 200) {
      //         setList(response.result.data);
      //         setTotalList(response.result.totalItems);
      //     } else {
      //     }
      //     setLoading(false);
      // });
      try {
        const response = await apiRequests.getRequest(
          `enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${listPerPage}&filterValue=${activeLink}`
        );
        if (response?.code === 200) {
          setList(response.result.data);
          setTotalList(response.result.totalItems);
        }
        // postRequestWithToken(`enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${listPerPage}&filterValue=${activeLink}`, obj, async (response) => {
        //     if (response?.code == 200) {
        //         setList(response.result.data);
        //         setTotalList(response.result.totalItems);
        //     }
        // })
      } catch (error) {
      } finally {
        setLoading(false);
      }
    } else if (activeLink === "purchased") {
      obj.status = "active";
      postRequestWithToken("purchaseorder/get-po-list", obj, (response) => {
        if (response?.code === 200) {
          setList(response.result.data);
          setTotalList(response.result.totalItems);
        } else {
        }
        setLoading(false);
      });
    }
  };

  // First useEffect: Calls fetchData when activeLink changes
  useEffect(() => {
    fetchData();
  }, [activeLink, currentPage]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles[`order-container`]}>
          <div className={styles["complete-container-order-section"]}>
            <div className={styles["complete-conatiner-head"]}>
              Inquiry & Purchased Orders
            </div>
          </div>
          <div className={styles[`order-wrapper`]}>
            <div className={styles[`order-wrapper-left`]}>
              <div
                onClick={() => handleLinkClick("inquiry")}
                className={`${activeLink === "inquiry" ? styles.active : ""} ${
                  styles["order-wrapper-left-text"]
                }`}
              >
                <DescriptionOutlinedIcon
                  className={styles["order-wrapper-left-icons"]}
                />
                <div className="inquiry-content-navbar">Ongoing Inquiries</div>
              </div>
              <div
                onClick={() => handleLinkClick("purchased")}
                className={`${
                  activeLink === "purchased" ? styles.active : ""
                } ${styles["order-wrapper-left-text"]}`}
              >
                <DescriptionOutlinedIcon
                  className={styles["order-wrapper-left-icons"]}
                />
                <div className="inquiry-content-navbar">Purchased Orders</div>
              </div>
            </div>
            <div className={styles[`order-wrapper-right`]}>
              {activeLink === "inquiry" && (
                <BuyerOngoingInquiry
                  inquiryList={list}
                  totalInquiries={totalList}
                  currentPage={currentPage}
                  inquiriesPerPage={listPerPage}
                  handlePageChange={setCurrentPage}
                  activeLink={activeLink}
                />
              )}
              {activeLink === "purchased" && (
                <BuyerPurchasedOrder
                  poList={list}
                  totalList={totalList}
                  currentPage={currentPage}
                  listPerPage={listPerPage}
                  handlePageChange={setCurrentPage}
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

export default BuyerInquiry;
