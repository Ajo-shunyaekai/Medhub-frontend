import React, { useEffect, useState } from "react";
import Loader from "../../SharedComponents/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import moment from "moment/moment";
import DataTable from "react-data-table-component";
import OrderCancel from "../../Orders/OrderCancel";
import { apiRequests } from "../../../../api";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import styles from "../../../assets/style/table.module.css";

const CompletedOrders = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

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
      cell: (row) => (
        <div>
          {row?.items?.reduce(
            (total, item) => total + (item?.quantity || item?.quantity_required),
            0
          )}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row?.order_status,
      sortable: true,
      cell: (row) => (
        <div>
          {row?.order_status?.charAt(0)?.toUpperCase() +
            row?.order_status.slice(1)}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/supplier/active-orders-details/${row?.order_id}`}>
          <div className ={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
          </div>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  useEffect(() => {
    const fetchOrderList = async () => {
      const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
      const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

      if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
        localStorage?.clear();
        navigate("/supplier/login");
        return;
      }

      try {
        setLoading(true);
        const response = await apiRequests.getRequest(
          `order/get-all-order-list?filterKey=completed&pageNo=${currentPage}&pageSize=${ordersPerPage}`
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
                        color: #5e676f;
                        font-size: 0.825rem;
                        font-weight: 600;
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
        <span className={styles.title}>Completed Orders</span>
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={orderList}
              persistTableHead
              noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
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
            activeLink={"completed"}
          />
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;