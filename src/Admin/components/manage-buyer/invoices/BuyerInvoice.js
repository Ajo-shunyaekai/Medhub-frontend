import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../../assets/style/secondsidebar.module.css";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BuyerPending from "./pending/BuyerPending";
import BuyerPaid from "./paid/BuyerPaid";
import BuyerProforma from "./proforma/BuyerProforma";
import Loader from "../../shared-components/Loader/Loader";
import { apiRequests } from "../../../../api";

const BuyerInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const adminIdSessionStorage = localStorage.getItem("admin_id");
  const adminIdLocalStorage = localStorage.getItem("admin_id");

  const getActiveLinkFromPath = (path) => {
    switch (path) {
      case "/admin/buyer-invoice/paid":
        return "paid";
      case "/admin/buyer-invoice/pending":
        return "pending";
      case "/admin/buyer-invoice/proforma":
        return "proforma";
      default:
        return "paid";
    }
  };

  const activeLink = getActiveLinkFromPath(location.pathname);

  const handleLinkClick = (link) => {
    setCurrentPage(1);
    switch (link) {
      case "paid":
        navigate("/admin/buyer-invoice/paid");
        break;
      case "pending":
        navigate("/admin/buyer-invoice/pending");
        break;
      case "proforma":
        navigate("/admin/buyer-invoice/proforma");
        break;
      default:
        navigate("/admin/buyer-invoice/paid");
    }
  };

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceList, setInvoiceList] = useState();
  const [totalItems, setTotalItems] = useState();
  const listPerPage = 10;

  useEffect(() => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      localStorage.clear();
      navigate("/admin/login");
      return;
    }

    const filterKey = activeLink === "paid" ? "paid" : "pending";
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      filterKey: filterKey,
      pageNo: currentPage,
      pageSize: listPerPage,
      page_no: currentPage,
      page_size: listPerPage,
    };

    if (activeLink === "paid" || activeLink === "pending") {
      obj.filterKey = activeLink;
      const fetchInvoiceList = async () => {
        try {
          const response = await apiRequests.getRequest(
            `order/get-all-invoice-list?filterKey=${filterKey}&pageNo=${currentPage}&pageSize=${listPerPage}`
          );
          if (response?.code !== 200) {
            return;
          }

          setInvoiceList(response.result.data);
          setTotalItems(response.result.totalItems);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      fetchInvoiceList();
    } else if (activeLink === "proforma") {
      const fetchOrderList = async () => {
        obj.filterKey = "active";
        try {
          const response = await apiRequests.getRequest(
            `order/get-all-order-list?filterKey=${"completed"}&pageNo=${currentPage}&pageSize=${listPerPage}`
          );
          if (response?.code === 200) {
            setInvoiceList(response.result.data);
            setTotalItems(response.result.totalItems);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      fetchOrderList();
    }
  }, [currentPage, activeLink]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Invoices</div>
          </div>
          <div className={styles.content}>
            <div className={styles.sidebar}>
              <div
                onClick={() => handleLinkClick("paid")}
                className={`${styles.tab} ${activeLink === "paid" ? styles.active : ""}`}
              >
                <DescriptionOutlinedIcon className={styles.icon} />
                <div className={styles.text}>Paid Invoices</div>
              </div>
              <div
                onClick={() => handleLinkClick("pending")}
                className={`${styles.tab} ${activeLink === "pending" ? styles.active : ""}`}
              >
                <DescriptionOutlinedIcon className={styles.icon} />
                <div className={styles.text}>Pending Invoices</div>
              </div>
              <div
                onClick={() => handleLinkClick("proforma")}
                className={`${styles.tab} ${activeLink === "proforma" ? styles.active : ""}`}
              >
                <DescriptionOutlinedIcon className={styles.icon} />
                <div className={styles.text}>Proforma Invoices</div>
              </div>
            </div>
            <div className={styles.main}>
              {activeLink === "paid" && (
                <BuyerPaid
                  invoiceList={invoiceList}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  listPerPage={listPerPage}
                  handlePageChange={handlePageChange}
                />
              )}
              {activeLink === "pending" && (
                <BuyerPending
                  invoiceList={invoiceList}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  listPerPage={listPerPage}
                  handlePageChange={handlePageChange}
                />
              )}
              {activeLink === "proforma" && (
                <BuyerProforma
                  invoiceList={invoiceList}
                  totalItems={totalItems}
                  currentPage={currentPage}
                  listPerPage={listPerPage}
                  handlePageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyerInvoice;