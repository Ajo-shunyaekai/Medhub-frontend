import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from '../../assets/style/secondsidebar.module.css'
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PendingInvoice from "./Pending/PendingInvoice";
import PaidInvoice from "./Paid/CompleteInvoice";
import ProformaInvoice from "./Proforma/ProformaInvoice";
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
  const invoicesPerPage = 8;

  useEffect(() => {
    const getActiveLinkFromPath = (path) => {
      switch (path) {
        case "/buyer/invoice/pending-invoice":
          return 0;
        case "/buyer/invoice/paid-invoice":
          return 1;
        case "/buyer/invoice/proforma-invoice":
          return 2;
        default:
          return 0;
      }
    };

    const newIndex = getActiveLinkFromPath(location.pathname);
    setActiveIndex(newIndex);
  }, [location.pathname]);

  useEffect(() => {
    if (activeIndex !== null) {
      fetchInvoices(activeIndex);
    }
  }, [activeIndex, currentPage]);

  const fetchInvoices = (index) => {
    const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
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
            `order/get-all-order-list?pageNo=${currentPage}&pageSize=${invoicesPerPage}&filterKey=${filterKey}`
          );
          if (response?.code === 200) {
            setInvoiceList(response.result.data);
            setTotalInvoices(response.result.totalItems);
          } else {
            toast(response.message, { type: "error" });
          }
        } catch (error) {
        } finally {
          setLoading(false);
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
        navigate("/buyer/invoice/pending-invoice");
        break;
      case "paid":
        setActiveIndex(1);
        navigate("/buyer/invoice/paid-invoice");
        break;
      case "active":
        setActiveIndex(2);
        navigate("/buyer/invoice/proforma-invoice");
        break;
      default:
        setActiveIndex(0);
        navigate("/buyer/invoice/pending-invoice");
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
         <div className={styles.container}>
                <div className={styles.header}>
                  <div className={styles.title}>
                  Invoices
                  </div>
                </div>
       
        <div className={styles.content}>
                <div className={styles.sidebar}>
              <div
                onClick={() => handleLinkClick("pending")}
                className={`${activeIndex === 0 ? styles.active : ""} ${styles.tab}`}
              >
                <DescriptionOutlinedIcon
                  className={styles.icon}
                />
                <div className={styles.text}>Pending Invoices</div>
              </div>
              <div
                onClick={() => handleLinkClick("paid")}
                className={`${activeIndex === 1 ? styles.active : ""} ${styles.tab}`}
              >
                <DescriptionOutlinedIcon
                  className={styles.icon}
                />
                <div className={styles.text}>Paid Invoices</div>
              </div>
              <div
                onClick={() => handleLinkClick("active")}
                className={`${activeIndex === 2 ? styles.active : ""} ${styles.tab}`}
              >
                <DescriptionOutlinedIcon
                 className={styles.icon}
                />
                <div className={styles.text}>Proforma Invoices</div>
              </div>
            </div>
            <div className={styles.main}>
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
