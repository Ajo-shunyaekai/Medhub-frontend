import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";
import OrderCancel from "../../Orders/OrderCancel/OrderCancel";
import moment from "moment/moment";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Loader from "../../SharedComponents/Loader/Loader";
import { apiRequests } from "../../../../api";

const CompletedOrders = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const ordersPerPage = 8;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
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

      const obj = {
        buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
        filterKey: "completed",
        page_no: currentPage,
        limit: ordersPerPage,
      };

      try {
        const response = await apiRequests.getRequest(
          `order/get-all-order-list?pageNo=${currentPage}&pageSize=${ordersPerPage}&filterKey=completed`
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
      name: "Supplier Name",
      selector: (row) => row?.supplier.supplier_name,
      sortable: true,
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
      selector: (row) =>
        row?.order_status?.charAt(0)?.toUpperCase() +
        row?.order_status?.slice(1),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/buyer/order-details/${row?.order_id}`}>
          <div className={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
          </div>
        </Link>
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
        <header className={styles.header}>
          <span className={styles.title}>Completed Orders</span>
        </header>
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={orderList}
              noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
              persistTableHead
              pagination={false}
              responsive
              progressPending={false}
            />
            {modal && (
              <OrderCancel
                setModal={setModal}
                orderId={selectedOrderId}
                activeLink={"completed"}
              />
            )}
            {orderList?.length > 0 && (
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

export default CompletedOrders;