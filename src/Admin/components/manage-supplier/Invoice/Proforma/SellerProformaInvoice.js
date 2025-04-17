import React from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import '../../../../assets/style/table.css'

const SellerProformaInvoice = ({ invoiceList, totalItems, currentPage, listPerPage, handlePageChange }) => {
    const columns = [
        {
            name: 'Invoice No.',
            selector: row => row.invoice_no,
            sortable: true,

        },
        {
            name: 'PO Date',
            selector: row => row.created_at, // Use raw date for sorting
            sortable: true,
            cell: row => <div>{moment(row.created_at).format("DD/MM/YYYY")}</div>,
        },
        {
            name: 'Order ID',
            selector: row => row.order_id,
            sortable: true,

        },
        {
            name: 'Customer Name',
            selector: row => row.buyer_name,
            sortable: true,

        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/proforma-invoice-details/${row.order_id}`}>
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

export default SellerProformaInvoice;