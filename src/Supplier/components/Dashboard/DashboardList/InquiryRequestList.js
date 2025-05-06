import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { apiRequests } from "../../../../api";
import moment from "moment/moment";
import OrderCancel from "../../Orders/OrderCancel";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import Loader from "../../SharedComponents/Loader/Loader";
import styles from "../../../assets/style/table.module.css";

const InquiryRequestList = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [inquiryList, setInquiryList] = useState([]);
  const [totalInquiries, setTotalInquiries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 8;

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchInquiryList = async () => {
      setLoading(true); // Set loading to true before fetching
      const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
      const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage?.clear();
        navigate("/supplier/login");
        setLoading(false); // Stop loading if redirected
        return;
      }

      const obj = {
        supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
        filterKey: "completed",
        pageNo: currentPage,
        pageSize: ordersPerPage,
      };

      try {
        const response = await apiRequests.getRequest(
          `enquiry/get-all-enquiry-list?pageNo=${currentPage}&pageSize=${ordersPerPage}&filterKey=completed`
        );
        if (response?.code === 200) {
          setInquiryList(response.result.data);
          setTotalInquiries(response.result.totalItems);
        } else {
          toast(response.message, { type: "error" });
        }
      } catch (error) {
        console.error("Error fetching inquiry list:", error);
      } finally {
        setLoading(false); // Stop loading after fetch completes
      }
    };
    fetchInquiryList();
  }, [currentPage, navigate]);

  const columns = [
    {
      name: "Inquiry ID",
      selector: (row) => row?.enquiry_id,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row?.created_at,
      sortable: true,
      cell: (row) => (
        <>{moment(row?.created_at).format("DD/MM/YYYY")}</>
      ),
    },
    {
      name: "Buyer Name",
      selector: (row) => row?.buyer.buyer_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.enquiry_status,
      sortable: true,
      cell: (row) => (
        <div>
          {row?.enquiry_status
            ?.split(" ")
            .map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
            .join(" ")}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/supplier/inquiry-request-details/${row?.enquiry_id}`}>
          <div className={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles["table-icon"]} />
          </div>
        </Link>
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
      <div className={styles.tableMainContainer}>
        <span className={styles.title}>Inquiry Request</span>
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={inquiryList}
              persistTableHead
              noDataComponent={<div className={styles["no-data"]}>No Data Available</div>}
              pagination={false}
              responsive
            />
            {inquiryList.length > 0 && totalInquiries > 0 && (
              <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalInquiries}
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
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryRequestList;