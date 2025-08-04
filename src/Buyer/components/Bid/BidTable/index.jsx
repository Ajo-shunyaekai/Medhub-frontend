import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { postRequestWithToken } from "../../../../api/Requests";
import Loader from "../../SharedComponents/Loader/Loader";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
import MainTable from "./BidTable";
import { useDispatch, useSelector } from "react-redux";

const BidTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bidData } = useSelector((state) => state.bidReducer);
  const [loading, setLoading] = useState(true);
  const [bidList, setBidList] = useState([]);
  const [totalBids, setTotalBids] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const bidPerPage = 10;

  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/buyer/bid":
        return "active";
      case "/buyer/bid/active":
        return "active";
      case "/buyer/bid/completed":
        return "completed";
      case "/buyer/bid/cancelled":
        return "cancelled";
      default:
        return "active";
    }
  };

  const activeLink = getActiveLinkFromPath(location.pathname);

  const handleLinkClick = (link) => {
    setCurrentPage(1);
    switch (link) {
      case "active":
        navigate("/buyer/bid");
        break;
      case "completed":
        navigate("/buyer/bid/completed");
        break;
      case "cancelled":
        navigate("/buyer/bid/cancelled");
        break;
      default:
        navigate("/buyer/bid");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async () => {
    const buyerId = localStorage?.getItem("_id");
    if (!buyerId) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
    const status = activeLink?.toLowerCase();
    const obj = {
      buyer_id: buyerId,
      status: status,
      pageNo: currentPage,
      pageSize: bidPerPage,
      usertype: "Buyer",
    };

    try {
      const response = await apiRequests.getRequest(
        `bid?userId=${buyerId}&page_no=${currentPage}&page_size=${bidPerPage}&status=${status}`
      );
      if (response?.code === 200) {
        setBidList(response.data?.bids);
        setTotalBids(response.data?.totalItems);
      }
    } catch (error) {
    } finally {
      setLoading(false);
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
            <div className={styles.title}>Bids</div>
            <button
              onClick={() => navigate("/buyer/bid/create-bid")}
              className={styles.bulkButton}
            >
              Create Bid
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.sidebar}>
              <div
                onClick={() => handleLinkClick("active")}
                className={
                  activeLink === "active"
                    ? `${styles.active} ${styles.tab}`
                    : styles.tab
                }
              >
                <BiPurchaseTagAlt className={styles.icon} />
                <div className={styles.text}>Active Bids</div>
              </div>
              <div
                onClick={() => handleLinkClick("completed")}
                className={
                  activeLink === "completed"
                    ? `${styles.active} ${styles.tab}`
                    : styles.tab
                }
              >
                <BiPurchaseTagAlt className={styles.icon} />
                <div className={styles.text}>Completed Bids</div>
              </div>
              <div
                onClick={() => handleLinkClick("cancelled")}
                className={
                  activeLink === "cancelled"
                    ? `${styles.active} ${styles.tab}`
                    : styles.tab
                }
              >
                <BiPurchaseTagAlt className={styles.icon} />
                <div className={styles.text}>Cancelled Bids</div>
              </div>
            </div>
            <div className={styles.main}>
              <MainTable
                bidList={bidList}
                totalBids={totalBids}
                currentPage={currentPage}
                bidPerPage={bidPerPage}
                handlePageChange={handlePageChange}
                activeLink={activeLink}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BidTable;
