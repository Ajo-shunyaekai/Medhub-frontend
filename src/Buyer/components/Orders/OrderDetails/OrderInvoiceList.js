// OrderInvoiceList.jsx
import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PaginationComponent from "../../SharedComponents/Pagination/pagination";
import styles from "../../../assets/style/table.module.css";

const OrderInvoiceList = ({ invoiceData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const columns = [
    {
      name: 'Invoice No.',
      selector: row => row?.invoice_no,
      sortable: true,
     
    },
    {
      name: 'Order ID',
      selector: row => row?.order_id,
      sortable: true,
     
    },
    {
      name: 'Supplier Name',
      selector: row => row?.supplier_name,
      sortable: true,
    
    },
    {
      name: 'Amount',
      selector: row => row?.total_payable_amount,
      sortable: true,
    
    },
    {
      name: 'Status',
      selector: row => row?.invoice_status,
      sortable: true,
      cell: row => (
        <span>
          {row?.invoice_status?.charAt(0)?.toUpperCase() + row.invoice_status?.slice(1)}
        </span>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <Link to={`/buyer/invoice-design/${row?.invoice_id}`} title="View Details">
             <div className={styles.activeBtn}>
            <VisibilityOutlinedIcon className={styles['table-icon']} />
          </div>
        
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = invoiceData?.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.mainInvoicecontainer}>
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
    <div className={styles.sectionMainContainer}>
        <header className={styles.header}>
          <span className={styles.title}>Invoice List</span>
        </header>
        <DataTable
          columns={columns}
          data={currentOrders || []}
          noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
          persistTableHead
          pagination={false}
          responsive
        />
        {invoiceData?.length > 0 ? (
          <PaginationComponent
            activePage={currentPage}
            itemsCountPerPage={ordersPerPage}
            totalItemsCount={invoiceData?.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        ) : null}
      </div>
    </div>
  );
};

export default OrderInvoiceList;