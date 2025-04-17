import React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import '../../../../assets/style/table.css'

const BuyerPaid = ({ invoiceList, totalItems, currentPage, listPerPage, handlePageChange }) => {
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
            name: 'Supplier Name',
            selector: row => row.supplier_name,
            sortable: true,

        },
        {
            name: 'Total Amount',
            selector: row => row.total_payable_amount,
            sortable: true,
            cell: row => <div>{row.total_payable_amount ? `${row.total_payable_amount} USD` : ''}</div>,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <div>
                    {row.status ? `${row.status.charAt(0).toUpperCase()}${row.status.slice(1)}` : ''}
                </div>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/buyer-invoice-details/${row.invoice_id}`}>
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
                data={invoiceList}
                persistTableHead
                noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                pagination={false}
                responsive
            />
            <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={listPerPage}
                totalItemsCount={totalItems}
                pageRangeDisplayed={10}
                onChange={handlePageChange}
            />
        </div>

    );
};

export default BuyerPaid;