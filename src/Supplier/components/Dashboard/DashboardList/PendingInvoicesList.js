import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/style/dashboardorder.css";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import moment from "moment/moment";
import { postRequestWithToken } from "../../../api/Requests";
import OrderCancel from "../../Orders/OrderCancel";
import Pagination from "react-js-pagination";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";

const PendingInvoicesList = () => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const iframeRef = useRef(null);

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  const [loading, setLoading] = useState(true);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;
  const indexOfLastOrder = currentPage * invoicesPerPage;
  const indexOfFirstOrder = indexOfLastOrder - invoicesPerPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
      const supplierIdLocalStorage = localStorage.getItem("supplier_id");

      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        navigate("/supplier/login");
        return;
      }

      const filterKey = "pending";
      try {
        const response = await apiRequests.getRequest(
          `order/get-all-invoice-list?filterKey=${filterKey}&pageNo=${currentPage}&pageSize=${invoicesPerPage}`
        );

        if (response?.code !== 200) {
          toast(response.message, { type: "error" });
          console.log("Error in invoice list API", response);
          return;
        }

        setInvoiceList(response.result.data);
        setTotalInvoices(response.result.totalItems);
      } catch (error) {
        console.log("Error in get-invoice-list API", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [currentPage]);

  const handleDownload = (invoiceId) => {
    setDownloadingInvoiceId(invoiceId);
    const invoiceUrl = `/supplier/invoice-design/${invoiceId}`;
    if (iframeRef.current) {
      // Set iframe src
      iframeRef.current.src = invoiceUrl;

      // Add a message to tell the iframe we want to download
      setTimeout(() => {
        try {
          const iframeWindow = iframeRef.current.contentWindow;
          if (iframeWindow) {
            // Try to call the download function directly after iframe loads
            iframeWindow.postMessage(
              {
                type: "DOWNLOAD_INVOICE",
                invoiceId: invoiceId,
              },
              window.location.origin
            );
          }
        } catch (error) {
          console.error("Error communicating with invoice iframe:", error);
        }
      }, 500); // Give the iframe a bit more time to load
    }
    setTimeout(() => {
      setDownloadingInvoiceId(null); // Stop loading state
    }, 3000);
  };

  useEffect(() => {
    // Listen for messages from the iframe
    const handleIframeMessage = (event) => {
      if (event.origin !== window.location.origin) return;

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

  return (
    <>
      <div className="completed-order-main-container">
        <div className="completed-order-main-head">Pending Invoices</div>
        <div className="completed-order-container">
          <div className="completed-order-container-right-2">
            <Table
              responsive="xxl"
              className="completed-order-table-responsive"
            >
              <thead>
                <div
                  className="completed-table-row-container m-0"
                  style={{ backgroundColor: "transparent" }}
                >
                  <div className="table-row-item table-order-1">
                    <span className="completed-header-text-color">Date</span>
                  </div>
                  <div className="table-row-item table-order-1">
                    <span className="completed-header-text-color">
                      Invoice No
                    </span>
                  </div>
                  <div className="completed-table-row-item completed-table-order-1">
                    <span className="completed-header-text-color">
                      Order ID
                    </span>
                  </div>
                  <div className="completed-table-row-item completed-table-order-2">
                    <span className="completed-header-text-color">
                      Customer Name
                    </span>
                  </div>
                  <div className="completed-table-row-item completed-table-order-1">
                    <span className="completed-header-text-color">Amount</span>
                  </div>
                  <div className="completed-table-row-item completed-table-order-1">
                    <span className="completed-header-text-color">Status</span>
                  </div>
                  <div className="completed-table-row-item completed-table-order-1">
                    <span className="completed-header-text-color">Action</span>
                  </div>
                </div>
              </thead>

              <tbody className="bordered">
                {invoiceList && invoiceList?.length > 0 ? (
                  invoiceList.map((invoice, i) => {
                    const dateToDisplay = invoice?.created_at;
                    return (
                      <div className="completed-table-row-container">
                        <div className="completed-table-row-item completed-table-order-1">
                          <div className="completed-table-text-color">
                            {moment(dateToDisplay).format("DD/MM/YYYY")}
                          </div>
                        </div>
                        <div className="completed-table-row-item completed-table-order-1">
                          <div className="completed-table-text-color">
                            {invoice.invoice_no}
                          </div>
                        </div>

                        <div className="completed-table-row-item completed-table-order-1">
                          <div className="completed-table-text-color">
                            {invoice.order_id}
                          </div>
                        </div>
                        <div className="completed-table-row-item  completed-table-order-2">
                          <div className="table-text-color">
                            {invoice.buyer_name}
                          </div>
                        </div>
                        <div className="completed-table-row-item completed-table-order-1">
                          <div className="completed-table-text-color">
                            {invoice.total_payable_amount} USD
                          </div>
                        </div>
                        <div className="completed-table-row-item completed-table-order-1">
                          <div className="completed-table-text-color">
                            {invoice?.status?.charAt(0).toUpperCase() +
                              invoice?.status?.slice(1)}
                          </div>
                        </div>
                        <div className="completed-table-row-item  completed-order-table-btn completed-table-order-1">
                          <Link
                            to={`/supplier/invoice-design/${invoice?.invoice_id}`}
                          >
                            <div className="completed-order-table completed-order-table-view ">
                              <RemoveRedEyeOutlinedIcon className="table-icon" />
                            </div>
                          </Link>
                          {/* <div className="invoice-details-button-column-download" onClick={() => handleDownload(invoice?.invoice_id)}>
                            <CloudDownloadOutlinedIcon className="invoice-view" />
                          </div> */}

                          <div
                            className="invoice-details-button-column-download"
                            onClick={() => handleDownload(invoice.invoice_id)}
                          >
                            {downloadingInvoiceId === invoice.invoice_id ? (
                              <ThreeDots
                                height="20"
                                width="20"
                                color="blue"
                                ariaLabel="loading"
                              />
                            ) : (
                              <CloudDownloadOutlinedIcon className="invoice-view" />
                            )}
                          </div>
                          <iframe
                            ref={iframeRef}
                            style={{ display: "none" }}
                            title="invoice-download-iframe"
                          ></iframe>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="pending-products-no-orders">
                      No Pending Invoices
                    </div>
                  </>
                )}
              </tbody>
            </Table>
            {invoiceList?.length > 0 && (
              <div className="completed-pagi-container">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={invoicesPerPage}
                  totalItemsCount={totalInvoices}
                  pageRangeDisplayed={5}
                  onChange={handlePageChange}
                  itemClass="page-item"
                  linkClass="page-link"
                  prevPageText={
                    <KeyboardDoubleArrowLeftIcon style={{ fontSize: "15px" }} />
                  }
                  nextPageText={
                    <KeyboardDoubleArrowRightIcon
                      style={{ fontSize: "15px" }}
                    />
                  }
                  hideFirstLastPages={true}
                />
                <div className="completed-pagi-total">
                  <div className="completed-pagi-total">
                    Total Items: {totalInvoices}
                  </div>
                </div>
              </div>
            )}
            {modal === true ? (
              <OrderCancel
                setModal={setModal}
                orderId={selectedOrderId}
                activeLink={"completed"}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingInvoicesList;
