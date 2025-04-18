import React from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import moment from 'moment/moment';
import PaginationComponent from '../../../shared-components/Pagination/Pagination';
import styles from '../../../../assets/style/table.module.css';
import '../../../../assets/style/table.css'

const CompletedBuyerOrder = ({ orderList, totalOrders, currentPage, ordersPerPage, handlePageChange }) => {
    const columns = [
        {
            name: 'Order ID',
            selector: row => row.order_id,
            sortable: true,

        },
        {
            name: 'Date',
            selector: row => row.created_at,
            sortable: true,
            cell: row => <div>
                {moment(row.created_at).format("DD/MM/YYYY")}
            </div>,

        },
        {
            name: 'Supplier Name',
            selector: row => row.supplier?.supplier_name,
            sortable: true,

        },
        {
            name: 'Quantity',
            selector: row => row.items.reduce((total, item) => total + (item.quantity || item.quantity_required), 0),
            sortable: true,

        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => <div>
                {row.status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>,
        },
        {
            name: 'Action',
            cell: row => (
                <Link to={`/admin/order-details/${row.order_id}`}>
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
                data={orderList}
                persistTableHead
                noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
                pagination={false}
                responsive
            />
            <PaginationComponent
                activePage={currentPage}
                itemsCountPerPage={ordersPerPage}
                totalItemsCount={totalOrders}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
            />
        </div>

    );
};

export default CompletedBuyerOrder;