import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { apiRequests } from "../../../../api";
import OrderCancel from "../../Orders/OrderCancel";
import moment from "moment/moment";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import Loader from "../../SharedComponents/Loader/Loader";
import styles from "../../../assets/style/table.module.css";

const DashboardOngoing = () => {
  const navigate = useNavigate();
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

      try {
        const response = await apiRequests.getRequest(
          `order/get-all-order-list?filterKey=active&pageNo=${currentPage}&pageSize=${ordersPerPage}`
        );
        if (response?.code === 200) {
          setOrderList(response.result.data);
          setTotalOrders(response.result.totalItems);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderList();
  }, [currentPage, navigate]);

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row?.order_id,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => moment(row?.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Buyer Name",
      selector: (row) => row?.buyer.buyer_name,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) =>
        row?.items?.reduce(
          (total, item) => total + (item?.quantity || item?.quantity_required),
          0
        ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row?.status?.charAt(0)?.toUpperCase() + row?.status.slice(1),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.actionColumn}>
          <Link to={`/supplier/active-orders-details/${row?.order_id}`}>
            <div className={styles.activeBtn}>
              <RemoveRedEyeOutlinedIcon className={styles["table-icon"]} />
            </div>
          </Link>
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
        <span className={styles.title}>Active Orders</span>
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
            {orderList.length > 0 && (
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
            activeLink={"active"}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardOngoing;