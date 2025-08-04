import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { postRequestWithToken } from "../../../../api/Requests";
import Loader from "../../SharedComponents/Loader/Loader";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
import MainTable from "./BidTable";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Style from "./bidTable.module.css";

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

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async () => {
    const status = activeLink?.toLowerCase();
    const participant = localStorage.getItem("_id");
    const type = localStorage
      ?.getItem("supplier_type")
      ?.toString()
      ?.toLowerCase()
      ?.replaceAll(/\s+/g, "");
    const country = localStorage?.getItem("country")

    try {
      const response = await apiRequests.getRequest(
        isParticipated?.toLowerCase() == "Participated Bids"?.toLowerCase() ||
          isParticipated?.toLowerCase() ==
            "Not Participated Bids"?.toLowerCase()
          ? `bid?&page_no=${currentPage}&country=${country}&page_size=${bidPerPage}&status=${status}&type=${type}&participant=${
              isParticipated?.toLowerCase() ==
              "Participated Bids"?.toLowerCase()
                ? participant
                : "not"
            }`
          : `bid?&page_no=${currentPage}&country=${country}&page_size=${bidPerPage}&status=${status}&type=${type}`
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
  }, [activeLink, currentPage, isParticipated]);

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
            <div className={Style.filterContainer}>
              <ul ref={dropdownRef} className={Style.filterSection}>
                <li
                  className={Style.filterLiSection}
                  onClick={
                    () =>
                      setOpenDropdown(
                        !openDropdown
                      ) /* toggleDropdown('gmpApprovals') */
                  }
                >
                  {!isParticipated ? "All Bids" : isParticipated}{" "}
                  {openDropdown === true /* 'gmpApprovals' */ ? (
                    <FaAngleUp />
                  ) : (
                    <FaAngleDown />
                  )}
                  {openDropdown === true /* 'gmpApprovals' */ && (
                    <ul className={Style.filterInnerSection}>
                      <li
                        className={Style.yesList}
                        onClick={() => {
                          setOpenDropdown(false);
                          setIsParticipated("Participated Bids");
                        }}
                      >
                        Participated Bids
                      </li>
                      <li
                        onClick={() => {
                          setOpenDropdown(false);
                          setIsParticipated("Not Participated Bids");
                        }}
                      >
                        Not Participated Bids
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
              {/* Show reset button only when filters are applied */}
              {isParticipated && (
                <button
                  className={Style.resetButton}
                  onClick={() => {
                    setOpenDropdown(false);
                    setIsParticipated("");
                  }}
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
