import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';

const SellerActiveInvoiceList = ({ invoiceData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = invoiceData.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const columns = [
        {
            name: 'Invoice No.',
            selector: row => row.invoice_no,
            sortable: true,
           
        },
        {
            name: 'Order ID',
            selector: row => row.order_id,
            sortable: true,
           
        },
        {
            name: 'Buyer Name',
            selector: row => row.buyer_name,
            sortable: true,
           
        },
        {
            name: 'Amount',
            selector: row => row.total_payable_amount,
            sortable: true,
            cell: row => (
                <div>
                    {row.total_payable_amount !== null && row.total_payable_amount !== undefined
                        ? `${row.total_payable_amount} USD`
                        : ''}
                </div>
            )
        },
        {
            name: 'Status',
            selector: row => row.invoice_status,
            sortable: true,
            cell: row => (
                <div>
                    {row.invoice_status.charAt(0).toUpperCase() + row.invoice_status.slice(1)}
                </div>
            )
        },
        {
            name: 'Action',
            cell: row => (
                
                    <Link to={`/admin/supplier-invoice-details/${row.invoice_id}`}>
                        <div className={styles.activeBtn}>
                            <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                        </div>
                    </Link>
              
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
    ];

    return (
        <div className={styles.mainInvoicecontainer}>
            <style>
                {`
                    .rdt_Table {
                       border: none;
    background-color: unset !important;
                    }
                        .rdt_TableRow{
                      background-color: #ffffff !important;
    border-bottom: none !important;
                        }
                    .rdt_TableHeadRow {
                            background-color: #f9f9fa;
    font-weight: bold;
    border-bottom: none !important;
                    }
    .rdt_TableBody{
    gap:10px !important;
    }
                    .rdt_TableCol {
                        text-align: center;
                        color: #333;
                    }
                    .rdt_TableCell {
                       
                           text-align: center;
    color: #99a0ac;
    font-weight: 500 !important;
                    }
                    .rdt_TableCellStatus {
                        text-align: center;
                        color: #333;
                    }
                `}
            </style>
                 <span className={styles.title}>Invoice List</span>
               
                <DataTable
                    columns={columns}
                    data={currentOrders}
                    persistTableHead
                        noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                        pagination={false}
                />
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={invoiceData.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                />
            </div>
    );
};

export default SellerActiveInvoiceList;