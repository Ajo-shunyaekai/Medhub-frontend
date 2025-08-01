import React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';

const PendingInvoice = ({ invoiceList, totalItems, currentPage, listPerPage, handlePageChange }) => {
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
            name: 'Buyer Name',
            selector: row => row?.buyer_name,
            sortable: true,
        },
        {
            name: 'Total Amount',
            selector: row => row?.total_payable_amount,
            sortable: true,
            cell: row => <div className={styles.tableText}>{row?.total_payable_amount ? `${row?.total_payable_amount} USD` : ''}</div>,
        },
        {
            name: 'Status',
            selector: row => row?.status,
            sortable: true,
            cell: row => (
                <div className={styles.tableText}>
                    {row?.status ? `${row?.status?.charAt(0)?.toUpperCase()}${row?.status.slice(1)}` : ''}
                </div>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/supplier-invoice-details/${row?.invoice_id}`} title="View Details">
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
            <DataTable
                columns={columns}
                data={invoiceList}
                persistTableHead
                noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                pagination={false}
                responsive
            />

            {/* Conditionally render PaginationComponent only if invoiceList has data */}
            {invoiceList && invoiceList.length > 0 && (
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={listPerPage}
                    totalItemsCount={totalItems}
                    pageRangeDisplayed={8}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default PendingInvoice;