import React from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import moment from 'moment/moment';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const TotalInquiriesRequest = ({ list, totalList, currentPage, ordersPerPage, handlePageChange, activeLink }) => {
  const columns = [
    {
      name: 'Inquiry ID',
      selector: (row) => row?.enquiry_id,
      sortable: true,
    },
    {
      name: 'Date',
      selector: (row) => moment(row?.created_at).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: 'Buyer Name',
      selector: (row) => row?.buyer?.buyer_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) =>
        row?.enquiry_status
          ?.split(' ')
          .map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
          .join(' ') || 'N/A',
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <Link to={`/admin/ongoing-inquiries-details/${row?.enquiry_id}`}>
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
                
            color: #616161;
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
      <DataTable
        columns={columns}
        data={list}
        persistTableHead
        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
        pagination={false}
        responsive
      />
      {list && list.length > 0 && (
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={ordersPerPage}
          totalItemsCount={totalList}
          pageRangeDisplayed={8}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TotalInquiriesRequest;