import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { ThreeDots } from "react-loader-spinner";
import Loader from "../../SharedComponents/Loader/Loader";
import OrderCancel from "../../Orders/OrderCancel/OrderCancel";
import { apiRequests } from "../../../../api";
import html2pdf from "html2pdf.js";

const CompleteInvoicesList = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(8);

  const iframeRef = useRef(null);

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
      const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

      if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        localStorage?.clear();
        navigate("/buyer/login");
        return;
      }

      setLoading(true);
      try {
        const response = await apiRequests.getRequest(
          `order/get-all-invoice-list?filterKey=paid&pageNo=${currentPage}&pageSize=${ordersPerPage}`
        );
        if (response?.code === 200) {
          setInvoiceList(response?.result?.data || []);
          setTotalInvoices(response?.result?.totalItems || 0);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, ordersPerPage]);

  const handleDownload = (invoiceId) => {
    setDownloadingInvoiceId(invoiceId);
    const invoiceUrl = `/buyer/invoice-design/${invoiceId}`;
    if (iframeRef.current) {
      iframeRef.current.src = invoiceUrl;
      setTimeout(() => {
        try {
          const iframeWindow = iframeRef.current.contentWindow;
          if (iframeWindow) {
            iframeWindow.postMessage(
              { type: "DOWNLOAD_INVOICE", invoiceId: invoiceId },
              window?.location?.origin
            );
          }
        } catch (error) {
          console.error("Error communicating with invoice iframe:", error);
        }
      }, 500);
    }
    setTimeout(() => {
      setDownloadingInvoiceId(null);
    }, 3000);
  };

  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.origin !== window?.location?.origin) return;
      if (event.data?.type === "INVOICE_READY") {
        const iframeDocument =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow.document;
        const element = iframeDocument.getElementById("invoice-content");
        if (element) {
          const invoiceId = event.data.invoiceId || "unknown";
          const options = {
            margin: 0.5,
            filename: `invoice_${invoiceId}.pdf`,
            image: { type: "jpeg", quality: 1.0 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
          };
          html2pdf().from(element).set(options).save();
        } else {
          console.error("Invoice content element not found in iframe");
        }
      }
    };
    window.addEventListener("message", handleIframeMessage);
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, []);

  const columns = [
    {
      name: "Invoice No",
      selector: (row) => row?.invoice_no || "-",
      sortable: true,
    },
    {
      name: "Order ID",
      selector: (row) => row?.order_id || "-",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row?.supplier_name || "-",
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `${row?.total_payable_amount || 0} USD`,
      sortable: true,
    },
    {
      name: "Payment Type",
      selector: (row) => row?.mode_of_payment || "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row?.status
          ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
          : "-",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/buyer/invoice-design/${row?.invoice_id}`}>
           <div className={styles.activeBtn}>
                      <RemoveRedEyeOutlinedIcon className={styles['table-icon']}  onClick={() => showModal(row?.order_id)} />
                    </div>
          </Link>
          <div
            className={styles.downloadButton}
            onClick={() => handleDownload(row?.invoice_id)}
          >
            {downloadingInvoiceId === row?.invoice_id ? (
              <Loader/>
            ) : (
              <div className={styles.activeBtn}>
              <CloudDownloadOutlinedIcon className={styles['table-icon']} />
              </div>
            )}
          </div>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className={styles.container}>
    <style>
      {`
        .rdt_Table {
          border: none;
          background-color: unset !important;
        }
        .rdt_TableRow {
          background-color: #ffffff !important;
          border-bottom: none !important;
        }
        .rdt_TableHeadRow {
          background-color: #f9f9fa;
    font-weight: bold !important;
    font-size: 14px !important;
    border-bottom: none !important;
        }
        .rdt_TableBody {
          gap: 10px !important;
        }
        .rdt_TableCol {
            color: #5e676f !important;
    font-weight: 500 !important;
        }
        .rdt_TableCell {
           
             color: #99a0ac;
     
        }
        .rdt_TableCellStatus {
           
             color: #99a0ac;
        }
      `}
    </style>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.tableMainContainer}>
        <header className={styles.header}>
          <span className={styles.title}>Completed Invoice</span>
        </header>
            <DataTable
              columns={columns}
              data={invoiceList || []}
              noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            persistTableHead
            pagination={false}
            responsive
              pointerOnHover
            />
            {modal && (
              <OrderCancel
                setModal={setModal}
                orderId={selectedOrderId}
                activeLink={"active"}
              />
            )}
            {invoiceList?.length > 0 && (
              <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalInvoices || 0}
                pageRangeDisplayed={8}
                onChange={handlePageChange}
              />
            )}
            <iframe
              ref={iframeRef}
              style={{ display: "none" }}
              title="invoice-download-iframe"
            ></iframe>
          </div>
        
      )}
   </div>
  );
};

export default CompleteInvoicesList;