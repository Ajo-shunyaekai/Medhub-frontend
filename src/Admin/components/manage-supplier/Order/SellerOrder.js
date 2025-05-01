import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import { TbReorder } from "react-icons/tb";
import ActiveSellerOrder from "./ActiveOrder/ActiveSellerOrder";
import CompletedSellerOrder from "./CompletedOrder/CompletedSellerOrder";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";

const SellerOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminIdSessionStorage = localStorage?.getItem("admin_id");
  const adminIdLocalStorage = localStorage?.getItem("admin_id");
  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/admin/supplier-order/active":
        return "active";
      case "/admin/supplier-order/complete":
        return "completed";
      case "/admin/supplier-order/pending":
        return "pending";
      default:
        return "active";
    }
  };
  const activeLink = getActiveLinkFromPath(location.pathname);
  const handleLinkClick = (link) => {
    setCurrentPage(1);
    switch (link) {
      case "active":
        navigate("/admin/supplier-order/active");
        break;
      case "completed":
        navigate("/admin/supplier-order/complete");
        break;
      case "pending":
        navigate("/admin/supplier-order/pending");
        break;
      default:
        navigate("/admin/supplier-order/active");
    }
  };
  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [totalOrders, setTotalOrders] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    const fetchOrderList = async () => {
      if (!adminIdSessionStorage && !adminIdLocalStorage) {
        localStorage?.clear();
        navigate("/admin/login");
        return;
      }
      const obj = {
        admin_id: adminIdSessionStorage || adminIdLocalStorage,
        filterKey: activeLink,
        pageNo: currentPage,
        pageSize: ordersPerPage,
      };
      try {
        const response = await apiRequests.getRequest(
          `order/get-all-order-list?pageNo=${currentPage}&pageSize=${ordersPerPage}&filterKey=${activeLink}`
        );
        if (response?.code === 200) {
          setOrderList(response.result.data);
          setTotalOrders(response.result.totalItems);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchOrderList();
  }, [activeLink, currentPage]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Orders</div>
          </div>
          <div className={styles.content}>
            <div className={styles.sidebar}>
              <div
                onClick={() => handleLinkClick("active")}
                className={`${activeLink === "active" ? styles.active : ""} ${styles.tab}`}
              >
                <TbReorder className={styles.icon} />
                <div className={styles.text}>Active Orders</div>
              </div>
              <div
                onClick={() => handleLinkClick("completed")}
                className={`${
                  activeLink === "completed" ? styles.active : ""
                } ${styles.tab}`}
              >
                <TbReorder className={styles.icon} />
                <div className={styles.text}>Completed Orders</div>
              </div>
            </div>
            <div className={styles.main}>
              {activeLink === "active" && (
                <ActiveSellerOrder
                  orderList={orderList}
                  totalOrders={totalOrders}
                  currentPage={currentPage}
                  ordersPerPage={ordersPerPage}
                  handlePageChange={handlePageChange}
                  activeLink={activeLink}
                />
              )}
              {activeLink === "completed" && (
                <CompletedSellerOrder
                  orderList={orderList}
                  totalOrders={totalOrders}
                  currentPage={currentPage}
                  ordersPerPage={ordersPerPage}
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

export default SellerOrder;
