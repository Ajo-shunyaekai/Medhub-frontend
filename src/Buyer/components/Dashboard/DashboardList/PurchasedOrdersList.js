// PurchasedOrdersList.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import OrderCancel from "../../Orders/OrderCancel/OrderCancel";
import { postRequestWithToken } from "../../../../api/Requests";
import { toast } from "react-toastify";
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";

const PurchasedOrdersList = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);
  const [poList, setPOList] = useState([]);
  const [totalPoList, setTotalPoList] = useState(0);

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const buyerIdSessionStorage = localStorage?.getItem("buyer_id");
    const buyerIdLocalStorage = localStorage?.getItem("buyer_id");

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }

    const obj = {
      buyer_id: buyerIdSessionStorage || buyerIdLocalStorage,
      status: "active",
      pageNo: currentPage,
      pageSize: ordersPerPage,
    };

    postRequestWithToken("purchaseorder/get-po-list", obj, async (response) => {
      if (response?.code === 200) {
        setPOList(response.result.data || []);
        setTotalPoList(response.result.totalItems || 0);
      } else {
        toast(response.message, { type: "error" });
      }
    });
  }, [currentPage, navigate]);

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
      name: "Date",
      selector: (row) => row?.po_date,
      sortable: true,
    },
    {
      name: "Supplier Name",
      selector: (row) => row?.supplier_name,
      sortable: true,
    },
    {
      name: "Total Amount",
      selector: (row) => {
        const totalAmount = row?.order_items?.reduce(
          (sum, item) => sum + parseFloat(item.total_amount || 0),
          0
        );
        return `${row.total_amount || totalAmount || 0} USD`;
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link to={`/buyer/purchased-order-details/${row.purchaseOrder_id}`}>
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
        <header className={styles.header}>
          <span className={styles.title}>Purchase Orders List</span>
        </header>
    
        <DataTable
          columns={columns}
          data={poList}
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
        {poList.length > 0 && (
          <PaginationComponent
            activePage={currentPage}
            itemsCountPerPage={ordersPerPage}
            totalItemsCount={totalPoList}
            pageRangeDisplayed={8}
            onChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default PurchasedOrdersList;