import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../inquirypurchaseorder.css";
import order_list from "../../../assets/images/dashboard/order_list.svg";
import OnGoingOrder from "./OnGoingOrder";
import PurchasedOrder from "../PurchasedOrder/PurchasedOrder";
import { postRequestWithToken } from "../../../../api/Requests";
import Loader from "../../SharedComponents/Loader/Loader";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";

const InquiryPurchaseOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [inquiryList, setInquiryList] = useState([]);
  const [totalInquiries, setTotalInquiries] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const inquiryPerPage = 5;

  const [poList, setPOList] = useState([]);
  const [totalPoList, setTotalPoList] = useState();

  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/buyer/inquiry":
        return "ongoing";
      case "/buyer/inquiry/Purchased-Order":
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
        navigate("/buyer/inquiry");
        break;
      case "purchased":
        navigate("/buyer/inquiry/Purchased-Order");
        break;
      default:
        navigate("/buyer/inquiry");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async () => {
    const buyerIdSessionStorage = localStorage.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage.getItem("buyer_id");
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }
    const status = activeLink === "ongoing" ? "pending" : "completed";
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      status: status,
      pageNo: currentPage,
      pageSize: inquiryPerPage,
      usertype: "Buyer",
    };

    try {
      const response = await apiRequests.getRequest(
        `enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${inquiryPerPage}&status=${status}`
      );
      if (response?.code === 200) {
        setInquiryList(response.result.data);
        setTotalInquiries(response.result.totalItems);
      }
      // postRequestWithToken(`enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${inquiryPerPage}&status=${status}`, obj, async (response) => {
      //     if (response?.code == 200) {
      //         setInquiryList(response.result.data)
      //         setTotalInquiries(response.result.totalItems)
      //     } else {
      //         toast(response.message, {type:'error'})
      //     }
      // })
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
        <div className="inquiry-purchase-main-container">
          <div className="inquiry-purchase-name">
            Inquiry & Purchased Orders
          </div>
          <div className="inquiry-purchase-container">
            <div className="inquiry-purchase-container-left">
              <div
                onClick={() => handleLinkClick("ongoing")}
                className={
                  activeLink === "ongoing"
                    ? "active inquiry-purchase-left-wrapper"
                    : "inquiry-purchase-left-wrapper"
                }
              >
                <img src={order_list} alt="inquiry-purchase icon" />
                <div>Ongoing Inquiries</div>
              </div>
              <div
                onClick={() => handleLinkClick("purchased")}
                className={
                  activeLink === "purchased"
                    ? "active inquiry-purchase-left-wrapper"
                    : "inquiry-purchase-left-wrapper"
                }
              >
                <img src={order_list} alt="inquiry-purchase icon" />
                <div>Purchased Orders</div>
              </div>
            </div>
            <div className="inquiry-purchase-container-right">
              <div
                responsive="xl"
                className="inquiry-purchase-table-responsive"
              >
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
        </div>
      )}
    </>
  );
};

export default InquiryPurchaseOrder;
