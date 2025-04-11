import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./dashboardorders.css";
import Table from "react-bootstrap/Table";
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import OrderCancel from "../../Orders/OrderCancel/OrderCancel";
import { postRequestWithToken } from "../../../../api/Requests";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import { apiRequests } from "../../../../api";

const OngoingInquiriesList = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [inquiryList, setInquiryList] = useState([]);
  const [totalInquiries, setTotalInquiries] = useState(0);

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchInquiryList = async () => {
      const buyerIdSessionStorage = localStorage.getItem("buyer_id");
      const buyerIdLocalStorage = localStorage.getItem("buyer_id");

      if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        navigate("/buyer/login");
        return;
      }

      const obj = {
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        filterKey: "pending",
        pageNo: currentPage,
        pageSize: ordersPerPage,
      };

    //   postRequestWithToken("buyer/enquiry/enquiry-list", obj, (response) => {
    //     if (response?.code === 200) {
    //       setInquiryList(response.result.data);
    //       setTotalInquiries(response.result.totalItems);
    //     } else {
    //       toast(response.message, { type: "error" });
    //       console.error("Error in order list API:", response);
    //     }
    //   });
      try {
        const response = await apiRequests.getRequest(
          `enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${ordersPerPage}&filterKey={"pending}`
        );
        if (response?.code === 200) {
          setInquiryList(response.result.data);
          setTotalInquiries(response.result.totalItems);
        } else {
          toast(response.message, { type: "error" });
          console.error("Error in order list API:", response);
        }
      } catch (error) {
      } finally {
      }
    };
    fetchInquiryList();
  }, [currentPage, navigate, ordersPerPage]);

  const handleNavigate = (id) => {
    navigate(`/buyer/cancel-inquiry-list/${id}`);
  };

  return (
    <div className="completed-order-main-container">
      <div className="completed-order-main-head">Ongoing Inquiries List</div>
      <div className="completed-order-container">
        <div className="completed-order-container-right-2">
          <Table responsive="xxl" className="completed-order-table-responsive">
            <thead>
              <tr
                className="completed-table-row-container m-0"
                style={{ backgroundColor: "transparent" }}
              >
                <th className="table-row-item table-order-1">
                  <span className="completed-header-text-color">
                    {" "}
                    Inquiry ID
                  </span>
                </th>
                <th className="completed-table-row-item completed-table-order-1">
                  <span className="completed-header-text-color"> Date</span>
                </th>
                <th className="completed-table-row-item completed-table-order-2">
                  <span className="completed-header-text-color">
                    {" "}
                    Supplier Name
                  </span>
                </th>
                <th className="completed-table-row-item completed-table-order-1">
                  <span className="completed-header-text-color"> Status</span>
                </th>
                <th className="completed-table-row-item completed-table-order-1">
                  <span className="completed-header-text-color"> Action</span>
                </th>
              </tr>
            </thead>

            <tbody className="bordered">
              {inquiryList.length > 0 ? (
                inquiryList.map((order, index) => (
                  <tr className="completed-table-row-container" key={index}>
                    <td className="completed-table-row-item completed-table-order-1">
                      {order?.enquiry_id}
                    </td>
                    <td className="completed-table-row-item completed-table-order-1">
                      {moment(order?.created_at).format("DD/MM/YYYY")}
                    </td>
                    <td className="completed-table-row-item completed-table-order-2">
                      {order.supplier.supplier_name}
                    </td>
                    <td className="completed-table-row-item completed-table-order-1">
                      {order?.enquiry_status === "Quotation submitted"
                        ? "Quotation Received"
                        : order?.enquiry_status
                            ?.split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                    </td>
                    <td className="completed-table-row-item completed-order-table-btn completed-table-order-1">
                      <Link
                        to={`/buyer/ongoing-inquiries-details/${order.enquiry_id}`}
                      >
                        <span className="completed-order-table-view ">
                          <RemoveRedEyeOutlinedIcon className="table-icon" />
                        </span>
                      </Link>
                      {order?.enquiry_status === "pending" && (
                        <span className="invoice-details-button-column-download">
                          <HighlightOffIcon
                            className="table-icon"
                            onClick={() => handleNavigate(order?.enquiry_id)}
                          />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <div className="pending-products-no-orders">
                    No Purchase Orders
                  </div>
                </>
              )}
            </tbody>
          </Table>

          {modal && (
            <OrderCancel
              setModal={setModal}
              orderId={selectedOrderId}
              activeLink={"active"}
            />
          )}

          {inquiryList.length > 0 && (
            <div className="completed-pagi-container">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalInquiries}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText={
                  <KeyboardDoubleArrowLeftIcon style={{ fontSize: "15px" }} />
                }
                nextPageText={
                  <KeyboardDoubleArrowRightIcon style={{ fontSize: "15px" }} />
                }
                hideFirstLastPages={true}
              />
              <div className="completed-pagi-total">
                Total Items: {totalInquiries}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OngoingInquiriesList;
