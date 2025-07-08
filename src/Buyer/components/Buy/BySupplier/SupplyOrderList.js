import React from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import DataTable from 'react-data-table-component';
import PaginationComponent from '../../SharedComponents/Pagination/pagination';
import styles from '../../../assets/style/table.module.css';

const SupplyOrderList = ({ orderList, totalOrders, currentPage, ordersPerPage, handleOrderPageChange }) => {
  const columns = [
    {
      name: 'Order ID',
      selector: row => row?.order_id || 'ORD-8723RD213fd',
      sortable: true,

    },
    {
      name: 'Date',
      selector: row => row?.created_at,
      sortable: true,
      cell: row => (
        <div>
          {moment(row?.created_at).format("DD/MM/YYYY") || '22/05/2024'}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: row => row?.order_status,
      sortable: true,
      cell: row => (
        <div>
          {row?.order_status?.charAt(0)?.toUpperCase() + row?.order_status?.slice(1) || 'Pending'}
        </div>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <Link to={`/buyer/order-details/${row?.order_id || `ORD-8723RD213fd`}`} title="View Details">
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
        <DataTable
          columns={columns}
          data={orderList || []}
          noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
          persistTableHead
          pagination={false}
          responsive
        />
        {orderList?.length > 0 && (
            <PaginationComponent
              activePage={currentPage}
              itemsCountPerPage={ordersPerPage}
              totalItemsCount={totalOrders}
              pageRangeDisplayed={5}
              onChange={handleOrderPageChange}
            />
        )}
      </div>
    </div>
  );
};

export default SupplyOrderList;