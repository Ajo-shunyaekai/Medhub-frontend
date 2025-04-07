import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./invoice.module.css";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PendingInvoice from "./Pending/PendingInvoice";
import PaidInvoice from "./Paid/CompleteInvoice";
import ProformaInvoice from "./Proforma/ProformaInvoice";
import { postRequestWithToken } from "../../../api/Requests";
import Loader from "../SharedComponents/Loader/Loader";
import { toast } from "react-toastify";
import { apiRequests } from "../../../api";

const Invoice = ({ socket }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  useEffect(() => {
    const getActiveLinkFromPath = (path) => {
      switch (path) {
        case "/buyer/invoice/Pending-Invoice":
          return 0;
        case "/buyer/invoice/Paid-Invoice":
          return 1;
        case "/buyer/invoice/Proforma-Invoice":
          return 2;
        default:
          return 0;
      }
    };

    const newIndex = getActiveLinkFromPath(location.pathname);
    setActiveIndex(newIndex);
    // fetchInvoices(newIndex);
  }, [location.pathname]);

  useEffect(() => {
    if (activeIndex !== null) {
      fetchInvoices(activeIndex);
    }
  }, [activeIndex, currentPage]);

  const fetchInvoices = (index) => {
    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage.getItem("buyer_id");

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      navigate("/buyer/login");
      return;
    }

    const filterKey = index === 0 ? "pending" : index === 1 ? "paid" : "active";
    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      filterKey: filterKey,
      page_no: currentPage,
      limit: invoicesPerPage,
    };

    setLoading(true); // Start loading before the API call

    if (index === 2) {
      const fetchOrderList = async () => {
        try {
          const response = await apiRequests.getRequest(
            `order/get-all-order-list?pageNo=${currentPage}&pageSize=${invoicesPerPage}&filterKey=${"filterKey"}`
          );
          if (response.code === 200) {
            setInvoiceList(response.result.data);
            setTotalInvoices(response.result.totalItems);
          } else {
            toast(response.message, { type: "error" });
          }
        } catch (error) {
        } finally {
        }
      };
      fetchOrderList();
    } else {
      const fetchInvoiceList = async () => {
        try {
          const response = await apiRequests.getRequest(
            `order/get-all-invoice-list?filterKey=${filterKey}&pageNo=${currentPage}&pageSize=${invoicesPerPage}`
          );
          if (response?.code !== 200) {
            toast(response.message, { type: "error" });
            return;
          }

          setInvoiceList(response.result.data);
          setTotalInvoices(response.result.totalItems);
          // postRequestWithToken(`order/get-all-invoice-list?filterKey=${filterKey}&pageNo=${currentPage}&pageSize=${invoicesPerPage}`, obj, async (response) => {
          //     if (response.code == 200) {
          //         setInvoiceList(response.result.data);
          //         setTotalInvoices(response.result.totalItems);
          //     }
          // })
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      fetchInvoiceList();

      setLoading(false);
    }
  };

  const handleLinkClick = (link) => {
    setCurrentPage(1);
    switch (link) {
      case "pending":
        setActiveIndex(0);
        navigate("/buyer/invoice/Pending-Invoice");
        break;
      case "paid":
        setActiveIndex(1);
        navigate("/buyer/invoice/Paid-Invoice");
        break;
      case "active":
        setActiveIndex(2);
        navigate("/buyer/invoice/Proforma-Invoice");
        break;
      default:
        setActiveIndex(0);
        navigate("/buyer/invoice/Pending-Invoice");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchInvoices(activeIndex);
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles["invoice-container"]}>
          <div className={styles["complete-container-invoice-section"]}>
            <div className={styles["complete-conatiner-head"]}>Invoices</div>
          </div>
          <div className={styles["invoice-wrapper"]}>
            <div className={styles["invoice-wrapper-left"]}>
              <div
                onClick={() => handleLinkClick("pending")}
                className={`${activeIndex === 0 ? styles.active : ""} ${
                  styles["invoice-wrapper-left-text"]
                }`}
              >
                <DescriptionOutlinedIcon
                  className={styles["invoice-wrapper-left-icons"]}
                />
                <div className={styles.invoiceHeading}>Pending Invoices</div>
              </div>
              <div
                onClick={() => handleLinkClick("paid")}
                className={`${activeIndex === 1 ? styles.active : ""} ${
                  styles["invoice-wrapper-left-text"]
                }`}
              >
                <DescriptionOutlinedIcon
                  className={styles["invoice-wrapper-left-icons"]}
                />
                <div className={styles.invoiceHeading}>Paid Invoices</div>
              </div>
              <div
                onClick={() => handleLinkClick("active")}
                className={`${activeIndex === 2 ? styles.active : ""} ${
                  styles["invoice-wrapper-left-text"]
                }`}
              >
                <DescriptionOutlinedIcon
                  className={styles["invoice-wrapper-left-icons"]}
                />
                <div className={styles.invoiceHeading}>Proforma Invoices</div>
              </div>
            </div>
            <div className={styles["invoice-wrapper-right"]}>
              {activeIndex === 0 && (
                <PendingInvoice
                  invoiceList={invoiceList}
                  currentPage={currentPage}
                  totalInvoices={totalInvoices}
                  invoicesPerPage={invoicesPerPage}
                  handlePageChange={handlePageChange}
                  socket={socket}
                />
              )}
              {activeIndex === 1 && (
                <PaidInvoice
                  invoiceList={invoiceList}
                  currentPage={currentPage}
                  totalInvoices={totalInvoices}
                  invoicesPerPage={invoicesPerPage}
                  handlePageChange={handlePageChange}
                  socket={socket}
                />
              )}
              {activeIndex === 2 && (
                <ProformaInvoice
                  invoiceList={invoiceList}
                  currentPage={currentPage}
                  totalInvoices={totalInvoices}
                  invoicesPerPage={invoicesPerPage}
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

export default Invoice;
