import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import styles from "../../assets/style/secondsidebar.module.css";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PendingInvoice from "./PendingInvoices/PendingInvoice";
import PaidInvoice from "./PaidInvoices/CompleteInvoice";
import ProformaList from "./ProformaInvoices/ProformaList";
import Loader from "../SharedComponents/Loader/Loader";
import { toast } from "react-toastify";
import { apiRequests } from "../../../api";

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;

  useEffect(() => {
    const getActiveLinkFromPath = (path) => {
      switch (path) {
        case "/supplier/invoice/pending":
          return 0;
        case "/supplier/invoice/paid":
          return 1;
        case "/supplier/invoice/proforma":
          return 2;
        default:
          return 0;
      }
    };

    setActiveIndex(getActiveLinkFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage?.clear();
      navigate("/supplier/login");
      return;
    }

    const filterKey =
      activeIndex === 0 ? "pending" : activeIndex === 1 ? "paid" : "active";

    const obj = {
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
      filterKey: filterKey,
      page_no: currentPage,
      limit: invoicesPerPage,
    };
    if (activeIndex === 2) {
      const fetchOrderList = async () => {
        try {
          const response = await apiRequests.getRequest(
            `order/get-all-order-list?filterKey=${filterKey}&pageNo=${currentPage}&pageSize=${invoicesPerPage}`
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
    }
  }, [activeIndex, currentPage]);

  const handleLinkClick = (link) => {
    setCurrentPage(1);
    switch (link) {
      case "pending":
        setActiveIndex(0);
        navigate("/supplier/invoice/pending");
        break;
      case "paid":
        setActiveIndex(1);
        navigate("/supplier/invoice/paid");
        break;
      case "active":
        setActiveIndex(2);
        navigate("/supplier/invoice/proforma");
        break;

      default:
        setActiveIndex(0);
        navigate("/supplier/invoice/pending");
    }
  };

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
                <DescriptionOutlinedIcon className={styles.icon} />
                                <div className={styles.text}>Pending Invoices</div>
                
              </div>
              <div
                onClick={() => handleLinkClick("paid")}
                className={`${activeIndex === 1 ? styles.active : ""} ${styles.tab}`}
              >
                <DescriptionOutlinedIcon className={styles.icon} />
                <div className={styles.text}>Paid Invoices</div>
               
              </div>

              <div
                onClick={() => handleLinkClick("active")}
                className={`${activeIndex === 2 ? styles.active : ""} ${styles.tab}`}
              >
                <DescriptionOutlinedIcon className={styles.icon} />
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
                />
              )}
              {activeIndex === 1 && (
                <PaidInvoice
                  invoiceList={invoiceList}
                  currentPage={currentPage}
                  totalInvoices={totalInvoices}
                  invoicesPerPage={invoicesPerPage}
                  handlePageChange={handlePageChange}
                />
              )}
              {activeIndex === 2 && (
                <ProformaList
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
