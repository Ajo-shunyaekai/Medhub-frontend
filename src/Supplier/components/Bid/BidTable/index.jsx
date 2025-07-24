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
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import Style from'./bidTable.module.css'
 
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
 
  /* filter - dropdown */
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isParticipated, setIsParticipated] = useState("");
 
  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/supplier/bid":
        return "active";
      case "/supplier/bid/active":
        return "active";
      case "/supplier/bid/completed":
        return "completed";
      case "/supplier/bid/cancelled":
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
        navigate("/supplier/bid");
        break;
      case "completed":
        navigate("/supplier/bid/completed");
        break;
      case "cancelled":
        navigate("/supplier/bid/cancelled");
        break;
      default:
        navigate("/supplier/bid");
    }
  };
 
  const dummyBids = [
    {
      _id: "BID20250701",
      bidId: "BID20250701",
      start: "2025-07-01 10:00 AM",
      end: "2025-07-05 05:00 PM",
      status: "Active",
    },
    {
      _id: "BID20250628",
      bidId: "BID20250628",
      start: "2025-06-28 09:30 AM",
      end: "2025-07-02 04:00 PM",
      status: "Completed",
    },
    {
      _id: "BID20250620",
      bidId: "BID20250620",
      start: "2025-06-20 11:00 AM",
      end: "2025-06-25 03:00 PM",
      status: "Cancelled",
    },
    {
      _id: "BID20250703",
      bidId: "BID20250703",
      start: "2025-07-03 08:00 AM",
      end: "2025-07-08 06:00 PM",
      status: "Active",
    },
    {
      _id: "BID20250615",
      bidId: "BID20250615",
      start: "2025-06-15 10:30 AM",
      end: "2025-06-20 05:00 PM",
      status: "Completed",
    },
  ];
 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
 
  const fetchData = async () => {
    // const supplierId = localStorage?.getItem("_id");
    // if (!supplierId) {
    //   localStorage?.clear();
    //   navigate("/supplier/login");
    //   return;
    // }
    const status = activeLink?.toLowerCase();
    const obj = {
      // buyer_id: buyerId,
      status: status,
      pageNo: currentPage,
      pageSize: bidPerPage,
      usertype: "Buyer",
    };
 
    try {
      const response = await apiRequests.getRequest(
        `bid?&page_no=${currentPage}&page_size=${bidPerPage}&status=${status}`
        // `bid?userId=${buyerId}&pageNo=${currentPage}&pageSize=${bidPerPage}&status=${status}`
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
          {/* header -> Bids, Filter-Tab, Create Bid */}
          <div className={Style.header}>
            <div className={Style.title}>Bids</div>
            
            {/* filter tab */}
            <div className={Style.filterContainer} /* ref={dropdownRef} */>
              <ul className={Style.filterSection}>
                  <li
                      className={Style.filterLiSection}
                      onClick={() => setOpenDropdown(!openDropdown)/* toggleDropdown('gmpApprovals') */}
                  >
                      Participated {isParticipated?"-":""}{" "}{isParticipated} {openDropdown === true/* 'gmpApprovals' */ ? <FaAngleUp /> : <FaAngleDown />}
                      {openDropdown === true/* 'gmpApprovals' */ && (
                          <ul className={Style.filterInnerSection}>
                              <li onClick={() => {setOpenDropdown(false);setIsParticipated("Yes");}}>Yes</li>
                              <li onClick={() =>{setOpenDropdown(false); setIsParticipated("No")}}>No</li>
                          </ul>
                      )}
                  </li>
              </ul>
                {/* Show reset button only when filters are applied */}
              {isParticipated && (
                <button 
                    className={Style.resetButton}
                    onClick={()=>{setOpenDropdown(false);setIsParticipated("");}}
                >
                    Reset Filters
                </button>
              )} 
            </div>
 
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