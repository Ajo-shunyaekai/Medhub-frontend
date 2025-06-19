import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import moment from "moment/moment";
import OrderCancel from "../OrderCancel";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import Loader from "../../SharedComponents/Loader/Loader";
import styles from "../../../assets/style/table.module.css";

const OrderRequest = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 8;

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  // Define columns for React Data Table
  const columns = [
    {
      name: "Order ID",
      selector: (row) => row?.order_id,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row?.created_at,
      sortable: true,
      cell: (row) => (
        <div>{moment(row?.created_at).format("DD/MM/YYYY")}</div>
      ),
    },
    {
      name: "Buyer Name",
      selector: (row) => row?.buyer?.buyer_name || "Needhi Pharma",
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) =>
        row?.items?.reduce((total, item) => total + item?.quantity, 0),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.order_status,
      sortable: true,
      cell: (row) => (
        <div>
          {row?.order_status?.charAt(0)?.toUpperCase() +
            row?.order_status?.slice(1)}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/supplier/order-details/${row?.order_id}`}>
          <div className={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles["table-icon"]} />
          </div>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Fetch orders
  useEffect(() => {
    const fetchOrderList = async () => {
      setLoading(true);
      const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
      const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage?.clear();
        navigate("/supplier/login");
        setLoading(false);
        return;
      }

      const obj = {
        supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
        filterKey: "pending",
        page_no: currentPage,
        limit: ordersPerPage,
      };

      try {
        // Replace with your actual API call
        const response = await fetch(
          `https://your-api-endpoint/order/get-all-order-list?filterKey=pending&pageNo=${currentPage}&pageSize=${ordersPerPage}`
        );
        const data = await response.json();
        if (data?.code === 200) {
          setOrderList(data.result.data);
          setTotalOrders(data.result.totalItems);
        } else {
          setOrderList([]);
          setTotalOrders(0);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrderList([]);
        setTotalOrders(0);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderList();
  }, [currentPage, navigate]);

  // Handle page change for pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      <div className={styles.tableMainContainer}>
        <span className={styles.title}>Order Request</span>
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={orderList}
              persistTableHead
              noDataComponent={
                <div className={styles["no-data"]}>No Data Available</div>
              }
              pagination={false}
              responsive
            />
            {orderList.length > 0 && totalOrders > 0 && (
              <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalOrders}
                pageRangeDisplayed={8}
                onChange={handlePageChange}
              />
            )}
          </>
        )}
        {modal && (
          <OrderCancel
            setModal={setModal}
            orderId={selectedOrderId}
            activeLink={"pending"}
          />
        )}
      </div>
    </div>
  );
};

export default OrderRequest;