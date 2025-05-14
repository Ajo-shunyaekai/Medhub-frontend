import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import OrderCancel from '../OrderCancel/OrderCancel';
import moment from 'moment/moment';
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";

const ActiveOrder = ({ orderList, totalOrders, currentPage, ordersPerPage, handlePageChange, activeLink }) => {
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const showModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModal(!modal);
  };

  const columns = [
    {
      name: 'Order ID',
      selector: (row) => row?.order_id || '-',
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row) => moment(row?.created_at).format('DD/MM/YYYY') || '-',
      sortable: true,
    },
    {
      name: 'Supplier Name',
      selector: (row) => row?.supplier?.supplier_name || '-',
      sortable: true,
    },
    {
      name: 'Quantity',
      selector: (row) =>
        row?.items?.reduce((total, item) => total + (item?.quantity_required || item?.quantity || 0), 0) || 0,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row?.status || '-',
      sortable: true,
    },
    {
      name: 'Action',
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
            <DataTable
              columns={columns}
              data={orderList || []}
              noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                         persistTableHead
                         pagination={false}
                         responsive
            />
          {modal && (
            <OrderCancel setModal={setModal} orderId={selectedOrderId} activeLink={activeLink} />
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
        </div>
      </div>
  );
};

export default ActiveOrder;