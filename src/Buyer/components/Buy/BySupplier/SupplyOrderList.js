import React from 'react';
import './table.css'
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import DataTable from 'react-data-table-component';
import PaginationComponent from '../../SharedComponents/Pagination/pagination';
import styles from './supplierdetails.module.css';

const SupplyOrderList = ({ orderList, totalOrders, currentPage, ordersPerPage, handleOrderPageChange }) => {
  const columns = [
    {
      name: 'Order ID',
      selector: row => row.order_id || 'ORD-8723RD213fd',
      sortable: true,
      cell: row => (
        <div className={styles.orderStatusText}>
          {row.order_id || 'ORD-8723RD213fd'}
        </div>
      ),
    },
    {
      name: 'Date',
      selector: row => row.created_at,
      sortable: true,
      cell: row => (
        <div className={styles.orderStatusText}>
          {moment(row.created_at).format("DD/MM/YYYY") || '22/05/2024'}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: row => row.order_status,
      sortable: true,
      cell: row => (
        <div className={styles.orderStatusText}>
          {row.order_status?.charAt(0).toUpperCase() + row.order_status?.slice(1) || 'Pending'}
        </div>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <Link to={`/buyer/order-details/${row.order_id || `ORD-8723RD213fd`}`}>
          <div className={styles.orderViewAction}>
            <RemoveRedEyeOutlinedIcon className={styles.viewIcon} />
          </div>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
      <div className={styles.orderListWrapper}>
        <DataTable
          columns={columns}
          data={orderList || []}
          pagination
          paginationServer
          paginationTotalRows={totalOrders}
          paginationDefaultPage={currentPage}
          paginationPerPage={ordersPerPage}
          onChangePage={handleOrderPageChange}
          paginationComponent={orderList?.length > 0 ? () => (
            <PaginationComponent
              activePage={currentPage}
              itemsCountPerPage={ordersPerPage}
              totalItemsCount={totalOrders}
              pageRangeDisplayed={5}
              onChange={handleOrderPageChange}
            />
          ) : null}
          noDataComponent={
           
              <div className={styles.noDataMessage}>No data available</div>
           
          }
          customStyles={{
            headCells: {
              style: {
                fontWeight: '600',
                padding: '12px',
                color: '#444',
              },
            },
            cells: {
              style: {
                padding: '12px',
              },
            },
            table: {
              style: {
                borderRadius: '4px',
                overflow: 'hidden',
              },
            },
          }}
        />
      </div>
  );
};

export default SupplyOrderList;