import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboardorders.css";
import Table from "react-bootstrap/Table";
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import OrderCancel from "../../Orders/OrderCancel/OrderCancel";
import Loader from "../../SharedComponents/Loader/Loader";
import { postRequestWithToken } from "../../../../api/Requests";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
import html2pdf from "html2pdf.js";
import { ThreeDots } from "react-loader-spinner";

const PendingInvoicesList = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };
  const [totalOrders, setTotalOrders] = useState();

  // Alloted Order JSOn file
  const [activeOrders, setActiveOrders] = useState([
    {
      invoice_no: "3654646",
      order_id: "14785269",
      customer_name: "Sheetal Pharmacy",
      amount: "233 USD",
      status: "Pending",
    },
    {
      invoice_no: "3654646",
      order_id: "14785269",
      customer_name: "Sheetal Pharmacy",
      amount: "233 USD",
      status: "Pending",
    },
    {
      invoice_no: "3654646",
      order_id: "14785269",
      customer_name: "Sheetal Pharmacy",
      amount: "233 USD",
      status: "Pending",
    },
    {
      invoice_no: "3654646",
      order_id: "14785269",
      customer_name: "Sheetal Pharmacy",
      amount: "233 USD",
      status: "Pending",
    },
    {
      invoice_no: "3654646",
      order_id: "14785269",
      customer_name: "Sheetal Pharmacy",
      amount: "233 USD",
      status: "Pending",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [invoiceList, setInvoiceList] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(5);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = activeOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(activeOrders.length / ordersPerPage);

  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const buyerIdSessionStorage = localStorage.getItem("buyer_id");
      const buyerIdLocalStorage = localStorage.getItem("buyer_id");

      if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        localStorage.clear();
        navigate("/buyer/login");
        return;
      }
      setLoading(true);
      const obj = {
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        filterKey: "pending",
        page_no: currentPage,
        limit: ordersPerPage,
      };

      try {
        const response = await apiRequests.getRequest(
          `order/get-all-invoice-list?filterKey=${"pending"}&pageNo=${currentPage}&pageSize=${ordersPerPage}`
        );
        if (response?.code !== 200) {
          return;
        }

        setInvoiceList(response.result.data);
        setTotalInvoices(response.result.totalItems);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handleDownload = (invoiceId) => {
    setDownloadingInvoiceId(invoiceId);
    const invoiceUrl = `/buyer/invoice-design/${invoiceId}`;
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
      {loading ? (
        <Loader />
      ) : (
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
                      <span className="completed-header-text-color">
                        Amount
                      </span>
                    </div>
                    <div className="completed-table-row-item completed-table-order-1">
                      <span className="completed-header-text-color">
                        Status
                      </span>
                    </div>
                    <div className="completed-table-row-item completed-table-order-1">
                      <span className="completed-header-text-color">
                        Action
                      </span>
                    </div>
                  </div>
                </thead>

                <tbody className="bordered">
                  {invoiceList && invoiceList.length > 0 ? (
                    invoiceList.map((invoice, i) => (
                      <div className="completed-table-row-container">
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
                            {invoice.supplier_name}
                          </div>
                        </div>
                        <div className="completed-table-row-item completed-table-order-1">
                          <div className="completed-table-text-color">
                            {invoice.total_payable_amount} USD
                          </div>
                        </div>
                        <div className="completed-table-row-item completed-table-order-1">
                          <div className="completed-table-text-color">
                            {invoice.status?.charAt(0).toUpperCase() +
                              invoice?.status?.slice(1)}
                          </div>
                        </div>
                        <div className="completed-table-row-item  completed-order-table-btn completed-table-order-1">
                          <Link
                            to={`/buyer/invoice-design/${invoice.invoice_id}`}
                          >
                            <div
                              className="completed-order-table-view "
                              onClick={showModal}
                            >
                              <RemoveRedEyeOutlinedIcon className="table-icon" />
                            </div>
                          </Link>
                          <div
                            className="invoice-details-button-column-download"
                            onClick={() => handleDownload(invoice.invoice_id)}
                          >
                            {/* <CloudDownloadOutlinedIcon className='invoice-view' /> */}
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
                    ))
                  ) : (
                    <div className="pending-products-no-orders">
                      No Pending Invoices Available
                    </div>
                  )}
                </tbody>
              </Table>

              {modal === true ? (
                <OrderCancel
                  setModal={setModal}
                  orderId={selectedOrderId}
                  activeLink={"active"}
                />
              ) : (
                ""
              )}
              {invoiceList.length > 0 && (
                <div className="completed-pagi-container">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={totalInvoices || invoiceList.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={
                      <KeyboardDoubleArrowLeftIcon
                        style={{ fontSize: "15px" }}
                      />
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
                      Total Items: {totalInvoices || invoiceList.length}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingInvoicesList;
