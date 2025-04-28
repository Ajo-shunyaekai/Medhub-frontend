import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import moment from "moment";
import { apiRequests } from "../../../../api";
import Loader from '../../shared-components/Loader/Loader';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const TotalActiveOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get("filterValue");

  const adminIdSessionStorage = localStorage.getItem("admin_id");
  const adminIdLocalStorage = localStorage.getItem("admin_id");

  const [loading, setLoading] = useState(true);
  const [orderList, setOrderList] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0); // Initialize as 0 for clarity
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchOrderList = async () => {
      if (!adminIdSessionStorage && !adminIdLocalStorage) {
        localStorage.clear();
        navigate("/admin/login");
        return;
      }

      try {
        const response = await apiRequests.getRequest(
          `order/get-all-order-list?filterKey=active&filterValue=${filterValue}&pageNo=${currentPage}&pageSize=${ordersPerPage}`
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
  }, [currentPage, filterValue, adminIdSessionStorage, adminIdLocalStorage, navigate]);

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.order_id,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => moment(row.created_at).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Supplier Name",
      selector: (row) => row.supplier_name,
      sortable: true,
    },
    {
      name: "Buyer Name",
      selector: (row) => row.buyer_name,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) =>
        row.items.reduce((total, item) => total + (item.quantity || item.quantity_required), 0),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status
          ?.split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/admin/order-details/${row.order_id}`}>
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
    <section className={styles.container}>
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
            text-align: center;
            color: #333;
          }
          .rdt_TableCell {
            text-align: center;
            color: #99a0ac;
            font-weight: 500 !important;
          }
          .rdt_TableCellStatus {
            text-align: center;
            color: #333;
          }
        `}
      </style>
      {loading ? (
        <Loader />
      ) : (
        <>
          <header className={styles.header}>
            <span className={styles.title}>Total Active Orders</span>
          </header>
          <DataTable
            columns={columns}
            data={orderList}
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            persistTableHead
            pagination={false}
            responsive
          />
          {orderList.length > 0 && totalOrders > 0 && (
            <PaginationComponent
              activePage={currentPage}
              itemsCountPerPage={ordersPerPage}
              totalItemsCount={totalOrders}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
            />
          )}
        </>
      )}
    </section>
  );
};

export default TotalActiveOrders;