import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { postRequestWithToken } from "../../../api/Requests";
import OrderCancel from "../../Orders/OrderCancel";
import PaginationComponent from "../../SharedComponents/Pagination/Pagination";
import Loader from "../../SharedComponents/Loader/Loader";
import styles from "../../../assets/style/table.module.css";
import { toast } from "react-toastify";

const PurchasedOrdersList = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [poList, setPOList] = useState([]);
  const [totalPoList, setTotalPoList] = useState(0);
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
    const supplierIdSessionStorage = localStorage?.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage?.getItem("supplier_id");

    if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
      localStorage?.clear();
      navigate("/supplier/login");
      return;
    }

    const obj = {
      supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
      status: "active",
      pageNo: currentPage,
      pageSize: ordersPerPage,
    };

    setLoading(true); // Set loading to true before fetching
    postRequestWithToken("purchaseorder/get-po-list", obj, async (response) => {
      if (response?.code === 200) {
        setPOList(response.result.data);
        setTotalPoList(response.result.totalItems);
      } else {
        toast(response.message, { type: "error" });
      }
      setLoading(false); // Set loading to false after fetching
    });
  }, [currentPage, navigate]);

  // Define columns for DataTable
  const columns = [
    {
      name: "PO ID",
      selector: (row) => row?.purchaseOrder_id,
      sortable: true,
    },
    {
      name: "Inquiry ID",
      selector: (row) => row?.enquiry_id,
      sortable: true,
    },
    {
      name: "PO Date",
      selector: (row) => row?.po_date,
      sortable: true,
    },
    {
      name: "Buyer Name",
      selector: (row) => row?.buyer_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row?.po_status?.charAt(0)?.toUpperCase() + row?.po_status.slice(1),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.buttonContainer}>
          <Link to={`/supplier/proforma-invoice/${row?.purchaseOrder_id}`}>
            <button className={styles.orderButton}>Make Order</button>
          </Link>
          <Link to={`/supplier/purchased-order-details/${row?.purchaseOrder_id}`}>
            <div className={styles.activeBtn}>
              <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
            </div>
          </Link>
        </div>
      ),
      sortable: true,
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
        <span className={styles.title}>Purchased Orders</span>
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={poList}
              persistTableHead
              noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
              pagination={false}
              responsive
            />
            {poList.length > 0 && totalPoList > 0 && (
              <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalPoList}
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

export default PurchasedOrdersList;