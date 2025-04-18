import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TotalOngoingInquiries from "./TotalOngoingInquiries";
import TotalInquiriesRequest from "./TotalInquiriesRequest";
import { postRequestWithToken } from "../../../api/Requests";
import { apiRequests } from "../../../../api";

const InquiriesDashList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get("filterValue");

  const adminIdSessionStorage = localStorage.getItem("admin_id");
  const adminIdLocalStorage = localStorage.getItem("admin_id");

  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/admin/inquiries-section/request":
        return "request";
      case "/admin/inquiries-section/ongoing":
        return "ongoing";
      default:
        return "request";
    }
  };

  // const activeLink = getActiveLinkFromPath(location.pathname);
  const [activeLink, setActiveLink] = useState(
    getActiveLinkFromPath(location.pathname)
  );

  const handleLinkClick = (link) => {
    setCurrentPage(1);
    setActiveLink(link);
    switch (link) {
      case "request":
        navigate(`/admin/inquiries-section/request?filterValue=${filterValue}`);
        break;
      case "ongoing":
        navigate(`/admin/inquiries-section/ongoing?filterValue=${filterValue}`);
        break;
      default:
        navigate(`/admin/inquiries-section/request?filterValue=${filterValue}`);
    }
  };

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [totalList, setTotalList] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch the inquiry or PO list based on activeLink and currentPage
  const fetchData = async () => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      localStorage.clear();
      navigate("/admin/login");
      return;
    }

    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      filterKey: activeLink,
      filterValue: filterValue,
      pageNo: currentPage,
      pageSize: ordersPerPage,
    };

    if (activeLink === "request") {
      // postRequestWithToken("admin/get-inquiry-list", obj, (response) => {
      //   if (response?.code === 200) {
      //     setList(response.result.data);
      //     setTotalList(response.result.totalItems);
      //   } else {
      //   }
      //   setLoading(false);
      // });
      
      try {
        const response = await apiRequests.getRequest(
          `enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${ordersPerPage}&filterKey=${activeLink}&filterValue=${filterValue}`
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
    } else if (activeLink === "ongoing") {
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
      <div className={styles[`order-container`]}>
        <div className={styles["complete-container-order-section"]}>
          <div className={styles["complete-conatiner-head"]}>Inquiries</div>
        </div>
        <div className={styles[`order-wrapper`]}>
          <div className={styles[`order-wrapper-left`]}>
            <div
              onClick={() => handleLinkClick("request")}
              className={`${activeLink === "request" ? styles.active : ""} ${
                styles["order-wrapper-left-text"]
              }`}
            >
              <DescriptionOutlinedIcon
                className={styles["order-wrapper-left-icons"]}
              />
              <div className="inquiry-content-navbar">Inquiry Requests</div>
            </div>
            <div
              onClick={() => handleLinkClick("ongoing")}
              className={`${activeLink === "ongoing" ? styles.active : ""} ${
                styles["order-wrapper-left-text"]
              }`}
            >
              <DescriptionOutlinedIcon
                className={styles["order-wrapper-left-icons"]}
              />
              <div className="inquiry-content-navbar">Ongoing Inquiries</div>
            </div>
          </div>
          <div className={styles[`order-wrapper-right`]}>
            {activeLink === "ongoing" && (
              <TotalOngoingInquiries
                list={list}
                totalList={totalList}
                currentPage={currentPage}
                ordersPerPage={ordersPerPage}
                handlePageChange={handlePageChange}
                activeLink={activeLink}
              />
            )}
            {activeLink === "request" && (
              <TotalInquiriesRequest
                list={list}
                totalList={totalList}
                currentPage={currentPage}
                ordersPerPage={ordersPerPage}
                handlePageChange={handlePageChange}
                activeLink={activeLink}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InquiriesDashList;
