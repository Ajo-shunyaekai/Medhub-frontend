import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import OrderCancel from "../../Orders/OrderCancel/OrderCancel";
import moment from "moment/moment";
import { apiRequests } from "../../../../api";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import Loader from "../../SharedComponents/Loader/Loader";
import styles from "../../../assets/style/table.module.css";
import { useDispatch } from "react-redux";
import { remindSupplier } from "../../../../redux/reducers/orderSlice";

const OngoingOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

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
      const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
      const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

      if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
        localStorage?.clear();
        navigate("/buyer/login");
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequests.getRequest(
          `order/get-all-order-list?pageNo=${currentPage}&pageSize=${ordersPerPage}&filterKey=active`
        );
        if (response?.code === 200) {
          setOrderList(response.result.data || []);
          setTotalOrders(response.result.totalItems || 0);
        } else {
          setOrderList([]);
          setTotalOrders(0);
        }
      } catch (error) {
        setOrderList([]);
        setTotalOrders(0);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderList();
  }, [currentPage, navigate]);

  // Define columns for DataTable
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
      cell: (row) => (
        <div>
          {moment(row.created_at).format("DD/MM/YYYY")}
          {row?.date?.time && <> {row?.date.time} </>}
        </div>
      ),
    },
    {
      name: "Supplier Name",
      selector: (row) => row?.supplier.supplier_name,
      sortable: true,
      cell: (row) => (
        <div>
          {row.supplier.supplier_name}
          {row?.source_destination?.destination && (
            <div>{row.source_destination.destination}</div>
          )}
        </div>
      ),
    },
    {
      name: "Quantity",
      selector: (row) =>
        row?.items.reduce(
          (total, item) => total + (item?.quantity || item?.quantity_required),
          0
        ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) =>
        row?.status
          ? `${row?.status.charAt(0).toUpperCase() + row.status.slice(1)}`
          : "N/A",
    },
    {
      name: "Action",
      grow: 1,
      cell: (row) => (
        <>
          <Link to={`/buyer/order-details/${row?.order_id}`}>
            <div className={styles.activeBtn}>
              <RemoveRedEyeOutlinedIcon className={styles["table-icon"]} />
            </div>
          </Link>
          {/* {row?.status == "Awaiting Details from Supplier" && (
            <div
              className={styles.activeBtn2}
              onClick={() => {
                dispatch(remindSupplier(row?._id));
              }}
            >
              <NotificationsNoneOutlinedIcon className={styles["table-icon"]} />
            </div>
          )} */}
        </>
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
        <header className={styles.header}>
          <span className={styles.title}>Active Orders</span>
        </header>
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={orderList}
              noDataComponent={
                <div className={styles["no-data"]}>No Data Available</div>
              }
              persistTableHead
              pagination={false}
              responsive
              progressPending={loading}
            />
            {modal && (
              <OrderCancel
                setModal={setModal}
                orderId={selectedOrderId}
                activeLink={"active"}
              />
            )}
            {orderList?.length > 0 && totalOrders > 0 && (
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
      </div>
    </div>
  );
};

export default OngoingOrders;
