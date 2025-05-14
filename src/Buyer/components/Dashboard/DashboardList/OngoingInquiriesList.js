import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import OrderCancel from "../../Orders/OrderCancel/OrderCancel";
import { apiRequests } from "../../../../api";
import { toast } from "react-toastify";
import moment from "moment-timezone";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import Loader from "../../SharedComponents/Loader/Loader";
import styles from "../../../assets/style/table.module.css";

const OngoingInquiriesList = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);
  const [inquiryList, setInquiryList] = useState([]);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [loading, setLoading] = useState(true);

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchInquiryList = async () => {
      setLoading(true);
      const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
      const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

      if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        localStorage?.clear();
        navigate("/buyer/login");
        setLoading(false);
        return;
      }

      const obj = {
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        filterKey: "pending",
        pageNo: currentPage,
        pageSize: ordersPerPage,
      };
      try {
        const response = await apiRequests.getRequest(
          `enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${ordersPerPage}&filterKey=pending`
        );
        if (response?.code === 200) {
          setInquiryList(response.result.data || []);
          setTotalInquiries(response.result.totalItems || 0);
        } else {
          toast(response.message, { type: "error" });
          console.error("Error in inquiry list API:", response);
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiryList();
  }, [currentPage, navigate, ordersPerPage]);

  const handleNavigate = (id) => {
    navigate(`/buyer/cancel-inquiry-list/${id}`);
  };

  const columns = [
    {
      name: "Inquiry ID",
      selector: (row) => row?.enquiry_id || "-",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => moment(row?.created_at).format("DD/MM/YYYY") || "-",
      sortable: true,
    },
    {
      name: "Supplier Name",
      selector: (row) => row?.supplier?.supplier_name || "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row?.enquiry_status === "Quotation submitted"
          ? "Quotation Received"
          : row?.enquiry_status
              ?.split(" ")
              ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
              ?.join(" ") || "-",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/buyer/ongoing-inquiries-details/${row.enquiry_id}`}>
            <div className={styles.activeBtn}>
              <RemoveRedEyeOutlinedIcon className={styles['table-icon']} onClick={() => showModal(row?.order_id)} />
            </div>
          </Link>
          {row?.enquiry_status === "pending" && (
            <div className={styles.activeBtn}>
              <HighlightOffIcon
                className={styles['table-icon']}
                onClick={() => handleNavigate(row?.enquiry_id)}
              />
            </div>
          )}
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
      <div className={styles.tableMainContainer}>
        <header className={styles.header}>
          <span className={styles.title}>Ongoing Inquiries List</span>
        </header>
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={inquiryList}
              noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
              persistTableHead
              pagination={false}
              responsive
            />
            {modal && (
              <OrderCancel
                setModal={setModal}
                orderId={selectedOrderId}
                activeLink={"active"}
              />
            )}
            {inquiryList.length > 0 && totalInquiries > 0 && (
              <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalInquiries}
                pageRangeDisplayed={8}
                onChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OngoingInquiriesList;