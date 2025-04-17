// InquiryRequest.jsx
import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import moment from 'moment-timezone';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import '../../../../assets/style/table.css'

const InquiryRequest = ({ inquiryList, totalInquiries, currentPage, inquiriesPerPage, handlePageChange }) => {
  const columns = [
    {
      name: 'Inquiry ID',
      selector: row => row.enquiry_id,
      sortable: true,

    },
    {
      name: 'Date',
      selector: row => moment(row.created_at).format('DD/MM/YYYY'),
      sortable: true,

    },
    {
      name: 'Buyer Name',
      selector: row => row.buyer.buyer_name,
      sortable: true,

    },
    {
        name: 'Status',
        selector: row => row.enquiry_status || '', // Fallback to empty string for sorting
        sortable: true,
        cell: row => (
          <div>
            {row.enquiry_status
              ? row.enquiry_status
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              : 'N/A'} {/* Fallback display if enquiry_status is undefined/null */}
          </div>
        ),
      },
    {
      name: 'Action',
      cell: row => (
        <Link to={`/admin/supplier-inquiry-details/${row.enquiry_id}`}>
          <div className={styles.activeBtn}>
            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
          </div>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: false,
    },
  ];
  return (
    <div className={styles.container}>
          <DataTable
            columns={columns}
            data={inquiryList}
            persistTableHead
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            pagination={false}
            responsive
            progressPending={inquiryList === null}
          />
          <PaginationComponent
            activePage={currentPage}
            itemsCountPerPage={inquiriesPerPage}
            totalItemsCount={totalInquiries}
            pageRangeDisplayed={10}
            onChange={handlePageChange}
          />
    </div>
  );
};

export default InquiryRequest;