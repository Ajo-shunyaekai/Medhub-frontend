import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import PayModal from "../pay/PayModal";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import Loader from "../../SharedComponents/Loader/Loader";

const PendingInvoice = ({
  invoiceList,
  currentPage,
  totalInvoices,
  invoicesPerPage,
  handlePageChange,
  socket,
}) => {
  const navigate = useNavigate();
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState();
  const [selectedOrderId, setSelectedOrderId] = useState();
  const [showModal, setShowModal] = useState(false);

  const handleModal = (invoiceId, orderId) => {
    setSelectedInvoiceId(invoiceId);
    setSelectedOrderId(orderId);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const iframeRef = useRef(null);

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
              { type: "DOWNLOAD_INVOICE", invoiceId },
              window?.location?.origin
            );
          }
        } catch (error) {
          console.error("Error communicating with invoice iframe:", error);
        }
      }, 500);
    }
    setTimeout(() => setDownloadingInvoiceId(null), 3000);
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
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  useEffect(() => {
    const buyerId = localStorage?.getItem("buyer_id");
    if (!buyerId) {
      localStorage?.clear();
      navigate("/buyer/login");
    }
  }, [navigate]);

  // DataTable columns
  const columns = [
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
      selector: (row) => row?.total_payable_amount,
      sortable: true,
      cell: (row) => (
        <span>
          {row?.total_payable_amount} USD
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) => (
        <span>
          {row?.status?.charAt(0)?.toUpperCase() + row.status?.slice(1)}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <button
            className={styles.orderButton}
            onClick={() => handleModal(row?.invoice_id, row?.order_id)}
          >
            Pay
          </button>
          <Link to={`/buyer/invoice-design/${row?.invoice_id}`}>
           <div className={styles.activeBtn}>
            <VisibilityOutlinedIcon className={styles['table-icon']} />
            </div>
          </Link>
          <button
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
          </button>
        </div>
      ),
       sortable: true,
       width : '300px',
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
    <div className={styles.tableMainContainer}>
      <DataTable
        columns={columns}
        data={invoiceList || []}
        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            persistTableHead
            pagination={false}
            responsive
      />
      <iframe
        ref={iframeRef}
        style={{ display: "none" }}
        title="invoice-download-iframe"
      ></iframe>
      <PayModal
        showModal={showModal}
        handleClose={handleCloseModal}
        invoiceId={selectedInvoiceId}
        orderId={selectedOrderId}
        buyerId={invoiceList?.[0]?.buyer_id}
        supplierId={invoiceList?.[0]?.supplier_id}
        socket={socket}
      />
      {invoiceList?.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={invoicesPerPage}
          totalItemsCount={totalInvoices || invoiceList.length}
          pageRangeDisplayed={8}
          onChange={handlePageChange}
        />
      )}
    </div>
    </div>
  );
};

export default PendingInvoice;