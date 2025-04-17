import React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import '../../../../assets/style/table.css'

const BuyerPurchasedOrder = ({ poList, totalList, currentPage, listPerPage, handlePageChange, activeLink }) => {
  const columns = [
    {
      name: 'PO ID',
      selector: row => row.purchaseOrder_id,
      sortable: true,
     
    },
    {
      name: 'Inquiry ID',
      selector: row => row.enquiry_id,
      sortable: true,
    
    },
    {
      name: 'Date',
      selector: row => row.created_at,
      sortable: true,
      cell: row => <div>{moment(row.created_at).format('DD/MM/YYYY')}</div>,
     
    },
    {
      name: 'Supplier Name',
      selector: row => row.supplier?.supplier_name || '',
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.po_status,
      sortable: true,
      cell: row => (
        <div className={styles.tableText}>
          {row.po_status ? row.po_status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : ''}
        </div>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <Link to={`/admin/buyer-purchased-order-details/${row.purchaseOrder_id}`}>
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
            data={poList}
            persistTableHead
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            pagination={false}
            responsive
          />
            <PaginationComponent
              activePage={currentPage}
              itemsCountPerPage={listPerPage}
              totalItemsCount={totalList}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
            />
          </div>
  );
};

export default BuyerPurchasedOrder;