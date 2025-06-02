import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import { BiPurchaseTagAlt } from "react-icons/bi";
import BuyerOngoingInquiry from "./Ongoing-Inquiries/BuyerOngoingInquiry";
import BuyerPurchasedOrder from "./Purchased-Order/BuyerPurchasedOrder";
import { postRequestWithToken } from "../../../api/Requests";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";

const BuyerInquiry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");
  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/admin/buyer-enquiry/ongoing-enquiry":
        return "enquiry";
      case "/admin/buyer-enquiry/purchased-order":
        return "purchased";
      default:
        return "enquiry";
    }
  };
  const [activeLink, setActiveLink] = useState(
    getActiveLinkFromPath(location.pathname)
  );
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [totalList, setTotalList] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const listPerPage = 8;
  const handleLinkClick = (link) => {
    setCurrentPage(1);
    setActiveLink(link);

    // Navigate to appropriate route
    if (link === "enquiry") {
      navigate("/admin/buyer-enquiry/ongoing-enquiry");
    } else if (link === "purchased") {
      navigate("/admin/buyer-enquiry/purchased-order");
    }
  };
  const fetchData = async () => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      localStorage?.clear();
      navigate("/admin/login");
      return;
    }

    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      filterKey: activeLink,
      pageNo: currentPage,
      pageSize: listPerPage,
    };

    if (activeLink === "enquiry") {
      try {
        const response = await apiRequests.getRequest(
          `enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${listPerPage}&filterValue=${activeLink}`
        );
        if (response?.code === 200) {
          setList(response.result.data);
          setTotalList(response.result.totalItems);
        }
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
              Enquiry & Purchased Orders
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.sidebar}>
              <div
                onClick={() => handleLinkClick("enquiry")}
                className={`${activeLink === "enquiry" ? styles.active : ""} ${styles.tab}`}
              >
                <BiPurchaseTagAlt
                 className={styles.icon}
                />
                <div className={styles.text}>Ongoing Inquiries</div>
              </div>
              <div
                onClick={() => handleLinkClick("purchased")}
                className={`${
                  activeLink === "purchased" ? styles.active : ""
                } ${styles.tab}`}
              >
                <BiPurchaseTagAlt
                  className={styles.icon}
                />
                <div className={styles.text}>Purchased Orders</div>
              </div>
            </div>
            <div className={styles.main}>
              {activeLink === "enquiry" && (
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
