import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from "../SharedComponents/Pagination/Pagination"
import styles from "../../assets/style/table.module.css";

const ActiveInvoiceList = ({ invoiceData }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 8;

    // Pagination calculations
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = invoiceData.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Define columns for DataTable
    const columns = [
        {
            name: 'Invoice No.',
            selector: (row) => row?.invoice_no,
            sortable: true,

        },
        {
            name: 'Order ID',
            selector: (row) => row?.order_id,
            sortable: true,

        },
        {
            name: 'Buyer Name',
            selector: (row) => row?.buyer_name,
            sortable: true,

        },
        {
            name: 'Amount',
            selector: (row) => row?.total_payable_amount,
            sortable: true,

        },
        {
            name: 'Status',
            selector: (row) => row?.invoice_status,
            sortable: true,
            cell: (row) => (

                <span>
                    {row?.invoice_status?.charAt(0)?.toUpperCase() + row?.invoice_status.slice(1)}
                </span>

            ),
        },
        {
            name: 'Action',
            cell: (row) => (

                <Link to={`/supplier/invoice-design/${row?.invoice_id}`}>
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
                        font-weight: bold;
                        border-bottom: none !important;
                    }
                    .rdt_TableBody {
                        gap: 10px !important;
                    }
                    .rdt_TableCol {
                           
                        color: #333;
                    }
                    .rdt_TableCell {
                           
                        color: #99a0ac;
                        font-weight: 500 !important;
                    }
                    .rdt_TableCellStatus {
                           
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
            
            {invoiceData.length > 0 && (
                <PaginationComponent
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={invoiceData.length}
                    pageRangeDisplayed={8}
                    onChange={handlePageChange}
                />
            )}

        </div>
    );
};

export default ActiveInvoiceList;