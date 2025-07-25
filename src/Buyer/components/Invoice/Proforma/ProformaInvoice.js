import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import moment from "moment/moment";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import Loader from "../../SharedComponents/Loader/Loader";

const ProformaInvoice = ({
  invoiceList,
  currentPage,
  totalInvoices,
  invoicesPerPage,
  handlePageChange,
}) => {
  const navigate = useNavigate();
  const [downloadingOrderId, setDownloadingOrderId] = useState(null);
  const iframeRef = useRef(null);

  const handleDownload = (orderId) => {
    setDownloadingOrderId(orderId);
    const invoiceUrl = `/buyer/proforma-invoice-details/${orderId}`;
    if (iframeRef.current) {
      iframeRef.current.src = invoiceUrl;
      setTimeout(() => {
        try {
          const iframeWindow = iframeRef.current.contentWindow;
          if (iframeWindow) {
            iframeWindow.postMessage(
              { type: "DOWNLOAD_INVOICE", orderId: orderId },
              window?.location?.origin
            );
          }
        } catch (error) {
          console.error("Error communicating with invoice iframe:", error);
        }
      }, 500);
    }
    setTimeout(() => {
      setDownloadingOrderId(null);
    }, 3000);
  };

  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.origin !== window?.location?.origin) return;
      if (event.data?.type === "INVOICE_READY") {
        const iframeDocument =
          iframeRef.current?.contentDocument ||
          iframeRef.current?.contentWindow?.document;
        const element = iframeDocument?.getElementById("invoice-content");
        if (element) {
          const invoiceId = event.data?.orderId || "unknown";
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

  useEffect(() => {
    const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage?.getItem("buyer_id");
    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
    }
  }, [navigate]);

  const columns = [
    {
      name: "Invoice No.",
      selector: (row) => row?.invoice_number || row?.invoice_no || "-",
      sortable: true,
    },
    {
      name: "PO Date",
      selector: (row) => row?.created_at,
      format: (row) =>
        row?.created_at ? moment(row.created_at).format("DD/MM/YYYY") : "-",
      sortable: true,
    },
    {
      name: "Order ID",
      selector: (row) => row?.order_id || "-",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row?.supplier?.supplier_name || "-",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/buyer/proforma-invoice-details/${row?.order_id}`} title="View Details">
          <div className={styles.activeBtn}>
            <VisibilityOutlinedIcon className={styles['table-icon']} />
          </div>
          </Link>
          <div
            className={styles.downloadButton}
            onClick={() => handleDownload(row?.order_id)}
            title="Download"
          >
            {downloadingOrderId === row?.order_id ? (
              <Loader/>
            ) : (
              <div className={styles.activeDownloadBtn}>
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
                        color: #5e676f;
                        font-size: 0.825rem;
                        font-weight: 500;
                        border-bottom: none !important;
                    }
        .rdt_TableBody {
          gap: 10px !important;
        }
        .rdt_TableCol {
           color: #5e676f !important;
              font-size: 0.825rem;
    font-weight: 500 !important;
        }
        .rdt_TableCell {
           
             color: #99a0ac;
              font-size: 0.825rem;
         
        }
        .rdt_TableCellStatus {
           
             color: #99a0ac;
              font-size: 0.825rem;
        }
      `}
    </style>
    <div className={styles.tableMainContainer}>
      <DataTable
        columns={columns}
        data={invoiceList || []}
        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            persistTableHead
            pagination={false}
            responsive
      />
      {invoiceList?.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={invoicesPerPage}
          totalItemsCount={totalInvoices || invoiceList?.length || 0}
          pageRangeDisplayed={8}
          onChange={handlePageChange}
        />
      )}
      <iframe
        ref={iframeRef}
        style={{ display: "none" }}
        title="invoice-download-iframe"
      />
    </div>
    </div>
  );
};

export default ProformaInvoice;