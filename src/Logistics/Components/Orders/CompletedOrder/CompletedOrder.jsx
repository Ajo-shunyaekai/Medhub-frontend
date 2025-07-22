import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import OrderCancel from '../OrderCancel/OrderCancel';
import moment from 'moment/moment';
import PaginationComponent from "../../SharedComponents/Pagination/Pagination"
import styles from "../../../Assets/Styles/table.module.css";

const CompletedOrder = ({ orderList, totalOrders, currentPage, ordersPerPage, handlePageChange, activeLink }) => {

  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Define columns for react-data-table-component
  const columns = [
    {
      name: "Logistic ID",
      selector: (row) => row?.logistics_id,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row?.created_at,
      sortable: true,
      cell: (row) => <div>{moment(row?.created_at).format("DD/MM/YYYY")}</div>,
    },
    {
      name: "Supplier Name",
      selector: (row) => row?.supplierDetails[0]?.supplier_name,
      sortable: true,
    },
    {
      name: "Buyer Name",
      selector: (row) => row?.buyerDetails[0]?.buyer_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) => (
        <div
          className={
            row?.status == "Awaiting Details from Supplier"
              ? styles.showPendingWork
              : ""
          }
        >
          {row?.status}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className={styles.actionCell}>
          <Link
            to={`/logistic/active-orders-details/${row?.logistics_id}`}
            title="View Details"
          >
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


  const showModal = (orderId) => {
      setSelectedOrderId(orderId);
      setModal(!modal);
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
                    font-weight: 500;
                    border-bottom: none !important;
                }
          .rdt_TableBody {
              gap: 10px !important;
          }
          .rdt_TableCol {
              color: #5e676f !important;
font-weight: 500 !important;
          font-size: 0.825rem;
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

        <DataTable
            columns={columns}
            data={orderList}
            persistTableHead
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            pagination={false}
            responsive
        />

        {modal && <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={activeLink} />}
        {orderList.length > 0 && (
            <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalOrders}
                pageRangeDisplayed={8}
                onChange={handlePageChange}
            />
        )}
    </div>

  )
}

export default CompletedOrder