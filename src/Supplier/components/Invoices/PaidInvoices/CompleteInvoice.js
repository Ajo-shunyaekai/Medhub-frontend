import React, { useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import DataTable from "react-data-table-component";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination"
import styles from "../../../assets/style/table.module.css";
import Loader from "../../SharedComponents/Loader/Loader";

const CompleteInvoice = ({
  invoiceList,
  currentPage,
  totalInvoices,
  invoicesPerPage,
  handlePageChange,
}) => {
  const iframeRef = useRef(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);

  const handleDownload = (invoiceId) => {
    setDownloadingInvoiceId(invoiceId);
    const invoiceUrl = `/supplier/invoice-design/${invoiceId}`;
    if (iframeRef.current) {
      iframeRef.current.src = invoiceUrl;
      setTimeout(() => {
        try {
          const iframeWindow = iframeRef.current.contentWindow;
          if (iframeWindow) {
            iframeWindow.postMessage(
              {
                type: "DOWNLOAD_INVOICE",
                invoiceId: invoiceId,
              },
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

      if (event.data && event.data.type === "INVOICE_READY") {
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

  // Define columns for react-data-table-component
  const columns = [
    {
      name: "Date & Time",
      selector: (row) => {
        const dateToDisplay =
          row?.quotation_items_created_at ||
          row?.quotation_items_updated_at ||
          row?.created_at ||
          moment().toISOString();
        return (
          <div>
            <div>
              {moment(dateToDisplay).tz("Asia/Kolkata").format("DD/MM/YYYY")}
            </div>
            {/* <div>
              {moment(dateToDisplay).tz("Asia/Kolkata").format("HH:mm:ss")}
            </div> */}
          </div>
        );
      },
      sortable: true,
    },
    {
      name: "Invoice No.",
      selector: (row) => row?.invoice_no,
      sortable: true,
    },
    {
      name: "Order ID",
      selector: (row) => row?.order_id,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => `${row?.total_payable_amount} USD`,
      sortable: true,
    },
    {
      name: "Payment Type",
      selector: (row) => row?.mode_of_payment,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row?.status?.charAt(0)?.toUpperCase() + row?.status?.slice(1),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/supplier/invoice-design/${row?.invoice_id}`}>
            <div className={styles.activeBtn}>
              <VisibilityOutlinedIcon className={styles['table-icon']} />
            </div>

          </Link>
          <div
            className={styles.invoiceDetailsButtonColumnDownload}
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
                   
               color: #212121 !important;
    font-weight: 600 !important;
            }
            .rdt_TableCell {
                   
                color: #616161;
                font-weight: 500 !important;
            }
            .rdt_TableCellStatus {
                   
                color: #616161;
            }
        `}
      </style>
      <DataTable
        columns={columns}
        data={invoiceList}
        persistTableHead
        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
        pagination={false}
        responsive
      />
      <iframe
        ref={iframeRef}
        style={{ display: "none" }}
        title="invoice-download-iframe"
      ></iframe>

      {invoiceList.length > 0 && (

        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={invoicesPerPage}
          totalItemsCount={totalInvoices}
          pageRangeDisplayed={8}
          onChange={handlePageChange}
        />

      )}
    </div>
  );
};

export default CompleteInvoice;