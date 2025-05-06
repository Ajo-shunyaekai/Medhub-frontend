import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import OrderCancel from "../../Orders/OrderCancel";
import Loader from "../../SharedComponents/Loader/Loader";
import { apiRequests } from "../../../../api";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination"
import styles from "../../../assets/style/table.module.css";

const CompletedInvoicesList = () => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
      const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage?.clear();
        navigate("/supplier/login");
        return;
      }
      setLoading(true);
      try {
        const response = await apiRequests.getRequest(
          `order/get-all-invoice-list?filterKey=paid&pageNo=${currentPage}&pageSize=${ordersPerPage}`
        );
        if (response?.code !== 200) {
          return;
        }
        setInvoiceList(response.result.data);
        setTotalInvoices(response.result.totalItems);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, navigate]);

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

  const columns = [
    {
      name: "Invoice No",
      selector: (row) => row?.invoice_no,
      sortable: true,
     
    },
    {
      name: "Order ID",
      selector: (row) => row?.order_id,
      sortable: true,
  
    },
    {
      name: "Customer Name",
      selector: (row) => row?.buyer_name,
      sortable: true,
     
    },
    {
      name: "Amount",
      selector: (row) => row?.total_payable_amount,
      sortable: true,
      cell: (row) => <div>{row?.total_payable_amount} USD</div>,
    },
    {
      name: "Payment Type",
      selector: (row) => row?.mode_of_payment,
      sortable: true,
     
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) => (
        <div>
          {row?.status?.charAt(0)?.toUpperCase() + row?.status?.slice(1)}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/supplier/invoice-design/${row?.invoice_id}`}>
          <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
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
      sortable: false,
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
                    font-weight: bold;
                    border-bottom: none !important;
                }
                .rdt_TableBody {
                    gap: 10px !important;
                }
                .rdt_TableCol {
                      
                    color: #333;
                }
                .rdt_TableCell {
                      
                    color: #99a0ac;
                    font-weight: 500 !important;
                }
                .rdt_TableCellStatus {
                      
                    color: #333;
                }
            `}
        </style>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.tableMainContainer}>
         <span className={styles.title}>Completed Invoices</span>
       
            <DataTable
              columns={columns}
              data={invoiceList}
              persistTableHead
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            pagination={false}
            responsive
            />
            {invoiceList.length > 0 && (
              <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalInvoices}
                pageRangeDisplayed={8}
                onChange={handlePageChange}
              />
            )}
            {modal && (
              <OrderCancel
                setModal={setModal}
                orderId={selectedOrderId}
                activeLink={"completed"}
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

export default CompletedInvoicesList;